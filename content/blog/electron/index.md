---
title: "Electron 공식문서 뿌시기🗿"
date: "2022-09-27"
description: "Electron 공식문서를 읽고 내용을 정리합니다."
---

## Get Started

### Electron은 무엇인가요?

Electron은 Javascript, HTML, CSS를 사용해서 desktop application을 만들 수 있는 Framework입니다. `Chromium`과 `Node.js`를 포함함으로서, Electron은 Javascript 코드 베이스로 Window, macOS, Linux에서 동작시킬 수 있습니다. 특별한 개발 경험이 필요하지 않습니다.

---

### Quick Start

여기서는 Electron으로 Hello World app을 만들 수 있습니다. 이 튜토리얼이 끝나면 앱은 실행 중인 Chromium, Node.js 및 Electron 버전에 대한 정보가 포함된 웹 페이지를 표시하는 브라우저 창을 엽니다.

#### 설치

```bash
mkdir my-electron-app && cd my-electron-app
npm init
```

`npm init` 은 몇가지의 fields를 설정해주어야 합니다. 이 튜토리얼을 진행하기 위해 따라야할 몇가지 사항이 있습니다.

- entry point는 `main.js`여야 합니다.

- author, description는 어떤 값이든 상관없습니다. 다만 `app packaging`을 위해 꼭 필요합니다.

package.json을 다음과 같이 설정해주세요.

```scripts
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "author": "DongSu Lee",
  "license": "MIT"
}
```

그 다음 `electron`을 `devDependencies`로 설치하세요.

```bash
npm install --save-dev electron
```

```scripts
{
  "scripts": {
    "start": "electron ."
  }
}
```

`npm run start`는 개발모드로 앱을 열어줄 것입니다.

```
npm start
```

> 참고: 이 스크립트는 Electron이 프로젝트의 루트 폴더에서 실행되도록 지시합니다. 이 단계에서 앱은 실행할 앱을 찾을 수 없다는 오류를 즉시 표시합니다.

#### Run the main process

실행되는 동안 Electron은 package.json에 있는 `main` 필드를 찾습니다.

electron application의 진입점은 `main.js`입니다. 이 스크립트는 **main process**를 컨트롤합니다. main process는 전체 Node.js 환경에서 실행되고 앱의 수명 주기를 제어하는 ​​주요 프로세스를 제어합니다.

#### 브라우저창에서 web page 열기

자 이제 main.js를 만들었으니 우리는 2가지의 Electron module이 필요합니다.

- app module (app의 이벤트 라이브사이클을 컨트롤합니다.)

- BrowserWindow module (app의 windows를 생성하고 관리합니다.)

main process가 node.js 런타임환경이니 `CommonJS` 모듈을 import 할 수 있습니다.

```Javascript
const { app, BrowserWindow } = require('electron')
```

그런 다음 index.html을 새 BrowserWindow 인스턴스에 로드하는 createWindow() 함수를 추가합니다.

```javascript
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  win.loadFile("index.html")
}
```

그 다음 createWindow 함수를 호출하세요.

Electron에서는 app 모듈이 `ready` 이벤트가 fired 된 후에 browser windows가 생성됩니다. 그래서 다음과 같이 작성할 수 있습니다.

```javascript
app.whenReady().then(() => {
  createWindow()
})
```

#### 윈도우 라이프사이클 관리하기

이제 앱을 열 수 있게 되었지만, 운영체제 별로 좀 더 native한 느낌을 주기 위해 추가적인 boilerPlate code가 필요합니다. Application windows는 각각의 OS별로 다르게 움직입니다.

##### Window & Linux

Windows 및 Linux에서 모든 창을 종료하면 일반적으로 응용 프로그램이 완전히 종료됩니다.

```javascript
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})
```

##### macOS

Linux 및 Windows 앱은 창이 열려 있지 않으면 종료되지만 macOS 앱은 일반적으로 창이 열리지 않아도 계속 실행되며 사용 가능한 창이 없을 때 앱을 활성화하면 새 창이 열립니다.

이 기능을 구현하려면 app 모듈의 activate event를 수신하고 브라우저 창이 열려 있지 않으면 기존 createWindow() 메서드를 호출합니다.

