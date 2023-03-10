## Example

### コード表示の下部にコンソールログ出力

Console関数の実行例：`console.clear()`もある。

```pjs
console.log(0)
console.count('label')
console.countReset('label')
console.error('Error !')
```

### ブラウザのコンソールへ出力

Console関数の実行例：以下APIはブラウザのコンソールに出力される

```pjs
let c = 0
let obj = { key: "value"}

console.debug(obj)
console.assert(c==0)
console.dir(obj)
console.group('グループ')
console.info('info !')
console.groupEnd('グループ')
```

上記の他,`profile(), profileEnd(), table(), dirxml(),exception(), groupCollapsed(), time(), timeEnd(), timeStamp(), trace()`がある。

### 動作の可視化

タイムラインのチェックボックスをOnとして、実行ボタン押下でvis-timelineによる動作が時系列順に表示される。

```pjs
console.tracing('1st', 'group1')
console.tracing('2nd', 'group1')
console.tracing('3rd', 'group2')
console.tracing('4th', 'group1')
```

```js
console.tracing(item, group)
```
`group`に所属する`item`を可視化して表示。

### 外部スクリプトとYAML front matterを使った例

[Plotly javascript graphing library in JavaScript](https://plotly.com/javascript/)を使います。ただこのままだと、CDNの設定ができないので、文書定義ファイルの`book.config.json`の`extScript`で指定します。

```json
{
    "title": "Practice JS Coce",
    "style": "custom.css",
    "cmTheme" : "githubLight",
    "extScript" : [
        "https://cdn.plot.ly/plotly-2.17.1.min.js"
    ],
    "extScript-comment" : "fenced code block実行時に使用する外部スクリプトを指定する.<head>内でloadする",
    "cmTheme-comment" : "Codemirror theme name. default: sublime; See https://www.npmjs.com/package/@uiw/codemirror-themes-all",
    "chapters": [
        { "file": "/1.md", "name" : "README"},
        { "file": "/2.md", "name" : "Mermaid Example"},
        { "file": "/3.md", "name" : "JSコード実行サンプル"},
        { "file": "/4.md", "name" : "HTMLコード実行サンプル"}
    ]
}
```

YAML front matterでローカル変数の設定と、実行時の設定ができます。YAMLは[The Official YAML Web Site](https://yaml.org/)を参照。[Transform YAML into JSON - Online YAML Tools](https://onlineyamltools.com/convert-yaml-to-json)のオンラインツールもあります。
ここでは、`config`にJSコードのview設定とスクリプト実行モード(script/module)を指定できるようにします。

```pjs
---
config: 
  view: true
  autorun: true
  hide: false
  timeline: false
  script: module
size: 50
---
console.log(size)
const button = document.createElement('button')
button.innerText = "button"
document.body.appendChild(button)
const dummy=document.getElementById('dummy')
console.log('dummy:', dummy);
```


```pjs
---
config: 
  hide: true
  autorun: true
  script: module
  view: true
---
const button = document.createElement('button')
button.innerText = "button"
document.body.appendChild(button)
```

```pjs
---
config: [view: true, autorun: false, hide: false, timeline: false, script: module]
size: 50
---
var x = new Array(size), y = new Array(size), z = new Array(size), i, j;

for (var i = 0; i < size; i++) {
    x[i] = y[i] = -2 * Math.PI + 4 * Math.PI * i / size;
    z[i] = new Array(size);
}

for (var i = 0; i < size; i++) {
    for (j = 0; j < size; j++) {
        var r2 = x[i] * x[i] + y[j] * y[j];
        z[i][j] = Math.sin(x[i]) * Math.cos(y[j]) * Math.sin(r2) / Math.log(r2 + 1);
    }
}

var data = [{
    z: z,
    x: x,
    y: y,
    type: 'contour'
}
];
const myDiv = document.createElement('div')
myDiv.setAttribute('id', 'myDiv')
document.body.appendChild(myDiv)
Plotly.newPlot('myDiv', data);
```

## HTML

`head`,`body`を記載することで、HTMLを実行できる。実行結果は`view`チェックボックスをOnにすることで、レンダリング結果を確認できる。

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


