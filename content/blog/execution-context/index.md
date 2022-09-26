---
title: "실행 컨텍스트와 javascript 동작원리에 대한 이해. (feat.호이스팅)"
date: "2022-09-25"
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
  소화() // 입식도위장
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

ThisBinding까지 한 블로그에 작성하면 너무 길어질거 같아서 아래에서는 위의 2가지 구성 항목을 개별적으로 알아보겠습니다! 😆

## VariableEnvironment

VariableEnvironment는 최초 실행시의 스냅샷을 유지합니다.

실행컨텍스트를 생성 할 때 VariableEnvironment에 정보를 먼저 담은 다음, 이걸 그대로 복사해서 LexicalEnvironment를 만듭니다.

이후에는 LexicalEnvironment를 주로 활용하게 됩니다.

VariableEnvironment와 LexicalEnvironment에는 아래와 같은 객체로 구성되어 있습니다.

- 🔥 environmentRecord

- 🔥 outerEnvironmentReference

LexicalEnvironment에도 동일한 구성을 가지고 있으므로 이에 대한 자세한 내용은 아래 LexicalEnvironment를 살펴보며 공부해보겠습니다.

## LexicalEnvironment

아까 위해서 javascript 엔진은 실행컨텍스트 생성을 위한 `환경정보`를 구성한다고 했었습니다.

예를 들면 이런 느낌입니다.

> 현재 밥먹자라는 실행컨텍스트 내부에는 a,b,c 와 같은 식별자들이 있고 그 외부 정보는 D를 참조하도록 구성되어 있다.

### environmentRecord (호이스팅)

environmentRecord에는 현재 컨텍스트와 관련된 코드의 `식별자 정보`들이 저장됩니다. (매개변수, 함수 자체)

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

📍 선언이 제일 위로 올라가고 할당, 결과 출력 순서대로 동작한다고 이해할 수 있습니다. (이해를 돕기 위해 작성한 것일뿐 실제 저렇게 변환되는 것은 아닙니다.)

#### 함수 선언문과 함수 표현식

- 함수 선언문 : function 정의부만 존재하고 별도의 할당 명령이 없는 것.

- 함수 표현식 : 정의한 function을 별도의 변수애 할당하는 것.

```javascript
function 치킨() {
  // 함수 선언문.
  console.log("치킨의 정석은 BBQ!")
}

치킨() // 실행 가능

const pizza = function () {
  // 익명 함수 표현식.
  console.log("피자의 정석은 파파존스!")
}

pizza() // 실행 가능

const hamburger = function 버거킹() {
  // 기명 함수 표현식.
  console.log("버거킹의 정석은 와퍼!")
}

hamburger() // 실행 가능

버거킹() // ReferenceError: 버거킹 is not defined
```

자 그럼 선언문과 표현식에 대해서 구체적으로 알게 되었으니, 호이스팅이 어떻게 되는지 한번 알아볼까요? 😆

```javascript
스시오마카세()
스위스여행()

function 스시오마카세() {
  console.log("장인의 손길!")
}

const 스위스여행 = function () {
  console.log("양때목장!")
}
```

과연 위에 코드가 정상동작 할까요? 이걸 호이스팅된 결과로 한번 바꾸어 보겠습니다.

```javascript
var 스시오마카세 = function 스시오마카세() {
  // 함수 선언문은 전체를 끌어올립니다.
  console.log("장인의 손길!")
}

var 스위스여행 // 변수는 선언문만 끌어올립니다.

스시오마카세()
스위스여행()

스위스여행 = function () {
  // 변수의 할당문은 원래 자리에 둡니다.
  console.log("양때목장!")
}
```

❗️ 함수 선언문은 개발자가 의도한 위치에서 정상동작하지 않을 가능성이 있습니다. 되도록 ~~(아니 꼭)~~ 함수 표현식을 사용하도록 합시다!

### outerEnvironmentReference

아까 LexicalEnvironment에는 2가지의 수집자료가 있다고 공부했습니다. 하나는 지금까지 공부했던 environmentRecord (호이스팅) 이였고 지금 배울 또 다른 하나는 `outerEnvironmentReference` 입니다.

#### 스코프, 스코프체인

변수에는 지역변수와 전역변수가 있습니다. 특정 함수 내에서 쓰이는 변수를 지역변수라 하고 함수밖에서도 사용가능한 변수를 전역변수라 합니다. 이것은 스코프가 생성되었기 때문에 가능한 것인데, 이러한 `식별자의 유효범위`를 안에서부터 바깥으로 차례로 검색해 나가는 것을 `스코프체인` 이라고 합니다. outerEnvironmentReference는 이를 가능하게 합니다!!

📍 outerEnvironmentReference는 현재 호출된 함수가 선언될 당시의 LexicalEnvironment를 참조합니다. 이걸 꼭 기억해주세요.

```javascript
(01) var 파파존스 = '존스페이보릿';
(02) var outer = function () {
(03)  var inner = function () {
(04)    console.log(파파존스);
(05)    var 파파존스 = '수퍼 파파스';
(06)  };
(07)  inner();
(08)  console.log(파파존스);
(09) };
(10) outer();
(11) console.log(파파존스);
```

결과가 어떻게 나올까요? 답은 undefined, 존스페이보릿, 존스페이보릿이 나옵니다. 수퍼파파스는 왜 찍히지 않을까요? undefined는 왜 찍힐까요? 구체적인 동작이 어떻게 되는지 한번 알아보죠.

