import { glob } from 'glob'
import path from 'path';
import { fileURLToPath } from 'url';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import deleteDist from 'rollup-plugin-delete';
import gzip from 'rollup-plugin-gzip';
export default {
  input: Object.fromEntries(
		glob.sync('node_modules/core-js/modules/**/*.js').map(file => [
			path.relative(
				'node_modules/core-js/modules',
				file.slice(0, file.length - path.extname(file).length)
			),
			fileURLToPath(new URL(file, import.meta.url))
		])
	),
  output: {
		format: 'amd',
		dir: 'dist',
		chunkFileNames: '[name].js',
		compact: true,
	},
  plugins: [
    commonjs(),
    resolve(),
		deleteDist({ targets: 'dist' }),
		gzip({
			gzipOptions: {
				level: 9,
			}
		})
  ]
}