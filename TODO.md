* TODO
- [ ] 長いドキュメントの場合にPagination
- [ ] attach external css/script using YAML front matter
- [ ] スクロールに応じた見出しの強調 [スクロールスパイ～Bootstrap5設置ガイド](https://bootstrap-guide.com/components/scrollspy)
    https://getbootstrap.jp/docs/5.0/components/scrollspy/
- [ ] console collapse
- [x] ui
    - [x] Visualize Js output 
        - [x] timeline
            - [x] group
        - [ ] network(future)
* 改善
- [ ] YFMのconfig指定を配列形式も許容する
- [ ] iframe内のコンテンツが大きい場合に、css設定できるよう。
```css
iframe {
  transform: scale(0.984375);
  transform-origin: 0 0;
}
```
- [ ] webpackの下記warning対応

```
WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets: 
  main.js (3.13 MiB)
```
* bug
- [ ] long h1 title
```
# aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```
- [ ] CM6で文字列設定(SetText)でTypeError

```
Uncaught TypeError: this.range is undefined
    reset webpack://practicejs/./node_modules/@lezer/lr/dist/index.js?:722
    reduceContext webpack://practicejs/./node_modules/@lezer/lr/dist/index.js?:386
    reduce webpack://practicejs/./node_modules/@lezer/lr/dist/index.js?:148
    advanceStack webpack://practicejs/./node_modules/@lezer/lr/dist/index.js?:1285
    advance webpack://practicejs/./node_modules/@lezer/lr/dist/index.js?:1180
    advance webpack://practicejs/./node_modules/@lezer/common/dist/index.js?:1503
    work webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:397
    withContext webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:432
    work webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:385
    work webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:651
    requestIdleCallback handler*requestIdle/timeout< webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:601
    setTimeout handler*requestIdle webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:600
    scheduleWork webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:635
    work webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:660
    requestIdleCallback handler*requestIdle/timeout< webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:601
    setTimeout handler*requestIdle webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:600
    scheduleWork webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:635
    work webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:660
    requestIdleCallback handler*requestIdle/timeout< webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:601
    setTimeout handler*requestIdle webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:600
    scheduleWork webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:635
    update webpack://practicejs/./node_modules/@codemirror/language/dist/index.js?:622
    update webpack://practicejs/./node_modules/@codemirror/view/dist/index.js?:1960
    updatePlugins webpack://practicejs/./node_modules/@codemirror/view/dist/index.js?:6556
    update webpack://practicejs/./node_modules/@codemirror/view/dist/index.js?:6467
    _dispatch webpack://practicejs/./node_modules/@codemirror/view/dist/index.js?:6341
    dispatch webpack://practicejs/./node_modules/@codemirror/view/dist/index.js?:6407
    setText webpack://practicejs/./src/js/CodeMirrorRepl.js?:65
    createEditorFromElement webpack://practicejs/./src/js/CodeMirrorRepl.js?:137
    createEditorFromSelector webpack://practicejs/./src/js/CodeMirrorRepl.js?:128
    <anonymous> webpack://practicejs/./src/js/main.js?:33
    async* webpack://practicejs/./src/js/main.js?:23
    js http://localhost:8080/main.bundle.js:1953
    __webpack_require__ http://localhost:8080/main.bundle.js:14229
    <anonymous> http://localhost:8080/main.bundle.js:15318
    <anonymous> http://localhost:8080/main.bundle.js:15320
```
次の行が含まれるとエラー,ただ単独業だけだとエラーにならないので、文字の組み合わせ？ CM6のバージョンは6.0.1
```
/* グローバル Chart:false, feather:false */
```

以下のテキストで発生
```
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ダッシュボード</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD">
  //CSSの設定など
  <!-- CSSの設定ファイル -->
  <style>
body {
  font-size: .875rem;
}

.feather {
  width: 16px;
  height: 16px;
}

/*
 * サイドバー
 */

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100; /* ナビゲーションバーの背面 */
  padding: 48px 0 0; /* ナビゲーションバーの高さ */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

@media (max-width: 767.98px) {
  .sidebar {
    top: 5rem;
  }
}

.sidebar-sticky {
  height: calc(100vh - 48px);
  overflow-x: hidden;
  overflow-y: auto; /* ビューポートがコンテンツより短い場合、スクロール可能なコンテンツ */
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #727272;
}

.sidebar .nav-link.active {
  color: #2470dc;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: .75rem;
}

/*
 * ナビゲーションバー
 */

.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

.navbar .navbar-toggler {
  top: .25rem;
  right: 1rem;
}

.navbar .form-control {
  padding: .75rem 1rem;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
}
  </style>
</head>

<body>
  <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <div class="container-fluid">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">会社名</a>
      <input class="form-control form-control-dark w-100 rounded-0 border-0" type="text" placeholder="検索" aria-label="検索">
      <div class="navbar-nav">
        <div class="nav-item text-nowrap">
          <a class="nav-link px-3" href="#">サインアウト</a>
        </div>
      </div>
    </div>
  </header>

  <div class="container-fluid">
    <div class="row">
      <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div class="position-sticky pt-3 sidebar-sticky">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                <span data-feather="home" class="align-text-bottom"></span>
                ダッシュボード
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file" class="align-text-bottom"></span>
                オーダー
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="shopping-cart" class="align-text-bottom"></span>
                製品
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="users" class="align-text-bottom"></span>
                顧客
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="bar-chart-2" class="align-text-bottom"></span>
                報告
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="layers" class="align-text-bottom"></span>
                統合
              </a>
            </li>
          </ul>

          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
            <span>保存されたレポート</span>
            <a class="d-flex align-items-center text-muted" href="#">
              <span data-feather="plus-circle" class="align-text-bottom"></span>
            </a>
          </h6>
          <ul class="nav flex-column mb-2">
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file-text" class="align-text-bottom"></span>
                今月
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file-text" class="align-text-bottom"></span>
               前四半期
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file-text" class="align-text-bottom"></span>
                社会的関与
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file-text" class="align-text-bottom"></span>
                年末販売
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 class="h2">ダッシュボード</h1>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group me-2">
              <button type="button" class="btn btn-sm btn-outline-secondary">シェア</button>
              <button type="button" class="btn btn-sm btn-outline-secondary">輸出</button>
            </div>
            <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
              <span data-feather="calendar" class="align-text-bottom"></span>
              今週
            </button>
          </div>
        </div>

        <canvas class="my-4 w-100" id="myChart" width="900" height="380"></canvas>

        <h2>セクションタイトル</h2>
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">見出し</th>
                <th scope="col">見出し</th>
                <th scope="col">見出し</th>
                <th scope="col">見出し</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1,001</td>
                <td>あお</td>
                <td>交</td>
                <td>小</td>
                <td>記</td>
              </tr>
              <tr>
                <td>1,002</td>
                <td>いね</td>
                <td>鋼</td>
                <td>省</td>
                <td>黄</td>
              </tr>
              <tr>
                <td>1,003</td>
                <td>うた</td>
                <td>抗</td>
                <td>商</td>
                <td>木</td>
              </tr>
              <tr>
                <td>1,004</td>
                <td>えま</td>
                <td>工</td>
                <td>匠</td>
                <td>規</td>
              </tr>
              <tr>
                <td>1,005</td>
                <td>おか</td>
                <td>項</td>
                <td>生</td>
                <td>機</td>
              </tr>
              <tr>
                <td>1,006</td>
                <td>かさ</td>
                <td>孔</td>
                <td>章</td>
                <td>期</td>
              </tr>
              <tr>
                <td>1,007</td>
                <td>きじ</td>
                <td>構</td>
                <td>証</td>
                <td>既</td>
              </tr>
              <tr>
                <td>1,008</td>
                <td>くり</td>
                <td>高</td>
                <td>章</td>
                <td>気</td>
              </tr>
              <tr>
                <td>1,009</td>
                <td>けち</td>
                <td>孝</td>
                <td>少</td>
                <td>基</td>
              </tr>
              <tr>
                <td>1,010</td>
                <td>こま</td>
                <td>功</td>
                <td>将</td>
                <td>貴</td>
              </tr>
              <tr>
                <td>1,011</td>
                <td>さら</td>
                <td>公</td>
                <td>招</td>
                <td>着</td>
              </tr>
              <tr>
                <td>1,012</td>
                <td>しか</td>
                <td>甲</td>
                <td>庄</td>
                <td>樹</td>
              </tr>
              <tr>
                <td>1,013</td>
                <td>すぎ</td>
                <td>候</td>
                <td>性</td>
                <td>来</td>
              </tr>
              <tr>
                <td>1,014</td>
                <td>せみ</td>
                <td>考</td>
                <td>頌</td>
                <td>奇</td>
              </tr>
              <tr>
                <td>1,015</td>
                <td>そと</td>
                <td>講</td>
                <td>勝</td>
                <td>器</td>
              </tr>
            </tbody>
          </table>
        </div><!-- /.table-responsive -->
      </main>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
  //JavaScriptプラグインの設定など
  <!-- アイコン -->
  <script src="https://cdn.jsdelivr.net/npm/feather-icons@4.28.0/dist/feather.min.js" integrity="sha384-uO3SXW5IuS1ZpFPKugNNWqTZRRglnUJK6UAZ/gxOX80nxEkN9NcGZTftn6RzhGWE" crossorigin="anonymous"></script>
  <!-- グラフ -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js" integrity="sha384-zNy6FEbO50N+Cg5wap8IKA4M/ZnLJgzc6w2NqACZaK0u0FXfOWRRJOnQtpZun8ha" crossorigin="anonymous"></script>
  <!-- JSの設定ファイル -->
  <script>
/* グローバル Chart:false, feather:false */

(() => {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })

  // グラフ
  const ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        '日曜日',
        '月曜日',
        '火曜日',
        '水曜日',
        '木曜日',
        '金曜日',
        '土曜日'
      ],
      datasets: [{
        data: [
          15339,
          21345,
          18483,
          24003,
          23489,
          24092,
          12034
        ],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })
})()

  </script>
</body>
```