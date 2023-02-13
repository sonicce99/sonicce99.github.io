---
title: "Redux-toolkit 공식문서 뿌시기"
date: "2023-02-13"
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

- request가 진행 중임을 나타내기 위해 request 전에 "start" action이 dispatch 됩니다.

  > 이는 로딩 상태를 추적하거나, 중복 request을 건너뛰거나, UI에 로딩 표시기를 표시하는 데 사용할 수 있습니다.

- 비동기 요청이 이루어집니다.

- 요청 결과에 따라 비동기 logic은 결과 데이터가 포함된 "success" or 오류 세부 정보가 포함된 "failure"를 dispatch 합니다. reducer는 두 경우 모두 로딩 상태를 지우고 성공 사례의 결과 데이터를 처리하거나 표시를 위해 오류 값을 저장합니다.

```javascript
const getRepoDetailsStarted = () => ({
  type: "repoDetails/fetchStarted",
})
const getRepoDetailsSuccess = repoDetails => ({
  type: "repoDetails/fetchSucceeded",
  payload: repoDetails,
})
const getRepoDetailsFailed = error => ({
  type: "repoDetails/fetchFailed",
  error,
})
const fetchIssuesCount = (org, repo) => async dispatch => {
  dispatch(getRepoDetailsStarted())
  try {
    const repoDetails = await getRepoDetails(org, repo)
    dispatch(getRepoDetailsSuccess(repoDetails))
  } catch (err) {
    dispatch(getRepoDetailsFailed(err.toString()))
  }
}
```

그러나 이 방법을 사용하여 코드를 작성하는 것은 지루한 작업입니다.

각각의 개별 요청은 유사한 구현을 반복해야 합니다.

하지만 `createAsyncThunk`는 action type 및 action creator를 생성하고 해당 action을 dispatch하는 thunk를 생성하여 이 패턴을 추상화합니다.

#### Async Requests with createAsyncThunk

개발자는 API 요청에 필요한 실제 logic, Redux action history log에 표시되는 action type 이름, reducer가 가져온 데이터를 처리하는 방법에 가장 관심이 있을 것입니다.

여러 action type을 정의하고 작업을 올바른 순서로 dispatch 하는 반복적인 세부 사항은 관심이 없을 것입니다.

`createAsyncThunk`는 이 프로세스를 단순화합니다.

개발자는 오직 action type prefix의 문자열과 실제 비동기 논리를 수행하고 결과와 함께 Promise를 반환하는 payload 생성자 콜백만 제공하면 됩니다.

그 대가로 createAsyncThunk는 사용자가 반환한 Promise와 reducer에서 처리할 수 있는 action type에 따라 올바른 작업을 dispatch하는 thunk를 제공합니다.

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { userAPI } from "./userAPI"

// First, create the thunk
const fetchUserById = createAsyncThunk(
  "users/fetchByIdStatus",
  async (userId, thunkAPI) => {
    const response = await userAPI.fetchById(userId)
    return response.data
  }
)

// Then, handle actions in your reducers:
const usersSlice = createSlice({
  name: "users",
  initialState: { entities: [], loading: "idle" },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      // Add user to the state array
      state.entities.push(action.payload)
    })
  },
})

// Later, dispatch the thunk as needed in the app
dispatch(fetchUserById(123))
```

thunk action creator는 payload에 대한 첫 번째 인수로 전달될 단일 arg를 허용합니다.

payload creator는 자동 생성된 고유한 무작위 요청 ID 문자열 및 AbortController.signal 객체뿐만 아니라 일반적으로 표준 Redux 썽크 함수에 전달되는 매개변수를 포함하는 thunkAPI 객체도 수신합니다.

```typescript
interface ThunkAPI {
  dispatch: Function
  getState: Function
  extra?: any
  requestId: string
  signal: AbortSignal
}
```

### Managing Normalized Data

대부분의 애플리케이션은 일반적으로 깊게 nested 되거나 relational인 데이터를 처리합니다.

데이터 normalizing의 목표는 state에서 데이터를 효율적으로 구성하는 것입니다.

이것은 일반적으로 id의 키가 있는 개체로 저장하고 해당 id의 정렬된 배열을 저장하여 수행됩니다.

#### Normalizing by hand

```javascript
{
  users: [
    {
      id: 1,
      first_name: "normalized",
      last_name: "person",
    },
  ]
}
```

다음은 데이터를 반환하는 fetchAll API 요청의 응답을 정규화하는 방법에 대한 기본적인 예입니다.

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import userAPI from "./userAPI"

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await userAPI.fetchAll()
  return response.data
})

export const slice = createSlice({
  name: "users",
  initialState: {
    ids: [],
    entities: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      // reduce the collection by the id property into a shape of { 1: { ...user }}
      const byId = action.payload.users.reduce((byId, user) => {
        byId[user.id] = user
        return byId
      }, {})
      state.entities = byId
      state.ids = Object.keys(byId)
    })
  },
})
```

