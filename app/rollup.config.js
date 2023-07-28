import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from "@rollup/plugin-typescript";
import autoprefixer from 'autoprefixer';
import { spawn } from 'child_process';
import CleanCSS from 'clean-css';
import fs from 'fs';
import css from 'rollup-plugin-css-only';
import livereload from 'rollup-plugin-livereload';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from "svelte-preprocess";
import tailwindcss from "tailwindcss";

const production = !process.env.ROLLUP_WATCH;
const labBuild = process.env.JUNGLETV_LAB;

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

			// https://github.com/moment/luxon/issues/193
			if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.message.includes('/luxon/')) return;
			warn(warning);
		},
		plugins: [
			replace({
				"globalThis.PRODUCTION_BUILD": JSON.stringify(production),
				"globalThis.LAB_BUILD": JSON.stringify(labBuild),
				"globalThis.OVERRIDE_APP_NAME": JSON.stringify(process.env.JUNGLETV_APP_NAME),
				"globalThis.OVERRIDE_API_HOST": JSON.stringify(process.env.JUNGLETV_API_HOST),
				preventAssignment: true,
			}),
			svelte({
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production
				},
				preprocess: sveltePreprocess({
					sourceMap: !production,
					postcss: {
						plugins: [
							tailwindcss("tailwind.config.cjs"),
							autoprefixer,
						],
					},
				}),
			}),
			typescript({
				sourceMap: !production,
				lib: ["ES2020", "DOM", "dom.iterable"],
				target: "ES2021",
				tsconfig: "./tsconfig.json",
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
				dedupe: ['svelte', 'svelte/transition', 'svelte/internal'],
				exportConditions: ['browser', 'svelte'],
      			extensions: ['.mjs', '.js', '.json', '.node', '.svelte']
			}),
			commonjs(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			// (requires the use of the livereload browser extension -
			// we can't load the script in the page since the livereload server serves over HTTP,
			// and we must use HTTPS for HTTP/2, required by gRPC-web)
			!production && livereload('public'),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(
				{
					ecma: 2020,
					toplevel: true,
					format: {
						comments: false
					}
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
				tsconfig: './serviceworker/tsconfig.json',
				sourceMap: !production,
				target: "ES2021",
				lib: ["ES2021", "DOM", "WebWorker"],
			}),
			resolve({
				browser: true,
				dedupe: ['svelte', 'svelte/transition', 'svelte/internal'],
				exportConditions: ['browser', 'svelte'],
				extensions: ['.mjs', '.js', '.json', '.node', '.svelte']
			}),
			commonjs(),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(
				{
					format: {
						comments: false
					}
				}
			),
		]
	},
	{
		input: 'appbridge/main.ts',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'appbridge',
			file: 'public/build/appbridge.js'
		},
		plugins: [
			replace({
				"globalThis.PRODUCTION_BUILD": JSON.stringify(production),
				"globalThis.LAB_BUILD": JSON.stringify(labBuild),
				preventAssignment: true,
			}),
			replace({
				'process.env.NODE_ENV': JSON.stringify('production'),
				preventAssignment: true,
			}),
			svelte({
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production,
					css: "injected",
				},
				emitCss: false, // together with css "injected" above, forces svelte component CSS to be part of the JS bundle for simplicity
				// (we already have sufficient problems including the main app's bundle.css inside the application pages to bring tailwind rules in)
				preprocess: sveltePreprocess({
					sourceMap: !production,
					postcss: {
						plugins: [
							tailwindcss,
							autoprefixer,
						],
					},
				}),
			}),
			typescript({
				tsconfig: './appbridge/tsconfig.json',
				sourceMap: !production,
				target: "ES2021",
				lib: ["ES2021", "DOM", "dom.iterable"],
			}),
			resolve({
				browser: true,
				dedupe: ['svelte', 'svelte/transition', 'svelte/internal'],
				exportConditions: ['browser', 'svelte'],
				extensions: ['.mjs', '.js', '.json', '.node', '.svelte']
			}),
			commonjs(),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && production && terser(
				{
					ecma: 2020,
					toplevel: false, // probably important because much of our code is for other scripts, outside of the bundle, to use
					format: {
						comments: false
					}
				}
			),
		]
	}
];
