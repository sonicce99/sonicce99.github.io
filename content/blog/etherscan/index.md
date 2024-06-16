---
title: "etherscan API 문서"
date: "2024-06-15"
description: ""
---

## 소개

Etherscan API 문서에 오신 것을 환영합니다 🚀.

Etherscan은 decentralized smart contracts platform인 Ethereum을 위한 블록체인 explorer, search, API 및 분석 플랫폼입니다.

블록체인 데이터에 대한 equitable access를 제공하기 위해 개발자가 GET/POST 요청을 통해 Etherscan의 블록 탐색기 데이터 및 서비스에 직접 액세스할 수 있도록 Etherscan 개발자 API를 개발했습니다.

Etherscan의 API는 커뮤니티 서비스로 제공되며 보증 없이 제공되므로 필요한 것만 사용하시기 바랍니다.

## API ENDPOINTS

### Accounts

[Single Address애서 Ether 잔액 조회](https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-a-single-address)

[단일 호출로 Multiple Addresses의 Ether 잔액 조회](https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-multiple-addresses-in-a-single-call)

[주소에서 Normal Transactions 목록 조회](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-normal-transactions-by-address)

- 주소에서 수행된 트랜잭션 목록을 반환합니다.

- Normal Transactions란?

  - 사용자가 직접 블록체인 네트워크에 보내는 트랜잭션.
  - 외부 계정(EOA: Externally Owned Account)에서 다른 외부 계정 또는 Smart Contract 계정으로 자금을 전송하는 작업을 포함.
    - Alice가 Bob에게 1 ETH를 전송하는 경우.
    - Alice가 스마트 계약에 1 ETH를 전송하여 특정 서비스를 사용하는 경우.

[주소에서 Internal Transactions 목록 조회](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-internal-transactions-by-address)

- Internal Transactions

  - Smart Contract 내부에서 발생하는 트랜잭션.
  - 외부에서 발생하는 트랜잭션과 다르게 직접적으로 블록체인에 기록되지 않지만, Smart Contract의 함수 호출이나 상태 변경을 통해 발생.
    - Alice가 Smart Contract A에 1 ETH를 전송하고, Smart Contract A가 이더를 Smart Contract B로 전송하는 경우.

[Transaction hash로 Internal Transactions 조회](https://docs.etherscan.io/api-endpoints/accounts#get-internal-transactions-by-transaction-hash)

- Transaction 내에서 수행된 내부 트랜잭션 목록을 반환합니다.

[Block 범위별로 Internal Transactions 조회](https://docs.etherscan.io/api-endpoints/accounts#get-internal-transactions-by-block-range)

[주소에서 발생된 ERC20 기반 토큰 전송 이벤트 목록 조회](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-erc20-token-transfer-events-by-address)