우리는 이 코드를 작성할 수 있지만 특히 여러 유형의 데이터를 처리하는 경우 반복됩니다.

또한 이 예제에서는 항목을 업데이트하지 않고 상태로 로드하는 것만 처리합니다.

#### Normalizing with normalizr

normalizr는 데이터 normalizing를 위한 인기 있는 기존 라이브러리입니다.

Redux 없이도 단독으로 사용할 수 있지만 Redux와 함께 매우 일반적으로 사용됩니다.

일반적인 사용법은 API 응답에서 컬렉션의 형식을 지정한 다음 reducer에서 처리하는 것입니다.

```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { normalize, schema } from "normalizr"

import userAPI from "./userAPI"

const userEntity = new schema.Entity("users")

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await userAPI.fetchAll()
  // Normalize the data before passing it to our reducer
  const normalized = normalize(response.data, [userEntity])
  return normalized.entities
})

export const slice = createSlice({
  name: "users",
  initialState: {
    ids: [],
    entities: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.entities = action.payload.users
      state.ids = Object.keys(action.payload.users)
    })
  },
})
```

이 코드는 상태에 추가 항목을 추가하거나 나중에 업데이트하는 것을 처리하지 않습니다.

수신된 모든 항목을 로드하기만 합니다.

#### Normalizing with createEntityAdapter

Redux Toolkit의 `createEntityAdapter` API는 컬렉션을 가져와

```
{
  ids: [],
  entities: {}
}
```

형태로 배치하여 슬라이스에 데이터를 저장하는 표준화된 방법을 제공합니다.

이 사전 정의된 상태 모양과 함께 데이터 작업 방법을 알고 있는 reducer 및 selectors를 생성합니다.

```javascript
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit"
import userAPI from "./userAPI"

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await userAPI.fetchAll()
  // In this case, `response.data` would be:
  // [{id: 1, first_name: 'Example', last_name: 'User'}]
  return response.data
})

export const updateUser = createAsyncThunk("users/updateOne", async arg => {
  const response = await userAPI.updateUser(arg)
  // In this case, `response.data` would be:
  // { id: 1, first_name: 'Example', last_name: 'UpdatedLastName'}
  return response.data
})

export const usersAdapter = createEntityAdapter()

// By default, `createEntityAdapter` gives you `{ ids: [], entities: {} }`.
// If you want to track 'loading' or other keys, you would initialize them here:
// `getInitialState({ loading: false, activeRequestId: null })`
const initialState = usersAdapter.getInitialState()

export const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    removeUser: usersAdapter.removeOne,
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, usersAdapter.upsertMany)
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      const { id, ...changes } = payload
      usersAdapter.updateOne(state, { id, changes })
    })
  },
})

const reducer = slice.reducer
export default reducer

export const { removeUser } = slice.actions
```

#### Using createEntityAdapter with Normalization Libraries

이미 normalizr 또는 다른 정규화 라이브러리를 사용하고 있다면 createEntityAdapter와 함께 사용하는 것을 고려할 수 있습니다.

위의 예를 확장하기 위해 다음은 normalizr를 사용하여 payload를 포맷한 다음 createEntityAdapter가 제공하는 유틸리티를 활용하는 방법에 대한 데모입니다.

기본적으로 setAll, addMany 및 upsertMany CRUD 메서드에는 엔터티 배열이 필요합니다.

그러나 { 1: { id: 1, ... }} 모양의 개체를 대안으로 전달할 수도 있으므로 사전 정규화된 데이터를 더 쉽게 삽입할 수 있습니다.

