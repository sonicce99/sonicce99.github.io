---
title: "Redux-toolkit 공식문서 뿌시기"
date: "2023-01-18"
description: "Redux-toolkit에 대한 모든 내용을 공식문서를 보고 정리합니다."
keywords:
  [
    react,
    자바스크립트,
    javascript,
    공식문서,
    Tutorial,
    redux,
    redux-toolkit,
    RTK-Query,
  ]
---

## Usage Guide

Redux Toolkit의 목표는 일반적인 Redux 사용 사례를 단순화하는 것입니다.

Redux로 수행할 수 있는 모든 작업을 위한 완벽한 솔루션은 아니지만 훨씬 간단하게 작성할 수 있습니다.

Redux Toolkit은 애플리케이션에서 사용할 수 있는 여러 개별 기능을 exports하고, Redux-Thunk와 같이 Redux와 함께 일반적으로 사용되는 일부 다른 패키지에 대한 종속성을 추가합니다.

이를 통해 새로운 프로젝트이든, 기존의 대규모 앱을 업데이트하든 관계없이 자신의 애플리케이션에서 사용하는 방법을 결정할 수 있습니다.

### Store Setup

모든 Redux 앱은 Store를 생성해야 합니다. 여기에는 일반적으로 여러 단계가 포함됩니다.

- root reducer 함수 import or creating.

- 미들웨어 설정 (예를 들어, 비동기 로직을 ​​처리하기 위한 미들웨어).

- Redux DevTools Extension 구성.

- development인지 production 인지에 따라 일부 logic을 변경할 수 있음.

#### Manual Store Setup

```javascript
import { applyMiddleware, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunkMiddleware from "redux-thunk"

import monitorReducersEnhancer from "./enhancers/monitorReducers"
import loggerMiddleware from "./middleware/logger"
import rootReducer from "./reducers"

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer))
  }

  return store
}
```

이 예는 읽을 수 있지만 프로세스가 항상 간단하지는 않습니다.

- createStore 함수는 rootReducer, preloadedState, enhancer를 인수로 받습니다.

- middleware 및 enhancers를 설정하는 프로세스는 혼란스러울 수 있습니다. 특히 여러 구성 요소를 추가하려는 경우에는 더욱 그렇습니다.

- Redux DevTools Extension 문서는 처음에 확장이 사용 가능한지 확인하기 위해 global namespace를 확인하는 손으로 쓴 코드를 사용할 것을 제안합니다. 많은 사용자가 이러한 스니펫을 복사하여 붙여넣기 때문에 설정 코드를 읽기가 더 어려워집니다.

#### Simplifying Store Setup with configureStore

configureStore 는 이러한 이슈를 다음과 같이 돕습니다.

- 더 쉽게 읽을 수 있는 naming된 parameters가 있는 옵션 개체가 있음

- 스토어에 추가하려는 middleware 및 enhancers array를 제공하고 자동으로 `applyMiddleware` 를 호출 및 작성합니다.

- Redux DevTools Extension을 자동으로 활성화

또한 configureStore는 기본적으로 아래의 미들웨어를 추가합니다.

- redux-thunk: 구성 요소 외부에서 동기 및 비동기 로직을 ​​모두 사용하는 데 가장 일반적으로 사용되는 미들웨어입니다.

- development 단계에서 middleware는 상태를 변경하거나 직렬화할 수 없는 값을 사용하는 것과 같은 일반적인 실수를 확인합니다.

이를 사용하는 가장 간단한 방법은 root reducer 함수를 reducer라는 parameter로 전달하는 것입니다.

```javascript
import { configureStore } from "@reduxjs/toolkit"
import usersReducer from "./usersReducer"
import postsReducer from "./postsReducer"

const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
  },
})

export default store
```

이것은 one level의 reducers에서만 작동합니다. reducers를 중첩하려면 `CombineReducers`를 직접 호출해야 합니다.

