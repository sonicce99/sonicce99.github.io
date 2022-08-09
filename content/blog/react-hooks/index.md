---
title: "Vanila Javascript로 useState 구현하기"
date: "2022-08-02"
description: "황준일 개발자님의 블로그를 보고 공부한 포스팅입니다."
---

## 마법 같았던 React-hooks. 🧚‍♀️

필자가 React를 처음 배울 때 가장 먼저 배웠던게 useState였다.
몇 번 써보았던 나는 곧 useState의 편리함에 빠져버렸고 useState를 마구마구 쓰기 시작했다.

그러던 어느날... 🥲

<img width='700px' src="https://user-images.githubusercontent.com/87749134/182306514-75065fbf-0bb5-49a8-98d2-aad8d51b6e3e.png" />

오잉? 이게 무슨 말이야 😭

React 공식문서에서 해당 error를 찾아보니 다음과 같은 이유가 나왔다.

1. React와 React DOM의 버전이 일치하지 않을 수 있습니다.

2. `Hooks 규칙`을 위반했을 수 있습니다.

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

📍 이러나 저러나 맨 위의 2가지의 규칙 모두 `최상위 레벨`에서 사용하라고 나와있다. 그런데 왜 그래야 할까??

필자는 몇 가지의 강의를 듣고 있다. 위의 의문을 품은지 꽤 시간이 지나고 어느날 [김민태의 프론트엔드 아카데미 : 제 2강 만들어보며 이해하는 React & Redux](https://fastcampus.co.kr/dev_academy_kmt2) 강의를 듣던 중 의문을 일정 부분 해소 할 수 있었다.

그리고 더 시간이 지나 황준일 개발자님의 [Vanilla Javascript로 React UseState Hook 만들기](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Make-useSate-hook/#vanilla-javascript%E1%84%85%E1%85%A9-react-usestate-hook-%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5) 블로그를 읽어 보며 한번 더 Hooks에 대한 공부를 할 수 있었고 직접 예제를 구현해보면서 hooks에 대해 확실히 이해할 수 있게 되었다.

자 이제 본격적으로 들어가보자!

### Step1. 1개의 state를 유지하기

hooks 마법의 최대 핵심은 `컴포넌트가 다시 실행되어도 state값은 초기화되지 않고 유지된다.` 라는 점이다. 우선 1개의 state부터 유지시켜보자.

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

import { useState } from "./useState.js"

const Counter = () => {
  const [count, setCount] = useState(1)

  window.increase = () => setCount(count + 1)

  return `
    <div>
      <strong>count : ${count}</strong>
      <button onclick="increase()">증가</button>
    </div>`
}

export default Counter
```

```javascript
// useState.js

import Counter from "./Counter.js"

// 처음엔 아무값도 할당하지 않음.
let state = null
export const useState = initState => {
  // state에 값이 없을 때만 초기화.
  if (state === null) {
    state = initState
  }

  const setState = newState => {
    state = newState
    // setState가 진행되면 렌더링을 다시 진행한다. (중요.)
    render()
  }
  return [state, setState]
}

let renderCount = 1
const render = () => {
  const $root = document.getElementById("root")
  $root.innerHTML = `
    <div>
      <div>하나의 useState 관리해보기</div>
      <br />
      <strong>총 렌더링 횟수 : ${renderCount}</strong>
      <br />
      ${Counter()}
    </div>
  `

  renderCount += 1
}

render()
```

<iframe class="example-frame" width="100%" src="https://sonicce99.github.io/make-react-hooks/single-state/index.html"></iframe>

state값을 useState함수 내부 스코프가 아닌 외부에 state를 저장해둠으로서 Counter.js를 재 렌더링하더라도 기존의 state를 유지 할 수 있게 만들었다. but 컴포넌트가 여러개 라면?? 여러개의 컴포넌트에서 각자 다른 state를 가지고 접근하고 싶다면 어떻게 할까?

하나의 state 값에서 여러 컴포넌트가 값을 가져다 쓸 수는 없을 것이다. 그러면 어떻게 해야 할까?

- 배열에 차곡차곡 push해서 값들을 유지하자!

- 각각의 값은 index를 통해 접근해서 가져올 수 있다.

이 2가지의 방법을 생각하면서 다음의 과정을 진행해보자.

### Step2. 여러개의 state를 유지하기

자 우선 아래의 클릭 버튼을 클릭해보고 일단 변화를 관찰해보자.

<iframe class="example-frame" width="100%" src="https://sonicce99.github.io/make-react-hooks/multi-state/index.html"></iframe>

클릭이라는 버튼과 피자라는 버튼을 클릭했을 때 클릭한 횟수와 피자는 어디 문자열이 하나씩 잘 늘어나는것을 볼 수 있다.

코드를 살펴보자.

여기서는 Counter.js는 변경 사항이 앖고 Pizza.js가 추가되었다!

```javascript
// Counter.js

import { useState } from "./useState.js"

const Counter = () => {
  const [count, setCount] = useState(1)
  const [click, setClick] = useState("클릭!")

  window.increase = () => {
    setCount(count + 1)
    setClick(click + "클릭!")
  }

  return `
    <div>
      <span>클릭한 횟수 : ${count}</span>
      <button onclick="increase()">클릭</button>
      <div>${click}</div> 
    </div>`
}

export default Counter
```

```javascript
// Pizza.js

import { useState } from "./useState.js"

const Pizza = () => {
  const [pizza, setPizza] = useState("도미노?")

  window.meow = () => setPizza(pizza + "파파존스!")

  return `
      <div>
        <strong>피자는 어디? : ${pizza}</strong>
        <button onclick="meow()">피자</button>
      </div>
    `
}

export default Pizza
```

아래의 useState.js 코드를 보면 currentStateKey와 states라는 전역 변수가 생겼다.

states에 모든 값들을 전부 밀어넣어서 저장 시키고 currentStateKey를 통해서 특정 value에 접근하는 것을 확인할 수 있다.

🌟 뿐만 아니라 자세히 살펴보면 render 함수 내부에서도 currentStateKey에 대한 접근이 필요히다는 것을 알 수 있다.

> ❗️ useState는 필연적으로 render와 같이 사용된다는 것을 알 수 있다.

```javascript
// useState.js

import Counter from "./Counter.js"

let currentStateKey = 0 // useState가 실행 된 횟수
const states = [] // state를 보관할 배열

export const useState = initState => {
  const key = currentStateKey

  // initState로 초기값 설정
  if (!states[currentStateKey]) {
    states[currentStateKey] = initState
  }

  // state 할당
  const state = states[currentStateKey]

  const setState = newState => {
    // state를 직접 수정하는 것이 아닌, states 내부의 값을 수정
    states[key] = newState
    render()
  }
  currentStateKey += 1
  return [state, setState]
}

let renderCount = 0
const render = () => {
  const $root = document.getElementById("root")

  // 아래와 같은 순서로 렌더링 되기 때문에 렌더링 되는 순서는 항상 같다.
  $root.innerHTML = `
    <div>
      <div>여러개의 useState 관리해보기</div>
      <br />
      <strong>렌더링 횟수 : ${renderCount}</strong>
      <br />
      ${Counter()}
    </div>
  `

  renderCount += 1

  /* setState가 호출된 양 만큼 currentStateKey값이 증가하기 때문에
     render호출이 끝나면 다시 0으로 저장해서 나중에 다시 render될때
     states 0번째 index부터 접근할 수 있게 해주어야한다.
  */
  currentStateKey = 0
}

render()
```

실제 useState 코드는 훨씬 복잡하겠지만 그래도 원리를 알면 생각보다 간단하다는 것을 알 수 있다.

하지만 위 코드에서 보면 뭔가 이상한게 보이지 않는가?

클릭이라는 버튼을 클릭하면 클릭한 횟수는 1씩 잘 증가하지만 총 렌더링 횟수는 2씩 증가하는 것을 볼 수 있다. 무엇인가 비효율적으로 render되고 있다는 것을 체크 할 수 있다.

useState 동작원리는 이제 다 알았으니 이제 최적화에 대해 알아보자!

## useState 최적화

앞에서는 useState에 `값을 유지하는 방법`에 대해서 공부해 보았다. 이번에는 최적화를 해보자.

최적화를 하야할 경우는 기본적으로

- 변경 된 값이 없을 경우.

- 동시에 여러 state가 변경 되는 경우.

일단 이 2가지가 있을 것이다.

### 변경된 값이 없을 경우

바로 위의 useState 코드는 실행시 무조건 render를 하게 되어 있다.

그렇기 때문에 간단한 조건만 추가하면 값이 다를 경우에만 rendering 시키면 된다!

```javascript
export const useState = initState => {
  const key = currentStateKey

  // initState로 초기값 설정
  if (!states[key]) {
    states[key] = initState
  }

  // state 할당
  const state = states[key]

  const setState = newState => {
    // 값이 똑같은 경우
    if (newState === state) return

    // 배열/객체일 때는 JSON.stringify를 통해 간단하게 비교할 수 있다.
    if (JSON.stringify(newState) === JSON.stringify(state)) return

    // state를 직접 수정하는 것이 아닌, states 내부의 값을 수정
    states[key] = newState
    render()
  }
  currentStateKey += 1
  return [state, setState]
}
```

간단하다!

### 동시에 여러 state가 변경되는 경우

setState가 실행되면 무조건 render가 실행되는 구조에서는 동시에 여러번 setState를 사용하는 경우에는 당연히 여러번 rendering하게 된다.

```javascript
// Counter.js

import { useState } from "./useState.js"

const Counter = () => {
  const [count, setCount] = useState(1)
  const [click, setClick] = useState("클릭!")

  window.increase = () => {
    setCount(count + 1)
    setClick(click + "클릭!")
  }

  return `
    <div>
      <span>클릭한 횟수 : ${count}</span>
      <button onclick="increase()">클릭</button>
      <div>${click}</div> 
    </div>`
}

export default Counter
```

만약에 setState가 하나의 함수내에서 100개가 있다면?

이 이벤트들을 모두 모아서 한번에 업데이트 칠 수는 없을까?

이를 해결하기 위해 `debounce`를 이용합니다.

```javascript
const debounce = (callback, delay = 0) => {
  let timer = null

  return () => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(callback, delay)
  }
}

const 야옹 = debounce(() => console.log("야옹"), 100)

야옹() // 실행 취소
야옹() // 실행 취소
야옹() // 실행 취소
야옹() // 실행
```

💵 tip debounce

> debounce는 이벤트를 그룹화하여 특정시간이 지난 후 하나의 이벤트만 발생하도록 하는 기술입니다.
>
> 즉, 순차적 호출을 하나의 그룹으로 "그룹화"할 수 있습니다.
>
> debounce 는 자주 사용 되는 이벤트나 함수 들의 실행되는 빈도를 줄여서, 성능 상의 유리함을 가져오기 위한 개념입니다.
>
> 자주 사용되는 간단한 예로는 자동 완성이 있습니다.
>
> keyboard 가 한자씩 입력될 때마다, api 로 데이터를 가져오게 되면, 사용자의 의도와 무관한 요청 이 자주 발생되는데, 이를 줄이기 위해, 입력이 끝난후나, 입력되는 중간 중간 200ms 마다 api 값을 가져온다면, 성능에서 매우 유리해집니다.
>
> 디바운싱에 대한 자세한 설명이나 예제 코드는 [여기](https://webclub.tistory.com/607)에서 확인해 보세요!

<img width="500px" src="https://user-images.githubusercontent.com/87749134/182535326-c25244ad-6cd4-4306-b5a5-58b067bfc893.png" />

> 현재 필자의 맥북의 주사율은 75Hz이다.

즉 1초에 75번 변화할 수 있다. 그 이상의 rendering은 사실상 불필요하다.

😊 결론 : 각자 컴퓨터의 주사율에 따라서 rendering 시키면 최적화를 할 수 있다!

이것을 도와주는 Web Api가 바로 `requestAnimationFrame` 이다. requestAnimationFrame는 자신의 컴퓨터 주사율에 맞춰서 자동으로 업데이트를 쳐준다.

다음 코드르 실행시켜 보자.

```javascript
;(() => {
  let start = new Date().getTime()
  let count = 0

  let callback = () => {
    let ts = new Date().getTime()
    count += 1
    if (ts - 1000 > start) {
      // console.log('End');
    } else {
      console.log(count)
      requestAnimationFrame(callback)
    }
  }

  requestAnimationFrame(callback)
})()
```

자신의 컴퓨터 주사율에 따라서 count가 표시될것이다.

60Hz => 1초애 60회

75Hz => 1초에 75회

144Hz => 1초에 144회

이제 debounce에 requestAnimationFrame을 적용시켜보자!

```javascript
const debounce = callback => {
  let timer = null

  return () => {
    if (timer) {
      cancelAnimationFrame(timer)
    }

    timer = requestAnimationFrame(callback)
  }
}

const 클릭 = debounce(() => console.log("클릭"))

클릭() // 실행 취소
클릭() // 실행 취소
클릭() // 실행 취소
클릭() // 실행
```

자! 이제 1초에 75번반 렌더링 하면서 맨 마지막 이벤트만 동작시키는 함수가 완성되었다!

이제 rendering 함수에 이를 적용시켜보자.

```javascript
const render = debounce(() => {
  const $root = document.getElementById("root")

  // 아래와 같은 순서로 렌더링 되기 때문에 렌더링 되는 순서는 항상 같다.
  $root.innerHTML = `
    <div>
      ${Cat()}
      ${Counter()}
    </div>
  `

  currentStateKey = 0
})
```

<iframe class="example-frame" width="100%" src="https://sonicce99.github.io/make-react-hooks/debounce-requestAnimationFrame/index.html"></iframe>

총 렌더링 횟수가 같이 잘 올라가는 것을 확인할 수 있다! 😆

## 다시 처음으로

~~수미상관 구조~~

필자가 처음 만났던 에러 🥲

이젠 무섭지 않아!! 🎃

<img width='700px' src="https://user-images.githubusercontent.com/87749134/182306514-75065fbf-0bb5-49a8-98d2-aad8d51b6e3e.png" />

이 에러가 왜 발생했는지 이제는 확실하게 말할 수 있다.

왜 최상위에 hooks가 존재해야만 하는지 확실하게 말할 수 있다.

왜 useEffect안에서 hooks를 호출 할 수 없는지 확살하게 알고 있다.

states에 array로 값들을 저장하고 currentStateKey로 접근해서 값을 빼오기 때문에 최상위가 아닌 다른 렌더링 조건이 걸려있으면 호출 할 수가 없는것이다.

## 마무리 하며

[황준일 개발자님의 블로그](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Make-useSate-hook/#_2-%E1%84%83%E1%85%A9%E1%86%BC%E1%84%89%E1%85%B5%E1%84%8B%E1%85%A6-%E1%84%8B%E1%85%A7%E1%84%85%E1%85%A5-setstate%E1%84%80%E1%85%A1-%E1%84%89%E1%85%B5%E1%86%AF%E1%84%92%E1%85%A2%E1%86%BC%E1%84%83%E1%85%AC%E1%86%AF-%E1%84%80%E1%85%A7%E1%86%BC%E1%84%8B%E1%85%AE) 를 보며 정말 많이 배울 수 있었고 공부할 수 있었다. 특히 debounce와 requestAnimationFrame Api로 최적화를 하는 부분은 정말 공부에 깊이감이 다르다는 생각을 많이 하면서 블로그를 읽었다. 나도 이런 개발자가 되기 위해 열심히 노력해야겠다.
