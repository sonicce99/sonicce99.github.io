---
title: "React-Toolkit-Query 공식문서 뿌시기 🗿"
date: "2022-06-20"
description: "기존의 OMS(주문 관리 시스템)은 Redux-thunk와 RTK-Query가 혼재되어 있었습니다.🥲 하지만 WMS(창고 관리 시스탬)을 개발하면서 우리는 RTK-Query로 코드를 작성하기로 했고 추후에 RTK-Query로 완전히 migaration 하기로 결정했습니다. 그래서 좀 더 자세히 RTK-Query를 이해해야만 했기 때문에 공식문서를 읽고 내용을 정리합니다."
---

# Overview

🌟 배울점.

- RTK Query는 무엇이고, 어떤 문제를 해결하는지.

- RTK Query안에 어떤 Api들이 포함되어 있는지!

- 기본적인 RTK Query 사용법 익히기!

**RTK Query**는 강력한 데이터 fetching 기능과 caching 기능이 있습니다.

웹에서 데이터를 load 하는 일반적인 경우를 단순화하도록 설계되었습니다. 따라서 fetching 해오고 캐싱하는 로직을 우리가 작성할 필요가 없습니다.

RTK Query는 Redux Toolkit package에 포함되어있는 **옵셔널한 addon** 입니다.

## Motivation

웹에서는 주로 서버에서 display 하기위해 데이터를 fetch 해와야합니다. 또한 주기적으로 update를 해야하고 서버에 데이터를 보내야합니다. 그리고 동기적으로 데이터를 클라이언트에 cached 합니다. 이러한 것들은 요즈음 웹에서 다른 동작들을 구현해야하기에 더욱 복잡해집니다.

- 로딩중인 UI를 보여주기 위해 loading state를 tracking 할 때.

- 같은 데이터에서 중복 요청을 피해야 할 때.

- 캐시 lifetime을 관리 할 때.

등등 🤥

하지만 Redux는 과거부터 한번도 이러한 문제를 완전히 해결하기 위해 어떠한 것도 한 적이 없습니다. 심지어 우리가 `createAsyncThunk` 를 `createSlice` 와 함께 사용할 때도, 우리가 해야할 것은 굉장히 많았습니다. async thunk를 만들어야 했고, 요청을 만들어야 했고, response에서 적절한 fields를 뽑아내야했고, 로딩 상태를 추가하고, `pending/fulfilled/rejected` 상태를 위해 `extraReducers`를 추가해야 했습니다.

지난 몇 년 동안 React 커뮤니티는 "데이터 가져오기 및 캐싱"이 "상태 관리"와 실제로는 다른 문제라는 것을 깨닫게 되었습니다.

그래서 RTK Query는 데이터 fetching에 선구자인 Apollo Client, React Query, Urql, and SWR로 부터 영감을 받았고, 독특한 Api 디자인을 추가했습니다.

- 데이터 가져오기 및 캐싱 로직은 Redux Toolkit의 createSlice 및 createAsyncThunk API를 기반으로 구축됩니다.

- API 엔드포인트는 인수에서 쿼리 매개변수를 생성하고 캐싱을 위해 응답을 변환하는 방법을 포함하여 미리 정의됩니다.

- 또한 전체 데이터를 fetching해오는 프로세스를 압축한 React hooks를 생성하고, data 및 isFetching fields를 제공하고, 구성 요소가 마운트 및 마운트 해제될 때 캐시된 데이터의 수명을 관리할 수 있습니다.

- RTK Query는 완전히 typeScript로 작성되었으며, 완벽한 TS 시용 경험을 제공합니다.

## What's included

### APIs

RTK Query는 `Redux Toolkit package` 에 내장되어 있습니다. 따라서 다음의 2가지 entry points에서 접근이 가능합니다.

```javascript
import { createApi } from "@reduxjs/toolkit/query"

import { createApi } from "@reduxjs/toolkit/query/react"
```

- createApi

RTK Query의 기능적 core 입니다. 이를 통해 해당 데이터를 가져오는 방법을 설명하는 endpoints를 정의할 수 있습니다. 대부분의 경우 "기본 URL당 하나의 API 슬라이스"를 사용하여 앱당 한 번 사용해야 합니다.

- fetchBaseQuery

fetchBaseQuery는 `axios` 와 같은 일반 라이브러리와 유사한 방식으로 request header 및 response를 자동으로 처리 하는 `fetch` 의 작은 wrapper 입니다. createApi 안에서 `baseQuery`를 사용하는 것을 추천합니다.