- 시작~ : 전역컨텍스트가 활성화됩니다. 전역컨텍스트의 LexicalEnvironment의 environmentRecord에는 { 파파존스, outer } 식별자가 저장됩니다. 전역컨텍스트는 선언된 시점이 없으므로 outerEnvironmentReference에는 아무것도 담기지 않습니다.

- 1, 2번째 줄 : 전역 스코프에 있는 파파존스와 outer에 존스페이보릿과 함수를 할당합니다.

- 10번째 줄 : outer함수를 실행합니다. 이제 콜스택에는 전역컨텍스트가 일시 중단되고 outer함수의 실행컨텍스트가 쌓이고 활성화됩니다.

- 2번째 줄 : outer함수에 대한 LexicalEnvironment를 구성합니다. environmentRecord에 { inner } 식별자를 저장합니다. outerEnvironmentReference에는 outer 함수가 선언될 시점의 LexicalEnvironment가 저장됩니다. [ GLOBAL, { 파파존스, outer } ]. (첫번째는 실행컨텍스트의 이름입니다.)

- 3번째 줄 : outer 스코프에 있는 inner에 함수를 할당합니다.

- 7번째 줄 : inner함수를 실행합니다. 이에 outer 실행컨텍스트가 일시 중단되고 콜스택에 inner 실행컨텍스트가 실행됩니다.

- 3번째 줄 : inner함수에 대한 LexicalEnvironment를 구성합니다. environmentRecord에 { 파파존스 } 식별자를 저장합니다. outerEnvironmentReference에는 inner 함수가 선언될 시점의 LexicalEnvironment가 저장됩니다. inner 함수는 outer함수 내부에서 선언되었음으로 outer함수의 LexicalEnvironment를 참조합니다. [ outer, { inner }].

- 4번째 줄 : 파파존스를 콘솔에 찍어야합니다. inner의 LexicalEnvironment부터 파파존스가 존재하는지 검색합니다. inner 함수의 environmentRecord에는 파파존스 식별자가 존재하지만 값이 할당되지 않았습니다. undefined를 출력합니다.

- 5번째 줄 : 선언된 파파존스 식별자에 수퍼파파스를 할당합니다.

- 6번째 줄 : inner 함수의 실행컨텍스트가 종료됩니다. 이에 inner의 실행컨텍스트가 콜스택에서 제거되고 일시 중단됬던 outer 실행컨텍스트가 다시 활성화되면서 8번째 줄로 이동합니다.

- 8번째 줄 : 파파존스를 콘솔에 찍어야합니다. outer의 LexicalEnvironment 부터 파파존스가 존재하는지 검색합니다. outer함수의 environmentRecord에는 inner 식별자 밖에 없습니다. 그럼 outerEnvironmentReference에 저장된 다음 LexicalEnvironment (즉 전역 컨텍스트 environmentRecord) 를 뒤집니다. 전역컨텍스트의 environmentRecord ({ 파파존스, outer })에는 파파존스가 존재합니다. 이는 존스페이보릿이라고 할당되어 있습니다. 따라서 존스페이보릿을 출력합니다.

- 9번째 줄 : outer 함수의 실행컨텍스트가 종료됩니다. 이에 outer의 실행컨텍스트가 콜스택에서 제거되고 일시 중단됬던 전역컨텍스트가 다시 활성화 되면서 11번째 줄로 이동합니다.

- 11번째 줄 : 파파존스를 콘솔에 찍어야합니다. 전역컨텍스트의 LexicalEnvironment부터 파파존스가 존재하는지 검색합니다. 전역컨텍스트의 environmentRecord ({ 파파존스, outer })에는 파파존스가 존재합니다. 이는 존스페이보릿이라고 할당되어 있습니다. 따라서 존스페이보릿을 출력합니다. 모든 코드가 실행되었습니다. 전역컨텍스트가 콜스택에서 제거되고 종료합니다.

##### 변수은닉화 (variable shadowing)

위에서 알아봤던 코드 (아래와 같음)를 다시 살펴보겠습니다.

```javascript
(01) var 파파존스 = '존스페이보릿';
(02) var outer = function () {
(03)  var inner = function () {
(04)    console.log(파파존스);
(05)    var 파파존스 = '수퍼 파파스';
(06)  };
(07)  inner();
(08)  console.log(파파존스);
(09) };
(10) outer();
(11) console.log(파파존스);
```

4번째 줄에서 파파존스라는 변수를 콘솔에 찍으라 했을 때 이미 5번째 줄에도 파파존스라는 변수가 할당되어 있고 심지어 전역변수에도 파파존스라는 변수가 존재합니다. 하지만 콘솔 결과는 undefined가 나옵니다.

이는 해당 함수의 LexicalEnvironment에서 부터 변수가 선언되었는지 찾아보기 때문입니다. 전역변수에 파파존스가 존재하지만 inner함수 내부에 이미 파파존스가 선언이 되어있습니다. 하지만 할당은 되어 있지 않기 때문에 전역스코프의 파파존스까지 값을 찾아보지 않고 inner에 있는 파파존스까지만 찾아보기 때문에 전역 공간에서 선언한 동일한 파파존스 변수에는 접근할 수 없는 셈입니다. 이를 **변수 은닉화** 라고 합니다.

## 마무리 하며

사실 실무에서 React와 javascript를 사용하면서 동작원리까지 구체적으로 알기는 어려웠는데 이번 기회에 확실히 정리할 수 있어서 참 좋았다. 굉장히 도움이 되는 책이라고 생각했고 다른 분들에게도 꼭 추천하고 싶은 책이다.
