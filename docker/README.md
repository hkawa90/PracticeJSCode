## Dockerfile

このDockerfileは`pnpm build`後の`./dist`の内容でdocker imageを作成します。
ブラウザからは`http://localhost:49999`でアクセスできます。

### Build

```shell
pnpm docker:build
```

### 実行

```shell
pnmp docker:run
```

このあと、　ブラウザから`http://localhost:49999`でアクセスできます。
