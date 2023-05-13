---
title: "React Router V6 제대로 알기"
date: "2023-05-14"
description: "React Router의 모든 내용을 공부합니다."
keywords: [react, javascript, 자바스크립트, react router]
---

## 들어가며

Next.js에서는 pages 폴더 기반의 라우팅을 기본으로 제공하며, dynamic route 등 편리한 기능이 많습니다.

Next.js만 계속 사용하다보니 React Router에 대해 어느순간 많이 잊어버렸다는 생각이 들었습니다.

그래서 이번 기회에 React Router에 대해 제대로 알아보고자 합니다.

## Feature Overview

### Client Side Routing

React Router는 "client side routing"을 가능하게 합니다.

기존 웹 사이트에서 브라우저는 웹 서버에서 문서를 요청하고 CSS 및 JavaScript assets을 다운로드 및 평가하고 서버에서 보낸 HTML을 렌더링합니다.

사용자가 링크를 클릭하면 새 페이지에 대한 프로세스가 다시 시작됩니다.

Client side routing을 통해 앱은 서버에서 다른 문서를 다시 요청하지 않고 링크 클릭에서 URL을 업데이트할 수 있습니다. 대신 앱은 새로운 UI를 즉시 렌더링하고 fetch를 통해 데이터를 요청하여 페이지를 새로운 정보로 업데이트할 수 있습니다.

이는 브라우저가 완전히 새로운 문서를 요청하거나 다음 페이지를 위해 CSS 및 JavaScript 자산을 재평가할 필요가 없기 때문에 더 빠른 사용자 경험을 가능하게 합니다. 또한 애니메이션과 같은 것으로 보다 동적인 사용자 경험을 가능하게 합니다.

Router를 생성하고 Link 및 \<Form>을 사용하여 페이지에 링크/제출하면 클라이언트 측 라우팅이 활성화됩니다.

```js
import React from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="about">About Us</Link>
      </div>
    ),
  },
  {
    path: "about",
    element: <div>About</div>,
  },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
```

### Nested Routes

중첩 라우팅은 URL의 세그먼트를 컴포넌트 계층 및 데이터에 연결하는 일반적인 개념입니다. React Router의 중첩된 경로는 2014년경 Ember.js의 라우팅 시스템에서 영감을 받았습니다. Ember 팀은 거의 모든 경우에 URL의 세그먼트가 다음을 결정한다는 것을 깨달았습니다.

- 페이지에서 렌더링할 레이아웃

- 해당 레이아웃의 데이터 dependencies

React Router는 URL 세그먼트 및 데이터에 결합된 중첩 레이아웃을 생성하기 위해 API를 사용하여 이 규칙을 수용합니다.

```js
// Configure nested routes with JSX
createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="contact" element={<Contact />} />
      <Route
        path="dashboard"
        element={<Dashboard />}
        loader={({ request }) =>
          fetch("/api/dashboard.json", {
            signal: request.signal,
          })
        }
      />
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} loader={redirectIfUser} />
        <Route path="logout" />
      </Route>
    </Route>
  )
)

// Or use plain objects
createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: ({ request }) =>
          fetch("/api/dashboard.json", {
            signal: request.signal,
          }),
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
            loader: redirectIfUser,
          },
          {
            path: "logout",
            action: logoutUser,
          },
        ],
      },
    ],
  },
])
```

### Dynamic Segments

URL의 세그먼트는 구문 분석되어 다양한 API에 제공되는 동적 placeholders일 수 있습니다.

```js
<Route path="projects/:projectId/tasks/:taskId" />
```

```js
// If the current location is /projects/abc/tasks/3
;<Route
  // sent to loaders
  loader={({ params }) => {
    params.projectId // abc
    params.taskId // 3
  }}
  // and actions
  action={({ params }) => {
    params.projectId // abc
    params.taskId // 3
  }}
  element={<Task />}
/>

function Task() {
  // returned from `useParams`
  const params = useParams()
  params.projectId // abc
  params.taskId // 3
}

function Random() {
  const match = useMatch("/projects/:projectId/tasks/:taskId")
  match.params.projectId // abc
  match.params.taskId // 3
}
```

### Ranked Route Matching

