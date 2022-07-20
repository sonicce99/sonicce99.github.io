---
title: "Jest 공식문서 뿌시기 🗿"
date: "2022-07-18"
description: "회사에서 테스트코드를 작성하기 위해 공부한 내용입니다."
---

### 들어가기에 앞서

- 유닛 테스트

  > 코드 상으로 기능을 점검. (로직을 파악. input A -> output B)

- E2E 테스트

  > End to End test. ( 실제 동작을 바탕으로 기능을 점검한다. A click 하면 B로 이동. 로직이랑 상관 X )

## Introduction

### Getting Started!

```bash
npm install --save-dev jest
```

1. 가상의 덧셈 함수를 만들어 봅시다! (sum.js)

```javascript
function sum(a, b) {
  return a + b
}
module.exports = sum
```

2. `sum.test.js` 파일을 생성하고 다음과 같이 작성합니다.

```javascript
const sum = require("./sum")

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3)
})
```

3. package.json에 다음과 같이 설정합니다.

```bash
{
  "scripts": {
    "test": "jest"
  }
}
```

#### Babel 사용하기

Babel을 사용하기 위해선, 몇가지 dependencies가 필요합니다.

```bash
npm install --save-dev babel-jest @babel/core @babel/preset-env
```

프로젝트 root에 babel.config.js 파일을 만들어 현재 버전의 노드를 대상으로 하도록 Babel을 구성합니다.

```javascript
// babel.config.js

module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
}
```

#### TypeScript 사용하기

Jest는 Babel을 통해 TypeScript를 지원합니다. 먼저 위의 Babel 사용 지침을 따랐는지 확인하세요.
다음으로 `@babel/preset-typescript` 를 설치합니다.

```bash
npm install --save-dev @babel/preset-typescript
```

```javascript
// babel.config.js

module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
}
```

### Using Matchers

