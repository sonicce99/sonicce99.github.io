---
title: "2022 상반기 회고"
date: "2022-07-24"
description: "회사에서 입사하고 약 4개월간의 회고입니다."
---

# 개발자로서의 온전한 시작.

## 들어가기에 앞서

기대 반 걱정 반으로 회사에 입사한지 거진 4개월이 지났다. 이제 4개월 밖에 안되었지만 참 많은 일들을 한 것 같다. 회사에서 사용하는 개발 환경에 대해 새로 공부해야할 내용들도 많았고 (Next.js, Redux-toolkit, RTK-Query, sheet.js, class-validator ... 등등) 이것들을 공부하면서 동시에 회사에서 요구하는 사항들을 훌륭하게 수행해야만 했다.
정말 짧은 기간이지만 분명히 더욱 성장할 수 있었던 상반기였다.

## 회사 프로젝트

### 1. 홈페이지 개편

![스크린샷 2022-07-25 오전 10 14 01](https://user-images.githubusercontent.com/87749134/180675203-4a8aa382-a758-4e2a-879c-8baac094b716.png)

회사에 입사하고 가장 처음에 했었던 프로젝트였다. 외주를 주고 웹 퍼블리셔 분들에게 작업을 맡겼다고 했었는데 일부 기능들이 정상적으로 동작하지 않는걸 나중에 발견했다.
(ex 특정 항목 여러번 빠르게 클릭시 일부 컴퓨터에서 동작이 원할하지 않았음.) 그래서 그 분들이 만들어 놓은걸 가지고 다시 작업하게 되었었는데 이떄의 문제점들은 다음과 같다.

- 순수 html, css , JQuery로 작성이 되어있었다.

  > 개발 퍼포먼스, UI 모둘화가 너무 좋지 않았다. 반복되는 내용이 (header, footer menuBar 등등 ...) 전부 복.붙 하여 코드가 작성되어 있었고, JQuery에 대해서는 제대로 알지 못했었기 떄문에 오류의 원인을 파악하기가 어려웠다.

- html 파일명이 어느 페이지를 지칭하는지 전혀 알 수 없었다.

  > 파일명이 sub1.html, sub2_2_2.html ... 등등 파일명 뿐만 아니라 변수명 조차 a 로 적어두는 등 퍼블리셔 분이 무엇을 의도하면서 작성한건지 전혀 알 수 없었다.

차라리 처음부터 만들었다면 훨씬 더 구조적으로 명확한 구조를 가지게 만들었을 수 있을거 같았지만 어찌됬던지 주어진 코드에서 빠르게 수정을 해야했기에 다음과 같이 문제를 해결하기로 했다.

1. JQuery 에서 Vanila javascript로 일부 migration.

2. 반복되는 코드를 최대한 지우고 js로 모듈화.

   - 매 페이지마다 반복되는 review slider, pagination, banner, footer 등등 전부 삭제후 js로 분리. index.html에서 type='module'로 import.

   ex) ↓ pagination 코드 예시

   ```javascript
   let template = `
       <span class="prev">
           <a href="#${word}/page/{{__prev__}}">
               <img src="./img/page_left.png" alt="이전" />이전
           </a>
       </span>
       <ol>
       {{ li }}
       </ol>
       <span class="next">
           <a href="#${word}/page/{{__next__}}">
           <img src="./img/page_right.png" alt="다음" />다음
           </a>
       </span>
       `

   template = template.replace("{{ li }}", array.join(""))
   ```

   다행히 과거에 [김민태의 프론트엔드 아카데미 : 제 1강 Javascript & Typescript Essential](https://fastcampus.co.kr/dev_academy_kmt1) 강의에서 Vanila Javascript를 어떤식으로 효과적으로 작성하는지 공부를 해두었기 때문에 나름 만족스럽게 할 수 있었다. ~~사실 지금도 이거 다 갈아 엎고 react로 다시 만들고 싶다.~~

   React가 얼마나 편리한지, Next.js 등등 우리가 지금 사용하는 이 방식이 얼마나 좋은 방식인지 정말 많이 느낄 수 있었던 홈페이지 개편이였다.

### 2. OMS 주문 업로드 방식 변경

### 3. 프로젝트 구조 변경 (Next.js)

### 4. 회원가입 프로세스 리뉴얼

### 5. WMS 개발