URL을 경로와 matching시킬 때 React Router는 세그먼트, 정적 세그먼트, 동적 세그먼트, 스플랫 등의 수에 따라 경로의 순위를 매기고 가장 구체적인 일치를 선택합니다.

예를 들어 다음 두 경로를 고려하십시오.

```js
<Route path="/teams/:teamId" />
<Route path="/teams/new" />
```

이제 URL이 http://example.com/teams/new라고 가정합니다.

두 경로가 기술적으로 URL과 일치하더라도(new는 :teamId일 수 있음) 두 번째 경로(/teams/new)를 선택해야 한다는 것을 직관적으로 알 수 있습니다.
React Router의 매칭 알고리즘도 이를 알고 있습니다.

순위 경로를 사용하면 경로 순서에 대해 걱정할 필요가 없습니다.

### Active Links

대부분의 웹 앱에는 UI 상단, 사이드바 및 종종 여러 수준에 지속적인 navigation sections이 있습니다.

active navigation items의 스타일을 지정하여 사용자가 앱에서 현재 위치(isActive) 또는 이동 위치(isPending)를 알 수 있도록 \<NavLink>를 사용하면 쉽게 수행할 수 있습니다.

```js
<NavLink
  style={({ isActive, isPending }) => {
    return {
      color: isActive ? "red" : "inherit",
    }
  }}
  className={({ isActive, isPending }) => {
    return isActive ? "active" : isPending ? "pending" : ""
  }}
/>
```

### Relative Links

HTML \<a href>와 마찬가지로 \<Link to> 및 \<NavLink to>는 중첩된 경로로 상대 경로를 사용할 수 있습니다.

다음 route config가 주어집니다.

```js
<Route path="home" element={<Home />}>
  <Route path="project/:projectId" element={<Project />}>
    <Route path=":taskId" element={<Task />} />
  </Route>
</Route>
```

다음 URL https://example.com/home/project/123을 생각해보세요.

```js
<Home>
  <Project />
</Home>
```

\<Project />가 다음 링크를 렌더링하면 링크의 href가 다음과 같이 해석됩니다.

| In \<Project> /home/project/123 | Resolved <a href>     |
| ------------------------------- | --------------------- |
| \<Link to="abc">                | /home/project/123/abc |
| \<Link to=".">                  | /home/project/123     |
| \<Link to="..">                 | /home                 |
| \<Link to=".." relative="path"> | /home/project         |

### Data Loading

URL 세그먼트는 일반적으로 앱의 영구 데이터에 매핑되기 때문에 React Router는 탐색 중에 data load를 시작하기 위해 data load hook을 제공합니다.

중첩 경로와 결합하여 특정 URL의 여러 레이아웃에 대한 모든 데이터를 병렬로 로드할 수 있습니다.

```js
<Route
  path="/"
  loader={async ({ request }) => {
    // loaders can be async functions
    const res = await fetch("/api/user.json", {
      signal: request.signal,
    })
    const user = await res.json()
    return user
  }}
  element={<Root />}
>
  <Route
    path=":teamId"
    // loaders understand Fetch Responses and will automatically
    // unwrap the res.json(), so you can simply return a fetch
    loader={({ params }) => {
      return fetch(`/api/teams/${params.teamId}`)
    }}
    element={<Team />}
  >
    <Route
      path=":gameId"
      loader={({ params }) => {
        // of course you can use any data store
        return fakeSdk.getTeam(params.gameId)
      }}
      element={<Game />}
    />
  </Route>
</Route>
```

useLoaderData를 통해 컴포넌트에서 데이터를 사용할 수 있습니다.

```js
function Root() {
  const user = useLoaderData()
  // data from <Route path="/">
}

function Team() {
  const team = useLoaderData()
  // data from <Route path=":teamId">
}

function Game() {
  const game = useLoaderData()
  // data from <Route path=":gameId">
}
```

### Redirects

데이터를 load하거나 변경하는 동안 사용자를 다른 경로로 리디렉션하는 것이 일반적입니다.

✅ 일반적으로 useNavigate 보다 loaders 및 actions에서 redirect를 사용하는 것이 좋습니다.