store 설정을 customize 해야 하는 경우 추가 옵션을 전달할 수 있습니다.

Redux Toolkit을 사용한 hot reloading 예제는 다음과 같습니다.

```javascript
import { configureStore } from "@reduxjs/toolkit"

import monitorReducersEnhancer from "./enhancers/monitorReducers"
import loggerMiddleware from "./middleware/logger"
import rootReducer from "./reducers"

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(loggerMiddleware),
    preloadedState,
    enhancers: [monitorReducersEnhancer],
  })

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer))
  }

  return store
}
```

`middleware` argument를 제공하면 configureStore는 나열된 모든 미들웨어만 사용합니다. 만약 custom 미들웨어와 defaults를 모두 함께 사용하려면 callback 표기법을 사용하고 `getDefaultMiddleware`를 호출하고 반환하는 미들웨어 배열에 결과를 포함할 수 있습니다.

### Writing Reducers

Reducers는 가장 중요한 Redux 개념입니다. 일반적인 Reducers 기능에는 다음이 필요합니다.

- action의 `type` 필드를 보고 어떻게 respond해야 하는지 확인합니다.

- 변경해야 하는 상태 부분의 복사본을 만들고 해당 복사본만 수정하여 상태를 불변으로 업데이트합니다.

Reducers를 작성할 때 어려운점은 `상태를 불변으로 업데이트`하는 것과 관련이 있습니다.

JavaScript는 mutable한 언어이므로 중첩된 변경 불가능한 데이터를 수동으로 업데이트하는 것은 어렵고 실수하기 쉽습니다.

다음은 `createReducer`를 사용하는 방법에 대한 몇 가지 예입니다.

switch 문과 변경 불가능한 업데이트를 사용하는 일반적인 "todo list" reducer부터 시작하겠습니다.

```javascript
function todosReducer(state = [], action) {
  switch (action.type) {
    case "ADD_TODO": {
      return state.concat(action.payload)
    }
    case "TOGGLE_TODO": {
      const { index } = action.payload
      return state.map((todo, i) => {
        if (i !== index) return todo

        return {
          ...todo,
          completed: !todo.completed,
        }
      })
    }
    case "REMOVE_TODO": {
      return state.filter((todo, i) => i !== action.payload.index)
    }
    default:
      return state
  }
}
```

우리는 특별히 state.concat()을 호출하여 새 todo 항목이 있는 복사된 배열을 반환하고, state.map()을 호출하여 토글 케이스에 대한 복사된 배열을 반환하고 spread 연산자를 사용하여 todo의 복사본을 만듭니다.

`createReducer`를 사용하면 해당 예제를 상당히 단축할 수 있습니다.

```javascript
const todosReducer = createReducer([], builder => {
  builder
    .addCase("ADD_TODO", (state, action) => {
      // "mutate" the array by calling push()
      state.push(action.payload)
    })
    .addCase("TOGGLE_TODO", (state, action) => {
      const todo = state[action.payload.index]
      // "mutate" the object by overwriting a field
      todo.completed = !todo.completed
    })
    .addCase("REMOVE_TODO", (state, action) => {
      // Can still return an immutably-updated value if we want to
      return state.filter((todo, i) => i !== action.payload.index)
    })
})
```

#### Considerations for Using createReducer

Redux Toolkit createReducer 함수가 정말 유용할 수 있지만 다음 사항을 명심하세요.

- "mutative" 코드는 createReducer 함수 내에서만 올바르게 작동합니다.

- Immer는 기존의 상태를 "mutating"하는 것과 새로운 상태 값을 반환하는 것을 혼합하도록 허용하지 않습니다.

### Writing Action Creators

Redux는 action object 생성 프로세스를 캡슐화하는 `action creator 함수`를 작성하기를 권장합니다.

이것이 꼭 필요한 것은 아니지만 Redux 사용의 표준 부분입니다.

대부분의 액션 생성자는 매우 간단합니다.

