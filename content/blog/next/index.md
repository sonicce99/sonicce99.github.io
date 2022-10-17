---
title: "Next.js 공식문서 뿌시기🗿"
date: "2022-10-14"
description: "Next.js 공식문서를 읽고 내용을 정리합니다."
---

## Get Started

Next.js 공식문서에 오신것을 환영합니다!

만약 여러분이 Next.js에 처음이라면, [learn-course](https://nextjs.org/learn/basics/create-nextjs-app) 에서 시작하는 것을 추천합니다.

#### 시스템 요구사항

- 12.22.0 / 이후 Node.js

- MacOS, Windows (WSL 포함), 그리고 Linux을 지원합니다.

### Automatic Setup

`create-next-app` 을 사용하는 것을 추천합니다. 이 명령어는 모든 설정을 자동으로 설정해줍니다.

```bash
npx create-next-app@latest
# or
yarn create next-app
# or
pnpm create next-app
```

타입스크립트를 원하시면 아래 명령어를 입력하세요.

```bash
npx create-next-app@latest --typescript
# or
yarn create next-app --typescript
# or
pnpm create next-app --typescript
```

### Manual Setup

`next`, `react`, `react-dom` 을 설치하세요.

```bash
npm install next react react-dom
# or
yarn add next react react-dom
# or
pnpm add next react react-dom

```

package.json에 아래 scripts를 추가하세요.

```javascript
"scripts": {
  "dev": "next dev",  // Next.js 개발 모드 시작.
  "build": "next build", // Next.js 상용 모드 시작.
  "start": "next start", // Next.js 상용 서버 시작.
  "lint": "next lint" // Next.js 내장 ESLint config 셋업.
}
```

`pages` 와 `public` 폴더를 root에 생성하세요.

- pages : 파일명에 따라 route가 연결됩니다. ex) pages/about.js -> /about

- public : 이미지, 폰트 와 같은 정적 assets를 저장합니다. public 폴더 안에 있는 파일들은 / 로 바로 참조할 수 있습니다.

🌟 Next.js는 pages 컨셉을 기반으로 제작되었습니다. 하나의 page는 React Component이며 `.js`, `.jsx`, `.ts`, `.tsx` 확장자를 가지고 있습니다. 그리고 심지어 파일명을 동적으로 할당할 수 있습니다.

---

## Basic Features

### Pages

#### Pre-rendering

기본적으로 Next.js는 매 페이지를 `pre-renders` 합니다. 즉 Next.js는 클라이언트 측 JavaScript에서 모든 작업을 수행하는 대신 각 페이지에 대해 미리 HTML을 생성합니다. Pre-rendering은 더 나은 성능과 SEO를 가져올 수 있습니다.

생성된 각 HTML은 해당 페이지에 필요한 최소한의 JavaScript 코드와 연결됩니다. 브라우저에서 페이지를 로드하면 해당 JavaScript 코드가 실행되어 페이지를 `fully interactive`하게 만듭니다. (이 과정을 `hydration` 라고 합니다.)

#### Two forms of Pre-rendering

Next.js에는 두 가지 형태의 Pre-rendering이 있습니다.

- Static Generation (추천): HTML은 빌드 시 생성되며 each request 마다 재사용됩니다.

- Server-side Rendering: HTML이 each request 마다 생성됩니다.

🌟 Next.js는 각 페이지에 사용할 Pre-rendering 형태를 고를 수 있게 해줍니다. 대부분의 페이지에는 `Static Generation`을 사용하고 다른 페이지에는 `Server-side Rendering`을 사용하여 "hybrid" Next.js 앱을 만들 수 있습니다.

Next.js에서는 데이터가 있거나 없는 페이지를 정적으로 생성할 수 있습니다. 각각의 경우를 살펴보겠습니다.

##### 데이터가 없는 Static Generation

```javascript
function About() {
  return <div>About</div>
}

export default About
```

위 페이지는 미리 렌더링할 외부 데이터를 가져올 필요가 없습니다. 이와 같은 경우 Next.js는 빌드 시 페이지당 하나의 HTML 파일을 생성합니다.

##### Data가 존재할 때 Static Generation

일부 페이지는 Pre-rendering을 위해 외부 데이터를 가져와야 합니다. 두 가지 시나리오가 있으며 하나 또는 둘 다 적용될 수 있습니다. 각각의 경우에 Next.js가 제공하는 다음 기능을 사용할 수 있습니다.

- getStaticProps: 페이지의 `내용`이 외부 데이터에 따라 다른 경우.

- getStaticPaths: 페이지의 `경로`가 외부 데이터에 따라 다른 경우.

ex) 블로그의 내용을 fetch해서 보여줘야 할 경우. (getStaticProps)