Jest는 "matchers"를 사용하여 다양한 방식으로 값을 테스트할 수 있습니다. 이 문서에서는 일반적으로 사용되는 몇 가지 매처를 소개합니다. 전체 목록은 [expect API doc](https://jestjs.io/docs/expect) 를 참조하세요.

#### Truthiness

테스트에서 undefined, null, false 를 명확하게 구분하고 싶을 수 있습니다. Jest에서는 원하는 것을 명시 할 수 있습니다.

```javascript
test("null", () => {
  const n = null
  expect(n).toBeNull()
  expect(n).toBeDefined()
  expect(n).not.toBeUndefined()
  expect(n).not.toBeTruthy()
  expect(n).toBeFalsy()
})

test("zero", () => {
  const z = 0
  expect(z).not.toBeNull()
  expect(z).toBeDefined()
  expect(z).not.toBeUndefined()
  expect(z).not.toBeTruthy()
  expect(z).toBeFalsy()
})
```

본인의 의도와 가장 일치하는 matcher를 사용하세요.

#### 숫자

```javascript
test("two plus two", () => {
  const value = 2 + 2
  expect(value).toBeGreaterThan(3)
  expect(value).toBeGreaterThanOrEqual(3.5)
  expect(value).toBeLessThan(5)
  expect(value).toBeLessThanOrEqual(4.5)

  // toBe and toEqual are equivalent for numbers
  expect(value).toBe(4)
  expect(value).toEqual(4)
})
```

#### 문자열

```javascript
const shoppingList = [
  "diapers",
  "kleenex",
  "trash bags",
  "paper towels",
  "milk",
]

test("the shopping list has milk on it", () => {
  expect(shoppingList).toContain("milk")
  expect(new Set(shoppingList)).toContain("milk")
})
```

toContain을 사용하여 배열 또는 iterable에 특정 항목이 포함되어 있는지 확인할 수 있습니다.

#### 예외처리

특정 함수가 호출될 때 오류가 발생하는지 테스트하려면 toThrow를 사용하세요.

```javascript
function compileAndroidCode() {
  throw new Error("you are using the wrong JDK")
}

test("compiling android goes as expected", () => {
  expect(() => compileAndroidCode()).toThrow()
  expect(() => compileAndroidCode()).toThrow(Error)

  // You can also use the exact error message or a regexp
  expect(() => compileAndroidCode()).toThrow("you are using the wrong JDK")
  expect(() => compileAndroidCode()).toThrow(/JDK/)
})
```

---

### 비동기 함수 testing

JavaScript에서는 코드가 비동기적으로 실행되는 것이 일반적입니다. 비동기식으로 실행되는 코드가 있는 경우 Jest는 테스트 중인 코드가 완료된 시점을 알아야 다른 테스트로 넘어갈 수 있습니다. Jest는 이를 처리하는 몇 가지 방법이 있습니다.

#### Promises

test에서 promise를 return하면 Jest는 해당 promise가 resolve될 때까지 기다립니다. 만일 promise기 rejected 되면 test는 실패합니다.

예를 들어 fetchData가 string 'peanut butter'로 resolve 되어야 하는 promise을 return 한다고 가정해 보겠습니다. 다음과 같이 테스트할 수 있습니다.

```javascript
test("the data is peanut butter", () => {
  return fetchData().then(data => {
    expect(data).toBe("peanut butter")
  })
})
```

```javascript
test("the fetch fails with an error", () => {
  expect.assertions(1)
  return fetchData().catch(e => expect(e).toMatch("error"))
})
```

#### Async/Await

또는 테스트에서 async 및 await를 사용할 수 있습니다. 비동기 테스트를 작성하려면 테스트에 전달된 함수 앞에 async 키워드를 사용합니다. 예를 들어 다음을 사용하여 동일한 fetchData는 다음과 같이 테스트할 수 있습니다.

```javascript
test("the data is peanut butter", async () => {
  await expect(fetchData()).resolves.toBe("peanut butter")
})

test("the fetch fails with an error", async () => {
  await expect(fetchData()).rejects.toMatch("error")
})
```

🎃 async 및 await는 Promise 보다 더 간결하고 명확하게 표현할 수 있습니다.

❗️ return / await 구문을 빼먹으면 fetchData가 resolve, reject 되기 전에 테스트는 종료됩니다.

#### Callbacks

promise를 사용하지 않는 경우 callbacks을 사용할 수 있습니다. 예를 들어 fetchData가 promise를 반환하는 대신 callbacks을 기대한다고 가정해 보겠습니다. 즉, 일부 데이터를 가져오고 완료되면 callback(null, data)을 호출합니다. 이 반환된 데이터가 '땅콩 버터' 문자열인지 테스트하려고 합니다.

```javascript
// Don't do this!
test("the data is peanut butter", () => {
  function callback(error, data) {
    if (error) {
      throw error
    }
    expect(data).toBe("peanut butter")
  }

  fetchData(callback)
})
```

문제는 callbacks을 호출하기 전에 fetchData가 완료되는 즉시 테스트가 완료된다는 것입니다.

이 문제를 해결할 수 있는 다른 형태가 있습니다. 빈 인수가 있는 함수에 테스트를 넣는 대신 done이라는 단일 인수를 사용하세요. Jest는 테스트를 완료하기 전에 done callbacks이 호출될 때까지 기다립니다.

```javascript
test("the data is peanut butter", done => {
  function callback(error, data) {
    if (error) {
      done(error)
      return
    }
    try {
      expect(data).toBe("peanut butter")
      done()
    } catch (error) {
      done(error)
    }
  }

  fetchData(callback)
})
```

만약 done()이 호출되지 않으면 test는 실패합니다. (timeout error)

만약 test가 실패하면 error를 thorw 하고 done()이 호출되지 않습니다. test log에서 실패한 이유를 보려면 try 블록에서 expect문을 wrapping하고 catch에서 error를 done으로 전달해야 합니다. 그렇지 않으면, expect(data)가 수신한 값을 표시하지 않는 불투명한 시간 초과 오류가 발생합니다.

#### resolve, reject

또한 expect 문에서 .resolves matcher를 사용할 수 있으며 Jest는 해당 promise가 resolve 될 때까지 기다립니다. promise가 reject 되면 테스트는 자동으로 실패합니다.

```javascript
test("the data is peanut butter", () => {
  return expect(fetchData()).resolves.toBe("peanut butter")
})
```

---

### 설정

종종 테스트를 작성하는 동안 테스트 실행 전에 수행해야 하는 설정 작업이 있고 테스트 실행 후에 수행해야 하는 마무리 작업이 있습니다. Jest는 이를 처리하기 위한 helper functions을 제공합니다.

#### Repeating Setup

많은 테스트에서 반복적으로 수행해야 하는 작업이 있는 경우 beforeEach 및 afterEach hooks를 사용할 수 있습니다.

예를 들어 여러 테스트가 데이터베이스와 상호 작용한다고 가정해 보겠습니다. 이러한 각 테스트 전에 호출해야 하는 initializeCityDatabase() 메서드와 이러한 각 테스트 후에 호출해야 하는 clearCityDatabase() 메서드가 있습니다.

```javascript
beforeEach(() => {
  initializeCityDatabase()
})

afterEach(() => {
  clearCityDatabase()
})

test("city database has Vienna", () => {
  expect(isCity("Vienna")).toBeTruthy()
})

test("city database has San Juan", () => {
  expect(isCity("San Juan")).toBeTruthy()
})
```

beforeEach 및 afterEach는 테스트가 비동기 코드를 처리할 수 있는 것과 동일한 방식으로 비동기 코드를 처리할 수 있습니다. done 매개변수를 사용하거나 promise를 return 할 수 있습니다. 예를 들어, initializeCityDatabase()가 데이터베이스가 초기화될 때 resolved 된 promise를 return 했다면 우리는 그 promise를 return 하고 싶을 것입니다.

```javascript
beforeEach(() => {
  return initializeCityDatabase()
})
```

#### One-Time Setup

어떤 경우에는 파일 시작 부분에서 한 번만 설정하면 됩니다. 이는 설정이 비동기식일 때 특히 성가실 수 있으므로 인라인으로 수행할 수 없습니다. Jest는 이러한 상황을 처리하기 위해 beforeAll 및 afterAll hooks를 제공합니다.

예를 들어 initializeCityDatabase()와 clearCityDatabase()가 모두 promise를 return 하고 테스트 간에 데이터베이스를 재사용할 수 있는 경우 테스트 코드를 다음과 같이 변경할 수 있습니다.

```javascript
beforeAll(() => {
  return initializeCityDatabase()
})

afterAll(() => {
  return clearCityDatabase()
})

test("city database has Vienna", () => {
  expect(isCity("Vienna")).toBeTruthy()
})

test("city database has San Juan", () => {
  expect(isCity("San Juan")).toBeTruthy()
})
```

#### Scoping

기본적으로 beforeAll 및 afterAll은 파일의 모든 테스트에 적용됩니다. describe를 사용하여 테스트를 grouping 할 수도 있습니다. describe 블록 내부에 있을 때 beforeAll 및 afterAll 블록은 해당 describe 블록 내의 테스트에만 적용됩니다.

```javascript
// Applies to all tests in this file
beforeEach(() => {
  return initializeCityDatabase()
})

test("city database has Vienna", () => {
  expect(isCity("Vienna")).toBeTruthy()
})

test("city database has San Juan", () => {
  expect(isCity("San Juan")).toBeTruthy()
})

describe("matching cities to foods", () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase()
  })

  test("Vienna <3 veal", () => {
    expect(isValidCityFoodPair("Vienna", "Wiener Schnitzel")).toBe(true)
  })

  test("San Juan <3 plantains", () => {
    expect(isValidCityFoodPair("San Juan", "Mofongo")).toBe(true)
  })
})
```

#### 예외 처리

Jest는 실제 테스트를 실행하기 전에 테스트 파일의 모든 describe handlers를 먼저 실행합니다. 이것은 describe block 내부가 아니라 before* 및 after* 핸들러 내부에서 setup 및 teardown을 수행하는 또 다른 이유입니다. describe block이 완료되면, 기본적으로 Jest는 수집 단계에서 발생한 순서대로 모든 테스트를 연속적으로 실행하고 각 테스트가 완료될 때까지 기다립니다.

```javascript
describe("describe outer", () => {
  console.log("describe outer-a")

  describe("describe inner 1", () => {
    console.log("describe inner 1")

    test("test 1", () => console.log("test 1"))
  })

  console.log("describe outer-b")

  test("test 2", () => console.log("test 2"))

  describe("describe inner 2", () => {
    console.log("describe inner 2")

    test("test 3", () => console.log("test 3"))
  })

  console.log("describe outer-c")
})

// describe outer-a
// describe inner 1
// describe outer-b
// describe inner 2
// describe outer-c
// test 1
// test 2
// test 3
```

---

### Mock Functions

현재 작성중인 포스트입니다.

https://jestjs.io/docs/mock-functions