```javascript
// features/articles/articlesSlice.js
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit"
import fakeAPI from "../../services/fakeAPI"
import { normalize, schema } from "normalizr"

// Define normalizr entity schemas
export const userEntity = new schema.Entity("users")
export const commentEntity = new schema.Entity("comments", {
  commenter: userEntity,
})
export const articleEntity = new schema.Entity("articles", {
  author: userEntity,
  comments: [commentEntity],
})

const articlesAdapter = createEntityAdapter()

export const fetchArticle = createAsyncThunk(
  "articles/fetchArticle",
  async id => {
    const data = await fakeAPI.articles.show(id)
    // Normalize the data so reducers can load a predictable payload, like:
    // `action.payload = { users: {}, articles: {}, comments: {} }`
    const normalized = normalize(data, articleEntity)
    return normalized.entities
  }
)

export const slice = createSlice({
  name: "articles",
  initialState: articlesAdapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchArticle.fulfilled, (state, action) => {
      // Handle the fetch result by inserting the articles here
      articlesAdapter.upsertMany(state, action.payload.articles)
    })
  },
})

const reducer = slice.reducer
export default reducer
```

```js
// features/users/usersSlice.js

import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import { fetchArticle } from "../articles/articlesSlice"

const usersAdapter = createEntityAdapter()

export const slice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchArticle.fulfilled, (state, action) => {
      // And handle the same fetch result by inserting the users here
      usersAdapter.upsertMany(state, action.payload.users)
    })
  },
})

const reducer = slice.reducer
export default reducer
```

---

## Usage With TypeScript

### Introduction

Redux Toolkit은 TypeScript로 작성되었으며 해당 API는 TypeScript 애플리케이션과의 뛰어난 통합이 가능하도록 설계되었습니다.

이 페이지에서는 Redux Toolkit에 포함된 다양한 API 각각에 대한 구체적인 세부 정보와 TypeScript로 API를 올바르게 입력하는 방법을 제공합니다.

### configureStore

#### Getting the State type

State type을 얻는 가장 쉬운 방법은 미리 root reducer를 정의하고 ReturnType을 추출하는 것입니다.

type name State는 일반적으로 많이 사용되므로 혼동을 방지하기 위해 type에 RootState와 같은 다른 이름을 지정하는 것이 좋습니다.

```javascript
import { combineReducers } from "@reduxjs/toolkit"
const rootReducer = combineReducers({})
export type RootState = ReturnType<typeof rootReducer>
```

또는 rootReducer를 직접 생성하지 않고 대신 slice reducers를 configureStore()에 직접 전달하는 경우 root reducer를 올바르게 유추하기 위해 입력을 약간 수정해야 합니다.

```js
import { configureStore } from "@reduxjs/toolkit"
// ...
const store = configureStore({
  reducer: {
    one: oneSlice.reducer,
    two: twoSlice.reducer,
  },
})
export type RootState = ReturnType<typeof store.getState>

export default store
```

reducer를 configureStore()에 직접 전달하고 루트 reducer를 명시적으로 정의하지 않으면 rootReducer에 대한 참조가 없습니다. 대신 State 유형을 가져오기 위해 store.getState를 참조할 수 있습니다.

```js
import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"
const store = configureStore({
  reducer: rootReducer,
})
export type RootState = ReturnType<typeof store.getState>
```

#### Getting the Dispatch type

store에서 Dispatch type을 get하려면 store를 생성 후 추출할 수 있습니다.

type name Dispatch는 일반적으로 과도하게 사용되므로 혼동을 방지하기 위해 유형에 AppDispatch와 같은 다른 이름을 지정하는 것이 좋습니다. 또한 아래에 표시된 useAppDispatch와 같은 hook를 내보낸 다음 useDispatch를 호출할 때마다 사용하는 것이 더 편리할 수 있습니다.

```js
import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import rootReducer from "./rootReducer"

const store = configureStore({
  reducer: rootReducer,
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types

export default store
```

#### Correct typings for the Dispatch type

dispatch 함수 type은 middleware 옵션에서 추론됩니다. 따라서 올바르게 입력된 middleware를 추가하면 디스패치가 이미 올바르게 입력되어 있어야 합니다.

TypeScript는 스프레드 연산자를 사용하여 배열을 결합할 때 종종 배열 type을 넓히므로 getDefaultMiddleware()에서 반환된 MiddlewareArray의 .concat(...) 및 .prepend(...) 메서드를 사용하는 것이 좋습니다.