> getStaticProps는 빌드 시 호출되며 Pre-Rendering 시 가져온 데이터를 페이지의 props로 전달할 수 있습니다.

```javascript
function Blog({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch("https://.../posts")
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}

export default Blog
```

ex) 블로그의 경로 (`/[id]`)을 fetch해서 id에 따른 다른 경로와 posts를 보여줘야 할 경우. (getStaticPaths)

> getStaticProps는 빌드 시 호출되며 Pre-Rendering 시 가져온 데이터를 페이지의 props로 전달할 수 있습니다.

```javascript
function Blog({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch("https://.../posts")
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map(post => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
}

export default Blog
```

##### Server-side Rendering

페이지에서 Server-side Rendering을 사용하는 경우 HTML 페이지는 each request 마다 생성됩니다.

Server-side Rendering을 사용하려면 `getServerSideProps` 라는 비동기 함수를 export 해야합니다. 이 함수는 모든 요청에 ​​대해 서버에서 호출됩니다.

예를 들어 페이지에서 자주 업데이트되는 데이터(외부 API에서 가져옴)를 Pre-Rendering 해야 한다고 가정합니다. 이 데이터를 가져와 다음과 같이 Page에 전달하는 getServerSideProps를 작성할 수 있습니다.

```javascript
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
```

`getServerSideProps`와 `getStaticProps`는 유사하지만 차이점은 getServerSideProps가 build time이 아니라 every request에 ​​대해 실행된다는 점입니다.

---

### Data Fetching

#### getServerSideProps

페이지에서 getServerSideProps라는 함수를 내보내면 Next.js는 getServerSideProps에서 반환된 데이터를 사용하여 해당 페이지를 Pre-Rendering 합니다.

❗️ SSG, SSR에 관계없이 모든 props는 페이지 구성 요소로 전달되고 초기 HTML의 클라이언트 측에서 볼 수 있습니다. 이것은 페이지가 적절하게 hydrated 되도록 하기 위한 것입니다. props에서 클라이언트에서 사용할 수 없어야 하는 민감한 정보를 전달하지 않도록 합니다.

##### 언제 getServerSideProps가 동작하나요?

getServerSideProps는 서버 측에서만 실행되며 브라우저에서는 실행되지 않습니다.

getServerSideProps는 page에서만 내보낼 수 있습니다. non-page files 에서는 내보낼 수 없습니다.

getServerSideProps를 독립적인 함수로 내보내야 합니다. getServerSideProps를 페이지 구성 요소의 property로 추가하면 동작하지 않습니다.

##### 언제 getServerSideProps를 사용해야 하나요?

매번 요청 할 때마다 데이터를 fetch 해야 할 경우에 getServerSideProps를 사용해야 합니다.

getServerSideProps를 사용하는 page는 매번 요청시에 서버측에서 rendering 되고 `cache-control headers`가 존재하는 경우에만 cached 됩니다.

#### getStaticPaths

만약 page에 Dynamic Routes가 있고 getStaticProps를 사용하는 경우 정적으로 생성할 경로 목록을 정의해야 합니다. 왜냐하면 Next.js는 getStaticPaths에 의해 지정된 모든 경로를 정적으로 Pre-Renering 하기 때문 입니다.

```javascript
// pages/posts/[id].js

// Generates `/posts/1` and `/posts/2`
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    fallback: false, // can also be true or 'blocking'
  }
}
```

##### 언제 getStaticPaths를 사용해야 하나요?

dynamic routes를 사용하고 statically Pre-Rendering 하고 있다면 사용해야 합니다.

##### 언제 getStaticPaths가 동작하나요?

getStaticPaths는 production 환경에서 build하는 동안에만 실행되며 런타임에는 호출되지 않습니다.
즉 getStaticPaths 내부에 작성된 코드가 클라이언트 측 번들에서는 볼 수 없습니다.

##### 어디서 getStaticPaths를 사용할 수 있나요?

- getStaticPaths는 **반드시** getStaticProps와 같이 사용되어야합니다.

- getStaticPaths는 getServerSideProps와 같이 사용할 수 없습니다.

- getStaticPaths는 none-page file 에서는 사용할 수 없습니다.

❗️ 개발모드에서 getStaticPaths는 모든 요청 마다 호출 됩니다.

#### getStaticProps

getStaticProps를 내보내면 Next.js는 getStaticProps에서 반환된 props를 사용하여 빌드 시 이 페이지를 Pre-Rendering 합니다.

```javascript
export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
```

