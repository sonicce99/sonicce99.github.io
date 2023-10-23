---
title: "인앱결제 프로젝트 중 만난 일"
date: "2023-10-23"
description: "캠핏에서 shopby를 통한 인앱결제 프로젝트 중 만났던 API 순차요청에 관한 이야기입니다."
keywords:
  [react, 자바스크립트, javascript, shopby, 캠핏, camfit, 프론트엔드, frontend]
---

## 들어가며

안녕하세요. <a href="https://camfit.co.kr/" target="_blank">캠핏</a>의 웹 프론트개발자 이동수입니다.

현재 캠핏 앱은 웹뷰를 사용하고 있습니다.

실제로 대부분의 캠핏 사용자들이 앱을 사용하고 있기 때문에 회사에서는 앱의 사용자 경험을 가장 중요하게 생각하고, 이를 향상 시키고자 항상 노력하고 있습니다. 그 일환 중 하나로 **인앱결제** 프로젝트를 올해 진행했습니다.

기존에는 <a href="https://smartstore.naver.com/camfit" target="_blank">캠핏 스마트스토어</a>가 있어서 앱내에서 결제 시 스마트스토어 외부링크로 빠졌었는데 앱내에서 결제를 가능하게 하고자 NHN Commerce에서 제공하는 <a href="https://www.nhn-commerce.com/z/shopby" target="_blank">shopby</a>를 사용하여 인앱 결제 플로우를 개발했습니다.

안앱결제 플로우를 개발하는 과정에서 있었던 이슈 중 하나를 여러분에게 소개하고자 합니다.

## 로그인이 유지되는 이유

한번 로그인을 해두면 일정시간동안 다음에 다시 해당 사이트를 방문했을 때 자동으로 로그인이 되어있는 경험을 모두가 자주 하셨을것 같습니다.

이게 가능한 이유가 뭘까요?

이것이 가능한 이유는 네이버를 예로 들면 사용자가 로그인을 했을 때, 네이버 서버가 사용자의 <u>브라우저 어딘가에 **사용자의 로그인 정보**</u>를 저장해두기 때문입니다.

그래서 네이버에 접속했을 때 브라우저에 사용자의 로그인 정보가 저장되어 있다면 로그인 되어 있는 상태를 가질 수 있는 것입니다.

이때 보안상의 이유로 브라우저에 사용자의 로그인 정보를 저장하기 위해서는 2가지의 조건이 있습니다.

1. 로그인 정보는 도메인에 종속됩니다.

2. 로그인 정보는 유효기한이 존재 할 수 있습니다.

그래서 크롬에서 로그인한 뒤에 사파리에서 네이버를 접속하면 로그인이 되어있지 않으며, 서버에서 정한 유효시간이 지나면 다시 로그인을 해야하는 것입니다.

## JSON WEB TOKEN

사용자의 로그인 정보를 브라우저에 저장하기 위한 방식으로 <strong><a href="https://jwt.io/" target="_blank">JSON WEB TOKEN</a></strong>을 많이 사용합니다.

<img width="630px " src="https://github.com/sonicce99/TIL/assets/87749134/df4b8724-b93a-4f48-a4b6-c54ba2fadbad" />

JWT는 3가지 (Header, Payload, Signature)부분으로 구분되어 있으며, 각각은 .(점)으로 구분됩니다.
(사진을 자세히 보시면 엄청나게 긴 문자열에 2개의 점이 있습니다.)

JWT에 대한 세부적인 내용은 이 블로그의 목적을 벗어나므로 자세히 소개하지는 않겠습니다.

(자세한 내용은 <a href="https://research.securitum.com/jwt-json-web-token-security/" target="_blank">여기</a>를 참조해주세요.)

결과적으로 사용자가 자신의 아이디와 패스워드를 입력하면 서버는 해당 아이디와 비밀번호가 유효한지 체크하고 유효한 경우, JWT를 생성하여 사용자 브라우저의 로컬스토리지 or 쿠키에 심어 돌려주게되고 사용자는 해당 JWT를 사용하여 서버 자원에 접근 인가(Authorization) 받게 됩니다.

