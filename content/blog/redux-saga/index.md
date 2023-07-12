---
title: "React-Saga 공식문서 번역본"
date: "2023-07-12"
description: "redux-saga의 공식문서를 읽고 내용을 정리합니다."
keywords: [react, 자바스크립트, javascript, redux-saga, 공식문서]
---

## About Redux-Saga

Redux-saga는 앱의 side-effects (data fetching, 브라우저 캐시 접근)을 보다 쉽게 관리하고, 쉽고, 테스트하기 용이하며, 오류를 더 잘 처리하도록 하는 것을 목표로 합니다.

기본적인 모델은 saga는 앱에서 동작하는 별도의 thread와 같다는 점입니다. redux-saga는 redux의 미들웨어로서, redux actions로 부터 thread를 시작, 중지, 취소 시킬 수 있습니다.

Generators라는 ES6 기능을 사용하여 이러한 비동기 흐름을 쉽게 읽고 쓰고 테스트할 수 있습니다. 이렇게 하면 이러한 비동기 흐름이 표준 동기 JavaScript 코드처럼 보입니다.

data fetching을 처리하기 위해 이전에 redux-thunk를 사용했을 수 있습니다. redux thunk와 달리 콜백 지옥에 빠지지 않고 비동기 흐름을 쉽게 테스트할 수 있으며 작업이 순수하게 유지됩니다.

## Introduction

### Beginner Tutorial

`sagas.js`를 만들고 아래와 같은 코드를 작성합니다.

```js
// sagas.js
export function* helloSaga() {
  console.log("Hello Sagas!")
}
```

saga를 통작시키기 위해선 다음이 필요합니다.

- saga middleware를 생성합니다.

- redux store에 saga middleware를 연결합니다.

`main.js`를 생성합니다.

```js
// main.js
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { helloSaga } from './sagas'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(helloSaga)

const action = type => store.dispatch({type})

function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => action('INCREMENT')}
      onDecrement={() => action('DECREMENT')}
      onIncrementAsync={() => action('INCREMENT_ASYNC')} />,
    />,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)
```

첫번째로 `.sagas.js` 에서 모듈을 import합니다.

그 다음 `redux-saga` 라이브러리에서 export 된 `createSagaMiddleware`를 사용하여 미들웨어를 생성할 수 있습니다.

미들웨어를 생성하면 Store에 연결을 시킨 후 `helloSaga`를 run합니다.

#### Making Asynchronous calls​

`Counter.js`를 생성합니다.

```js
const Counter = ({ value, onIncrement, onDecrement, onIncrementAsync }) => (
  <div>
    <button onClick={onIncrementAsync}>Increment after 1 second</button>

    <button onClick={onIncrement}>Increment</button>

    <button onClick={onDecrement}>Decrement</button>

    <div>Clicked: {value} times</div>
  </div>
)
```

🌿 redux-thunk와 다르게 dispatch 대신 action 객체를 사용합니다.

`sagas.js`에 다음의 코드로 변경합니다.

```js
// sagas.js
import { put, takeEvery } from "redux-saga/effects"

const delay = ms => new Promise(res => setTimeout(res, ms))

export function* helloSaga() {
  console.log("Hello Sagas!")
}

// Our worker Saga: will perform the async increment task
export function* incrementAsync() {
  yield delay(1000)
  yield put({ type: "INCREMENT" })
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchIncrementAsync() {
  yield takeEvery("INCREMENT_ASYNC", incrementAsync)
}
```

delay라는 함수를 생성했는데 이는 Generator를 `block` 하기 위해 사용합니다.

Sagas는 redux-saga 미들웨어에 객체를 yield하는 Generator 함수로 구현됩니다.
yield된 객체는 미들웨어가 해석해야 하는 일종의 명령입니다.
Promise가 미들웨어에 yield되면 미들웨어는 Promise가 완료될 때까지 Saga를 일시 중단합니다.
위의 예에서 incrementAsync Saga는 delay에 의해 Promise가 해결될 때까지 일시 중지되며, 이는 1초 후에 발생합니다.

