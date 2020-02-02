import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import vue from 'rollup-plugin-vue'


const isProd = process.env.NODE_ENV === 'production'

const plugins = [
  babel(),
  resolve(),
  commonjs({
    namedExports: { '@metamask-checker/core': [
      'MetamaskNotFoundError',
    ]},
  }),
]

if (isProd) {
  plugins.push(terser())
}

export default [
  {
    input: 'src/index.js',
    output: {
      format: 'esm',
      file: 'build/library.esm.js',
      sourcemap: ! isProd,
    },
    plugins: [ ...plugins, vue() ],
  },
  {
    input: 'src/index.js',
    output: {
      format: 'cjs',
      file: 'build/library.ssr.js',
      sourcemap: ! isProd,
    },
    plugins: [ ...plugins, vue({ template: { optimizeSSR: true } }) ],
  },
  {
    input: 'src/wrapper.js',
    output: {
      format: 'iife',
      file: 'build/library.js',
      sourcemap: ! isProd,
    },
    plugins: [ ...plugins, vue() ],
  }
]