그리고 유저가 어떤 정보를 http 요청하게 되면 이 JWT는 **HTTP header**속에 담기게 되어 서버에 전송되게 됩니다.

## 오류 겹치기

동수는 최근 회사에서 점심을 먹고 커피를 자주 마시게 되었습니다.

그런데 3개월쯤 하다보니, 커피를 마실 때 생기는 플라스틱이 한번 쓰고 버리긴 너무 아깝다는 생각이 들게되었고, 지구를 지키자?는 마음으로 텀블러를 구매하기 위해 쿠팡에 들어갔습니다.

텀블러를 구매하기하기 위해 쿠팡은 다음과 같은 정보를 유저에게 보여줘야하는 상황입니다.

1. 유저의 최근 배송지 주소

2. 유저가 사용가능한 적립금

3. 유저의 주문, 반품, 환불 내역

쿠팡은 유저의 3가지의 정보를 서버에 받아오기 위해서 서버에 3번의 요청해야합니다.

이때 정상적으로 응답이 오게되면 데이터를 받을 수 있지만, 무엇인가 잘못된 경우 유저에게 잘못되었다는걸 알려줘야합니다.

그런데 하필 동수가 처음 쿠팡에 접속한지 하루가 지나버려 JWT의 유효기간이 지났고, 기한이 만료된 잘못된 JWT로 3개의 요청을 서버에 보냈습니다.

당연히 3개의 응답이 모두 정상적인 인가를 받지 못했습니다.

아래 버튼을 한번 눌러보세요.

<iframe class="example-frame" width="100%" height='100px' src="https://sonicce99.github.io/api-sequential-requests/parallel/"></iframe>

3개의 요청을 보냈고 3개의 요청이 실패했으니, 각각에 대해 잘못되었다고 유저에게 응답을 해주었습니다.

하지만 어떤가요?

유저는 버튼을 한번 클릭했을 뿐인데 알림이 3개가 나타나고 있습니다.

실제 서비스에서 이렇게 동작한다면 유저의 사용자경험이 감소할 것입니다.

위의 동작을 코드로 표현해보겠습니다.

```js
// 1초후 에러를 반환하는 promise.
const apiRequest = request => {
  const jwt = `이것은 유효기한이 만료된 JWT`
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (jwt === "이것은 유효기한이 만료된 JWT") {
        reject(new Error(`${request} 에러!`))
      } else {
        resolve(`${request} 성공!`)
      }
    }, 1000)
  })
}

const onClick = async () => {
  const requests = [
    "최근 배송지 주소 가져오기",
    "사용가능한 적립금 가져오기",
    "주문, 반품, 환불 내역 가져오기",
  ]
  const promises = requests.map(request => apiRequest(request))
  const results = await Promise.allSettled(promises)

  results.forEach(result => {
    const { status, reason } = result

    // promise가 거부될 경우.
    if (status === "rejected") {
      alert(reason)
    }
  })
}

// 텀블러 구매하기 버튼 클릭 시 동작.
onClick()
```

onClick 함수를 보면 map을 사용하여 apiRequest를 병렬적으로 실행하고 있습니다.

잘못된 jwt를 가지고 동시에 3개의 요청을 보냈기 때문에 실패한 응답이 3개가 올 수 밖에 없습니다. (주륵🥲)

이렇게 사용자 경험이 떨어질 수 있는 문제를 어떻게 해결할 수 있을까요?

인앱결제 프로젝트 도중 위와 같은 문제에 직면하게 되었고 저희 캠핏 프론트엔드 팀은 아래와 같이 문제를 해결했습니다.

## API 순차 요청

JWT 시간 만료와 같이 <u>하나의 값이 정상적이지 않아 이후의 모든 API 요청 결과 역시 부정적 영향을 미칠 가능성</u>이 있는 요청들의 경우, **순차적**으로 요청을 보내고 정상적인 응답이 온 경우에만 다음 요청을 보내도록 합니다.

