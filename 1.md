# Practice JS Code

![Practice JS Code](https://github.com/hkawa90/PracticeJSCode/blob/48bce8943681664e2ce3b5e79b1a5fbdf23fd045/dist/PracticsJSCode.png)

## 誰のため

将来の自分。もしくはJSの初心者のための反面教師として。

## 何をするもの

記事や、自分のメモで書いたmarkdown文書内のサンプルコードだけでは理解しにくいことから、ブラウザ上でサンプルコードを実行できるようにして、その場で`console.log()`などで実行結果を確認。また時系列順に動作がわかるChartを表示できるようにしています。

## Demo

Demo site: [Practice JS Coce](https://hkawa90.github.io/PracticeJSCode/)

## Install

1. Node.js インストール

Node.jsを使っています。環境に合わせて[ダウンロード | Node.js](https://nodejs.org/ja/download/)からインストールします。

2. yarnのインストール

Package Managerの[Home | Yarn - Package Manager](https://yarnpkg.com/)使用しているので、[Installation | Yarn - Package Manager](https://yarnpkg.com/getting-started/install)を参考にインストールします。

2. moduleのインストール

```shell
yarn install
```

## Build

```shell
yarn run build
```
## 実行

サンプル文書はdistファオルダにある。そのまま実行する場合は以下を実行してブラウザで開く。ブラウザでは`http://localhost:8080/`をオープンします。

```shell
yarn run start
```
## 特徴

markdown文書からWebページを生成します。fenced code blockのJavascriptをWebページで動作させて理解しやすくします。

* [jpn.css - Optimize typography in Japanese](https://kokushin.github.io/jpn.css/)を使用。
* [azu/codemirror-console: Web Console UI for JavaScript.](https://github.com/azu/codemirror-console)を使用してJavascriptコードをWebページ上で実行。オリジナルはCM5を使用していたが、最新版の[CodeMirror](https://codemirror.net/)を使って実装した。また一部誤りなどを修正して使用している。
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
    "style": "custom.css",
    "cmTheme" : "materialLight",
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

ほぼ[azu/codemirror-console: Web Console UI for JavaScript.](https://github.com/azu/codemirror-console)と同じだが、CMを最新版のV6に変更.scrpt, moduleなどに加えて、HTMLコードを実行できるように変更している。consoleのlog(),info(), warn(), error()に加えて、clear(),count(),countReset(),debug(),assert(),dir(),dirxml(),exception(),group(),groupCollapsed(),groupEnd(),profile(),profileEnd(),table(),time(),timeEnd(),timeStamp()を追加。

## 文書作成方法

章毎のMarkdown文書を作成し、`dist`フォルダに`book.config.json`を作成し、文書タイトルと章毎にファイル名とタイトルを記載。ファイル名は`dist`配下の絶対パスで指定する。styleを変更したい場合は、`style`にカスタムCSSファイルを指定できる。カスタムCSSファイルは通常のCSSファイルと同じ。また同様に、`cmTheme`でCodeMirrorのthemeを設定できる。Theme名は[material](https://www.npmjs.com/package/@uiw/codemirror-themes-all)を参照。

`book.config.json`の例:
```json
{
    "title": "Practice JS Coce",
    "style": "/custom.css",
    "cmTheme" : "materialLight",
    "chapters": [
        { "file": "/1.md", "name" : "README"},
        { "file": "/2.md", "name" : "Mermaid Example"},
        { "file": "/3.md", "name" : "JSコード実行サンプル"},
        { "file": "/4.md", "name" : "HTMLコード実行サンプル"}
    ]
}
```

コード実行させたいJavascript codeでは下記のように言語指定で`pjs`とします。

````
```pjs
console.log(1)
```
````

実行させたいHTMLでは下記のように言語指定で`phtml`とします。

````
```phtml
<head>
	<!-- Load plotly.js into the DOM -->
	<script src='https://cdn.plot.ly/plotly-2.17.1.min.js'></script>
</head>

<body>
	<div id='myDiv'><!-- Plotly chart will be drawn inside this DIV --></div>
  <script>
var size = 100, x = new Array(size), y = new Array(size), z = new Array(size), i, j;

for(var i = 0; i < size; i++) {
	x[i] = y[i] = -2 * Math.PI + 4 * Math.PI * i / size;
  	z[i] = new Array(size);
}

for(var i = 0; i < size; i++) {
  	for(j = 0; j < size; j++) {
    	var r2 = x[i]*x[i] + y[j]*y[j];
    	z[i][j] = Math.sin(x[i]) * Math.cos(y[j]) * Math.sin(r2) / Math.log(r2+1);
 	}
}

var data = [ {
		z: z,
		x: x,
		y: y,
		type: 'contour'
	}
];

Plotly.newPlot('myDiv', data);

  </script>
</body>
```
````
mermaidで表示させたい場合は、下記のように言語指定で`mermaid`とします。

````
```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
````

あとはMarkdownに従います。

## メモ

* dist配下をgh-pagesにpushしてGithub Pagesで公開

```shell
$ git subtree push --prefix dist origin gh-pages
```
参考ページ：[Deploy to `gh-pages` from a `dist` folder on the master branch. Useful for use with \[yeoman\](http://yeoman.io).](https://gist.github.com/cobyism/4730490)

* 空のブランチ作成
- [ ] TODO:動作確認

```shell
git switch --orphan <new branch>
git commit --allow-empty -m "Initial commit on orphan branch"
git push -u origin <new branch>
```

* Github:ファイルへのパーマリンクを取得する

コミット SHA を手作業で探すのは不便ですが、ショートカットとして y を押すと、URL がパーマリンクのバージョンに自動で更新されます。 その後、URL をコピーし、共有すると、自分が表示したのとまったく同じものが表示されます。