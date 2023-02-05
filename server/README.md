## ローカルで閲覧するための、web serverです。

1. 使い方

プロジェクトディレクトリで以下を実行

```shell
pnpm build
node ./server/index.mjs ./public
```
実行後、Web serverが起動します。ブラウザで`http://localhost:9999`を開いてください。

2. オプション

設定を`dist/book.config.json`の`express`プロパティで行えます。

```json
    "express": {
        "document_root": [
            "./dist"
        ],
        "convert_markdown" : true
    },
```

* 複数のディレクトリを１つのドキュメントルートに設定できます。`document_root`に配列形式でディレクトリを設定してください。

* ローカルでMarkdownをHTMLに変換して、`PracticeJSCode`のブラウザ側で変換しないようにすることができます。`convert_markdown`を`true`に設定します。`true`の場合このプログラムの実行でMakrdownからHTMLへ変換します。こうすると起動が早くなります。
