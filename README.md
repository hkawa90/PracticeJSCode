# 誰のため

将来の自分。もしくはJSの初心者のための反面教師として。

# 何をするもの

記事や、自分のメモで書いたmarkdown文書内のサンプルコードだけでは理解しにくいことから、ブラウザ上でサンプルコードを実行できるようにして、その場で`console.log()`などで実行結果を確認。また時系列順に動作がわかるChartを表示できるようにしています。

# Demo

TODO:ここにリンク

## 特徴

markdown文書からWebページを生成します。fenced code blockのJavascriptをWebページで動作させて理解しやすくします。

* [jpn.css - Optimize typography in Japanese](https://kokushin.github.io/jpn.css/)を使用。
* [azu/codemirror-console: Web Console UI for JavaScript.](https://github.com/azu/codemirror-console)を使用してJavascriptコードをWebページ上で実行。オリジナルはCM5を使用していたが、最新版のCM6を使って実装した。また一部誤りなどを修正して使用している。
* [vis.js](https://visjs.org/)のTimelineを使って、fenced code blockのJSコードの動作を可視化。`console.tracing()`をコールしたときの情報を可視化している。
* fenced code blockで[Mermaid | Diagramming and charting tool](https://mermaid.js.org/)でdiagram表示
* CSSフレームワークの[Introduction · Bootstrap v5.0](https://getbootstrap.com/docs/5.0/getting-started/introduction/)を使用。Webページのレイアウトに[Bootstrap 5 Sidebar Examples - DEV Community 👩‍💻👨‍💻](https://dev.to/codeply/bootstrap-5-sidebar-examples-38pb)を参考にした。
* [markedjs/marked: A markdown parser and compiler. Built for speed.](https://github.com/markedjs/marked)でmarkdownをブラウザ上でHTMLへ変換
* 通常のfenced code blockは`highlight.js`を使用

## モジュール

### main.js

メインモジュールで、`mermaid`を`startOnLoad:false`で初期化。Markdownが変換できたら、`mermaid.init()`をコールしている。`style=didplay:none`を適用した要素以下に適用すると、mermaidはエラーとなる。

以降、Markdown文書のレンダリング、JSコード/HTMLコード実行環境を構築、ハイライト処理を実行する。

### CrtDoc.js

文書構造を定義した`book.config.json`を`fetch()`で読み込み、必要なMarkdown文書も読み込む。

`book.config.json`:

```json
{
    "title": "タイトルだぞ",
    "chapters": [
        { "file": "/1.md", "name" : "第1章"},
        { "file": "/2.md", "name" : "第2章"},
        { "file": "/3.md", "name" : "サンプル"},
        { "file": "/4.md", "name" : "Timeline"}
    ]
}
```

markdown文書のHTML変換後は`id=CONTENTS`の配下に`appendChild`する。この時'id=chap-章番号-content'として、アクセス可能としている。また、HTMLから`h1,h2,h3,h4,h5,h6`を抽出して、TOC(目次)を作成して、左サイドバーに表示するようにしている。

### CodeMirrorRepl.js, context-eval.js

ほぼ[azu/codemirror-console: Web Console UI for JavaScript.](https://github.com/azu/codemirror-console)と同じだが、CMを最新版のV6に変更.scrpt, moduleなどに加えて、HTMLコードを実行できるように変更している。consoleのlog(),info(),     warn(), error()に加えて、clear(),count(),countReset(),debug(),assert(),dir(),dirxml(),exception(),group(),groupCollapsed(),groupEnd(),profile(),profileEnd(),table(),time(),timeEnd(),timeStamp()を追加。

TODO:キャプチャ画像