### Bundle Size

RTK Query는 Redux Toolkit 및 React-Redux를 기반으로 동작 하기 때문에 추가된 크기는 앱에서 이미 사용 중인지 여부에 따라 다릅니다. 예상되는 min+gzip 번들 크기는 다음과 같습니다.

- 이미 RTK 를 사용중인경우 : ~9kb for RTK Query and ~2kb for the hooks.

- 사용중이 아닌 경우 : With React: 19kB + React-Redux, which is a peer dependency

엔드포인트 정의를 추가하면 일반적으로 몇 바이트에 불과한 엔드포인트 정의 내부의 실제 코드를 기반으로 크기가 증가합니다.

## RTK Query caching에 대해

Redux는 항상 예측가능하고, 명시적인 행동을 강조했습니다. 'Magic' 은 없으며 앱은 항상 리듀서를 통해 액션을 디스패치하고 상태를 업데이트하는 동일한 기본 패턴을 따르기 때문입니다.

**Redux Toolkit core Api도 기본적인 Redux app 데이터 flow에서 변하지 않고** 사용자는 여전히 reducers를 작성하고 dispatching 합니다. 단 더 적은 코드로! **RTK Query 도 같은 방식입니다.**

❗️ 대신 `RTK Query`를 사용하면 사고 방식의 전환이 발생합니다. 우리는 더 이상 **상태 관리** 자체에 대해 생각하지 않습니다. 대신 **캐시된 ​​데이터 관리** 에 대해 생각합니다. 리듀서를 직접 작성하는 대신 "이 데이터의 출처는 어디인가요?", "이 업데이트를 어떻게 보내야 하나요?", "이 캐시된 데이터를 언제 다시 가져와야 하나요?", 및 "캐시된 ​​데이터를 어떻게 업데이트해야 하나요?". 데이터를 가져오고, 저장하고, 검색하는 방법은 더 이상 걱정할 필요가 없는 구현 세부 사항이 됩니다.

---

# RTK Query 설정

이제 RTK 쿼리를 사용하기 위해 모든 비동기 로직을 ​​마이그레이션해야 합니다. 진행하면서 RTK 쿼리의 모든 주요 기능을 사용하는 방법과 기존 `createAsyncThunk` 및 `createSlice` 사용을 마이그레이션하여 RTK 쿼리 API를 사용하는 방법을 살펴보겠습니다.

## Api Slice 정의하기

이전에는 게시물, 사용자 및 알림과 같은 다양한 데이터 유형 각각에 대해 별도의 **Slices**를 정의했습니다. 각 Slice애는 고유한 reducer가 있고 고유한 action과 thunk를 정의하고 해당 데이터 유형에 대한 항목을 별도로 캐시했습니다.

하지만 RTK Query 에서는 **캐시된 데이터를 관리하기 위한 logic이 애플리케이션당 단일 "API Slice"로 중앙 집중화됩니다.**

새 apiSlice.js 파일을 정의하는 것으로 시작하겠습니다. features/api/ 폴더를 추가하고 거기에 apiSlice.js를 넣습니다.

```javascript
// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "api",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: "/fakeApi" }),
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPosts: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => "/posts",
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetPostsQuery } = apiSlice
```

RTK Query는 `createApi` 라는 하나의 method에 기반합니다.
지금까지 본 모든 Redux Toolkit API는 UI에 구애받지 않으며 모든 UI 계층에서 사용할 수 있습니다. RTK 쿼리 핵심 로직은 동일합니다.
그러나 RTK 쿼리에는 createApi의 `React 전용 버전`도 포함되어 있으며 RTK와 React를 함께 사용하고 있으므로 RTK의 React 통합을 활용하려면 이를 사용해야 합니다. 따라서 `@reduxjs/toolkit/query/react`에서 구체적으로 가져옵니다.

🌟 애플리케이션에는 createApi 호출이 **하나만** 있어야 합니다. 이 하나의 API 슬라이스에는 동일한 기본 URL과 통신하는 모든 엔드포인트 정의가 포함되어야 합니다. 예를 들어 엔드포인트 /api/posts 및 /api/users는 모두 동일한 서버에서 데이터를 가져오므로 동일한 API 슬라이스로 이동합니다. 앱이 여러 서버에서 데이터를 가져오는 경우 각 끝점에서 전체 URL을 지정하거나 필요한 경우 각 서버에 대해 별도의 API 조각을 만들 수 있습니다.