Electron app은 ready 이벤트 전에 창을 만들 수 없으므로 앱이 initialized된 후에만 activate 이벤트를 수신 대기해야 합니다. 기존 whenReady() 콜백 내에서 이벤트 리스너를 연결하여 이를 수행합니다.

```javascript
app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
```

#### preload script를 사용하여 Node.js에 access하기

우리가 해야할 일은 Electron의 version과 devDependencies를 웹페이지에 출력하는 것입니다.

이런 정보에 접근하기 위해서 사실 main process에 작업을 하는것이 간단합니다. 하지만 main process에서는 `renderer's document context`에 접근할 수 없기 때문에 DOM을 수정할 수 없습니다.

여기서 **preload script**를 renderer에 미리 붙이면 편리합니다. preload script는 renderer process가 실행되기 전에 실행되며, renderer globals (window, document) 와 Node.js환경 모두에 접근 할 수 있습니다.

`preload.js`를 아래와 같이 생성하세요.

```javascript
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
```

❗️ 이 스크립트를 renderer process에 연결하려면, BrowserWindow 생성자의 webPreferences.preload 옵션에 전달하세요.

```javascript
// include the Node.js 'path' module at the top of your file
const path = require("path")

// modify your existing createWindow() function
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  win.loadFile("index.html")
}
// ...
```

#### 보너스: 추가적인 web contents 추가하기

이 시점에서 어떻게 추가적인 기능을 넣을 수 있을지 궁금하실겁니다!

더 많은 콘텐츠를 위해, scripts를 renderer process에 추가 할 수 있습니다. renderer은 normal web 환경에서 돌아가기 때문에 `<script> tag` 를 index.html의 </body> tag 앞에 추가할 수 있습니다.

```html
<script src="./renderer.js"></script>
```

renderer.js에 포함된 코드는 같은 Javascript API과 프론트엔드에서 사용하는 전형적인 개발 도구에서 사용가능합니다.

#### 요약

- 앱을 컨트롤하고 Node.js 환경에서 돌아가는 main process를 main.js에 script를 생성했습니다.

- main.js에서 브라우저 창을 생성하고 웹 컨텐츠를 보여주기 위해 Electron의 `app`과 `BrowserWindow` 모듈을 사용했습니다.

---

## 튜토리얼

### 전제조건 (Prerequisites)

Electron은 HTML, CSS, Javascript를 사용해 desktop application을 만들기 위한 프레임워크 입니다. ` Chromium` 과 `Node.js`을 single binary file에 추가함으로써, Electron은 Javascript 코드 베이스로 Windows, macOS, Linux에서 동작하는 cross-platform apps를 만들 수 있게 해줍니다.

이번 튜토리얼에서는 Electron을 사용해 desktop application을 개발하는 과정을 가이드합니다.

#### 가정

Electron은 Web apps을 위한 기본 wrapper layer이며 Node.js 환경에서 실행됩니다. 따라서 이번 튜토리얼에서는 일반적으로 Node 및 프런트 엔드 웹 개발 기본 사항에 익숙하다고 가정합니다.

### 앱 만들기 (Building your First App)