```js
import { configureStore } from '@reduxjs/toolkit'
import additionalMiddleware from 'additional-middleware'
import logger from 'redux-logger'
// @ts-ignore
import untypedMiddleware from 'untyped-middleware'
import rootReducer from './rootReducer'

export type RootState = ReturnType<typeof rootReducer>
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(
        // correctly typed middlewares can just be used
        additionalMiddleware,
        // you can also type middlewares manually
        untypedMiddleware as Middleware<
          (action: Action<'specialAction'>) => number,
          RootState
        >
      )
      // prepend and concat calls can be chained
      .concat(logger),
})

export type AppDispatch = typeof store.dispatch

export default store
```

**getDefaultMiddleware 없이 MiddlewareArray 사용**

getDefaultMiddleware의 사용을 모두 건너뛰고 싶다면 미들웨어 array의 type-safe 연결을 위해 MiddlewareArray를 계속 사용할 수 있습니다. 이 클래스는 .concat(...) 및 추가 .prepend(...) 메서드에 대한 수정된 유형으로만 기본 JavaScript 배열 유형을 확장합니다.

const로 사용하고 스프레드 연산자를 사용하지 않는 한 배열 유형 확장 문제가 발생하지 않을 것이므로 일반적으로 필요하지 않습니다.

따라서 다음 두 호출은 동일합니다.

```js
import { configureStore, MiddlewareArray } from '@reduxjs/toolkit'

configureStore({
  reducer: rootReducer,
  middleware: new MiddlewareArray().concat(additionalMiddleware, logger),
})

configureStore({
  reducer: rootReducer,
  middleware: [additionalMiddleware, logger] as const,
})
```

#### Using the extracted Dispatch type with React Redux

기본적으로 React Redux useDispatch hook에는 미들웨어를 고려하는 type이 포함되어 있지 않습니다.