parameters를 받아서 구체적인 `type` 필드와 parameters의 action object를 반환합니다. parameters는 일반적으로 `payload` 라는 필드에 넣습니다.

일반적인 action creator는 다음과 같습니다.

```javascript
function addTodo(text) {
  return {
    type: "ADD_TODO",
    payload: { text },
  }
}
```

#### Defining Action Creators with createAction

`action creators`를 손으로 작성하는 것은 지루할 수 있습니다.

Redux Toolkit은 주어진 action type을 사용하는 action creator를 생성하고 argument를 payload 필드로 바꾸는 createAction이라는 함수를 제공합니다.

```javascript
const addTodo = createAction("ADD_TODO")
addTodo({ text: "Buy milk" })
// {type : "ADD_TODO", payload : {text : "Buy milk"}})
```

#### Using Action Creators as Action Types

Redux reducers는 상태를 업데이트하는 방법을 결정하기 위해 특정 action types을 찾아야 합니다.

일반적으로 이것은 action type 문자열과 action creator 함수를 별도로 정의하여 수행됩니다.

Redux Toolkit createAction 함수는 이를 더 쉽게 하기 위해 몇 가지 트릭을 사용합니다.

1.  createAction은 자신이 생성하는 action creator에서 toString() 메서드를 재정의합니다. 즉, builder.addCase 또는 createReducer object 표기법에 제공된 key와 같은 일부 위치에서 action creator 자체를 "action type" 참조로 사용할 수 있습니다.

2.  action type도 action creator에서 type 필드로 정의됩니다.

```javascript
const actionCreator = createAction("SOME_ACTION_TYPE")

console.log(actionCreator.toString())
// "SOME_ACTION_TYPE"

console.log(actionCreator.type)
// "SOME_ACTION_TYPE"

const reducer = createReducer({}, builder => {
  // actionCreator.toString() will automatically be called here
  // also, if you use TypeScript, the action type will be correctly inferred
  builder.addCase(actionCreator, (state, action) => {})

  // Or, you can reference the .type field:
  // if using TypeScript, the action type cannot be inferred that way
  builder.addCase(actionCreator.type, (state, action) => {})
})
```

즉, 별도의 변수를 작성하거나 사용할 필요가 없으며 `const SOME_ACTION_TYPE = "SOME_ACTION_TYPE"` 과 같은 작업 유형의 이름과 값을 반복할 필요가 없습니다.

불행히도 문자열로의 암시적 변환은 switch 문에서 동작하지 않습니다.

switch 문에서 이러한 action creator 중 하나를 사용하려면 actionCreator.toString()을 직접 호출해야 합니다.

```javascript
const actionCreator = createAction('SOME_ACTION_TYPE')

const reducer = (state = {}, action) => {
  switch (action.type) {

    // ERROR: this won't work correctly!
 ❌ case actionCreator: {
      break
    }
    // CORRECT: this will work as expected
    case actionCreator.toString(): {
      break
    }
    // CORRECT: this will also work right
    case actionCreator.type: {
      break
    }
  }
}
```

### Creating Slices of State

Redux state는 일반적으로 `combineReducers`에 전달되는 reducers에 의해 정의되는 "slices"로 구성됩니다.

```javascript
import { combineReducers } from "redux"
import usersReducer from "./usersReducer"
import postsReducer from "./postsReducer"

const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
})
```

이 예에서 users와 posts은 모두 "slice"로 간주됩니다.

보통은 한 파일에서 slice의 reducer function을 정의하고 두 번째 파일에서 action creator를 정의하는 것입니다.

두 함수 모두 같은 action type을 참조해야 하기 때문에 일반적으로 세 번째 파일에서 정의되고 두 파일에서 import 합니다.

