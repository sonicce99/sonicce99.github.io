---
title: "Next.js 공식문서 뿌시기🗿 (till 12 version)"
date: "2022-11-01"
description: "Next.js 공식문서를 읽고 내용을 정리합니다."
keywords: [react, 자바스크립트, Next.js, javascript, 공식문서, tutorial]
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

❗️ SSG, SSR에 관계없이 모든 props는 Component로 전달되고 초기 HTML의 클라이언트 측에서 볼 수 있습니다. 이것은 페이지가 적절하게 hydrated 되도록 하기 위한 것입니다. props에서 클라이언트에서 사용할 수 없어야 하는 민감한 정보를 전달하지 않도록 합니다.

##### 언제 getServerSideProps가 동작하나요?

getServerSideProps는 서버 측에서만 실행되며 브라우저에서는 실행되지 않습니다.

getServerSideProps는 page에서만 내보낼 수 있습니다. non-page files 에서는 내보낼 수 없습니다.

getServerSideProps를 독립적인 함수로 내보내야 합니다. getServerSideProps를 Component의 property로 추가하면 동작하지 않습니다.

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

모든 props는 Component로 전달되고 초기 HTML의 클라이언트 측에서 볼 수 있습니다. 이것은 페이지가 적절하게 hydrated 되기 위한 것입니다.
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

이 JSON 파일은 next/link 또는 next/router를 통한 클라이언트 측 라우팅에 사용됩니다. getStaticProps를 사용하여 Pre-Rendering 된 페이지로 이동하면 Next.js는 이 JSON 파일(빌드 시 미리 계산됨)을 가져와 Component의 props으로 사용합니다. 즉, 내보낸 JSON만 사용되므로 클라이언트 측 페이지 전환이 getStaticProps를 호출하지 않습니다.

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

Next.js를 사용하면 JavaScript 파일에서 CSS 파일을 가져올 수 있습니다.

#### Global Stylesheet 추가하기

전역 스타일을 주고 싶다면 `pages/_app.js` 에 CSS 파일을 import 하세요.

```css
 {
  /* styles.css */
}

body {
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", "Helvetica",
    "Arial", sans-serif;
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

```javascript
{
  /* pages/_app.js */
}

import "../styles.css"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

이러한 스타일은 애플리케이션의 모든 Component에 적용됩니다. 스타일시트의 글로벌 특성으로 인해 충돌을 피하기 위해 pages/\_app.js 내에서만 가져올 수 있습니다.

❗️ production 모드에서, 모든 CSS 파일은 자동으로 하나의 단일 .css 파일로 작성됩니다.

##### node_modules에서 스타일 import 하기

Next.js 9.5.4부터 node_modules에서 CSS 파일을 가져올 수 있습니다.

```javascript
// pages/_app.js
import "bootstrap/dist/css/bootstrap.css"

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

#### Component-Level CSS 추가하기

Next.js는 `[name].module.css` 파일명 convention을 사용하여 CSS 모듈을 지원합니다.

CSS module은 unique한 class 이름을 자동으로 생성하여 로컬에서 CSS 범위를 지정합니다. 이를 통해 충돌에 대한 걱정 없이 다른 파일에서 동일한 CSS class 이름을 사용할 수 있습니다.

```css
/*
다른 `.css` or `.module.css` 파일과 .error {}가 출돌할 걱정을 할 필요 없습니다.
*/
.error {
  color: white;
  background-color: red;
}
```

```javascript
import styles from "./Button.module.css"

export function Button() {
  return (
    <button
      type="button"
      // Note how the "error" class is accessed as a property on the imported
      // `styles` object.
      className={styles.error}
    >
      Destroy
    </button>
  )
}
```

CSS 모듈은 선택적 기능이며 확장자가 .module.css인 파일에만 사용할 수 있습니다. 일반 `<link>` 스타일시트와 global CSS 파일은 계속 지원됩니다.

production에서 모든 CSS 모듈 파일은 자동으로 여러 축소 및 코드 분할 .css 파일로 연결됩니다. 이러한 .css 파일은 응용 프로그램이 그리기 위해 로드되는 CSS의 양을 최소화합니다.

#### SASS 지원

Next.js를 사용하면 .scss 및 .sass 확장자를 모두 사용하여 Sass를 가져올 수 있습니다.
CSS 모듈 및 .module.scss 또는 .module.sass 확장을 통해 Component-level Sass를 사용할 수 있습니다.

❗️ 참고: Sass는 각각 고유한 extension을 가진 두 가지 구문을 지원합니다. .scss 확장자는 SCSS 구문을 사용해야 하고 .sass 확장자는 들여쓰기 구문("Sass")을 사용해야 합니다.

어떤 것을 선택해야 할지 잘 모르겠다면 CSS의 상위 집합인 .scss 확장자를 사용하세요.

##### SASS Customizing

Sass 컴파일러를 구성하려면 `next.config.js`에서 sassOptions를 사용하여 구성할 수 있습니다.

```javascript
// next.config.js

const path = require("path")

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
}
```

---

### Layouts

만약 React를 사용하면 page를 여러 components로 분해할 수 있습니다. 이러한 components는 재사용되는 경우가 많습니다. 예를 들어 모든 페이지에 동일한 navigation bar 나 footer가 있을 수 있습니다.

```javascript
// components/layout.js

import Navbar from "./navbar"
import Footer from "./footer"

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

#### Examples

##### Single Layout

전체 애플리케이션에 대해 하나의 레이아웃만 있는 경우 사용자는 Custom App을 만들고 레이아웃으로 애플리케이션을 래핑할 수 있습니다. <Layout /> 컴포넌트는 페이지를 변경할 때 재사용되기 때문에 컴포넌트 상태가 유지됩니다.

```javascript
// pages/_app.js

import Layout from "../components/layout"

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

##### Per-Page Layout

여러 레이아웃이 필요한 경우 페이지에 `getLayout` 속성을 추가하여 레이아웃에 대한 React component를 반환할 수 있습니다. 이를 통해 페이지별로 레이아웃을 정의할 수 있습니다. 함수를 반환하기 때문에 원하는 경우 복잡한 중첩 레이아웃을 가질 수 있습니다.

```javascript
// pages/index.js

import Layout from "../components/layout"
import NestedLayout from "../components/nested-layout"

export default function Page() {
  return {
    /** Your content */
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}
```

```javascript
// pages/_app.js

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || (page => page)

  return getLayout(<Component {...pageProps} />)
}
```

페이지를 navigating 할 때, 우리는 state가 유지되기를 원합니다. (input values, scroll position ...)

이 레이아웃 패턴은 페이지 전환 시 React component tree가 유지되기 때문에 상태 지속성을 가능하게 합니다. 컴포넌트 트리를 사용하여 React는 상태를 유지하기 위해 변경된 요소를 이해할 수 있습니다.

##### Data Fetching

```javascript
// components/layout.js

import useSWR from "swr"
import Navbar from "./navbar"
import Footer from "./footer"