Promise가 resolve되면 미들웨어는 Saga를 재개하여 다음 yield까지 코드를 실행합니다.
다음 명령문은 INCREMENT action을 dispatch하도록 미들웨어에 지시하는 put({type: 'INCREMENT'}) 호출의 결과인 또 다른 yield된 객체입니다.

put은 우리가 Effect라고 부르는 것의 한 예입니다.
Effects는 미들웨어가 수행할 명령을 포함하는 일반 JavaScript 객체입니다.
미들웨어가 Saga에서 생성된 Effects를 retrieves하면 Effets가 충족될 때까지 Saga가 일시 중지됩니다.

요약하자면, incrementAsync Saga는 delay(1000)에 대한 호출을 통해 1초 동안 대기한 다음 INCREMENT 작업을 발송합니다.

다음으로 또 다른 Saga watchIncrementAsync를 만들었습니다.
redux-saga에서 제공하는 helper 함수인 takeEvery를 사용하여 발송된 INCREMENT_ASYNC 작업을 수신하고 매번 incrementAsync를 실행합니다.

이제 우리는 2개의 Sagas를 가지고 있고, 우리는 그것들을 한 번에 시작해야 합니다.
이를 위해 다른 Sagas 시작을 담당하는 rootSaga를 추가합니다. 동일한 파일 sagas.js에서 다음과 같이 파일을 리팩터링합니다.

```js
// sagas.js
import { put, takeEvery, all } from "redux-saga/effects"

export const delay = ms => new Promise(res => setTimeout(res, ms))

export function* helloSaga() {
  console.log("Hello Sagas!")
}

export function* incrementAsync() {
  yield delay(1000)
  yield put({ type: "INCREMENT" })
}

export function* watchIncrementAsync() {
  yield takeEvery("INCREMENT_ASYNC", incrementAsync)
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([helloSaga(), watchIncrementAsync()])
}
```

이제 middleware에 rootSaga를 전달합니다.

```js
// ...
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const store = ...
sagaMiddleware.run(rootSaga)

// ...
```

#### Making our code testable

incrementAsync Saga를 테스트하여 원하는 작업을 수행하는지 확인하려고 합니다.

다른 파일 `sagas.spec.js`를 만듭니다.

```js
// sagas.spec.js
import test from "tape"

import { incrementAsync } from "./sagas"

test("incrementAsync Saga test", assert => {
  const gen = incrementAsync()

  // now what ?
})
```

incrementAsync는 Generator 함수입니다.
실행되면 iterator 객체를 반환하고 iterator의 next 메서드는 아래와 같은 객체를 반환합니다.

```js
gen.next() // => { done: boolean, value: any }
```

```js
gen.next() // => { done: false, value: <result of calling delay(1000)> }
gen.next() // => { done: false, value: <result of calling put({type: 'INCREMENT'})> }
gen.next() // => { done: true, value: undefined }
```

처음 2개의 호출은 yield 표현식의 결과를 반환합니다.
세 번째 호출에서는 더 이상 yield가 없으므로 done 필드가 true로 설정됩니다.
또한 incrementAsync Generator는 아무 것도 반환하지 않으므로(return 문 없음) value 필드는 undefined로 설정됩니다.

따라서 이제 incrementAsync 내부의 논리를 테스트하려면 반환된 Generator를 반복하고 Generator에서 산출한 값을 확인해야 합니다.

```js
// sagas.spec.js
import test from 'tape'

import { incrementAsync } from './sagas'

test('incrementAsync Saga test', (assert) => {
  const gen = incrementAsync()

  assert.deepEqual(
    gen.next(),
    { done: false, value: ??? },
    'incrementAsync should return a Promise that will resolve after 1 second'
  )
})
```

문제는 delay의 return 값을 테스트하는 방법입니다.
우리는 Promise에 대해 간단한 동등성 테스트를 할 수 없습니다.
delay가 normal 값을 반환했다면 테스트하기가 더 쉬웠을 것입니다.