여러 파일 간에 엔드포인트를 분할하려는 경우 문서의 8부 섹션에서 'Injecting Endpoints' 섹션을 참조하세요!

#### Injecting Endpoints

더 큰 애플리케이션은 기능을 별도의 번들로 "code-split" 하는 것이 일반적입니다. RTK 쿼리에는 일반적으로 애플리케이션당 하나의 "API Slice"가 있으며 지금까지 apiSlice.js에서 직접 모든 엔드포인트를 정의했습니다. 엔드포인트 정의 중 일부를 코드 분할하거나 API Slice 파일이 너무 커지지 않도록 다른 파일로 이동하려는 경우 어떻게 해야 할까요?

```javascript
import { apiSlice } from "../api/apiSlice"

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => "/users",
    }),
  }),
})

export const { useGetUsersQuery } = extendedApiSlice
```

### Api Slice Parameters

우리가 `createApi`를 호출할 때 필수 값으로 2가지가 있습니다.

- baseQuery(필수) : 서버에서 데이터를 가져오는 방법을 알고 있는 함수입니다. RTK 쿼리에는 `fetchBaseQuery`가 포함되어 있습니다. 이는 요청 및 응답의 일반적인 처리를 처리하는 표준 fetch() 함수 주변의 작은 wrapper 입니다. fetchBaseQuery 인스턴스를 만들 때 모든 향후 요청의 기본 URL을 전달할 수 있을 뿐만 아니라 요청 헤더 수정과 같은 동작을 재정의할 수 있습니다.

- endpoints(필수)

- reducerPath(옵션) : createApi는 또한 reducerPath 필드를 허용합니다. 만약 reducerPath를 옵션으로 넣지 않는다면, `api` 라는 이름이 기본으로 되며, state.api로 접근이 가능합니다. 하지만 옵션을 넣는 경우, postsSlice와 같은 다른 슬라이스의 경우 state.posts 로 접근이 가능합니다.

### Endpoints 정의하기

기본적으로 query endpoints는 `GET` HTTP request를 사용합니다, 하지만 URL 문자열 자체 대신 `{url: '/posts', method: 'POST', body: newPost}` 와 같은 객체를 반환하여 이를 재정의할 수 있습니다. 헤더 설정과 같은 이 방법으로 요청에 대한 몇 가지 다른 옵션을 정의할 수도 있습니다.

**RTK Query는 우리가 정의한 모든 엔드포인트에 대해 React hooks를 자동으로 생성합니다!** 이러한 hooks는 구성 요소가 마운트될 때 요청을 트리거하고 요청이 처리되고 데이터를 사용할 수 있을 때 구성 요소를 다시 렌더링하는 프로세스를 `encapsulate`합니다. React 구성 요소에서 사용하기 위해 이 API 슬라이스 파일에서 해당 hooks를 export 할 수 있습니다.

## Store 설정하기

```javascript
import postsReducer from "../features/posts/postsSlice"
import usersReducer from "../features/users/usersSlice"
import notificationsReducer from "../features/notifications/notificationsSlice"
import { apiSlice } from "../features/api/apiSlice"

export default configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
```

---

# Queries로 목록 displaying 해보기

```javascript
import React from "react"
import { Link } from "react-router-dom"

import { Spinner } from "../../components/Spinner"
import { PostAuthor } from "./PostAuthor"
import { TimeAgo } from "./TimeAgo"
import { ReactionButtons } from "./ReactionButtons"

import { useGetPostsQuery } from "../api/apiSlice"

let PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery()

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = posts.map(post => <PostExcerpt key={post.id} post={post} />)
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
```

현재 `<PostList>`는 posts data를 읽고 로딩 상태를 가져오기 위해 `useSelector`, `useDispatch`, `useEffect` 를 가지고 옵니다. **하지만 useGetPostsQuery는 모든 것을 대체할 수 있습니다!**

## posts 정렬하기

```javascript
// omit setup

export const PostsList = () => {
  const {
    🌟 data: posts = [],
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsQuery()

  🌟 const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    // Sort posts in descending chronological order
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    🌟 content = sortedPosts.map(post => <PostExcerpt key={post.id} post={post} />)
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
```

## Query에 Parameter 넣기

