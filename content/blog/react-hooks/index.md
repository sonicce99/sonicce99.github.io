---
title: "Vanila Javascript로 useState 구현하기"  
date: "2022-08-02"
description: "황준일 개발자님의 블로그를 보고 공부한 포스팅입니다."  
---

# 마법과 같았던 React-hooks. 🧚‍♀️

필자가 React를 처음 배울 때 가장 먼저 배웠던게 useState였다.
몇 번 써보았던 나는 곧 useState의 편리함에 빠져버렸고 useState를 마구마구 쓰기 시작했다.   

그러던 어느날... 🥲

![hook-error](https://user-images.githubusercontent.com/87749134/182306514-75065fbf-0bb5-49a8-98d2-aad8d51b6e3e.png)

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

<iframe class="example-frame" width="100%" src="https://sonicce99.github.io/make-react-hooks/multi-state/index.html"></iframe>  