redux-saga는 위의 진술을 가능하게 하는 방법을 제공합니다.
incrementAsync 내에서 직접 delay(1000)를 호출하는 대신 간접적으로 호출하고 내보내기하여 이후의 심층 비교를 가능하게 합니다.

```js
// sagas.js
import { put, takeEvery, all, call } from "redux-saga/effects"

export const delay = ms => new Promise(res => setTimeout(res, ms))

// ...

export function* incrementAsync() {
  // use the call Effect
  yield call(delay, 1000)
  yield put({ type: "INCREMENT" })
}
```

yield delay(1000) -> yield call(delay, 1000)로 변경되었습니다.  
차이점이 뭘까요?

첫번째는 next 호출자에게 전달되기 전에 평가됩니다.
따라서 호출자가 얻는 것은 Promise입니다.

두 번째 경우, yield 표현식 call(delay, 1000)은 next 호출자에게 전달되는 것입니다.
put과 마찬가지로 call은 미들웨어가 주어진 인수로 주어진 함수를 호출하도록 지시하는 Effect를 반환합니다.
실제로 put이나 call은 자체적으로 디스패치 또는 비동기 호출을 수행하지 않으며 일반 JavaScript 객체를 반환합니다.

```js
put({ type: "INCREMENT" }) // => { PUT: {type: 'INCREMENT'} }
call(delay, 1000) // => { CALL: {fn: delay, args: [1000]}}
```

```js
// sagas.spec.js
import test from "tape"

import { put, call } from "redux-saga/effects"
import { incrementAsync, delay } from "./sagas"

test("incrementAsync Saga test", assert => {
  const gen = incrementAsync()

  assert.deepEqual(
    gen.next().value,
    call(delay, 1000),
    "incrementAsync Saga must call delay(1000)"
  )

  assert.deepEqual(
    gen.next().value,
    put({ type: "INCREMENT" }),
    "incrementAsync Saga must dispatch an INCREMENT action"
  )

  assert.deepEqual(
    gen.next(),
    { done: true, value: undefined },
    "incrementAsync Saga must be done"
  )

  assert.end()
})
```

put 및 call은 일반 객체를 반환하므로 테스트 코드에서 동일한 함수를 재사용할 수 있습니다.
그리고 incrementAsync의 논리를 테스트하기 위해 generator를 반복하고 해당 값에 대해 deepEqual 테스트를 수행합니다.

### Basic Concepts

#### Declarative Effects

redux-saga에서 Sagas는 Generator 함수를 사용하여 구현됩니다.
Saga 논리를 표현하기 위해 Generator에서 일반 JavaScript 객체를 생성합니다.
우리는 이러한 객체를 Effects라고 부릅니다.
Effect는 미들웨어에 의해 참조되는 객체입니다. 일부 작업(예: 일부 비동기 함수 호출, 저장소에 작업 발송 등)을 수행하기 위해 미들웨어에 대한 Effects를 볼 수 있습니다.

`redux-saga/effects` 에서 Effects를 가져올 수 있습니다.

이 섹션과 다음 섹션에서는 몇 가지 기본 Effects를 소개합니다. 그리고 어떻게 Sagas를 쉽게 테스트할 수 있게 하는지 확인하세요.

Sagas는 여러 형태의 Effects를 생성할 수 있습니다. 가장 쉬운 방법은 Promise를 생성하는 것입니다.

예를 들어 PRODUCTS_REQUESTED 작업을 감시하는 Saga가 있다고 가정합니다. action에 매치되면 서버에서 제품 목록을 가져오는 작업을 시작합니다.

```js
import { takeEvery } from "redux-saga/effects"
import Api from "./path/to/api"

function* watchFetchProducts() {
  yield takeEvery("PRODUCTS_REQUESTED", fetchProducts)
}

function* fetchProducts() {
  const products = yield Api.fetch("/products")
  console.log(products)
}
```