export default function Layout({ children }) {
  const { data, error } = useSWR("/api/navigation", fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <Navbar links={data.links} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

레이아웃 내에서 useEffect 또는 SWR과 같은 라이브러리를 사용하여 클라이언트 측에서 데이터를 가져올 수 있습니다. 이 파일은 page가 아니고 component이므로 getStaticProps 또는 getServerSideProps를 사용할 수 없습니다.

---

### 이미지 컴포넌트와 최적화

Next.js 이미지 Component인 next/image는 최신 웹용으로 발전된 HTML `<img>` 요소의 extension입니다. 여기에는 우수한 `Core Web Vitals`를 달성하는 데 도움이 되는 다양한 기본 제공 성능 최적화가 포함되어 있습니다. 이 점수는 웹사이트에서 사용자 경험을 측정하는 중요한 척도이며 Google 검색 순위에 반영됩니다.

Image component에 내장된 몇 가지 최적화는 다음과 같습니다.

- Improved Performance : 최신 이미지 형식을 사용하여 항상 각 기기에 올바른 크기의 이미지를 제공합니다.

- Visual Stability :

- Faster Page Loads : Image는 viewport에 들어갈 때만 only 로드 됩니다.

- Asset Flexibility : 원격 서버에 이미지가 저장된 경우에도, On-demand image resizing.

#### Image 컴포넌트 사용하기

```javascript
import Image from "next/image"
```

or 기본 `<img>` 요소에 훨씬 더 가까운 Component가 필요한 경우 `next/future/image`를 가져올 수 있습니다.

```javascript
import Image from "next/future/image"
```

##### Local Images

로컬 이미지를 사용하려면 .jpg, .png 또는 .webp 파일을 가져오세요.

```javascript
import profilePic from "../public/me.png"
```

Dynamic await import() 또는 require()는 지원되지 않습니다. import는 빌드 시 분석할 수 있도록 static 이어야 합니다.

Next.js는 가져온 파일을 기반으로 이미지의 width와 height를 자동으로 결정합니다. 이 값은 이미지가 로드되는 동안 누적 레이아웃 이동을 방지하는 데 사용됩니다.

```javascript
import Image from "next/image"
import profilePic from "../public/me.png"

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src={profilePic}
        alt="Picture of the author"
        // width={500} automatically provided
        // height={500} automatically provided
        // blurDataURL="data:..." automatically provided
        // placeholder="blur" // Optional blur-up while loading
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```

##### Remote Images

원격 이미지를 사용하려면 src 속성은 URL 문자열이어야 하며 상대경로 또는 절대경로 일 수 있습니다. Next.js는 빌드 프로세스 중에 원격 파일에 액세스할 수 없으므로 너비, 높이 및 선택적 blurDataURL props를 메뉴얼로 제공해야 합니다.

```javascript
import Image from "next/image"

export default function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```

##### Domains

만약 remote 이미지를 최적화하고 싶지만 내장된 Next.js 이미지 최적화 API를 계속 사용하고 싶을 수 있습니다. 이렇게 하려면 로더를 기본 설정으로 두고 Image src props에 절대 URL을 입력하세요.

악의적인 사용자로부터 애플리케이션을 보호하려면 next/image Component와 함께 사용할 원격 호스트 이름 list을 정의해야 합니다.

##### Loaders

앞의 예에서 remote 이미지에 대해 부분 URL("/me.png")이 제공된다는 점에 주의하세요. 이것은 next/image loader 아키텍처 때문에 가능합니다.

로더는 이미지의 URL을 생성하는 기능입니다. 제공된 src를 수정하고 여러 URL을 생성하여 다양한 크기의 이미지를 요청합니다. 이러한 여러 URL은 자동 srcset 생성에 사용되므로 사이트 방문자에게 표시 영역에 적합한 크기의 이미지가 제공됩니다.

##### Priority

각 페이지에 가장 중요한 이미지에 우선 순위 속성을 추가해야 합니다. 이렇게 하면 Next.js가 로드할 이미지의 우선 순위를 특별히 지정할 수 있습니다.

```javascript
import Image from "next/image"

export default function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
        priority
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```

##### Image Sizing

이미지가 가장 일반적으로 성능을 저하시키는 방법 중 하나는 이미지가 로드될 때 페이지의 다른 요소를 밀어내는 layout shift 할 때입니다. 이 문제는 사용자 경험에 매우 좋지 않아서 `Cumulative Layout Shift` 이라는 자체 Core Web Vital이 있습니다.

이러한 layout shift를 피하는 방법은 항상 이미지 크기를 조정하는 것입니다. 이를 통해 브라우저는 이미지가 로드되기 전에 이미지를 위한 충분한 공간을 정확하게 예약할 수 있습니다.

next/image는 좋은 성능 결과를 보장하도록 설계되었기 때문에 layout shift가 일어나도록 하지 않으며, 다음 세 가지 방법 중 하나로 크기를 조정해야 합니다.

- 정적 이미지 사용하기

- 명시적으로 `width`, `height` 포함하기

- layout="fill" 사용하여 부모 요소를 채우기 위해 이미지를 확장되도록 하기

> ❗️ 내 이미지 사이즈를 모르면 어떡하나요..?

> 🌟 layout="fill" 을 사용하세요.

> layout='fill' 을 사용하면 부모 요소에 따라 이미지 크기를 조정할 수 있습니다. CSS를 사용하여 페이지에 이미지의 부모 요소 공간을 제공한 다음, objectPosition 속성과 함께 fill, contain 또는 cover와 함께 objectFit 속성을 사용하여 이미지가 해당 공간을 차지하는 방식을 정의하는 것을 고려하세요.

##### Styling

Image Component의 스타일 지정은 일반 `<img>` 요소의 스타일 지정과 크게 다르지 않지만 명심해야 할 몇 가지가 있습니다.

- 올바른 layout mode를 고르세요.

  > 이미지 component에는 페이지에서 크기가 조정되는 방식을 정의하는 여러 가지 layout mode가 있습니다. 이미지 스타일이 원하는 대로 되지 않으면 다른 레이아웃 모드를 실험해 보세요.

  - layout= 'fill' 일 경우에는 부모는 반드시 `position: relative` 여야 합니다.

  - layout= 'responsive' 일 경우에는 부모는 반드시 `display: block` 이여야 합니다.

- DOM 구조를 기반으로 하지 않고 className으로 이미지를 지정

---

### 폰트 최적화

Next.js는 빌드 할 동안 웹 폰트 로딩을 최적화합니다. 이 최적화는 아래와 같이 선언된 글꼴 파일을 가져오기 위한 추가 네트워크 왕복을 제거합니다.

```html
// Before
<link
  href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
  rel="stylesheet"
/>

// After
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<style
  data-href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
>
  @font-face{font-family:'Inter';font-style:normal...
</style>
```

#### 사용

웹 폰트는 Next.js에서 사용하려면 다음과 같이 추가하세요.

```javascript
// pages/_document.js

import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

개별 페이지보다 `_document`에 글꼴을 추가하는 것이 좋습니다. next/head가 있는 단일 페이지에 글꼴을 추가하면 클라이언트 측 또는 스트리밍을 사용할 때 페이지 간 navigations에서 동작하지 않습니다.

##### 최적화 끄기

```javascript
// next.config.js

module.exports = {
  optimizeFonts: false,
}
```

---

### Static File Serving

Next.js는 루트 디렉터리의 public이라는 폴더 아래에 이미지와 같은 정적 파일을 제공할 수 있습니다. 그런 다음 기본 URL(/)에서 시작하는 코드에서 공용 내부의 파일을 참조할 수 있습니다.

예를 들어 public/me.png에 이미지를 추가하면 다음 코드가 이미지에 액세스합니다.

```javascript
import Image from "next/image"

function Avatar() {
  return <Image src="/me.png" alt="me" width="64" height="64" />
}

export default Avatar
```

---

### Fast Refresh

Fast Refresh는 React component에 대한 수정 사항에 대해 즉각적인 피드백을 제공하는 Next.js 기능입니다. Fast Refresh는 9.4 이상의 모든 Next.js 애플리케이션에서 기본적으로 활성화되어 있습니다. Next.js Fast Refresh가 활성화되면 대부분의 수정 내용은 상태를 잃지 않고 1초 이내에 표시되어야 합니다.

#### 어떻게 동작하나요?

- React Component(s)만 exports 하는 파일을 수정하는 경우 Fast Refresh는 해당 파일에 대한 코드만 업데이트하고 components를 다시 렌더링합니다. 스타일, 렌더링 logic, event handlers 또는 effets를 포함하여 해당 파일의 모든 것을 수정 할 수 있습니다.

- React component가 아닌 파일을 수정하는 경우 Fast Refresh는 해당 파일과 파일을 가져오는 다른 파일을 모두 다시 실행합니다. 따라서 Button.js와 Modal.js가 모두 theme.js를 가져오는 경우 theme.js를 수정하면 두 component가 모두 업데이트됩니다.

#### 제한

Fast Refresh는 수정 중인 component에서 local React state를 유지하려고 시도하지만 그렇게 하는 것이 안전한 경우에만 가능합니다. 다음은 파일을 수정할 때마다 local state가 reset되는 몇 가지 이유입니다.

- local state는 class component에 대해 유지되지 않습니다. (오직 함수형 컴포넌트 및 Hook만 상태 유지)

- 수정중인 파일이 React component 외에 다른 exports가 있는 경우.

- HOC 와 같은 고차함수를 내보낼 때, 반환된 컴포넌트가 class 컴포넌트면 reset 됩니다.

- 익명 화살표 함수의 경우.

#### Tips

- 상태를 강제로 reset하고 component를 다시 마운트해야 하는 경우가 있습니다. 예를 들어 마운트 시에만 발생하는 애니메이션을 조정하는 경우 유용할 수 있습니다. 이렇게 하려면 수정 중인 파일의 아무 곳에나 `// @refresh reset`을 추가할 수 있습니다.

#### Fast Refresh and Hooks

가능한 경우 Fast Refresh는 컴포넌트의 상태를 가능한 유지하려고 합니다. 특히, useState 및 useRef는 인수나 Hook 호출의 순서를 변경하지 않는 한 이전 값을 유지합니다.

useEffect, useMemo 및 useCallback과 같은 hooks는 Fast Refresh 동안 항상 업데이트됩니다. Fast Refresh가 발생하는 동안 dependencies는 무시됩니다.

---

### ESLint

11.0.0 버전 이후로, Next.js는 완전한 ESLint 경험을 제공합니다.

```json
"scripts": {
  "lint": "next lint"
}
```

애플리케이션에 ESLint를 아직 설정하지 않은 경우 설치 및 설정 프로세스를 안내합니다.

```bash
yarn lint

# You'll see a prompt like this:
#
# ? How would you like to configure ESLint?
#
# ❯   Base configuration + Core Web Vitals rule-set (recommended)
#     Base configuration
#     None
```

아래의 3가지 옵션이 존재합니다.

- Strict: 보다 엄격한 `Core Web Vitals`와 함께 Next.js의 기본 ESLint 구성을 포함합니다. ESLint를 처음 설정하는 개발자에게 권장되는 구성입니다.

```json
{
  "extends": "next/core-web-vitals"
}
```

- Base: Next.js의 기본 ESLint config 입니다.

```json
{
  "extends": "next"
}
```

- Cancel: ESLint config를 포함하지 않습니다. 사용자 정의 ESLint config를 설정할 계획인 경우에만 이 옵션을 선택하세요.

두 구성 옵션 중 하나가 선택되면 Next.js는 자동으로 `eslint` 및 `eslint-config-next`를 애플리케이션의 development dependencies로 설치하고 선택한 구성을 포함하는 프로젝트 루트에 .eslintrc.json 파일을 생성합니다.

이제 오류를 잡기 위해 ESLint를 실행할 때마다 `next lint`를 실행할 수 있습니다. ESLint가 설정되면 build 중에 자동으로 실행됩니다. 오류는 빌드에 실패하지만 경고는 그렇지 않습니다.

#### 다른 tool과 사용

##### Prettier

ESLint에는 기존 Prettier config와 충돌할 수 있는 코드 형식 지정 규칙도 포함되어 있습니다. ESLint와 Prettier가 함께 작동하도록 ESLint 구성에 `eslint-config-prettier`를 포함하는 것이 좋습니다.

```bash
npm install --save-dev eslint-config-prettier
```

```json
// ESLint config

{
  "extends": ["next", "prettier"]
}
```

---

### TypeScript

Next.js는 zero-config와 훌륭한 TypeScript 환경을 제공합니다.

다음과 같이 --ts, --typescript 플래그를 사용하여 create-next-app으로 TypeScript 프로젝트를 만들 수 있습니다.

```bash
npx create-next-app@latest --ts
# or
yarn create next-app --typescript
# or
pnpm create next-app --ts
```

#### Existing projects

기존 프로젝트에서 시작하려면 루트 폴더에 빈 `tsconfig.json` 파일을 만듭니다.

그런 다음 (일반적으로 npm run dev 또는 yarn dev)을 실행하면 Next.js가 설정을 완료하는 데 필요한 패키지 설치를 안내합니다.

```bash
npm run dev

# You'll see instructions like these:
#
# Please install TypeScript, @types/react, and @types/node by running:
#
#         yarn add --dev typescript @types/react @types/node
#
# ...
```

❗️ 프로젝트 루트에 `next-env.d.ts`라는 파일이 생성됩니다. 이 파일은 TypeScript 컴파일러가 Next.js types을 선택하도록 합니다. 언제든지 변경될 수 있으므로 제거하거나 편집하지 마십시오. 이 파일은 커밋되어서는 안 되며 버전 제어에서 무시되어야 합니다. (ex .gitignore 파일 내부)

TypeScript strict mode는 기본적으로 꺼져 있습니다. TypeScript에 익숙해지면 tsconfig.json에서 켜는 것이 좋습니다.

#### Static Generation 과 Server-side Rendering type

getStaticProps, getStaticPaths 및 getServerSideProps의 경우 각각 GetStaticProps, GetStaticPaths 및 GetServerSideProps type을 사용할 수 있습니다.

```javascript
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next"

export const getStaticProps: GetStaticProps = async context => {
  // ...
}

export const getStaticPaths: GetStaticPaths = async () => {
  // ...
}

export const getServerSideProps: GetServerSideProps = async context => {
  // ...
}
```

#### \_App

custom App이 있는 경우 내장된 `AppProps`를 사용하고 다음과 같이 파일 이름을 ./pages/\_app.tsx로 변경할 수 있습니다.

```javascript
import type { AppProps } from "next/app"

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

---

### 환경변수

Next.js에는 환경 변수에 대한 지원이 내장되어 있어 다음을 수행할 수 있습니다.

- `.env.local`을 사용.

- `NEXT_PUBLIC_` 사용.

#### 환경변수 load하기

Next.js에는 `.env.local`에서 `process.env`로 환경 변수를 load하는 기능이 내장되어 있습니다.

```javascript
// .env.local

DB_HOST = localhost
DB_USER = myuser
DB_PASS = mypassword
```

이렇게 하면 process.env.DB_HOST, process.env.DB_USER 및 process.env.DB_PASS가 Node.js 환경에 자동으로 load되어 Next.js 데이터 fetching methods 및 API routes에서 사용할 수 있습니다.

```javascript
// pages/index.js

export async function getStaticProps() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

#### 브라우저에서 활용하기

기본적으로 환경 변수는 `Node.js` 환경에서만 사용할 수 있습니다. 즉, 브라우저에 노출되지 않습니다.

브라우저에 변수를 노출하려면 변수에 `NEXT_PUBLIC_ `접두어를 붙여야 합니다.

```javascript
// .env.local

NEXT_PUBLIC_ANALYTICS_ID = abcdefghijk
```

이렇게 하면 `process.env.NEXT_PUBLIC_ANALYTICS_ID`가 Node.js 환경에 자동으로 로드되어 코드의 어디에서나 사용할 수 있습니다. 값은 NEXT*PUBLIC* 접두사로 인해 브라우저로 전송되는 JavaScript에 인라인됩니다. 이 인라인은 빌드 시 발생하므로 프로젝트를 빌드할 때 다양한 NEXT*PUBLIC* 환경을 설정해야 합니다.

```javascript
// pages/index.js
import setupAnalyticsService from "../lib/my-analytics-service"

// 'NEXT_PUBLIC_ANALYTICS_ID' can be used here as it's prefixed by 'NEXT_PUBLIC_'.
// It will be transformed at build time to `setupAnalyticsService('abcdefghijk')`.
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)

function HomePage() {
  return <h1>Hello World</h1>
}

export default HomePage
```

---

## Routing

Next.js는 pages를 컨셉으로한 라우터 시스템을 가지고 있습니다.

pages 디렉토리에 파일이 추가되면 자동으로 router로 사용할 수 있습니다.

- Index routes

  - router는 index라는 이름의 파일을 디렉터리의 루트로 자동 라우팅합니다.

  > pages/index.js → /

  > pages/blog/index.js → /blog

- Nested routes

  - 라우터는 중첩 파일을 지원합니다. 중첩된 폴더 구조를 생성하면 파일이 동일한 방식으로 자동으로 라우팅됩니다.

  > pages/blog/first-post.js → /blog/first-post

- Dynamic route segments

  - Dynamic route를 사용하기 위해 대괄호 구문을 사용할 수 있습니다. 이렇게 하면 매개변수를 일치시킬 수 있습니다.

  > pages/blog/`[slug]`.js → /blog/:slug (/blog/hello-world)

  > pages/post/`[...all]`.js → /post/\* (/post/2020/id/title)

### pages 간 이동

Next.js router를 사용하면 SPA와 유사하게 페이지 간에 client-side route transitions을 수행할 수 있습니다.

이 client-side route transitions을 수행하기 위해 `Link`라는 React component가 제공됩니다.

```javascript
import Link from "next/link"

function Home() {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About Us</a>
        </Link>
      </li>
      <li>
        <Link href="/blog/hello-world">
          <a>Blog Post</a>
        </Link>
      </li>
    </ul>
  )
}

export default Home
```

#### dynamic 경로 이동

- 템플릿 리터럴을 사용할 수 있습니다.

```javascript
import Link from "next/link"

function Posts({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
            <a>{post.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

- URL Object를 사용할 수 있습니다.

```javascript
import Link from "next/link"

function Posts({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link
            href={{
              pathname: "/blog/[slug]",
              query: { slug: post.slug },
            }}
          >
            <a>{post.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

---

### Dynamic Routes

다음 페이지를 살펴 보세요. pages/post/`[pid]`.js:

```javascript
import { useRouter } from "next/router"

const Post = () => {
  const router = useRouter()
  const { pid } = router.query

  return <p>Post: {pid}</p>
}

export default Post
```

post/1, /post/abc 등과 같은 모든 경로는 pages/post/`[pid]`.js와 matched 됩니다. matched되는 경로 매개변수는 page에 query parameter로 전송되고 다른 query parameter와 병합됩니다.

- /post/abc

  > { "pid": "abc" }

- /post/abc?foo=bar

  > { "foo": "bar", "pid": "abc" }

- pages/post/`[pid]`/`[comment]`.js

  > { "pid": "abc", "comment": "a-comment" }

❗️ 그러나 route parameter는 동일한 이름의 query parameter를 overriding 합니다. 예를 들어 /post/abc?pid=123 경로에는 다음 쿼리 개체가 있습니다.

> { "pid": "abc" }

#### Catch all routes

Dynamic routes는 [] 안에 세 개의 점(...)을 추가하여 모든 경로를 catch 하도록 할 수 있습니다.

- pages/post/`[...slug]`.js

  > /post/a

  > /post/a/b

  > /post/a/b/c

matched된 parameter는 query parameter로 page에 전송되며 항상 `배열`입니다.

- /post/a

  > { "slug": `["a"]` }

- /post/a/b

  > { "slug": ["a", "b"] }

#### Optional catch all routes

Catch all route는 parameter를 이중 괄호 안에 포함하여 optional로 만들 수 있습니다.

- pages/post/`[[...slug]]`.js

  > /post

  > /post/a

  > /post/a/b

❗️ catch all과 optional catch all route의 주요 차이점은 optional을 사용하면 매개변수가 없는 경로도 일치한다는 것입니다(위의 예에서 /post).

```javascript
{ } // GET `/post` (empty object)
{ "slug": ["a"] } // `GET /post/a` (single-element array)
{ "slug": ["a", "b"] } // `GET /post/a/b` (multi-element array)
```

#### 주의

Predefined routes는 dynamic routes 보다 `우선`합니다.

- pages/post/create.js -> /post/create

- pages/post/`[pid]`.js -> /post/1, /post/abc, etc.

  > **But not /post/create**

- pages/post/`[...slug]`.js -> /post/1/2, /post/a/b/c, etc.

  > **But not /post/create, /post/abc**

---

### Imperatively

next/link는 대부분의 라우팅 요구 사항을 처리할 수 있어야 하지만 이것 없이도 클라이언트 측 탐색을 수행할 수 있습니다. next/router에 대한 설명서를 살펴보세요.

다음 예는 useRouter를 사용하여 기본 페이지 탐색을 수행하는 방법을 보여줍니다.

```javascript
import { useRouter } from "next/router"

export default function ReadMore() {
  const router = useRouter()

  return (
    <button onClick={() => router.push("/about")}>
      Click here to read more
    </button>
  )
}
```

---

## API Routes

API routes는 Next.js로 API를 빌드하기 위한 solution을 제공합니다.

pages/api 폴더 내의 모든 파일은 /api/\*에 매핑되며 page 대신 `API endpoint`로 처리됩니다. 서버 측 전용 번들이며 클라이언트 측 번들 크기를 늘리지 않습니다.

예를 들어 pages/api/user.js는 상태 코드가 200인 json 응답을 반환합니다.

```javascript
export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" })
}
```

API route가 작동하려면 함수를 default로 export해야 합니다. 그러면 아래 매개변수가 수신됩니다.

- req

- res

API route에서 다른 HTTP 메소드를 처리하기 위해 다음과 같이 req.method를 사용할 수 있습니다.

```javascript
export default function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

---

### Dynamic API Routes

API routes는 dynamic routes를 지원하며 pages에 사용되는 것과 동일한 파일 naming rules를 따릅니다.

예를 들어 API 경로 pages/api/post/`[pid]`.js에는 다음 코드가 있습니다.

```javascript
export default function handler(req, res) {
  const { pid } = req.query
  res.end(`Post: ${pid}`)
}
```

/api/post/abc에 대한 요청은 Post: abc 텍스트로 응답합니다.

#### Index routes 와 Dynamic API routes

#### Catch all API routes

API routes는 대괄호 안에 세 개의 점(...)을 추가하여 모든 경로를 포착하도록 확장할 수 있습니다.

- pages/api/post/`[...slug]`.js

  > /api/post/a

  > /api/post/a/b

  > /api/post/a/b/c

matched된 parameter는 query parameter로 page에 전송되며 항상 배열입니다.

- /api/post/a

  > { "slug": `["a"]` }

- /api/post/a/b

  > { "slug": ["a", "b"] }

#### Optional catch all API routes

parameter에 이중 괄호 (`[[...slug]]`) 를 사용할 수 있습니다.

catch all과 optional catch all routes의 주요 차이점은 optional을 사용하면 매개변수가 없는 경로도 일치한다는 것입니다(위 예의 /api/post).

---

### API Routes Request helpers

API routes는 들어오는 request를 분석하는 built-in request helpers를 제공합니다.

- req.cookies: request에서 보낸 cookie가 포함된 object입니다. default로 {}

- req.query: query string을 포함하는 object입니다. default로 {}

- req.body: content-type이 포함된 body를 포함하는 object. body가 전송되지 않은 경우 null.

---

### API Routes Response helpers

Server Response object (보통 res로 불림) 에는 개발자 경험을 개선하고 새 API endpoints 생성 속도를 높이기 위한 Express.js와 유사한 helper moethods가 포함되어 있습니다.

- res.status(code)

- res.json(body): JSON response를 보냅니다. body는 **serializable object** 이여야합니다.

- res.send(body): HTTP responsse를 보냅니다. body는 **string**, **object**, **Buffer** 이여야합니다.

- res.redirect([status, ] path]): 지정된 경로 또는 URL로 리디렉션합니다. status는 유효한 HTTP 상태 코드여야 합니다. 지정하지 않으면 상태는 기본적으로 "307" "임시 리디렉션"으로 설정됩니다.

- res.revalidate(urlPath): getStaticProps를 사용하여 요청 시 페이지를 재검증합니다. urlPath는 문자열이어야 합니다.

#### response의 status code 설정

client에 response를 보낼 때 status code를 설정할 수 있습니다.

다음 예제에서는 응답의 상태 코드를 200(OK)으로 설정하고 Next.js에서 Hello 값이 있는 메시지 속성을 반환합니다!

```javascript
export default function handler(req, res) {
  res.status(200).json({ message: "Hello from Next.js!" })
}
```

#### JSON response 보내기

client에 response을 보낼 때 JSON 응답을 보낼 수 있습니다. 이것은 `serializable object`여야 합니다.

```javascript
export default async function handler(req, res) {
  try {
    const result = await someAsyncOperation()
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: "failed to load data" })
  }
}
```

#### HTTP response 보내기

HTTP 응답을 보내는 것은 JSON 응답을 보낼 때와 같은 방식으로 작동합니다. 유일한 차이점은 응답 body가 string, object 또는 Buffer일 수 있다는 것입니다.

```javascript
export default async function handler(req, res) {
  try {
    const result = await someAsyncOperation()
    res.status(200).send({ result })
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" })
  }
}
```

#### 다른 경로나 URL로 Redirects 하기

Form을 예로 들면 클라이언트가 form을 제출한 후 지정된 경로나 URL로 리디렉션할 수 있습니다.

```javascript
export default async function handler(req, res) {
  const { name, message } = req.body
  try {
    await handleFormInputAsync({ name, message })
    res.redirect(307, "/")
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" })
  }
}
```

##### Typescript types 추가하기

```javascript
import type { NextApiRequest, NextApiResponse } from "next"

type ResponseData = {
  message: string,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: "Hello from Next.js!" })
}
```

---

## API Reference

### next/router

#### useRouter

만약 함수형 컴포넌트에 있는 router object에 access하려면 `userRouter` hook을 사용할 수 있습니다.

```javascript
import { useRouter } from "next/router"

function ActiveLink({ children, href }) {
  const router = useRouter()
  const style = {
    marginRight: 10,
    color: router.asPath === href ? "red" : "black",
  }

  const handleClick = e => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

export default ActiveLink
```

#### router object

- pathname: /pages 뒤에 오는 현재 route file의 path입니다. 따라서 basePath, locale 및 trailing slash는 포함되지 않습니다.

- query: dynamic route parameter를 포함한 query string입니다. page에서 Server-side Rendering을 사용하지 않는 경우 prerendering 중에 빈 object가 됩니다. 기본값은 {}

- asPath: search parameter를 포함하고 trailingSlash config을 따릅니다. basePath 및 locale은 포함되지 않습니다.

- isFallback: 현재 페이지가 fallback mode인지 여부입니다.

- basePath: 활성화된 basePath

- locale: 활성화된 locale

- locales: 지원하는 모든 locale

- defaultLocale: 현재 default locale

##### router.push

client-side transition을 처리합니다. 이 방법은 next/lint가 충분하지 않은 경우에 유용합니다.

```javascript
router.push(url, as, options)
```

- url

- as: browser URL 표시줄에 대체 표시됩니다.

- options

  - scroll: navigation 후 페이지 상단으로 스크롤하는 것을 제어합니다. 기본값은 true

  - shallow: getStaticProps, getServerSideProps 또는 getInitialProps를 다시 실행하지 않고 현재 페이지의 경로를 업데이트합니다. 기본값은 false

  - locale: 새 페이지의 로케일을 나타냅니다.

---

### next/link

route 간의 Client-side 전환은 Link component를 통해 활성화할 수 있습니다.

`Link`는 아래와 같은 props를 갖습니다.

- href: navigate할 path or URL입니다. 반드시 필요한 props입니다.

- as: browser URL 표시줄에 대체 표시됩니다.

- legacyBehavior: 자식이 `<a>`여야 하도록 동작을 변경합니다. 기본값은 false입니다.

- passHref: Link가 href 속성을 자식에게 보내도록 합니다. 기본값은 false

- prefetch: 백그라운드에서 page를 prefetch 합니다. 기본값은 true입니다. 뷰포트에 있는 모든 `<Link />`는 preloaded 됩니다. prefetch={false}를 전달하여 prefetch를 비활성화할 수 있습니다. prefetch가 false로 설정되어 있으면 hover 시 prefetch가 계속 발생합니다. SSG를 사용하는 페이지는 더 빠른 페이지 전환을 위해 데이터와 함께 JSON 파일을 미리 로드합니다. prefetch는 프로덕션에서만 활성화됩니다.

- replace: stack에 새 URL을 추가하는 대신 현재 history state를 바꿉니다. 기본값은 false

- scroll: navigation 후 페이지 상단으로 스크롤하는 것을 제어합니다. 기본값은 true

- shallow: getStaticProps, getServerSideProps 또는 getInitialProps를 다시 실행하지 않고 현재 페이지의 경로를 업데이트합니다. 기본값은 false

- locale

#### child가 a태그를 감싼 custom component인 경우

Link의 child가 `<a>` 태그를 래핑하는 custom component인 경우 Link에 passHref를 추가해야 합니다. 이는 styled-components와 같은 라이브러리를 사용하는 경우 필요합니다. 이것이 없으면 `<a>` 태그에 href 속성이 없어 사이트의 접근성을 해치고 SEO에 영향을 줄 수 있습니다. ESLint를 사용하는 경우 passHref의 올바른 사용을 보장하는 내장 규칙 next/link-passhref가 있습니다.

```javascript
import Link from "next/link"
import styled from "styled-components"

// This creates a custom component that wraps an <a> tag
const RedLink = styled.a`
  color: red;
`

function NavLink({ href, name }) {
  return (
    <Link href={href} passHref legacyBehavior>
      <RedLink>{name}</RedLink>
    </Link>
  )
}

export default NavLink
```

- 만약 emotion의 JSX pragma 기능(@jsx jsx)을 사용하는 경우, `<a>` 태그를 직접 사용하더라도 반드시 passHref를 사용해야 합니다.

- component는 navigation을 올바르게 트리거하기 위해 onClick 속성을 지원해야 합니다.

#### child가 함수형 컴포넌트인 경우

Link의 child가 함수형 컴포넌트인 경우 passHref 및 legacyBehavior를 사용하는 것 외에도 React.forwardRef에서 component를 래핑해야 합니다.

```javascript
import Link from "next/link"

// `onClick`, `href`, and `ref` need to be passed to the DOM element
// for proper handling
const MyButton = React.forwardRef(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      Click Me
    </a>
  )
})