저희는 API 요청을 보내기 위한 Queue를 하나 생성했습니다.

API 요청이 들어오면 Queue에 push 해두고, 요청이 성공했을 때만 Queue에서 해당 요청을 dequeue 후 다음 요청을 하게합니다.

아래 순차 요청 버튼을 클릭해보세요!

<iframe class="example-frame" width="100%" height='100px' src="https://sonicce99.github.io/api-sequential-requests/sequential/"></iframe>

이제는 오류가 겹치지 않습니다!

어떻게 변경되었는지 코드로 한번 보겠습니다.

```js
// api 순차 요청 하기 위한 queue가 새로 생성
const apiQueue = []
let jwt = `이것은 유효기한이 만료된 JWT`

const apiRequest = request => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (jwt === "이것은 유효기한이 만료된 JWT") {
        reject(new Error(`${request} 에러!`))
      } else {
        resolve(`${request} 성공!`)
      }
    }, 1000)
  })
}

const sequentialRequests = async () => {
  try {
    const req_path = apiQueue[0]
    await apiRequest(req_path)
    alert(`success ${req_path}`)

    // api 요청 성공 시 dequeue.
    apiQueue.shift()

    if (apiQueue.length > 0) {
      sequentialRequests()
    }
  } catch (error) {
    alert(error + ` JWT를 다시 받아오겠습니다.`)
    jwt = `이것은 정상적인 JWT`

    if (apiQueue.length > 0) {
      sequentialRequests()
    }
  }
}

const onClick = async path => {
  apiQueue.push(path)

  // 최초 요청이 들어왔을 때만 순차 요청 함수 실행.
  if (apiQueue.length === 1) {
    sequentialRequests()
  }
}

onClick(`1. 최근 배송지 주소 가져오기`)

// 0.3초 후 다른 여러 api 요청이 queue에 enqueue된다고 가정.
setTimeout(() => {
  apiQueue.push(`2. 사용가능한 적립금 가져오기`)
  apiQueue.push(`3. 주문, 반품, 환불 내역 가져오기`)
}, 300)
```

처음에 저희는 3가지의 요청이 있다고 가정했었습니다.

1. 유저의 최근 배송지 주소

2. 유저가 사용가능한 적립금

3. 유저의 주문, 반품, 환불 내역

첫번째로 '최근 배송지 주소 가져오기' 요청을 시도했는데 만료된 JWT로 요청을 했기 때문에 Error가 발생했습니다.

첫번째 요청에서 에러가 발생했기 때문에 2번째, 3번째 요청을 실행하지 않습니다.👍

JWT를 새로 받아온 이후 정상적인 JWT를 가지고 첫번째 요청을 재시도하고 이후 순차적으로 요청을 시도하게 됩니다.

## 인앱결제 프로젝트에 대한 회고

인앱결제 프로젝트를 배포하고, 디자인팀, 프론트엔드, 백엔드팀, 커머스팀, 운영팀, 영업팀 등 여러 팀이 모여 회고를 진행했습니다. 이번 캠핏에는 큰 변화가 있었습니다.

기존에는 하나의 프로젝트를 명확한 기한이 없이 스프린트(Sprint) 형식으로 진행했었지만, 이번 프로젝트부터는 <strong>_이터레이션(Iteration)_</strong>으로 배포까지 6주간의 기한을 명확히 두고 프로젝트가 진행되었습니다. QA 역시 기존에는 화이트박스 테스트만 진행했었지만, 개발자가 테스트케이스를 작성하고 테스터가 블랙박스 테스트를 진행함으로써 다양한 문제 상황을 배포 전에 더욱 확실히 잡을 수 있었습니다.

이번 API 순차 요청을 하게 된 계기 역시 블랙박스 테스트 도중 발견된 문제를 해결하기 위해 진행되었으며, 개발자가 미쳐 고려하지 못했던 부분을 잡아줄 수 있는 충분한 QA 프로세스가 있었다는 점에서 훨씬 안심하고 프로젝트를 진행 할 수 있었습니다.

감사합니다.
