import { defineConfig } from "vite"
import autoprefixer from "autoprefixer"
import path from 'path'
import babel from 'vite-plugin-babel'

export default defineConfig(({ command }) => {
  if (command === "serve") {
    //開発環境設定
    return {
      resolve: {
        alias: {
          '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
          '~vis-timeline': path.resolve(__dirname, 'node_modules/vis-timeline'),
        }
      },
      plugins: [
        // Babel will try to pick up Babel config files (.babelrc or .babelrc.json)
        babel(),
        // ...
      ],
      server: {
        port: 8000,
      },
    };
  } else {
    //本番環境設定
    return {
      resolve: {
        alias: {
          '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
          '~vis-timeline': path.resolve(__dirname, 'node_modules/vis-timeline'),
        }
      },
      plugins: [
        // Babel will try to pick up Babel config files (.babelrc or .babelrc.json)
        babel(),
        // ...
      ],
      css: {
        postcss: {
          plugins: [autoprefixer],
        },
      },
    };
  }
});

