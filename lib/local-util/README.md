ローカルな非公式ライブラリです。

ローカルライブラリを使用する方法:

1. ローカルライブラリディレクトリで以下を実行

```shell
$ npm link
```

2. ローカルライブラリを使うプロジェクトディレクトリで以下を実行

```shell
$ npm link <local package path>
$ npm install <local package path>
```

3. プロジェクトコードで`require`, `import`する