- 내용은 위에 [Quick Start](#quick-start)와 동일함.

#### 요약  

- Electron 애플리케이션은 npm 패키지를 사용하여 설정됩니다. Electron 실행 파일은 프로젝트의 devDependencies에 설치되어야 하며 package.json 파일의 스크립트를 사용하여 개발 모드에서 실행할 수 있습니다.

- 앱은 package.json에 `main` property를 찾아 진입하며, 이 파일은 Node.js의 인스턴스를 실행하고 앱의 수명 주기, 기본 인터페이스 표시, 권한 있는 작업 수행, renderer process 관리를 담당하는 Electron의 **main process**를 컨트롤합니다.     

- Renderer process는 그래픽 콘텐츠 표시를 담당합니다. 웹 주소나 로컬 HTML 파일을 가리키도록 하여 웹 페이지를 렌더러에 로드할 수 있습니다. renderer는 일반 웹 페이지와 매우 유사하게 작동하며 동일한 웹 API에 액세스할 수 있습니다.    

- 다음 섹션에서는 privileged API로 renderer process를 컨트롤 하는 방법과 프로세스 간에 통신하는 방법을 배웁니다.    

### Preload script 활용하기 (Using Preload Scripts)

#### 목표  

이번장에서는 preload script는 무엇인지, renderer process에서 privileged API를 어떻게 안전하게 사용할 수 있는지에 대해 학습합니다. 또한 main process와 renderer process 사이에서 어떻게 통신하는지에 대해서 배울 수 있습니다.

#### preload script는 무엇인가요?

Electron의 main process는 전체 운영 체제 액세스 권한이 있는 Node.js 환경입니다. Electron 모듈 외에도 Node.js 내장 기능과 npm을 통해 설치된 모든 패키지에 액세스할 수 있습니다. 반면에 renderer process는 웹 페이지를 실행하며 보안상의 이유로 기본적으로 Node.js를 실행하지 않습니다.

서로 다른 프로세스 유형을 연결하려면 **preload** 라는 special script를 사용해야 합니다.

#### preload script를 통한 renderer 확장  

BrowserWindow의 preload script는 HTML DOM과 Node.js 및 Electron API의 제한된 하위 집합에 모두 액세스할 수 있는 컨텍스트에서 실행됩니다.

preload script는 웹 페이지가 renderer에 로드되기 전에 주입됩니다. 필요한 기능을 renderer에 추가하려면 contextBridge API를 통해 전역 객체를 정의할 수 있습니다.  

이 개념을 시연하기 위해 앱의 Chrome, Node 및 Electron 버전을 renderer에 노출하는 preload script를 만듭니다.    

```javascript
// preload.js

const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
})
```

preload script를 renderer process에 연결하려면 해당 경로를 BrowserWindow 생성자의 webPreferences.preload 옵션에 전달하세요.

```javascript
// main.js

const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```

이 시점에서 renderer는 versions global에 접근할 수 있으므로, 이 정보를 window에 띄워보겠습니다.
renderer.js를 생성하고 아래와 같이 작성하세요.

```javascript
// renderer.js

const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
```

html에 renderer.js script를 추가해줍니다.

```HTML
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <meta
      http-equiv="X-Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <title>Hello from Electron renderer!</title>
  </head>
  <body>
    <h1>Hello from Electron renderer!</h1>
    <p>👋</p>
    <p id="info"></p>
  </body>
  <script src="./renderer.js"></script>
</html>
```

<img width="600" alt="스크린샷 2022-10-13 오전 10 45 02" src="https://user-images.githubusercontent.com/87749134/195479488-0044412b-faad-4140-9547-515b0fbcdd63.png">


#### 프로세스간 통신

위에서 언급했다 싶이, main과 renderer process는 전혀 다른 환경을 가지고 있습니다. 그래서 renderer process에서 Node.js APIs에 바로 접근하는건 불가능할 뿐만 아니라 HTML DOM 에서 main process로 접근도 불가능 하죠.

이런 문제를 해결하기 위해서 Electron의 `ipcMain` 과 `ipcRenderer` 모듈을 사용하는 것입니다. 우리의 웹페이지에서 main process로 메세지를 보내기 위해, `ipcMain.handle` 이라는 main process handler를 설정할 수 있습니다. 그리고 `ipcRender.invoke` 를 preload.js에서 호출하면 됩니다.

우선, main process에서 renderer에 string을 return 하는 `ping()` 이라는 전역 함수를 추가합니다.   

```javascript
// preload.js

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  // we can also expose variables, not just functions
})
```

그런 다음 main process에서 handle listener를 설정합니다. HTML 파일을 load하기 전에 이 작업을 수행하여 renderer에서 호출을 보내기 전에 처리기가 준비되었음을 보장합니다.


```javascript
const { ipcMain } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  ipcMain.handle('ping', () => 'pong')
  win.loadFile('index.html')
}
```

sender와 receiver를 설정했으면 이제 정의한 'ping' 채널을 통해 renderer에서 main process로 메시지를 보낼 수 있습니다.  

```javascript
const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
}

func()
```

***

### 기능 추가하기 (Adding Features)