```javascript
// postsConstants.js
const CREATE_POST = "CREATE_POST"
const UPDATE_POST = "UPDATE_POST"
const DELETE_POST = "DELETE_POST"

// postsActions.js
import { CREATE_POST, UPDATE_POST, DELETE_POST } from "./postConstants"

export function addPost(id, title) {
  return {
    type: CREATE_POST,
    payload: { id, title },
  }
}

// postsReducer.js
import { CREATE_POST, UPDATE_POST, DELETE_POST } from "./postConstants"

const initialState = []

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_POST: {
      // omit implementation
    }
    default:
      return state
  }
}
```

#### Defining Functions in Objects

modern JavaScript에는 object의 key와 functions를 모두 정의하는 몇 가지 방법이 있으며 다양한 key 정의와 function 정의를 max and match 할 수 있습니다.

예를 들어, 다음은 object 내부의 함수를 정의하는 방법입니다.

```javascript
const keyName = "ADD_TODO4";

const reducerObject = {
    // Explicit quotes for the key name, arrow function for the reducer
    "ADD_TODO1" : (state, action) => {

    }

    // Bare key with no quotes, function keyword
    ADD_TODO2 : function(state, action){

    }

    // Object literal function shorthand
    ADD_TODO3(state, action) {

    }

    // Computed property
    [keyName] : (state, action) => {

    }
}
```

#### Simplifying Slices with createSlice

slice 만드는 작업을 단순화하기 위해 Redux Toolkit에는 reducers function의 이름을 기반으로 action type 및 action creator를 자동 생성하는 createSlice 함수가 포함되어 있습니다.

```javascript
const postsSlice = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    createPost(state, action) {},
    updatePost(state, action) {},
    deletePost(state, action) {},
  },
})

console.log(postsSlice)
/*
콘솔 결과.
{
    name: 'posts',
    actions : {
        createPost,
        updatePost,
        deletePost,
    },
    reducer
}
*/

const { createPost } = postsSlice.actions

console.log(createPost({ id: 123, title: "Hello World" }))
// type이 자동으로 생성됨.
// {type : "posts/createPost", payload : {id : 123, title : "Hello World"}}
```

createSlice는 reducers 필드에 정의된 모든 function을 살펴보고 제공된 모든 함수에 대해 reducer의 이름을 action type 자체로 사용하는 action creator를 생성합니다. 그래서 createPost reducer는 "posts/createPost" action type이 되었고, createPost() action creator는 해당 type의 action을 반환할 것입니다.

#### Exporting and Using Slices

대부분의 경우 slice을 정의하고 해당 action creator와 reducer를 내보낼 것입니다. 권장되는 방법은 ES6 구조 분해 및 내보내기 구문을 사용하는 것입니다.

```javascript
const postsSlice = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    createPost(state, action) {},
    updatePost(state, action) {},
    deletePost(state, action) {},
  },
})

// Extract the action creators object and the reducer
const { actions, reducer } = postsSlice
// Extract and export each action creator by name
export const { createPost, updatePost, deletePost } = actions
// Export the reducer, either as a default or named export
export default reducer
```

원하는 경우 slice object 자체를 직접 내보낼 수도 있습니다.

이 방식으로 정의된 slice는 action creator와 reducer를 정의하고 내보내기 위한 "Redux Ducks" 패턴과 개념상 매우 유사합니다. 그러나 slice를 가져오고 내보낼 때 알아야 할 몇 가지 잠재적인 단점이 있습니다.

1. Redux action type은 하나의 slice에만 국한되지 않습니다. 개념적으로는 각 slice reducer는 Redux 상태의 자체 부분을 "소유"하지만 모든 action type을 듣고 적절하게 상태를 업데이트할 수 있어야 합니다. 예를 들어, 다른 slice가 데이터를 지우거나 초기 상태 값으로 다시 재설정하여 "사용자 로그아웃" 작업에 응답하려고 할 수 있습니다. 이 점을 염두하면서 slice들을 설계해야합니다.

