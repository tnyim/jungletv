import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import replace from '@rollup/plugin-replace';

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
			name: 'app',
			file: 'public/build/bundle.js'
		},
		plugins: [
			replace({
				globalThis: JSON.stringify({
					API_HOST: production ? "https://jungletv.live" : "use-origin",
					PRODUCTION_BUILD: production,
				}),
			}),
			replace({
				// fix rollup insistence on trying to use things meant for node
				include: "node_modules/debug/src/index.js",
				delimiters: ["", ""],
				process: JSON.stringify({
					type: "renderer",
				}),
				"module.exports = require('./node.js');": "",
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
			css({ output: 'bundle.css' }),

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
			production && terser(),
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
		]
	}
];