```javascript
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts'
    }),
    🌟 getPost: builder.query({
      query: postId => `/posts/${postId}`
    })
  })
})

export const { useGetPostsQuery, useGetPostQuery } = apiSlice
```

```javascript
import React from 'react'
import { Link } from 'react-router-dom'

🌟 import { Spinner } from '../../components/Spinner'
🌟 import { useGetPostQuery } from '../api/apiSlice'

import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  🌟 const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

  let content
  🌟 if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    )
  }

  return <section>{content}</section>
}
```

## 컴포넌트에서 간단한 Query Hook 사용해보기

```javascript
export const PostDetail = ({ id }: { id: string }) => {
  const {
    data: post,
    isFetching,
    isLoading,
  } = useGetPostQuery(id, {
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    skip: false,
  })

  if (isLoading) return <div>Loading...</div>
  if (!post) return <div>Missing post!</div>

  return (
    <div>
      {post.name} {isFetching ? "...refetching" : ""}
    </div>
  )
}
```

---

# Mutations

mutation endpoint는 query endpoint 와 굉장히 유사합니다. 가장 큰 차이점은 `builder.query()` 대신에 `builder.mutation()`을 사용합니다. 그리고 HTTP method을 `POST` 로 바꿔야 하고 `body`를 제공합니다.

```javascript
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/fakeApi" }),
  endpoints: builder => ({
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: "/posts",
        method: "POST",
        // Include the entire post object as the body of the request
        body: initialPost,
      }),
    }),
  }),
})

export const { useAddNewPostMutation } = apiSlice
```

##  컴포넌트에서 mutation hook 사용하기

```javascript
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { Spinner } from '../../components/Spinner'
import { useAddNewPostMutation } from '../api/apiSlice'
import { selectAllUsers } from '../users/usersSlice'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  🌟 const [addNewPost, { isLoading }] = useAddNewPostMutation()
  const users = useSelector(selectAllUsers)

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setUserId(e.target.value)

  🌟 const canSave = [title, content, userId].every(Boolean) && !isLoading

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        🌟 await addNewPost({ title, content, user: userId }).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      }
    }
  }

  // omit rendering logic
}
```

mutation hooks는 2가지를 return 합니다.

- 첫번째 값은 `trigger function` 입니다. 이게 호출되면 서버로 request를 전송합니다.

- 두 번째 값은 현재 진행 중인 요청에 대한 메타데이터가 있는 객체입니다(있는 경우). 여기에는 요청이 진행 중인지 여부를 나타내는 isLoading 플래그가 포함됩니다.

❗️ 기존 thunk 디스패치 및 구성 요소 로드 상태를 useAddNewPostMutation hooks의 트리거 함수 및 isLoading 플래그로 바꿀 수 있으며 나머지 구성 요소는 동일하게 유지됩니다.

addNewPost를 호출할 때 이것은 `.unwrap`라는 특별한 Promise를 반환하고 ry/catch 블록으로 잠재적인 오류를 처리하기 위해 addNewPost().unwrap()을 기다릴 수 있습니다.

## 자동 refreshing.

사용자가 수동으로 클릭하여 데이터를 다시 가져오게 하는 것이 때때로 필요하지만 일반적인 사용에는 확실히 좋은 솔루션이 아닙니다.

우리는 "서버"에 방금 추가한 게시물을 포함하여 모든 게시물의 전체 목록이 있다는 것을 알고 있습니다. 이상적으로는 변형 요청이 완료되는 즉시 앱이 업데이트된 게시물 목록을 자동으로 다시 가져오도록 하고 싶습니다. 그렇게 하면 클라이언트 측 캐시 데이터가 서버에 있는 데이터와 동기화된다는 것을 알 수 있습니다.

**RTK 쿼리를 사용하면 "tags"를 사용하여 자동으로 데이터 refetching을 활성화하기 위해 query와 mutations 간의 관계를 정의할 수 있습니다.**

"tags"는 특정 유형의 데이터에 이름을 지정하고 캐시의 일부를 무효화할 수 있는 string 또는 object 입니다. 캐시 tag가 invalidated 되면 RTK 쿼리는 tag가 표시된 endpoint를 자동으로 refetch 합니다.

```javascript
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),

  🌟 tagTypes: ['Post'],

  endpoints: builder => ({

    getPosts: builder.query({
      query: () => '/posts',
      🌟 providesTags: ['Post']
    }),

    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        body: initialPost
      }),
      🌟 invalidatesTags: ['Post']
    })
  })
})
```
