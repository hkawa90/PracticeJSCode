## Running Mocha in the Browser

[Mocha - the fun, simple, flexible JavaScript test framework](https://mochajs.org/#running-mocha-in-the-browser)より。`autorun`オプションでブラウザ上のテストを自動実行してその結果を表示します。

```phtml
---
config:
    hide: false
    autorun: true
    view: true
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Mocha Tests</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mocha/10.2.0/mocha.css"
        integrity="sha512-SjDc34mGAkSBKnNMasz1QPVustFyPQUHUO5wxzGNC5x9wQMcHwDHXCNRYowC/6DsX0lqvpCI1mKiVEQkws2olw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        html {
            font-size: 180%;
        }
        #mocha h2 {
            font-size: 19px;
        }
        #mocha .test pre {
            font-size: 18px;
        }
    </style>
</head>

<body>
    <script>
    </script>
    <div id="mocha"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mocha/10.2.0/mocha.min.js"
        integrity="sha512-jsP/sG70bnt0xNVJt+k9NxQqGYvRrLzWhI+46SSf7oNJeCwdzZlBvoyrAN0zhtVyolGcHNh/9fEgZppG2pH+eA=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.7/chai.min.js"
        integrity="sha512-Pwgr3yHn4Gvztp1GKl0ihhAWLZfqgp4/SbMt4HKW7AymuTQODMCNPE7v1uGapTeOoQQ5Hoz367b4seKpx6j7Zg=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>
        const assert = chai.assert
        const expect = chai.expect
    </script>
    <script type="module" class="mocha-init">
        mocha.setup('bdd');
        mocha.checkLeaks();
    </script>
    <script type="module" src="bookmark.js"></script>
    <script type="module" src="test.bookmark.js"></script>
    <script type="module" class="mocha-exec">
        mocha.run();
    </script>
</body>

</html>
```

参考文献：

- [mocha による自動テスト](https://ja.javascript.info/testing-mocha)
- [MochaとChaiでなんでもテスト ～準備編～ - キリウ君が読まないノート](https://note.kiriukun.com/entry/testing-with-mocha-and-chai--start)
- [MochaとChaiでなんでもテスト ～ブラウザ用JavaScript編～ - キリウ君が読まないノート](https://note.kiriukun.com/entry/testing-with-mocha-and-chai---browser-javascript)