dispatch할 때 dispatch 함수에 대해 더 구체적인 type이 필요한 경우 반환된 dispatch 함수의 type을 지정하거나 useSelector의 custom-typed 버전을 만들 수 있습니다. [자세한 내용은 React Redux 문서를 참조하세요](https://react-redux.js.org/using-react-redux/usage-with-typescript#typing-the-usedispatch-hook).

### createAction

대부분의 사용 사례에서 action.type의 리터럴 정의가 필요하지 않으므로 다음을 사용할 수 있습니다.

```js
createAction < number > "test"
```

그러면 생성된 action이 PayloadActionCreator<숫자, 문자열> type이 됩니다.

일부 설정에서는 action.type에 대한 리터럴 유형이 필요합니다.

하지만 불행하게도 TypeScript type 정의는 수동으로 정의된 유형 매개변수와 유추된 유형 매개변수의 혼합을 허용하지 않으므로 Generic 정의와 실제 JavaScript 코드 모두에서 유형을 지정해야 합니다.

```js
createAction < number, "test" > "test"
```

중복 없이 작성하는 다른 방법을 찾고 있다면 prepare callback을 사용하여 두 type parameters가 arguments에서 추론될 수 있으므로 action type을 지정할 필요가 없습니다.

```js
function withPayloadType<T>() {
  return (t: T) => ({ payload: t })
}
createAction('test', withPayloadType<string>())
```

#### Alternative to using a literally-typed action.type

예를 들어 case 문에 payload를 올바르게 입력하기 위해 action.type을 식별자로 사용하는 경우 다음 대안에 관심을 가질 수 있습니다.

생성된 action creators에는 type predicate 역할을 하는 match method가 있습니다.

```js
const increment = createAction < number > "increment"
function test(action: Action) {
  if (increment.match(action)) {
    // action.payload inferred correctly here
    action.payload
  }
}
```

### createReducer

createReducer를 호출하는 기본 방법은 다음과 같습니다.

```js
createReducer(0, {
  increment: (state, action: PayloadAction<number>) => state + action.payload,
})
```

안타깝게도 key는 문자열일 뿐이므로 해당 API TypeScript를 사용하면 action type을 유추하거나 확인할 수 없습니다.

```js
{
  const increment = createAction<number, 'increment'>('increment')
  const decrement = createAction<number, 'decrement'>('decrement')
  createReducer(0, {
    [increment.type]: (state, action) => {
      // action is any here
    },
    [decrement.type]: (state, action: PayloadAction<string>) => {
      // even though action should actually be PayloadAction<number>, TypeScript can't detect that and won't give a warning here.
    },
  })
}
```

#### Building Type-Safe Reducer Argument Objects

간단한 객체를 createReducer에 대한 인수로 사용하는 대신 ActionReducerMapBuilder 인스턴스를 수신하는 콜백을 사용할 수도 있습니다.

```js
const increment = createAction<number, 'increment'>('increment')
const decrement = createAction<number, 'decrement'>('decrement')
createReducer(0, (builder) =>
  builder
    .addCase(increment, (state, action) => {
      // action is inferred correctly here
    })
    .addCase(decrement, (state, action: PayloadAction<string>) => {
      // this would error out
    })
)
```

reducer argument objects를 정의할 때 더 엄격한 안전성이 필요한 경우 이 API를 사용하는 것이 좋습니다.

**Typing builder.addMatcher**

builder.addMatcher에 대한 첫 번째 matcher argument로 type predicate 함수를 사용해야 합니다.

결과적으로 두 번째 reducer argument에 대한 action argument는 TypeScript에서 유추할 수 있습니다.

```js
function isNumberValueAction(action: AnyAction): action is PayloadAction<{ value: number }> {
  return typeof action.payload.value === 'number'
}

createReducer({ value: 0 }, builder =>
   builder.addMatcher(isNumberValueAction, (state, action) => {
      state.value += action.payload.value
   })
})
```

### createSlice

---

## Store Setup

### configureStore

#### Parameters

configureStore는 아래의 옵션과 함께 단일 config object parameter를 허용합니다.

```js
type ConfigureEnhancersCallback = (
  defaultEnhancers: StoreEnhancer[]
) => StoreEnhancer[]

interface ConfigureStoreOptions<
  S = any,
  A extends Action = AnyAction,
  M extends Middlewares<S> = Middlewares<S>
> {
  /**
   * A single reducer function that will be used as the root reducer, or an
   * object of slice reducers that will be passed to `combineReducers()`.
   */
  reducer: Reducer<S, A> | ReducersMapObject<S, A>

  /**
   * An array of Redux middleware to install. If not supplied, defaults to
   * the set of middleware returned by `getDefaultMiddleware()`.
   */
  middleware?: ((getDefaultMiddleware: CurriedGetDefaultMiddleware<S>) => M) | M

  /**
   * Whether to enable Redux DevTools integration. Defaults to `true`.
   *
   * Additional configuration can be done by passing Redux DevTools options
   */
  devTools?: boolean | DevToolsOptions

  /**
   * The initial state, same as Redux's createStore.
   * You may optionally specify it to hydrate the state
   * from the server in universal apps, or to restore a previously serialized
   * user session. If you use `combineReducers()` to produce the root reducer
   * function (either directly or indirectly by passing an object as `reducer`),
   * this must be an object with the same shape as the reducer map keys.
   */
  preloadedState?: DeepPartial<S extends any ? S : S>

  /**
   * The store enhancers to apply. See Redux's `createStore()`.
   * All enhancers will be included before the DevTools Extension enhancer.
   * If you need to customize the order of enhancers, supply a callback
   * function that will receive the original array (ie, `[applyMiddleware]`),
   * and should return a new array (such as `[applyMiddleware, offline]`).
   * If you only need to add middleware, you can use the `middleware` parameter instead.
   */
  enhancers?: StoreEnhancer[] | ConfigureEnhancersCallback
}

function configureStore<S = any, A extends Action = AnyAction>(
  options: ConfigureStoreOptions<S, A>
): EnhancedStore<S, A>
```

##### reducer

만약 single 함수인 경우 스토어의 root reducer로 직접 사용됩니다.

{
users : usersReducer,
posts : postsReducer
}

와 같은 slice reducer의 객체인 경우 configureStore는 이 객체를 Redux combineReducers 유틸리티에 전달하여 자동으로 루트 리듀서를 생성합니다.

##### middleware

Redux 미들웨어 함수의 optional array입니다.

이 옵션이 제공되면 store에 추가하려는 모든 미들웨어 기능이 포함되어야 합니다. configureStore는 자동으로 그것들을 applyMiddleware로 전달합니다.

제공되지 않으면 configureStore는 getDefaultMiddleware를 호출하고 반환하는 미들웨어 함수 배열을 사용합니다.

##### devTools

만약 boolean인 경우 configureStore가 Redux DevTools browser extension에 대한 지원을 자동으로 활성화해야 하는지 여부를 나타내는 데 사용됩니다.

object인 경우 DevTools Extension이 활성화되고 options object가 composeWithDevtools()에 전달됩니다.

기본값은 true입니다.

##### preloadedState

Redux createStore 함수에 전달할 optional initial state 값입니다.

##### enhancers

콜백 함수로 정의된 경우 DevTools Extension 없이 기존의 enhancer array로 호출되며 새로운 enhancer array을 반환해야 합니다.

이는 redux-first-router 또는 redux-offline과 같이 applyMiddleware 앞에 스토어 인핸서를 추가해야 하는 경우에 주로 유용합니다.

> ex) Enhancers: (defaultEnhancers) => [offline, ...defaultEnhancers]는 [offline, applyMiddleware, devToolsExtension]으로 최종 설정 됩니다.