```js
<Route
  path="dashboard"
  loader={async () => {
    const user = await fake.getUser()
    if (!user) {
      // if you know you can't render the route, you can
      // throw a redirect to stop executing code here,
      // sending the user to a new route
      throw redirect("/login")
    }

    // otherwise continue
    const stats = await fake.getDashboardStats()
    return { user, stats }
  }}
/>
```

### Pending Navigation UI

사용자가 앱을 탐색하면 페이지가 렌더링되기 전에 다음 페이지의 데이터가 로드됩니다.

앱이 응답하지 않는 것처럼 느껴지지 않도록 이 시간 동안 사용자 피드백을 제공하는 것이 중요합니다.

```js
function Root() {
  const navigation = useNavigation()
  return (
    <div>
      {navigation.state === "loading" && <GlobalSpinner />}
      <FakeSidebar />
      <Outlet />
      <FakeFooter />
    </div>
  )
}
```

### Skeleton UI with \<Suspense>

다음 페이지의 데이터를 기다리는 대신 데이터를 load하는 동안 placeholder UI가 있는 다음 화면으로 UI가 즉시 넘어가도록 데이터를 연기할 수 있습니다.

defer는 promise가 아닌 요소들이 promise 인 요소들이 전부 처리될 때까지 기다리게 해줍니다.

React 18버전에서의 \<Suspense>를 통해 응답이 올 때까지 기다리고 요소를 처리할 수 있습니다.

```js
;<Route
  path="issue/:issueId"
  element={<Issue />}
  loader={async ({ params }) => {
    // these are promises, but *not* awaited
    const comments = fake.getIssueComments(params.issueId)
    const history = fake.getIssueHistory(params.issueId)
    // the issue, however, *is* awaited
    const issue = await fake.getIssue(params.issueId)

    // defer enables suspense for the un-awaited promises
    return defer({ issue, comments, history })
  }}
/>

function Issue() {
  const { issue, history, comments } = useLoaderData()
  return (
    <div>
      <IssueDescription issue={issue} />

      {/* Suspense provides the placeholder fallback */}
      <Suspense fallback={<IssueHistorySkeleton />}>
        {/* Await manages the deferred data (promise) */}
        <Await resolve={history}>
          {/* this calls back when the data is resolved */}
          {resolvedHistory => <IssueHistory history={resolvedHistory} />}
        </Await>
      </Suspense>

      <Suspense fallback={<IssueCommentsSkeleton />}>
        <Await resolve={comments}>
          {/* ... or you can use hooks to access the data */}
          <IssueComments />
        </Await>
      </Suspense>
    </div>
  )
}

function IssueComments() {
  const comments = useAsyncValue()
  return <div>{/* ... */}</div>
}
```

### Data Mutations

HTML from은 link와 마찬가지로 navigation events입니다.

React Router는 클라이언트 측 라우팅을 통해 HTML From 워크플로우를 지원합니다.

Form이 제출되면 일반 브라우저 navigation event가 방지되고 제출의 FormData가 포함된 본문이 포함된 요청이 생성됩니다.

이 요청은 Form의 \<Form action>과 일치하는 \<Route action>으로 전송됩니다.

Form 요소의 name props가 action에 제출됩니다.

```js
<Form action="/project/new">
  <label>
    Project title
    <br />
    <input type="text" name="title" />
  </label>

  <label>
    Target Finish Date
    <br />
    <input type="date" name="due" />
  </label>
</Form>
```

### Busy Indicators (useNavigation)

라우팅 작업을 위해 Form을 제출할 때 navigation 상태에 액세스하여 busy indicators를 표시하고 fieldsets를 비활성화하는 등의 작업을 수행할 수 있습니다.

```js
function NewProjectForm() {
  const navigation = useNavigation()
  const busy = navigation.state === "submitting"
  return (
    <Form action="/project/new">
      <fieldset disabled={busy}>
        <label>
          Project title
          <br />
          <input type="text" name="title" />
        </label>

        <label>
          Target Finish Date
          <br />
          <input type="date" name="due" />
        </label>
      </fieldset>
      <button type="submit" disabled={busy}>
        {busy ? "Creating..." : "Create"}
      </button>
    </Form>
  )
}
```
