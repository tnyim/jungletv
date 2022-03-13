import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import replace from '@rollup/plugin-replace';
import CleanCSS from 'clean-css';
import fs from 'fs';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [
	{
		input: 'src/main.ts',
		output: {
			sourcemap: true,
			format: 'iife',
			file: 'public/build/bundle.js',
		},
		onwarn: function onwarn(warning, warn) {
			if (
				warning.code === 'EVAL' &&
				warning.id.indexOf('google-protobuf.js') >= 0)
				return;
			if (warning.code === 'MISSING_NAME_OPTION_FOR_IIFE_EXPORT') return;
			warn(warning);
		},
		plugins: [
			replace({
				globalThis: JSON.stringify({
					API_HOST: production ? "https://jungletv.live" : "use-origin",
					PRODUCTION_BUILD: production,
				}),
				preventAssignment: true,
			}),
			replace({
				// fix rollup insistence on trying to use things meant for node
				include: "node_modules/debug/src/index.js",
				delimiters: ["", ""],
				process: JSON.stringify({
					type: "renderer",
				}),
				preventAssignment: true,
				"module.exports = require('./node.js');": "",
			}),
			replace({
				// fix library which appends a hidden textarea to document.body for measurement purposes
				// this doesn't work right inside the shadow DOM - it needs to attach to our shadow DOM root instead
				include: "node_modules/svelte-textarea-autoresize/src/AutoresizingTextAreaComponent/**",
				delimiters: ["", ""],
				preventAssignment: true,
				"const height = calculateNodeHeight(": "const height = calculateNodeHeight(node,",
				"export default function calculateNodeHeight(sizingData, value) {": "export default function calculateNodeHeight(node, sizingData, value) {",
				"document.body": "node.getRootNode()",
			}),
			/*replace({
				// this might help fix things when proxied by Cloudflare? since they don't recognize grpc-web as being grpc
				include: "node_modules/@improbable-eng/grpc-web/dist/*.js",
				delimiters: ["", ""],
				"application/grpc-web+proto": "application/grpc+proto",
			}),*/
			svelte({
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production
				},
				preprocess: sveltePreprocess({
					sourceMap: !production,
					postcss: {
						plugins: [
							require("tailwindcss"),
							require("autoprefixer"),
						],
					},
				}),
			}),
			typescript({
				sourceMap: !production,
				lib: ["ES2020", "DOM"],
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({
				output: function (styles, styleNodes, bundle) {
					if (production) {
						const compressed = new CleanCSS().minify(styles).styles;
						fs.writeFileSync('public/build/bundle.css', compressed);
					} else {
						fs.writeFileSync('public/build/bundle.css', styles)
					}
				}
			}),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),
			commonjs(),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload('public'),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(
				{
					ecma: 2020,
				}
			),
		],
		watch: {
			clearScreen: false
		}
	},
	{
		input: 'serviceworker/main.ts',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'serviceworker',
			file: 'public/build/swbundle.js'
		},
		plugins: [
			replace({
				'process.env.NODE_ENV': JSON.stringify('production'),
				preventAssignment: true,
			}),
			typescript({
				tsconfig: './tsconfig-serviceworker.json',
				sourceMap: !production,
				lib: ["ES2020", "DOM"],
			}),
			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),
			commonjs(),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),
		]
	}
];