#### Usage

```js
// file: todos/todosReducer.ts noEmit
import type { Reducer } from '@reduxjs/toolkit'
declare const reducer: Reducer<{}>
export default reducer

// file: visibility/visibilityReducer.ts noEmit
import type { Reducer } from '@reduxjs/toolkit'
declare const reducer: Reducer<{}>
export default reducer

// file: store.ts
import { configureStore } from '@reduxjs/toolkit'

// We'll use redux-logger just as an example of adding another middleware
import logger from 'redux-logger'

// And use redux-batched-subscribe as an example of adding enhancers
import { batchedSubscribe } from 'redux-batched-subscribe'

import todosReducer from './todos/todosReducer'
import visibilityReducer from './visibility/visibilityReducer'

const reducer = {
  todos: todosReducer,
  visibility: visibilityReducer,
}

const preloadedState = {
  todos: [
    {
      text: 'Eat food',
      completed: true,
    },
    {
      text: 'Exercise',
      completed: false,
    },
  ],
  visibilityFilter: 'SHOW_COMPLETED',
}

const debounceNotify = _.debounce(notify => notify());

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
  enhancers: [batchedSubscribe(debounceNotify)],
})

// The store has been created with these options:
// - The slice reducers were automatically passed to combineReducers()
// - redux-thunk and redux-logger were added as middleware
// - The Redux DevTools Extension is disabled for production
// - The middleware, batched subscribe, and devtools enhancers were composed together
```

### getDefaultMiddleware

미들웨어의 default list을 포함하는 array을 return 합니다.

#### Intended Usage

기본적으로 configureStore는 일부 미들웨어를 Redux store 설정에 자동으로 추가합니다.

```js
const store = configureStore({
  reducer: rootReducer,
})

// Store has middleware added, because the middleware list was not customized
```

미들웨어 list을 customize 하려는 경우 다음과 같이 configureStore에 미들웨어 function 배열을 제공할 수 있습니다.

```js
const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk, logger],
})

// Store specifically has the thunk and logger middleware applied
```

그러나 미들웨어 옵션을 제공할 때 store에 추가하려는 모든 미들웨어를 정의해야 합니다.

❗️ configureStore는 나열된 것 이외의 추가 미들웨어를 추가하지 않습니다.

getDefaultMiddleware는 custom 미들웨어를 추가하고 싶지만 default 미들웨어도 추가하려는 경우에 유용합니다.

```js
import { configureStore } from "@reduxjs/toolkit"

import logger from "redux-logger"

import rootReducer from "./reducer"

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
})

// Store has all of the default middleware added, _plus_ the logger middleware
```

전개 연산자 대신 반환된 MiddlewareArray의 연결 가능한 .concat(...) 및 .prepend(...) 메서드를 사용하는 것이 좋습니다.

후자가 경우에 따라 중요한 type 정보를 잃을 수 있기 때문입니다.

#### Included Default Middleware

##### Development

Redux Toolkit의 목표 중 하나는 기본값을 제공하고 흔한 실수를 방지하는 것입니다.

두 가지 흔한 이슈에 대한 runtime check를 제공하기 위해서 getDefaultMiddleware에는 App의 development build에 추가되는 일부 미들웨어가 포함되어 있습니다.

- Immutability check middleware

mutations에 대한 상태 값을 깊이 비교합니다. dispatch 중 reducer의 mutations와 dispatch 사이에 발생하는 mutations를 감지할 수 있습니다. mutations가 감지되면 오류를 발생시키고 state tree에서 변이된 값이 감지된 키 경로를 나타냅니다.

- Serializability check middleware

Redux Toolkit에서 사용하기 위해 특별히 생성된 custom 미들웨어입니다. immutable-state-invariant와 개념이 유사하지만 function, Promises, Symbols 및 other non-plain-JS-data values과 같은 직렬화할 수 없는 값에 대해 state tree와 action을 자세히 확인합니다. 직렬화할 수 없는 값이 감지되면 직렬화할 수 없는 값이 감지된 키 경로와 함께 콘솔 오류가 인쇄됩니다.