function Home() {
  return (
    <Link href="/about" passHref legacyBehavior>
      <MyButton />
    </Link>
  )
}

export default Home
```

#### a태그 없이 Link 태그 사용하기

Link는 URL object를 수신할 수도 있으며 자동으로 형식을 지정하여 URL 문자열을 생성합니다.

```javascript
import Link from "next/link"

function Home() {
  return (
    <ul>
      <li>
        <Link
          href={{
            pathname: "/about",
            query: { name: "test" },
          }}
        >
          About us
        </Link>
      </li>
      <li>
        <Link
          href={{
            pathname: "/blog/[slug]",
            query: { slug: "my-post" },
          }}
        >
          Blog Post
        </Link>
      </li>
    </ul>
  )
}

export default Home
```

---

### next/image

#### 필수 props

image component에는 다음 property가 필요합니다.

##### src

1. static imported image file

2. path string 입니다. absolute external URL 이거나 loader prop에 따라 internal path 일 수 있습니다.

❗️ 외부 URL을 사용하는 경우 next.config.js의 [remotePatterns](#remote-patterns)에 추가해야 합니다.

##### width / height

statically imported Image 또는 fill property 속성이 있는 이미지를 제외하고 필수입니다.

##### alt

이미지가 순전히 장식적이거나 사용자를 위한 것이 아닌 경우 alt 속성은 빈 문자열(alt="")이어야 합니다.

#### optional props

##### loader

이미지 URL을 resolve하는 데 사용되는 custom function 입니다.

loader는 다음 parameter가 주어지면 이미지의 URL 문자열을 반환하는 함수입니다.

- src

- width

- quality

```javascript
import Image from "next/image"

const myLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

const MyImage = props => {
  return (
    <Image
      loader={myLoader}
      src="me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

또는 next.config.js의 loaderFile config을 사용하여 prop을 전달하지 않고 애플리케이션에서 next/image의 모든 인스턴스를 설정할 수 있습니다.

```javascript
module.exports = {
  images: {
    loader: "custom",
    loaderFile: "./my/image/loader.js",
  },
}
```

##### fill

width와 height를 설정하는 대신 이미지가 부모 요소를 채우도록 하는 boolean입니다.

부모 요소는 position: "relative", position: "fixed" 또는 position: "absolute" 스타일을 지정해야 합니다.

기본적으로 img 요소는 자동으로 position: "absolute" 로 지정됩니다.

기본적으로는 container에 맞게 이미지를 늘립니다. container에 맞고 가로세로 비율을 유지하기 위해 object-fit: "contain"을 설정하는 것을 선호할 수 있습니다.

또는 object-fit: "cover"를 사용하면 이미지가 전체 컨테이너를 채우고 가로 세로 비율을 유지하기 위해 잘립니다. 이것이 올바르게 보이려면 overflow: "hidden" 스타일이 상위 요소에 할당되어야 합니다.

- [object-fit CSS 예제 보러가기](https://developer.mozilla.org/ko/docs/Web/CSS/object-fit)

##### size

size 값은 fill을 사용하거나 반응형 size를 갖도록 스타일이 지정된 이미지의 성능에 큰 영향을 미칩니다.

size 속성은 이미지 성능과 관련된 두 가지 중요한 목적을 수행합니다.

- 브라우저에게 미리 알려준다.

> size 값은 next/image로부터 다운로드할 이미지의 크기를 결정해 브라우저에게 알려주는데 사용됩니다. 브라우저는 이미지를 선택할 때 페이지의 이미지 크기를 아직 알지 못하기 때문에 뷰포트보다 크거나 같은 크기의 이미지를 선택합니다. size 속성을 사용하면 이미지가 실제로 전체 화면보다 작을 것임을 브라우저에 알릴 수 있습니다. fill 속성을 사용하여 이미지에 크기 값을 지정하지 않으면 기본값인 100vw(전체 화면 너비)가 사용됩니다.

- 이미지 최적화에 도움

> size 속성은 next/image가 이미지 세트를 자동으로 생성하는 방법을 구성합니다. 크기 값이 없으면 고정 size 이미지에 적합한 작은 소스 세트가 생성됩니다. 크기가 정의되면 반응형 이미지에 적합한 대용량 소스 세트가 생성됩니다. size 속성이 50vw와 같은 크기를 포함하는 경우 소스 세트가 너무 작아서 필요하지 않은 값을 포함하지 않도록 잘립니다.

예를 들어, 스타일 지정으로 인해 모바일 장치에서는 이미지가 전체 너비로 표시되고 태블릿에서는 2열 레이아웃으로, 데스크톱 디스플레이에서는 3열 레이아웃으로 표시되는 경우 다음과 같은 크기 속성을 포함해야 합니다.

```javascript
import Image from "next/image"

const Example = () => (
  <div className="grid-element">
    <Image
      src="/example.png"
      fill
      sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
    />
  </div>
)
```

##### quality

최적화된 이미지의 품질로 1에서 100 사이의 정수입니다. 여기서 100은 최상의 품질이므로 가장 큰 파일 크기입니다. 기본값은 75입니다.

##### priority

true인 경우 이미지가 높은 우선 순위와 preload로 간주됩니다. lazy loading은 priority를 사용하는 이미지에 대해 자동으로 비활성화됩니다.

LCP(Large Contentful Paint) 요소로 감지된 모든 이미지에 priority 속성을 사용해야 합니다. 다른 이미지는 다른 뷰포트 크기에 대한 LCP 요소일 수 있으므로 여러 우선순위 이미지를 갖는 것이 적절할 수 있습니다.

scroll 없이 볼 수 있는 부분에 이미지가 표시되는 경우에만 사용해야 합니다. 기본값은 `false`입니다.

##### placeholder

이미지가 load되는 동안 사용됩니다. 가능한 값은 blur or empty 입니다. 기본값은 empty 입니다.

blur 처리하면 blurDataURL 속성이 placeholder로 사용됩니다. src가 static imported 이고 가져온 이미지가 .jpg, .png, .webp 또는 .avif이면 blurDataURL이 자동으로 채워집니다.

동적 이미지의 경우 blurDataURL 속성을 제공해야 합니다.

비어 있으면 이미지가 로드되는 동안 placeholder가 없고 빈 공간만 있습니다.

#### Advanced props

경우에 따라 고급 사용법이 필요할 수 있습니다.

##### onLoadingComplete

이미지가 완전히 load되고 placeholder가 제거되면 호출되는 콜백 함수입니다.

##### onLoad

이미지가 로드될 때 호출되는 콜백 함수입니다.

##### onError

이미지 로드에 실패하면 호출되는 콜백 함수입니다.

##### loading

이미지의 load 동작입니다. 기본값은 lazy입니다.

lazy인 경우 뷰포트에서 계산된 거리에 도달할 때까지 이미지 load를 defer 합니다.

eager인 경우 즉시 이미지를 로드합니다.

> eager로 로드하도록 이미지를 전환하면 일반적으로 성능이 저하됩니다. 거의 모든 사용 사례에 priority를 대신 사용하는 것이 좋습니다.

##### blurDataURL

src 이미지가 성공적으로 load되기 전에 placeholder 이미지로 사용할 데이터 URL입니다. placeholder="blur"와 결합된 경우에만 적용됩니다.

base64로 인코딩된 이미지여야 합니다. 확대되어 흐려지므로 아주 작은(10px 이하) 이미지를 권장합니다. 더 큰 이미지를 자리 표시자로 포함하면 애플리케이션 성능이 저하될 수 있습니다.

#### Configuration Options

##### Remote Patterns

악의적인 user로부터 애플리케이션을 보호하기 위해 외부 이미지를 사용하기 위한 config가 필요합니다. 이렇게 하면 계정의 외부 이미지만 Next.js Image Optimization API에서 제공될 수 있습니다. 이러한 외부 이미지는 아래와 같이 `next.config.js` 파일의 remotePatterns 속성으로 구성할 수 있습니다.

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/account123/**",
      },
    ],
  },
}
```

참고: 위의 예에서는 next/image의 src 속성이 https://example.com/account123/으로 시작해야 합니다. 다른 프로토콜, 호스트 이름, 포트 또는 일치하지 않는 경로는 400 Bad Request로 응답합니다.

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.example.com",
      },
    ],
  },
}
```

Wildcard patterns은 경로 이름과 호스트 이름 모두에 사용할 수 있으며 다음 구문을 가집니다.

- \*: single path 세그먼트 또는 subdomain과 일치

- \*\*: end or 시작 부분의 subdomain의 어떠한 숫자와도 일치

\*\* 구문은 패턴 중간에 작동하지 않습니다.

##### Domains

remotePatterns와 유사하게 domain config를 사용하여 외부 이미지에 대해 허용된 호스트 이름 목록을 제공할 수 있습니다.

그러나 domain config은 Wildcard patterns을 지원하지 않으며 프로토콜, 포트 또는 경로 이름을 제한할 수 없습니다.

다음은 next.config.js 파일에 있는 도메인 속성의 예입니다.

```javascript
module.exports = {
  images: {
    domains: ["assets.acme.com"],
  },
}
```

---

### Data Fetching

#### getInitialProps

> ❗️ next v9 이상에서는 getInitialProps 대신 getStaticProps, getStaticPaths, getServerSideProps을 사용하도록 가이드 합니다.

getInitialProps는 page에서 Server-side rendering을 가능하게 하고 초기 데이터 채우기를 수행할 수 있도록 합니다. 이는 서버에서 이미 채워진 데이터로 페이지를 보내는 것을 의미합니다. 이것은 SEO에 특히 유용합니다.

getInitialProps는 Automatic Static Optimization를 비활성화합니다.

getInitialProps는 static method로 모든 페이지에 추가할 수 있는 비동기 함수입니다.

```javascript
function Page({ stars }) {
  return <div>Next stars: {stars}</div>
}

Page.getInitialProps = async ctx => {
  const res = await fetch("https://api.github.com/repos/vercel/next.js")
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default Page
```

getInitialProps는 일부 데이터를 비동기적으로 가져온 다음 props로 전달합니다.

getInitialProps에서 반환된 데이터는 JSON.stringify가 하는 것과 비슷하게 서버 렌더링 시 serialized 됩니다. getInitialProps에서 반환된 객체가 Date, Map 또는 Set을 사용하지 않는 일반 객체인지 확인하세요.

초기 페이지 load의 경우 getInitialProps는 서버에서만 실행됩니다.

하지만 next/link component를 통하거나 next/router를 사용하여 다른 경로로 이동할 때는 클라이언트에서 실행됩니다.

##### Context Object

getInitialProps는 context라는 single argument를 받으며 다음 properties을 가진 객체입니다.

- pathname: 현재 경로. /pages에 있는 페이지의 경로입니다.

- query: URL의 쿼리 문자열

- asPath: 브라우저에 표시되는 실제 경로(쿼리 포함)의 문자열

- req: HTTP request object (server only)

- res: HTTP request object (server only)

- err: 렌더링 중 오류가 발생한 경우 오류 개체

##### TypeScript

```javascript
import { NextPage } from "next"

interface Props {
  userAgent?: string;
}

const Page: NextPage<Props> = ({ userAgent }) => (
  <main>Your user agent: {userAgent}</main>
)

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  return { userAgent }
}

export default Page
```

---

#### getServerSideProps

page에서 getServerSideProps라는 함수를 내보내면 Next.js는 반환된 데이터를 사용하여 each request 마 이 페이지를 pre-rendering 합니다. 자주 데이터가 변경된다거나 가장 최신 데이터를 표시하도록 페이지를 업데이트하려는 경우에 유용합니다.

```javascript
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
```

getServerSideProps는 최상위 level에서 모듈을 가져올 수 있습니다. 사용된 데이터는 client에서 번들로 제공되지 않습니다. 즉, DB에서 데이터 fetch를 포함하여 getServerSideProps에서 직접 서버 측 코드를 작성할 수 있습니다.

##### Context parameter

- params: page에서 dynamic route를 사용하는 경우 params에 route parameter가 포함됩니다. 페이지 이름이 `[id]`.js이면 params는 { id: ... }처럼 보일 것입니다.

- req

- res: HTTP 응답 개체.

- query: 쿼리 문자열을 나타내는 개체입니다.

- preview: 페이지가 preview mode라면 true이고 그렇지 않으면 false입니다.

- previewData

- resolvedUrl

- locale

- locales

- defaultLocale

##### getServerSideProps return values

- props

props 개체는 page component에서 각 값을 받는 key-value 쌍입니다. 전달된 모든 props가 JSON.stringify로 직렬화될 수 있도록 직렬화 가능한 객체여야 합니다.

```javascript
export async function getServerSideProps(context) {
  return {
    props: { message: `Next.js is awesome` }, // will be passed to the page component as props
  }
}
```

- notFound

notFound를 사용하면 페이지가 404 상태 및 404 페이지를 반환할 수 있습니다. 이전에 성공적으로 생성된 페이지가 있더라도 페이지가 404를 반환합니다.

```javascript
export async function getServerSideProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}
```

- redirect

redirect을 사용하면 내부 및 외부 리소스로 redirect 할 수 있습니다.

> { destination: string, permanent: boolean }

```javascript
export async function getServerSideProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {}, // will be passed to the page component as props
  }
}
```

##### TypeScript

```javascript
import { GetServerSideProps } from "next"

type Data = { ... }

export const getServerSideProps: GetServerSideProps<{
  data: Data,
}> = async context => {
  const res = await fetch("https://.../data")
  const data: Data = await res.json()

  return {
    props: {
      data,
    },
  }
}
```

---

#### getStaticPaths

dynamic routes를 사용하는 page에서 getStaticPaths라는 함수를 내보낼 때 Next.js는 getStaticPaths에 의해 지정된 모든 경로를 정적으로 pre-rendering 합니다.

```javascript
export async function getStaticPaths() {
  return {
    paths: [
      { params: { ... } } // See the "paths" section below
    ],
    fallback: true, false or "blocking" // See the "fallback" section below
  };
}
```

##### getStaticPaths return values

getStaticPaths 함수는 다음 필수 속성이 있는 객체를 반환해야 합니다.

- paths

path key는 pre-rendering 될 path를 결정합니다. 예를 들어, pages/posts/`[id]`.js라는 dynamic routes를 사용하는 페이지가 있다고 가정합니다.

```javascript
return {
  paths: [
    { params: { id: '1' }},
    {
      params: { id: '2' },
      // with i18n configured the locale for the path can be returned as well
      locale: "en",
    },
  ],
  fallback: ...
}
```

그러면 Next.js는 pages/posts/`[id]`.js의 page component를 사용하여 next/build 중에 /posts/1 및 /posts/2를 정적으로 생성합니다.

각 params 객체의 value은 페이지 이름에 사용된 매개변수와 일치해야 합니다.

- pages/posts/`[postId]`/`[commentId]`

  > params에는 postId 및 commentId가 포함되어야 합니다.

- pages/`[...slug]` (catch-all route)

  > params에는 slug(배열)가 포함되어야 합니다. 이 배열이 ['hello', 'world']이면 Next.js는 정적으로 /hello/world에 페이지를 생성합니다.

- pages/`[[...slug]]` (optional catch-all route)

  > null, [], undefined 또는 false를 사용하여 최상위 경로를 렌더링합니다.

❗️ params 문자열은 대소문자를 구분하며 경로가 올바르게 생성되도록 이상적으로 정규화해야 합니다. 예를 들어 WoRLD가 매개변수에 대해 반환된 경우 WoRLD가 실제 방문한 경로일 때만 일치하며 world 또는 World가 아닙니다.

##### fallback: false

fallback이 false인 경우 getStaticPaths에서 반환하지 않은 모든 경로는 404 페이지가 됩니다.

next/build가 실행되면 Next.js는 getStaticPaths가 fallback: false를 반환했는지 확인한 다음 getStaticPaths가 반환한 경로만 빌드합니다. 이 옵션은 생성할 경로가 적거나 새 페이지 데이터가 자주 추가되지 않는 경우에 유용합니다. 더 많은 경로를 추가해야 하고 fallback: false가 있는 경우 새 경로를 생성할 수 있도록 next/build를 다시 실행해야 합니다.

```javascript
// pages/posts/[id].js

function Post({ post }) {
  // Render post...
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

export default Post
```

##### fallback: true

fallback이 true이면 getStaticProps의 동작이 다음과 같이 변경됩니다.

- getStaticPaths에서 반환된 경로는 getStaticProps에 의해 빌드 시 HTML로 렌더링됩니다.

- 빌드 시 생성되지 않은 경로는 404 페이지를 생성하지 않습니다. 대신 Next.js는 이러한 경로에 대한 첫 번째 요청에서 [“fallback” page](https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-pages)를 제공합니다. 그리고 서버에서 static하게 페이지를 생성합니다.

- fallback: true가 있는 페이지가 next/link 또는 next/router(client side)를 통해 이동될 때 Next.js는 fallback을 제공하지 않고 대신 페이지가 fallback: 'blocking'으로 작동합니다.

fallback: true는 앱에 데이터에 의존하는 정적 페이지가 매우 많은 경우에 유용합니다. 모든 제품 페이지를 미리 렌더링하려면 빌드 시간이 매우 오래 걸립니다.

> (예: 매우 큰 전자 상거래 사이트).

대신 페이지의 작은 하위 집합을 정적으로 생성하고 나머지는 fallback: true를 사용할 수 있습니다. 누군가 아직 생성되지 않은 페이지를 요청하면 사용자는 로딩 표시기 또는 스켈레톤 component가 있는 페이지를 보게 됩니다.

잠시 후 getStaticProps가 완료되고 페이지가 요청된 데이터로 렌더링됩니다. 이제부터 동일한 페이지를 요청하는 모든 사람은 정적으로 pre-rendering 된 페이지를 받게 됩니다.

이를 통해 사용자는 빠른 빌드와 정적 생성의 이점을 유지하면서 항상 빠른 경험을 할 수 있습니다.

fallback: true는 생성된 페이지를 업데이트하지 않습니다. 이에 대해서는 Incremental Static Regeneration을 살펴보세요.

##### fallback: 'blocking'

fallback이 'blocking'인 경우 getStaticPaths에서 반환되지 않은 새 path는 SSR과 동일하게 HTML이 생성될 때까지 기다린 다음 이후 요청을 위해 cached 되어 path 당 한 번만 발생합니다.

getStaticProps는 다음과 같이 작동합니다.

- getStaticPaths에서 반환된 경로는 getStaticProps에 의해 빌드 시 HTML로 렌더링됩니다.

- 빌드 시 생성되지 않은 경로는 404 페이지를 생성하지 않습니다. 대신 첫 번째 요청에서 SSR을 수행하고 생성된 HTML을 반환합니다.

- 완료되면 브라우저는 생성된 경로에 대한 HTML을 수신합니다. 사용자의 관점에서 "브라우저가 페이지를 요청하는 중"에서 "전체 페이지가 로드됨"으로 전환됩니다.

- 동시에 Next.js는 이 경로를 pre-rendering 된 페이지 목록에 추가합니다. 동일한 경로에 대한 후속 요청은 빌드 시 미리 렌더링된 다른 페이지와 마찬가지로 생성된 페이지를 제공합니다.

- fallback: 'blocking'은 기본적으로 생성된 페이지를 업데이트하지 않습니다.

##### TypeScript

```javascript
import { GetStaticPaths } from "next"

export const getStaticPaths: GetStaticPaths = async () => {
  // ...
}
```

---

#### getStaticProps

- getServerSideProps와 property가 거의 비슷하여 생략함. 확인 하고 싶으신 분은 아래 링크에서 참조하세요.

[여기서 확인하세요.](https://nextjs.org/docs/api-reference/data-fetching/get-static-props)
