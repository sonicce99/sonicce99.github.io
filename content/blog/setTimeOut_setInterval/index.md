---
title: "React와 setTimeout 그리고 setInterval에 대한 이해. (feat.closure)"
date: "2022-65-08"
description: "사용자가 주문 시스템(OMS)에 업로드한 주문 데이터를 창고관리 시스템(WMS)으로 전송할때 대량의 주문건인 경우(300건 이상), 원활히 전송하지 못하던 기존의 프로세스를 개선하는 과정에서 얻게된 깨달음에 관한 이야기입니다. "
---

## 들어가며 👋🏻

풀필먼트 서비스 회사이기 때문에 회사에는 2가지 시스템이 있습니다. 하나는 `주문관리시스템` (Order Management Sysyem), 또 다른 하나는 `창고관리시스템` (Warehouse Management Sysyem) 입니다. 기존의 주문 전송 방식은 대량의 업로드 건을 처리하는데 문제가 많았습니다. 그래서 기존에는 업로드할 데이터를 소량씩 짤라서 dispatch 했다면, 새로운 방식으로는 모든 데이터를 한번에 전송하고 batchNumber를 가지고 지속적으로 `polling` 하면서 데이터가 정상적으로 처리되었는지 확인 하는 프로세스를 구축하기로 했습니다.

## polling?

생소하신 분들도 있으리라 생각됩니다. 저 역시 생소한 단어였는데요. 위키 백과에서 찾은 polling의 정의는 다음과 같습니다.

🎃 : **폴링(polling)** 이란 하나의 장치(또는 프로그램)가 충돌 회피 또는 동기화 처리 등을 목적으로 다른 장치(또는 프로그램)의 상태를 **주기적으로 검사** 하여 일정한 조건을 만족할 때 송수신 등의 자료처리를 하는 방식을 말한다.

## 어떻게 주기적으로 검사해야 할까?

결론적으로 말하면 여러 방법이 있겠지만 제가 생각한 방법에는 3가지가 있었습니다.

- setInterval

- setTimeout

- useInterval

주기적으로 특정 callback 함수를 실행 시킬 수 있다면 server에 지속적으로 데이터가 모두 처리 되었는지 질의해 볼 수 있겠다는 결론이 들었습니다.
3가지 방법을 모두 고려해 보고 어떤 것이 가장 좋을지 생각해보았는데 아래에서 찬찬히 살펴보겠습니다.

### setInterval 과 setTimeout의 차이?

어떤 함수를 선택해야 가장 최고의 선택일까요? 물론 원하는 동작마다 다르다고 생각합니다.

하지만 결정적인 차이는 바로 **시간 보장** 입니다. ⏰

```javascript
let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...)
```

> setInterval : 시간마다 주기적으로 해당 func 실행하는 함수.

```javascript
let timerId = setTimeout(func|code, [delay], [arg1], [arg2], ...)
```

> setTimeout : 일정 시간 후에 해당 func 실행하는 함수.

다음 그림을 보면 이해가 쉽습니다.

<img width='500px' src='https://user-images.githubusercontent.com/87749134/172602822-09332d4e-6254-4c1e-8bba-50f189613b65.png' />

위의 그림처럼 setInterval은 **함수의 실행 시점 부터 시간을 잡기 때문** 에 실제 함수 호출이 종료되고 다음 함수 호출까지의 시간은 우리가 설정한 시간보다 훨씬 짧아지게 됩니다. 반면에 setTimeout은 해당 시간동안 delay 후 callback 함수가 실행되기 때문에 우리가 설정한 시간만큼 확실히 delay를 보장해 줍니다. 아주 당연한 결과이죠.

하지만 setInterval 함수에서 만약 callback 함수의 실행 시간이 우리가 설정해 놓은 시간보다 길어지면 어떻게 될까요?
엔진은 다행히 묵묵히 그 시간을 기다려 줍니다. 하지만 이건 우리가 원한 결과는 아니죠. 그렇다면 setInterval은 지금 상황에 맞지 않다...🤥 탈락.

setInterval은 주기적으로 callback을 실행 시킬 수 있으니 장점이 있다고 생각이 드는 순간 setTimeout은 주기적으로 callback 함수를 실행시킬 수 없나? 하는 의문도 들죠. 방법이 있습니다.

#### 중첩 setTimeout

```javascript
let delay = 5000;

let timerId = setTimeout(function request() {
  ...요청 보내기...

  if (서버 과부하로 인한 요청 실패) {
    // 요청 간격을 늘립니다.
    delay *= 2;
  }

  timerId = setTimeout(request, delay);

}, delay);
```

setTimeout을 중첩하여 사용한다면 확실하게 일정기간만큼 시간을 보장 받을 수도 있고, 들어오는 데이터의 양에 따라 delay를 수정 할 수도 있겠다..! 이 방법이 가장 깔끔하겠어! 😽 라는 기쁨이 들며 코드를 작성했는데 문제가 발생했습니다.

### 예기치 못한 Closure

❗️ **Javascript에서 Event Loop와 Call Stack, Callback Queue가 동작하는 방식을 살펴보자.**
Javascript는 Single thread 언어이기 때문에 엔진은 하나의 task만 작업이 가능합니다. 그렇기 때문에 실행이 긴 함수를 만나면 화면이 멈추게 되죠. 이런 문제점을 해결하기 위해 Web Api를 사용하고, Call Stack에서 비동기 함수가 호출되면 Callback Queue에 쌓이게 되고, 이 Queue는 Call Stack이 비면 실행됩니다.

setTimeout이나 setInterval도 Web Api 중에 하나이기 때문에 호출되면 Callback Queue에 쌓입니다. 그리고 Call Stack이 비면 실행되게 되죠. 그리고 ❗️ _실행된 setTimeout, setInterval은 한번만 호출 후에 바로 종료됩니다. 하지만 callback 함수는 그대로 메모리에 남아있게 되고 주기적으로 실행된니다._

