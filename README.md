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

3. moduleのインストール

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
* [dworthen/js-yaml-front-matter: Parses yaml or json from the beginning of a string or file](https://github.com/dworthen/js-yaml-front-matter)を使ってmetadata取得の実装(ただ取得までの実装、メモに使える?)。JSコード実行では、実行時の動作設定とローカル変数としてアクセス可能。記法についての注意点があるので、下記を参考にしてください。
```javascript
import yamlFront from 'yaml-front-matter'

const yamlStr = `---
age: 127
---
Some Other content`

try {
    console.log(yamlFront.loadFront(yamlStr))
} catch (e) {
    console.log(e)
}
```
上記で`age: 127`の場合は正常に動作するが、

```json
{ age: 127, __content: '\nSome Other content' }
```
ここで`age:127`とすると(`:`コロンの後にスペース入れない)、

```javascript
const yamlStr = `---
age:127
---
```
その結果は、以下の通りエラー(例外)となるので記述に気をつける必要がある。**これはYAMLの仕様です。**[YAML 構文 — Ansible Documentation](https://docs.ansible.com/ansible/2.9_ja/reference_appendices/YAMLSyntax.html)が参考になります。

```shell
$ node yam.mjs
TypeError: Cannot create property '__content' on string 'age:127'
    at u (/home/kawa90/work/js/web-stream-api/PracticeJSCode/node_modules/yaml-front-matter/dist/yamlFront.js:1:1834)
    at Module.f (/home/kawa90/work/js/web-stream-api/PracticeJSCode/node_modules/yaml-front-matter/dist/yamlFront.js:1:1869)
    at file:///home/kawa90/work/js/web-stream-api/PracticeJSCode/yam.mjs:9:27
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
```

## コード実行

### JSコード実行

`実行`ボタン押下でJS/HTMLコードが実行できます。`クリア`ボタン押下でコンソールログと描画表示をクリアします。

`script`モードと、`module`モードがある。このモード切替は実行ボタン横のチェックボックスで行う。
`script`モードでは、JSコードは`eval()`で実行される。`module`モードでは`dynamic import`で読み込まれたモジュールとして実行される。このため、`strict`モードで動作する。
`script`モードではコード先頭に記述した`YAML Front matter`のオブジェクトをローカル変数としてアクセスできる。次の例では、Markdownでの実行可能なJSコード記述方法を示す。言語指定で`javascript`ではなく`pjs`とします。

```pjs
console.log(0)
console.count('label')
console.countReset('label')
console.error('Error !')
```

YAML front matterにてローカル変数の指定と、実行時動作の設定を行うことができます。
まずはYAML front matterの例です。`---`と`---`とで挟まれた範囲がYAML front matterです。`comment`はそのままローカル変数としてアクセス可能です。下記例では、コード表示下部のコンソールに`やっほー`と表示されます。

```pjs
---
comment : "やっほー"
---
console.log(comment)
```

次に、実行時動作の設定は同じYAML front matterにて`config`内容を変更することで動作を切り替えることができます。
設定可能な一覧は下記の通り。

|item|内容|備考   |default|
|---|---|---|---|
|view|描画On/Off|boolean(On:true, Off:false)|false|
|autorun|自動実行|boolean(自動実行する:true, 自動実行しない:false)|false|
|hide|ソースコード表示On/Off|boolean(表示しない:true, 表示する:false)|false|
|timeline|時系列表示On/Off|boolean(On:true, Off:false)|false|
|script|実行モード|"script"or"module"|"script"|
|sandbox|iframe sandbox属性|string|allow-scripts allow-same-origin|

実際の設定例は以下の通り。指定がない項目は、デフォルト値で動作する。

```javascript
---
config: 
  view: true
  autorun: false
  hide: false
  timeline: false
  script: module
size: 50
---
console.log(size)
const button = document.createElement('button')
button.innerText = "button"
document.body.appendChild(button)
```
下記の内容がエラー出力されたら、`script`チェックボックスをOffとしてください。

```text
SyntaxError: await is only valid in async functions, async generators and modules
```
そうすると、次の`await`を含む[コード](https://web.dev/i18n/ja/storage-for-the-web/)を実行できます。

```javascript
if (navigator.storage && navigator.storage.estimate) {
  const quota = await navigator.storage.estimate();
  // quota.usage -> Number of bytes used.
  // quota.quota -> Maximum number of bytes available.
  const percentageUsed = (quota.usage / quota.quota) * 100;
  console.log(`You've used ${percentageUsed}% of the available storage.`);
  const remaining = quota.quota - quota.usage;
  console.log(`You can write up to ${remaining} more bytes.`);
}
```

### HTMLコード実行

`body`を除いた、`head`, `body`タグで構成された、HTMLコードを実行できる。`view`チェックボックONでレンダリング結果(iframe)が表示される。

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

章毎のMarkdown文書を作成し、`dist`フォルダに`book.config.json`を作成し、文書タイトルと章毎にファイル名とタイトルを記載。ファイル名は`dist`配下の絶対パスで指定する。styleを変更したい場合は、`style`にカスタムCSSファイルを指定できる。カスタムCSSファイルは通常のCSSファイルと同じ。また同様に、`cmTheme`でCodeMirrorのthemeを設定できる。Theme名は[material](https://www.npmjs.com/package/@uiw/codemirror-themes-all)を参照。JSコードの実行に必要な外部スクリプト(CDN)がある場合は、`extScript`に指定する。

`book.config.json`の例:
```json
{
    "title": "Practice JS Coce",
    "style": "/custom.css",
    "cmTheme" : "materialLight",
    "extScript" : [
        "https://cdn.plot.ly/plotly-2.17.1.min.js"
    ],
    "chapters": [
        { "file": "/1.md", "name" : "README"},
        { "file": "/2.md", "name" : "Mermaid Example"},
        { "file": "/3.md", "name" : "JSコード実行サンプル"},
        { "file": "/4.md", "name" : "HTMLコード実行サンプル"}
    ]
}
```

コード実行させたいJavascript codeでは下記のように言語指定で`pjs`とします。

````javascript
```pjs
console.log(1)
```
````

実行させたいHTMLでは下記のように言語指定で`phtml`とします。

````javascript
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

````javascript
```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
````

fenced code blockの戦闘にYAML front matterでmetadataを設定できます。ただ現在は反映されません。

````javascript
---
comment: "メモです"
---
```pjs
console.log(1)
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

* [dworthen/js-yaml-front-matter: Parses yaml or json from the beginning of a string or file](https://github.com/dworthen/js-yaml-front-matter)を導入しようとしたら、エラーが出たので下記を参考にして解決。

[Webpack5でReactのプロジェクトをビルドしたら一生エラーが出続けた話 - Qiita](https://qiita.com/issei_k/items/f33164a22b8c1dc74a09)

*`iframe`には`sandbox`属性がある。
TODO: sandboxの説明

*`iframe`のクライアント領域の大きさで`iframe`のサイズを設定すると、小さくなる。`iframe`内の`body`にmarginがあるため。

* MarkdownのYaml front matterの定番は、layout, date, categories, tags, titleのようだ。このプログラムでは使い勝手がないのかも。

* git tag

```shell
git tag -a tagname -m 'comment for tag'
git push origin tagname
```

* iframeのサイズ計算で、まだ表示が間に合わない時clientサイズが0になる。[function isHidden(elem) {
  return !elem.offsetWidth && !elem.offsetHeight;
}](https://ja.javascript.info/size-and-scroll)が詳しい。以下で隠されている要素か確認できるらしい。

```javascript
function isHidden(elem) {
  return !elem.offsetWidth && !elem.offsetHeight;
}
```

* [phw/peek: Simple animated GIF screen recorder with an easy to use interface](https://github.com/phw/peek)を使ってAnimated GIF作成。

* debugで[ba-hooker.min.js](https://github.com/cowboy/javascript-hooker)を使ってデバッグ
```javascript
    import hooker from 'hooker'
    // iframeに属性をつけているところをtraceできる。
    const iframe = document.createElement("iframe");
    hooker.hook(iframe, "setAttribute", function() {
        console.trace('setAttribute:', arguments)
      });
```
ただ`strict`モードだとcaller,calleeが取得できないので、`console.trace()`を使っている。

* 起動時のコード実行で、コード評価管理用語にiframeの高さを`clientHeight`で調整するが、初回はレンダリングが間に合わないのか`0`となる。workaroundで`0`の場合はデフォルトの高さのままとする。
    * 親要素が`display:none`な状態でiframe内でrenderingされた場合、`clientHeight`が0になるようなので、`display:none`が解除された段階でコード実行するよう変更

* JSDoc
    - [JSDoc で JavaScript のコメントを書こう | スターフィールド株式会社](https://sterfield.co.jp/designer/jsdoc-%E3%81%A7-javascript-%E3%81%AE%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%92%E6%9B%B8%E3%81%93%E3%81%86/)
    - [Use JSDoc: Index](https://jsdoc.app/index.html)

* ページレイアウトは[ダッシュボードの実例～Bootstrap5設置ガイド](https://bootstrap-guide.com/sample/dashboard)を参考にした。
* Bootstrap5の導入は[webpackでの使用～Bootstrap5設置ガイド](https://bootstrap-guide.com/getting-started/webpack)を参考にした。

+ git archive: リリース要のtar/zip ball作成
GithubであればRelease使えばいらないかもしれないが。
```shell
#!/usr/bin/env bash

$tag = $1 
$project = $2
# Create a compressed tarball.
git archive --format=tar --prefix=$2-$1/ $1 | gzip > $2-$1.tar.gz  
# Create a compressed zipball.
git archive --format=zip --prefix=$2-$1/ $1 > $2-$1.zip  
```

* package.jsonのversion変更
[jq](https://stedolan.github.io/jq/)を使う方法。
```shell
version=$(git describe --tags --abbrev=0) # latest tag
jq \'.version=\"$version\"\' package.json
```

* [dworthen/js-yaml-front-matter: Parses yaml or json from the beginning of a string or file](https://github.com/dworthen/js-yaml-front-matter)ではコメントのみだと例外発生(conf is null)。
```YAML
---
#
---
```