import { glob } from 'glob'
import path from 'path';
import { fileURLToPath } from 'url';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import deleteDist from 'rollup-plugin-delete';
import gzip from 'rollup-plugin-gzip';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import nodePolyfills from 'rollup-plugin-polyfill-node';

var options = {}

if (process.env.corejs) {
	const input = Object.fromEntries(
		glob.sync('node_modules/core-js/modules/**/*.js').map(file => [
			path.relative(
				'node_modules/core-js/modules',
				file.slice(0, file.length - path.extname(file).length)
			),
			fileURLToPath(new URL(file, import.meta.url))
		])
	);
	options = {
		input,
		output: {
			format: 'amd',
			amd: {
				forceJsExtensionForImports: true,
			},
			dir: 'core-js-amd-bundle',
			chunkFileNames: '[name].js',
			compact: true,
		},
		plugins: [
			commonjs(),
			resolve(),
			deleteDist({ targets: 'core-js-amd-bundle' }),
			gzip({
				gzipOptions: {
					level: 9,
				}
			})
		]
	}
} else {
	options = {
		input: './index.js',
		output: {
			format: 'amd',
			file: 'core-js-amd.js'
		},
		plugins: [
			commonjs(),
			resolve(),
			json(),
			terser(),
			nodePolyfills()
		]
	}
}

export default options