2. 두 모듈이 서로 가져오려고 하면 JS 모듈에 "circular reference" 문제가 발생할 수 있습니다. 이로 인해 가져오기가 정의되지 않아 해당 가져오기가 필요한 코드가 손상될 수 있습니다. 두 개의 서로 다른 파일에 정의된 slice가 모두 다른 파일에 정의된 action에 응답하려는 경우 이 문제가 발생할 수 있습니다.

### Asynchronous Logic and Data Fetching

#### Using Middleware to Enable Async Logic

Redux store는 비동기 로직에 대해 아무것도 모릅니다.

동작을 동기식으로 전달하고, root reducer 함수를 호출하여 상태를 업데이트하고, 무언가 변경되었음을 UI에 알리는 방법만 알고 있습니다.

**모든 비동기성은 저장소 외부에서 발생해야 합니다.**

하지만 현재 store 상태를 dispatch 하거나 확인하여 비동기 로직이 store와 상호 작용하도록 하려면 어떻게 해야 할까요?

그것이 바로 middleware가 들어오는 곳입니다.

middleware는 store를 확장하고 아래와 같은 일을 합니다.

- action이 dispatch될 때 추가 logic 실행

- dispatch된 action 일시 중지, 수정, 딜레이, 교체 또는 중단

- dispatch 및 getState에 접근할 수 있는 추가 코드 작성

- 함수 및 promise외 같은 일반 action objects 이외의 다른 값을 intercepting 해서 dispatch에 다른 값을 넣습니다.

Redux에는 여러 종류의 비동기 middleware가 있으며 각각 다른 구문을 사용하여 logic을 작성할 수 있습니다.

가장 일반적인 비동기 middleware는 다음과 같습니다.

- redux-thunk: 비동기 로직을 ​​직접 포함하는 함수를 작성할 수 있다.

- redux-saga: 미들웨어에서 실행할 수 있도록 behavior의 descriptions을 반환하는 generator functions를 사용.

- redux-observable: RxJS observable 라이브러리를 사용하여 action을 처리하는 함수 chains을 생성.

이러한 각 라이브러리에는 서로 다른 사용 사례와 장단점이 있습니다.

💁🏻‍♂️ Redux Toolkit의 RTK Query 는 Redux 앱용으로 구축된 data fetching 및 caching solution 이며 thunks / reducer를 작성할 필요가 없습니다. 직접 사용해 보고 도움이 되는지 확인해 보세요!

Redux Toolkit configureStore 기능은 기본적으로 thunk 미들웨어를 자동으로 설정하므로 애플리케이션 코드의 일부로 thunk 작성을 즉시 시작할 수 있습니다.

#### Defining Async Logic in Slices

Redux Toolkit은 현재 thunk 함수 작성을 위한 특수 API 또는 구문을 제공하지 않습니다.

특히 createSlice() 호출의 일부로 정의할 수 없습니다.

일반 Redux 코드와 동일하게 reducer logic과 별도로 작성해야 합니다.

Thunks는 일반적으로 dispatch(dataLoaded(response.data))와 같은 일반 작업을 전달합니다.

```javascript
// First, define the reducer and action creators via `createSlice`
const usersSlice = createSlice({
  name: "users",
  initialState: {
    loading: "idle",
    users: [],
  },
  reducers: {
    usersLoading(state, action) {
      // Use a "state machine" approach for loading state instead of booleans
      if (state.loading === "idle") {
        state.loading = "pending"
      }
    },
    usersReceived(state, action) {
      if (state.loading === "pending") {
        state.loading = "idle"
        state.users = action.payload
      }
    },
  },
})

// Destructure and export the plain action creators
export const { usersLoading, usersReceived } = usersSlice.actions

// Define a thunk that dispatches those action creators
const fetchUsers = () => async dispatch => {
  dispatch(usersLoading())
  const response = await usersAPI.fetchAll()
  dispatch(usersReceived(response.data))
}
```

#### Redux Data Fetching Patterns

Redux의 Data fetching logic는 일반적으로 `predictable pattern`을 따릅니다.
