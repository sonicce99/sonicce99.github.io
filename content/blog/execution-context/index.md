---
title: "실행 컨텍스트와 javascript 동작원리에 대한 이해. (feat.호이스팅)"
date: "2022-08-21"
description: "코어 자바스크립트 책을 읽고 공부한 실행컨텍스트에 대한 내용입니다."
---

# 실행 컨텍스트

## 들어가며

지금은 `두나무(업비트 거래소)`에서 근무중이신 [황규현 프론트엔드 개발자님](https://github.com/JungKyuHyun)께 한권의 책을 추천받았다.

바로 [코어 자바스크립트](https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EC%BD%94%EC%96%B4+%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8) 라는 책이였다. 자바스크립트에 대한 입문용 책이였는데 this나 메모리 할당과 구조, 클로저 및 Class 등등 초심자가 이해하기에 어려운 내용을 정말 쉽게 표현되어 있어 좋았다. 이 중에 실행컨텍스트라는 목차가 있는데 그 일부를 정리하고자 한다.

## 실행 컨텍스트란 무엇인가요?

실행컨텍스트 영어로는 execution context라고 하며 **실행하고자 하는 코드에 제공할 환경정보**를 모아놓은 객체이다.

javascript는 어떤 실행컨텍스트가 실행되는 시점에 호이스팅(hoisting), 외부 환경정보를 구성하고 this값을 설정하는 등의 동작을 수행합니다.

이때 이런 환경정보들을 모아 컨텍스트를 구성하고 이를 `콜 스택`에 쌓아 올렸다가, 가장 위에 쌓여있는 컨텍스트와 관련된 코드를 실행하는 식으로 전체코드의 환경과 순서를 보장합니다. 자세히 알아보겠습니다. 🕵🏻‍♂️

```javascript
// (1)
const 입 = "입"

function 밥먹자() {
  const 식도 = "식도"

  function 소화() {
    const 위장 = "위장"
    console.log(입 + 식도 + 위장)
  }

  // (3)
  소화()
}

// (2)
밥먹자()
```

처음 자바스크립트 코드를 실행하면 `전역 컨텍스트`가 콜 스택에 담깁니다.

(1)에서 전역 컨텍스트를 실행하다가 (2)에서 밥먹자 라는 명령이 떨어집니다. 그러면 javascript 엔진은 밥먹자에 대한 환경정보를 수집해서 실행컨텍스트를 생성한 후 콜 스택에 담습니다.

그러면 콜 스택에는 전역 컨텍스트 위에 밥먹자 컨텍스트가 놓였으므로 전역컨텍스트와 관련된 코드를 실행 중단하고 밥먹자에 대한 코드를 순차 실행합니다.

밥먹자에 대한 코드를 실행하던 중 소화 라는 함수를 만나게 되고 다시 밥먹자에 대한 코드 실행을 일시 중단하고 소화에 대한 정보들을 수집해서 컨텍스트를 생성 후 콜 스택에 담아 실행합니다.

console.log()를 실행하면 소화에 대한 컨텍스트가 종료되고 콜 스택에서 제거 됩니다. 그러면 다시 밥먹자에 대한 나머지 컨텍스트가 실행되고, 마지막에 전역 컨텍스트에 대한 실행까지 완료 후 콜 스택이 완전히 비워지게 됩니다.

이때 javascript 엔진이 수집하는 실행컨텍스트 생성을 위한 환경정보 구성은 다음과 같습니다.

- VariableEnvironment : 현재 컨텍스트 내의 식별자들에 대한 정보 + 외부 환경 정보.

  > 선언 시점의 LexicalEnvironment의 스냅샷으로, (❗️ 변경 사항은 반영되지 않음).

- LexicalEnvironment : 처음에는 VariableEnvironment와 같지만 변경 사항이 실시간으로 반영됨.

- ThisBinding : this 식별자가 바라봐야 할 대상 객체.

아래에서는 위의 3가지 구성 항목을 개별적으로 알아보겠습니다! 😆

## VariableEnvironment

VariableEnvironment는 최초 실행시의 스냅샷을 유지합니다.

실행컨텍스트를 생성 할 때 VariableEnvironment에 정보를 먼저 담은 다음, 이걸 그대로 복사해서 LexicalEnvironment를 만듭니다.

이후에는 LexicalEnvironment를 주로 활용하게 됩니다.

VariableEnvironment와 LexicalEnvironment에는 아래와 같은 객체로 구성되어 있습니다.

- environmentRecord

- outerEnvironmentReference

LexicalEnvironment에도 동일한 구성을 가지고 있으므로 이에 대한 자세한 내용은 아래 LexicalEnvironment를 살펴보며 공부해보겠습니다.

## LexicalEnvironment

아까 위해서 javascript 엔진은 실행컨텍스트 생성을 위한 `환경정보`를 구성한다고 했었습니다.

예를 들면 이런 느낌입니다.

> 현재 밥먹자라는 실행컨텍스트 내부에는 a,b,c 와 같은 식별자들이 있고 그 외부 정보는 D를 참조하도록 구성되어 있다.

### environmentRecord (호이스팅)

environmentRecord에는 현재 컨텍스트와 관련된 코드의 식별자 정보들이 저장됩니다. (매개변수, 함수 자체)

컨텍스트 내부 전체를 처음부터 끝까지 쭉 훑어나가며 순서대로 수집합니다.

🌟 변수 정보를 수집하는 과정을 모두 마쳤더라도 아직 실행 컨텍스트가 관여할 코드들은 실행되기 전의 상태입니다.

> 코드가 실행되기 전임에도 불구하고 javascript 엔진은 이미 코드의 변수명, 함수명 들을 모두 알고 있게 됩니다.

📍 즉, 실제로 식별자들을 코드 최상단으로 끌어올려놓는 것은 아니지만 마치 식별자들을 모두 코드 최상단에 끌어올려놓은 다음 실제 코드를 실행한다고 생각하더라도 문제가 없는 것처럼 보이게 됩니다. 이것이 호이스팅의 개념입니다.

예제를 통해 살펴보죠

```javascript
function 치킨이나피자냐그것이문제로다(food) {
  console.log(food)

  var food
  console.log(food)

  var food = "피자"
  console.log(food)
}

치킨이나피자냐그것이문제로다("치킨")
```

여러분들은 어떤 결과가 나올거 같나요? var은 재선언 재할당이 가능하므로 ES6에서는 var 대신 let과 const를 주로 쓰지만 hosting을 이해하기 위해서 var을 쓰겠습니다.

과연 치킨, undefined, 피자 순서로 출력될까요?

그렇지 않습니다. 그대로 복사해서 [CodeSandBox](https://codesandbox.io/s/vanilla)에 붙여넣어서 실행시켜 보세요. 결과가 어떻게 나오나요?

치킨, 치킨, 피자 순서로 출력됩니다🥲

왜 이렇게 될까요? 호이스팅의 개념을 이해하면 이해할 수 있습니다. 아래의 코드를 보세요. 실제로 javascript 엔진이 이렇게 함수를 변환하는 것은 아니지만 이해를 위해 변환시켜 보겠습니다.

```javascript
function 치킨이나피자냐그것이문제로다(food) {
  var food
  var food

  food = "치킨"
  console.log(food)
  console.log(food)

  food = "피자"
  console.log(food)
}

치킨이나피자냐그것이문제로다("치킨")
```
