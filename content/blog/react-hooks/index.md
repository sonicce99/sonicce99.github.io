---
title: "Vanila Javascript로 useState 구현하기"  
date: "2022-08-02"
description: "황준일 개발자님의 블로그를 보고 공부한 포스팅입니다."  
---

# 마법과 같았던 React-hooks. 🧚‍♀️

필자가 React를 처음 배울 때 가장 먼저 배웠던게 useState였다.
몇 번 써보았던 나는 곧 useState의 편리함에 빠져버렸고 useState를 마구마구 쓰기 시작했다.   

그러던 어느날... 🥲

<img width='700px' src="https://user-images.githubusercontent.com/87749134/182306514-75065fbf-0bb5-49a8-98d2-aad8d51b6e3e.png" />  

오잉? 이게 무슨 말이야 😭

React 공식문서에서 해당 error를 찾아보니 다음과 같은 이유가 나왔다.

1. React와 React DOM의 버전이 일치하지 않을 수 있습니다.

2. ```Hooks 규칙```을 위반했을 수 있습니다.

3. 같은 앱에 React가 한 개 이상있을 수 있습니다.

가장 유력했던 원인이 2번일거 같다는 생각이 들었다. 그런데

**Hooks의 규칙이 뭐지?**

공식문서에는 다음과 같이 나와있었다.

- Hooks의 규칙 위반

  - 함수 컴포넌트의 본문 최상위 레벨에서 호출하세요.

  - 사용자 정의 Hook 본체의 최상위 레벨에서 호출하세요.  

  - 클래스 컴포넌트에서 Hooks를 호출하지 마세요.

  - 이벤트 핸들러에서 호출하지 마세요.

  - useMemo, useReducer or useEffect에 전달된 함수 내에서 Hooks를 호출하지 마세요.  

📍 이러나 저러나 맨 위의 2가지의 규칙 모두 ```최상위 레벨```에서 사용하라고 나와있다. 그런데 왜 그래야 할까??