이러한 개발 도구 미들웨어 외에도 기본적으로 redux-thunk가 추가되는데, 이는 thunk가 Redux의 기본 권장 미들웨어이기 때문입니다.

### Immutability Middleware

Redux Toolkit과 함께 사용하도록 맞춤화된 미들웨어의 port입니다. 감지된 모든 mutations는 오류로 처리됩니다.

이 미들웨어는 기본적으로 configureStore 및 getDefaultMiddleware에 의해 저장소에 추가됩니다.

getDefaultMiddleware에 immutableCheck 값으로 전달하여 이 미들웨어의 동작을 customize 할 수 있습니다.

```js
// file: exampleSlice.ts
import { createSlice } from "@reduxjs/toolkit"

export const exampleSlice = createSlice({
  name: "example",
  initialState: {
    user: "will track changes",
    ignoredPath: "single level",
    ignoredNested: {
      one: "one",
      two: "two",
    },
  },
  reducers: {},
})

export default exampleSlice.reducer
```

```js
// file: store.ts
import { configureStore } from "@reduxjs/toolkit"

import exampleSliceReducer from "./exampleSlice"

const store = configureStore({
  reducer: exampleSliceReducer,
  // This replaces the original default middleware with the customized versions
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: {
        ignoredPaths: ["ignoredPath", "ignoredNested.one", "ignoredNested.two"],
      },
    }),
})
```

### Serializability Middleware

serialize 할 수 없는 값이 dispatch 된 actions에 포함되었는지 감지하는 custom middleware 입니다. 직렬화할 수 없는 값이 감지되면 콘솔에 기록됩니다.

이 미들웨어는 기본적으로 configureStore 및 getDefaultMiddleware에 의해 저장소에 추가됩니다.

getDefaultMiddleware의 serializableCheck 값으로 전달하여 이 middleware의 동작을 customize 할 수 있습니다.

#### Options

```js
interface SerializableStateInvariantMiddlewareOptions {
  /**
   * The function to check if a value is considered serializable. This
   * function is applied recursively to every value contained in the
   * state. Defaults to `isPlain()`.
   */
  isSerializable?: (value: any) => boolean
  /**
   * The function that will be used to retrieve entries from each
   * value.  If unspecified, `Object.entries` will be used. Defaults
   * to `undefined`.
   */
  getEntries?: (value: any) => [string, any][]

  /**
   * An array of action types to ignore when checking for serializability.
   * Defaults to []
   */
  ignoredActions?: string[]

  /**
   * An array of dot-separated path strings or regular expressions to ignore
   * when checking for serializability, Defaults to
   * ['meta.arg', 'meta.baseQueryMeta']
   */
  ignoredActionPaths?: (string | RegExp)[]

  /**
   * An array of dot-separated path strings or regular expressions to ignore
   * when checking for serializability, Defaults to []
   */
  ignoredPaths?: (string | RegExp)[]
  /**
   * Execution time warning threshold. If the middleware takes longer
   * than `warnAfter` ms, a warning will be displayed in the console.
   * Defaults to 32ms.
   */
  warnAfter?: number

  /**
   * Opt out of checking state. When set to `true`, other state-related params will be ignored.
   */
  ignoreState?: boolean

  /**
   * Opt out of checking actions. When set to `true`, other action-related params will be ignored.
   */
  ignoreActions?: boolean
}
```

#### Exports

```js
import isPlainObject from "./isPlainObject"

export function isPlain(val: any) {
  return (
    typeof val === "undefined" ||
    val === null ||
    typeof val === "string" ||
    typeof val === "boolean" ||
    typeof val === "number" ||
    Array.isArray(val) ||
    isPlainObject(val)
  )
}

import { Iterable } from "immutable"
import {
  configureStore,
  createSerializableStateInvariantMiddleware,
  isPlain,
} from "@reduxjs/toolkit"
import reducer from "./reducer"

// Augment middleware to consider Immutable.JS iterables serializable
const isSerializable = (value: any) =>
  Iterable.isIterable(value) || isPlain(value)

const getEntries = (value: any) =>
  Iterable.isIterable(value) ? value.entries() : Object.entries(value)

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
  getEntries,
})

const store = configureStore({
  reducer,
  middleware: [serializableMiddleware],
})
```
