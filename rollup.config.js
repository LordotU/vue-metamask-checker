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
  vue({ template: { optimizeSSR: true } }),
]

if (isProd) {
  plugins.push(terser())
}

export default [
  {
    input: 'src/index.js',
    output: {
      format: 'esm',
      file: 'build/index.js',
      sourcemap: ! isProd,
    },
    plugins,
  },
]
