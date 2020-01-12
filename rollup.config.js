import autoExternal from 'rollup-plugin-auto-external'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import cleaner from 'rollup-plugin-cleaner'
import { terser } from 'rollup-plugin-terser'
import { eslint } from 'rollup-plugin-eslint'
import { workspaces } from './package.json'

export default async () => {
  const input = 'src/index.ts'
  const pkg = await import(`${process.cwd()}/package.json`)
  const globalName = name => name // '@namespace/package' -> 'Namespace.Package'
    .split('/')
    .map(string => string
      .split(/[^a-z\d]/)
      .map(part => part ? part[0].toUpperCase() + part.slice(1) : '')
      .join('')
    )
    .join('.')

  const config = {
    input,
    output: { sourcemap: true },
    plugins: [
      autoExternal()
    ]
  }

  const typescriptConfig = {
    clean: true
  }

  return [
    {
      ...config,
      output: [
        { ...config.output, file: pkg.main, format: 'cjs' },
        { ...config.output, file: pkg.module, format: 'es' }
      ],
      plugins: [
        cleaner({ targets: [pkg.main.replace(/\/[^\/]+$/, '')] }),
        eslint(),
        typescript(typescriptConfig),
        ...config.plugins
      ]
    },
    {
      ...config,
      output: {
        ...config.output,
        file: pkg.browser,
        format: 'umd',
        name: globalName(pkg.name),
        globals: await Promise
          .all(workspaces.map(path => import(`./${path}/package.json`)))
          .then(pkgs => pkgs.reduce((globals, { name }) => {
            globals[name] = globalName(name)
            return globals
          }, {}))
      },
      plugins: [
        ...config.plugins,
        typescript({
          ...typescriptConfig,
          check: false,
          tsconfigOverride: {
            compilerOptions: { target: 'es5' }
          }
        }),
        nodeResolve(),
        commonjs(),
        terser()
      ]
    }
  ]
}
