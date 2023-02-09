import { defineConfig } from "vite"
import autoprefixer from "autoprefixer"
import path, { resolve } from 'path'
import babel from 'vite-plugin-babel'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ command, mode }) => {
  const resolve = {
    resolve: {
      alias: {
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        '~vis-timeline': path.resolve(__dirname, 'node_modules/vis-timeline'),
      }
    }
  }
  const plugins = {
    plugins: [
      // Babel will try to pick up Babel config files (.babelrc or .babelrc.json)
      babel(),
      // ...
    ]
  }
  const analyze = visualizer({
    open: true,
    filename: path.resolve(__dirname, 'dist/stats.html'),
    gzipSize: true,
    brotliSize: true,
  })
  const build =
  {
    build: {
      rollupOptions: {
        plugins: [
          (mode === 'analyze') ? analyze : null
        ]
      }
    }
  }
  const css = {
    postcss: {
      plugins: [autoprefixer],
    }
  }
  console.log('vite:', Object.assign(resolve, plugins, css, build))
  if (command === "serve") {
    const server = { server: { port: 8000 } }
    //開発環境設定
    return Object.assign(resolve, plugins, server, build)

  } else {
    //本番環境設定
    return Object.assign(resolve, plugins, css, build)
  }
});

