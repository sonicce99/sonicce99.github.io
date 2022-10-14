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