모든 props는 페이지 구성 요소로 전달되고 초기 HTML의 클라이언트 측에서 볼 수 있습니다. 이것은 페이지가 적절하게 hydrated 되기 위한 것입니다.
❗️ props에서 클라이언트가 사용할 수 없어야 하는 민감한 정보를 전달하지 않도록 합니다.

##### 언제 getStaticProps가 동작하나요?

getStaticProps는 항상 서버에서 실행되고 클라이언트에서는 실행되지 않습니다.

- 항상 `next build` 중에 실행됩니다.

- fallback: true, revalidate을 사용할 때 background에서 실행됩니다.

- 최초 렌더링 전 fallback: blocking을 사용하면 실행됩니다.

##### server-side code 바로 사용하기

getStaticProps는 서버 측에서만 실행되므로 클라이언트 측에서는 실행되지 않습니다. 브라우저용 JS 번들에도 포함되지 않으므로 브라우저로 보내지 않고 직접 데이터베이스 쿼리를 작성할 수 있습니다.

```javascript
// lib/load-posts.js

// The following function is shared
// with getStaticProps and API routes
// from a `lib/` directory
export async function loadPosts() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts/')
  const data = await res.json()

  return data
}

// pages/blog.js
import { loadPosts } from '../lib/load-posts'

// This function runs only on the server side
export async function getStaticProps() {
  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`
  🌟 const posts = await loadPosts()

  // Props returned will be passed to the page component
  return { props: { posts } }
}
```

##### HTML와 JSON을 모두 정적 생성 합니다.

getStaticProps가 있는 페이지가 빌드 시 Pre-Rendering 되면 HTML 파일 외에도 Next.js가 getStaticProps 실행 결과를 포함하는 JSON 파일을 생성합니다.

이 JSON 파일은 next/link 또는 next/router를 통한 클라이언트 측 라우팅에 사용됩니다. getStaticProps를 사용하여 Pre-Rendering 된 페이지로 이동하면 Next.js는 이 JSON 파일(빌드 시 미리 계산됨)을 가져와 페이지 구성 요소의 소품으로 사용합니다. 즉, 내보낸 JSON만 사용되므로 클라이언트 측 페이지 전환이 getStaticProps를 호출하지 않습니다.

##### 어디서 getStaticProps를 사용할 수 있나요?

getStaticProps는 page에서만 내보낼 수 있습니다. 페이지가 아닌 파일, \_app, \_document 또는 \_error에서는 내보낼 수 없습니다.

❗️ 개발모드에서 getStaticProps는 모든 요청 마다 호출 됩니다.

#### Incremental Static Regeneration

Next.js를 사용하면 사이트를 build한 후 정적 페이지를 만들거나 업데이트할 수 있습니다. ISR을 사용하면 전체 사이트를 다시 빌드할 필요 없이 페이지별로 정적 생성할 수 있습니다. ISR을 사용하면 수백만 페이지로 확장하면서 정적의 이점을 유지할 수 있습니다.

```javascript
function Blog({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch("https://.../posts")
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const res = await fetch("https://.../posts")
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map(post => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" }
}

export default Blog
```

Pre-Rendering된 페이지에 대한 요청이 이루어지면 처음에는 캐시된 페이지가 표시됩니다.

- 초기 요청 후 10초 전에 페이지에 대한 모든 요청도 여전히 캐시됩니다.

- 10초 후 다음 요청은 여전히 ​​캐시된(stale) 페이지를 표시합니다.

- Next.js는 백그라운드에서 페이지 regeneration을 트리거합니다.

- 페이지가 성공적으로 생성되면 Next.js는 캐시를 무효화하고 업데이트된 페이지를 표시합니다. 백그라운드 regeneration이 실패하면 이전 페이지는 여전히 변경되지 않습니다.

자세한 내용은 [여기](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) 를 참조하세요.

#### Client-side data fetching

Client-side data fetching SEO가 필요하지 않거나 데이터를 Pre-Rendering 할 필요가 없거나 페이지 콘텐츠를 자주 업데이트해야 할 때 유용합니다.

page level에서 수행하면 런타임에 데이터를 가져오고 데이터가 변경되면 페이지 내용이 업데이트됩니다. 컴포넌트 level에서 사용하는 경우 컴포넌트 마운트 시 데이터를 가져오고 데이터가 변경되면 컴포넌트의 내용이 업데이트됩니다.

client-side data fetching을 사용하면 애플리케이션의 성능과 페이지의 로드 속도에 영향을 미칠 수 있다는 점에 유의해야 합니다. 이는 컴포넌트나 페이지가 마운트되는 시점에 데이터 페칭이 이루어지고 데이터가 캐싱되지 않기 때문이다.

```javascript
function Profile() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch("/api/profile-data")
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  )
}
```

---

### Built-In CSS Support