필자는 몇 가지의 강의를 듣고 있다. 위의 의문을 품은지 꽤 시간이 지나고 어느날 [김민태의 프론트엔드 아카데미 : 제 2강 만들어보며 이해하는 React & Redux](https://fastcampus.co.kr/dev_academy_kmt2) 강의를 듣던 중 의문을 일정 부분 해소 할 수 있었다.

그리고 더 시간이 지나 황준일 개발자님의 [Vanilla Javascript로 React UseState Hook 만들기](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Make-useSate-hook/#vanilla-javascript%E1%84%85%E1%85%A9-react-usestate-hook-%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5) 블로그를 읽어 보며 한번 더 Hooks에 대한 공부를 할 수 있었고 직접 예제를 구현해보면서 hooks에 대해 확실히 이해할 수 있게 되었다.

자 이제 본격적으로 들어가보자!

## Step1. 1개의 state를 유지하기  

hooks 마법의 최대 핵심은 ```컴포넌트가 다시 실행되어도 state값은 초기화되지 않고 유지된다.``` 라는 점이다. 우선 1개의 state부터 유지시켜보자.

```html
// index.html

<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./useState.js" type="module"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

```javascript
// Counter.js

import { useState } from "./useState.js";

const Counter = () => {
  const [count, setCount] = useState(1);

  window.increase = () => setCount(count + 1);

  return `
    <div>
      <strong>count : ${count}</strong>
      <button onclick="increase()">증가</button>
    </div>`;
};

export default Counter;
```

```javascript
// useState.js

import Counter from "./Counter.js";

// 처음엔 아무값도 할당하지 않음.
let state = null;
export const useState = (initState) => {
  // state에 값이 없을 때만 초기화.
  if (state === null) {
    state = initState;
  }

  const setState = (newState) => {
    state = newState;
    // setState가 진행되면 렌더링을 다시 진행한다. (중요.)
    render();
  };
  return [state, setState];
};

const render = () => {
  const $root = document.getElementById("root");
  $root.innerHTML = Counter();
};

render();
```

<iframe class="example-frame" width="100%" src="https://sonicce99.github.io/make-react-hooks/single-state/index.html"></iframe>  

자 하나의 state는 외부에 state를 저장해둠으로서 컴포넌트가 재 실행되어도 유지 할 수 있게 만들었다. but 컴포넌트가 여러개 라면??

하나의 state 값에서 여러 컴포넌트가 값을 가져다 쓸 수는 없을 것이다. 그러면 어떻게 해야 할까?

- 배열에 차곡차곡 push해서 값들을 유지하자!

- 각각의 값은 index를 통해 접근해서 가져올 수 있다.

이 2가지의 방법을 생각하면서 다음의 과정을 진행해보자.

## Step2. 여러개의 state를 유지하기   

html 파일은 위에서 본 코드와 같다.  

```html
// index.html

<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./useState.js" type="module"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Counter.js 역시 똑같고 Cat.js라는 파일이 추가되었다.

```javascript
// Counter.js

import { useState } from "./useState.js";

const Counter = () => {
  const [count, setCount] = useState(1);

  window.increase = () => setCount(count + 1);

  return `
    <div>
      <strong>count : ${count}</strong>
      <button onclick="increase()">증가</button>
    </div>`;
};

export default Counter;
```

```javascript
// Cat.js  

import { useState } from "./useState.js";

const Cat = () => {
  const [cat, setCat] = useState("고양이");

  window.meow = () => setCat(cat + "야옹!");

  return `
      <div>
        <strong>${cat}</strong>
        <button onclick="meow()">야옹</button>
      </div>
    `;
};

export default Cat;
```

Cat.js 파일이 생기면서 2개의 useState가 사용되었다. 그럼 useState.js 파일은 당연히 이전 코드와 같을 수 없고 수정되어야한다. 어떻게 해야할까?


```javascript
// useState.js

import Counter from "./Counter.js";
import Cat from "./Cat.js";

let currentStateKey = 0; // useState가 실행 된 횟수
const states = []; // state를 보관할 배열

export const useState = (initState) => {
  const key = currentStateKey;

  // initState로 초기값 설정
  if (!states[key]) {
    states[key] = initState;
  }

  // state 할당
  const state = states[key];

  const setState = (newState) => {
    // state를 직접 수정하는 것이 아닌, states 내부의 값을 수정
    states[key] = newState;
    render();
  };
  currentStateKey += 1;
  return [state, setState];
};

const render = () => {
  const $root = document.getElementById("root");

  // 아래와 같은 순서로 렌더링 되기 때문에 렌더링 되는 순서는 항상 같다.
  $root.innerHTML = `
    <div>
      ${Cat()}
      ${Counter()}
    </div>
  `;

  currentStateKey = 0;
};

render();
```

currentStateKey와 states라는 전역 변수가 생겼다.

🌟 뿐만 아니라 render 함수 내부에서도 currentStateKey에 대한 접근이 필요하기 때문에 Dock 패턴으로 코드를 합치게 되었다.

  > ❗️ useState는 필연적으로 renderㄹ와 같이 사용된다는 것을 알 수 있다.

물론 실제 useState 코드는 훨씬 복잡하겠지만 그래도 원리를 알면 생각보다 간단하다는 것을 알 수 있다.  

<iframe class="example-frame" width="100%" src="https://sonicce99.github.io/make-react-hooks/multi-state/index.html"></iframe>  


# useState 최적화  

앞에서는 useState에 ```값을 유지하는 방법```에 대해서 공부해 보았다. 이번에는 최적화를 해보자.  

최적화를 하야할 경우는 기본적으로  

- 변경 된 값이 없을 경우.

- 동시에 여러 state가 변경 되는 경우.  

일단 이 2가지가 있을 것이다.

## 변경된 값이 없을 경우

바로 위의 useState 코드는 실행시 무조건 render를 하게 되어 있다.

그렇기 때문에 간단한 조건만 추가하면 값이 다를 경우에만 rendering 시키면 된다!

```javascript
export const useState = (initState) => {
  const key = currentStateKey;

  // initState로 초기값 설정
  if (!states[key]) {
    states[key] = initState;
  }

  // state 할당
  const state = states[key];

  const setState = (newState) => {
    // 값이 똑같은 경우
    if (newState === state) return;

    // 배열/객체일 때는 JSON.stringify를 통해 간단하게 비교할 수 있다.
    if (JSON.stringify(newState) === JSON.stringify(state)) return;

    // state를 직접 수정하는 것이 아닌, states 내부의 값을 수정
    states[key] = newState;
    render();
  };
  currentStateKey += 1;
  return [state, setState];
};
```

## 동시에 여러 state가 변경되는 경우

setState가 실행되면 무조건 render가 실행되는 구조에서는 동시에 여러번 setState를 사용하는 경우에는 당연히 여러번 rendering하게 된다.

```javascript
setCat(cat + '야옹!');
setCat(count + 1);
```

즉 비효율적이다.

이를 해결하기 위해 ```debounce```를 이용합니다.

::: tip debounce

Debounce는 이벤트를 그룹화하여 특정시간이 지난 후 하나의 이벤트만 발생하도록 하는 기술입니다.

즉, 순차적 호출을 하나의 그룹으로 "그룹화"할 수 있습니다.

Debounce 는 자주 사용 되는 이벤트나 함수 들의 실행되는 빈도를 줄여서, 성능 상의 유리함을 가져오기 위한 개념입니다.  

자주 사용되는 간단한 예로는 자동 완성이 있습니다.

keyboard 가 한자씩 입력될 때마다, api 로 데이터를 가져오게 되면, 사용자의 의도와 무관한 요청 이 자주 발생되는데, 이를 줄이기 위해, 입력이 끝난후나, 입력되는 중간 중간 200ms 마다 api 값을 가져온다면, 성능에서 매우 유리해집니다.


디바운싱에 대한 자세한 설명이나 예제 코드는 [여기](https://webclub.tistory.com/607)에서 확인해 보세요!  

:::

<img width="500px" src="https://user-images.githubusercontent.com/87749134/182535326-c25244ad-6cd4-4306-b5a5-58b067bfc893.png" />

현재 필자의 맥북은 75Hz이다.

즉 1초에 75번 변화할 수 있다.

이는 다시말해 ```1초에 75번을 초과하는 변화는 감지되기 힘들다``` 이다.

😊 결론 : 1초에 75번만 rendering 시키면 최적화를 할 수 있다!
