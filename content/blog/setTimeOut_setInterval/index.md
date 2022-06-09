---
title: "React와 setTimeout 그리고 setInterval에 대한 이해. (feat.closure)"
date: "2022-65-08"
description: "사용자가 주문 시스템(OMS)에 업로드한 주문내역을 창고관리 시스템(WMS)으로 전송하던 기존의 프로세스를 개선하는 과정에서 얻게된 깨달음에 관한 이야기입니다. "
---

## 들어가며

회사에는 2가지 시스템이 있다. 하나는 주문관리시스템 (Order Management Sysyem), 또 다른 하나는 창고관리시스템 (Warehouse Management Sysyem) 이다. 기존의 주문 전송 방식은 대량의 업로드 건을 처리하는데 문제가 많았다. 그래서 기존에는 업로드할 데이터를 소량씩 짤라서 dispatch 했다면, 새로운 방식으로는 모든 데이터를 한번에 전송하고 batchNumber를 가지고 지속적으로 ```polling``` 하면서 데이터가 정상적으로 처리되었는지 확인 하는 프로세스를 구축하기로 헀다.

## polling?

생소하신 분들도 있으리라 생각됩니다. 저 역시 생소한 단어였는데요! 위키 백과에서 찾은 polling의 정의는 다음과 같습니다.

🎃 : **폴링(polling)** 이란 하나의 장치(또는 프로그램)가 충돌 회피 또는 동기화 처리 등을 목적으로 다른 장치(또는 프로그램)의 상태를 __주기적으로 검사__ 하여 일정한 조건을 만족할 때 송수신 등의 자료처리를 하는 방식을 말한다.


## 어떻게 주기적으로 검사해야 할까?

결론적으로 말하면 여러 방법이 있겠지만 제가 생각한 방법에는 3가지가 있었습니다.

- setInterval

- setTimeout

- useInterval

주기적으로 특정 callback 함수를 실행 시킬 수 있다면 server에 지속적으로 데이터가 모두 처리 되었는지 질의해 볼 수 있겠다는 결론이 들었습니다.
3가지 방법을 모두 고려해 보고 어떤 것이 가장 좋을지 생각해보았는데 아래에서 찬찬히 살펴보겠습니다.

### setInterval 과 setTimeout의 차이?

막상 어떤 함수를 선택해야 가장 최고의 선택일까요? 물론 원하는 동작마다 다르다고 생각합니다.

하지만 결정적인 차이는 바로 **시간 보장** 입니다. ⏰

```javascript
let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...)
```

  > 시간마다 주기적으로 해당 func 실행하는 함수.

```javascript
let timerId = setTimeout(func|code, [delay], [arg1], [arg2], ...)
```

  > 일정 시간 후에 해당 func 실행하는 함수.


다음 그림을 보면 이해가 쉽습니다.

<img width='500px' src='https://user-images.githubusercontent.com/87749134/172602822-09332d4e-6254-4c1e-8bba-50f189613b65.png' />

위의 그림처럼 setInterval은 *함수의 실행 시점 부터 시간을 잡기 때문* 에 실제 함수 호출이 종료되고 다음 함수 호출까지의 시간은 우리가 설정한 시간보다 훨씬 짧아지게 됩니다. 반면에 setTimeout은 해당 시간동안 delay 후 callback 함수가 실행되기 때문에 우리가 설정한 시간만큼 확실히 delay를 보장해 줍니다. 아주 당연한 결과이죠.

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

### 예기치 못한 Closure (클로져)

❗️ **Javascript에서 Event Loop와 Call Stack, Callback Queue가 동작하는 방식을 살펴보자.**
Javascript는 Single thread 언어이기 때문에 엔진은 하나의 task만 작업이 가능하다. 그렇기 떄문에 실행이 긴 함수를 만나면 화면이 멈추게 된다. 이런 문제점을 해결하기 위해 Web Api를 사용하고, Call Stack에서 비동기 함수가 호출되면 Callback Queue에 쌓이게 되고, 이 Queue는 Call Stack이 비면 실행된다.

setTimeout이나 setInterval도 Web Api 중에 하나이기 때문에 호출되면 Callback Queue에 쌓인다. 그리고 Call Stack이 비면 실행되게 된다. 그리고 🌟 *실행된 setTimeout, setInterval은 한번만 호출 후에 바로 종료된다. 하지만 callback 함수는 그대로 남아있게 되고 주기적으로 실행된다.*

따라서 setTimeout 외부에서 선언한 변수를 가지고 setTimeout 안에서 실행시킨다면 setTimeout은 종료되었지만 그떄 과거의 값을 그대로 참조하고 있게 된다.

```javascript
// 클로져 실행 예시. useEffect 안에서 number를 console로 찍어보면 항상 0이다.
// useEffect 밖에서 콘솔을 찍어보면 정상 동작한다.
export default function App() {
  const [number, setNumber] = useState(0);

  console.log("number", number); // 정상 동작.
  useEffect(() => {
    const loop = setInterval(() => {
      setNumber((prev) => prev + 1);
      console.log("number", number); // 항상 0.
      if (number === 10) clearInterval(loop);
    }, 1000);
  }, []);

  return <div className="App">number : {number}</div>;
}
```

### 어떻게 해결했어?

아래는 Dan 형님께서 만든 custom Hook 이다.

```javascript
import { useState, useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef(); // 최근에 들어온 callback을 저장할 ref를 하나 만든다.

  useEffect(() => {
    savedCallback.current = callback; // callback이 바뀔 때마다 ref를 업데이트 해준다.
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current(); // tick이 실행되면 callback 함수를 실행시킨다.
    }
    if (delay !== null) { // 만약 delay가 null이 아니라면
      let id = setInterval(tick, delay); // delay에 맞추어 interval을 새로 실행시킨다.
      return () => clearInterval(id); // unmount될 때 clearInterval을 해준다.
    }
  }, [delay]); // delay가 바뀔 때마다 새로 실행된다.
}
```

Closure에 의해 새롭게 렌더링된 값에 접근 할 수 없으므로 useRef를 통해 우회하는 방법을 보고 해결 방법을 찾아냈습니다. 