따라서 setTimeout 외부에서 선언한 변수를 가지고 setTimeout 안에서 실행시킨다면 setTimeout은 종료되었지만 그떄 과거의 값을 그대로 참조하고 있게 된다.

```javascript
// 클로져 실행 예시. useEffect 안에서 number를 console로 찍어보면 항상 0이다.
// useEffect 밖에서 콘솔을 찍어보면 정상 동작한다.
export default function App() {
  const [number, setNumber] = useState(0)

  console.log("number", number) // 정상 동작.
  useEffect(() => {
    const loop = setInterval(() => {
      setNumber(prev => prev + 1)
      console.log("number", number) // 항상 0.
      if (number === 10) clearInterval(loop)
    }, 1000)
  }, [])

  return <div className="App">number : {number}</div>
}
```

### Solution.

아래는 Dan 형님께서 만든 custom Hook 이다.

```javascript
import { useState, useEffect, useRef } from "react"

function useInterval(callback, delay) {
  const savedCallback = useRef() // 최근에 들어온 callback을 저장할 ref를 하나 만든다.

  useEffect(() => {
    savedCallback.current = callback // callback이 바뀔 때마다 ref를 업데이트 해준다.
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current() // tick이 실행되면 callback 함수를 실행시킨다.
    }
    if (delay !== null) {
      // 만약 delay가 null이 아니라면
      let id = setInterval(tick, delay) // delay에 맞추어 interval을 새로 실행시킨다.
      return () => clearInterval(id) // unmount될 때 clearInterval을 해준다.
    }
  }, [delay]) // delay가 바뀔 때마다 새로 실행된다.
}
```

Closure에 의해 새롭게 렌더링된 값에 접근 할 수 없으므로 useRef를 통해 문제를 해결하는 방법을 보고 해결 방법을 알아냈습니다.

useEffect를 통해 callback함수가 update될 경우 해당 값을 current로 유지시키고 아래 useEffect에서 current 값에 접근 함으로서 원하는 결과를 이끌어 낼 수 있습니다.

### 결론.

자. 다시 처음으로 돌아와서 우리의 목적은 서버에 `batchNumber` 를 가지고 데이터가 모두 처리 되었는지 지속적으로 질의해야 했습니다.

#### step1. 우선 polling 함수를 만들자.

```javascript
const longPolling = async () => {
  await waitTime(delay) // 특정 시간만큼 기다림.

  dispatch(Api(batchNumber)) // batchNumber를 가지고 서버에 질의.
}
```

질의를 한번만 하면 안되니 서버에서 response가 올 때까지 `지속적으로` 질의 해야겠죠? 그래서 재귀함수를 통해 longPolling 함수를 반복적으로 실행시켜줍니다.

#### step2. 반복적으로 질의하자.

```javascript
const longPolling = async (delay: number) => {
  await waitTime(delay) // 특정 시간만큼 기다림.

  dispatch(Api(batchNumber)) // batchNumber를 가지고 서버에 질의.

  longPolling(delay) // 서버에 질의 후 다시 함수 실행.
}
```

🌟 재귀함수를 사용했으면 반드시 탈출 조건을 명시해줘야 합니다. 서버에 응답을 받아오면 longPolling 함수를 실행하지 않고 return 할 수 있도록 해줘야겠죠? 어떻게 할 수 있을까요?

```javascript
// Api 실행 후 서버에서 받아오는 response
// Api 실행결과로 다음 3가지가 내려옵니다. batchNumber, successList(wms로 전송 성공한 데이터), failList(전송 실패한 데이터).
const serverResponse = useAppSelector(state => state.store.serverResponse)

const longPolling = async (delay: number) => {
  await waitTime(delay) // 특정 시간만큼 기다림.

  if (serverResponse?.batchNumber) {
    return
  } else {
    dispatch(Api(batchNumber)) // batchNumber를 가지고 서버에 질의.

    longPolling(delay) // 서버에 질의 후 다시 함수 실행.
  }
}
```

❌ 자 위에 처럼 코드를 작성하면 과연 제대로 동작할까요? 아닙니다. 응답이 왔을 경우 serverResponse는 최신의 값을 가지고 있지만, **longPolling 함수 안에서의 serverResponse는 최신화된 값을 참조하지 않기 때문에 응답이 왔음에도 불구하고 탈출하지 못하고 dispatch를 계속하게 되고 재귀함수를 탈출하기 위해 useRef를 사용해야합니다.**

#### useRef 사용.

```javascript
const serverResponse = useAppSelector(state => state.store.serverResponse)
const serverResponse_ref = useRef(null)

useEffect(() => {
  if (serverResponse?.batchNumber) {
    serverResponse_ref.current = serverResponse
  }
}, [serverResponse])

const longPolling = async (delay: number) => {
  await waitTime(delay) // 특정 시간만큼 기다림.

  if (serverResponse_ref.currnet?.batchNumber) {
    serverResponse_ref.current = null
    return
  } else {
    dispatch(Api(batchNumber)) // batchNumber를 가지고 서버에 질의.

    longPolling(delay) // 서버에 질의 후 다시 함수 실행.
  }
}
```

### 마치며.

polling 방식으로 데이터를 처리하기 위해 공부를 하면서 `비동기 데이터 처리방식`에 대해서 많이 공부할 수 있었던 계기가 되었다. 더 열심히 해서 우아한 코드를 작성할 수 있는, 더 좋은 동료가 되기 위해 노력해야겠다. 그리고 항상 좋은 advice를 해주시는 조수관 기술 이사님께 감사함을 느낀다. 🙏🏻
