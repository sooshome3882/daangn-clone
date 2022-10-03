<div align="center">

  # 당근마켓 클론코딩 (+ 백오피스)
</div> 
<br>

## 💡 기획 의도

### ⁉️ 당근마켓을 클론코딩하게 된 이유는?

👉 서비스 되고 있는 플랫폼 중에서 기존에 잘 사용하고 있는 당근 마켓을 개발하게 되면 **애정있는 개발**이 가능할 것으로 판단

👉 잘 사용하고 있는 프로그램 기능(동네 범위 설정, 매너 온도 기능 등) 중 **어떻게 동작하는지 궁금한 기능**이 있어 **개발자로서 분석 및 개발해보고 싶은 욕구**가 발생

<br>

## 👩🏻‍💻 구현 기능

### 👨‍👩‍👦 **회원 기능**  

- [X] 문자 인증으로 로그인 / 회원가입  
- [X] 🗝 내 동네 설정 및 동네 범위 설정  
- [X] 프로필 설정  
- [X] 마이페이지 - 판매내역, 구매내역, 관심목록, 리뷰 평가

### ✒️ **게시글 - 내 물건 팔기 or 사기 메뉴**  

- [X] 게시글 CRUD   
  - [X] 🗝 보여줄 동네 범위 설정 (설정된 동네 범위에 있는 유저만 게시글 확인가능)  
  - [X] 카테고리 분류  
- [X] 가격 제안  
- [X] 조회수(사용자 당 1회 증가), 괸심표시  
- [X] 게시글 신고  
- [X] 🗝 채팅  
  - [X] 채팅 메시지 보내기  
  - [X] 채팅방 목록, 삭제, 읽지 않은 메시지 수 확인  
  - [X] 채팅 내용 상세 확인  
  - [X] 채팅 사용자 신고, 채팅글 신고  

### 💬 **리뷰**   

- [X] 구매자, 판매자 리뷰 CRUD   
- [X] 🗝 매너 온도 계산  

### 🚨 **관리자**  

- [X] 관리자 계정 생성, 수정, 로그인  
- [X] 신고 접수 관리  
  - [X] 이용정지자 리스트 조회  
  - [X] 신고 목록 조회 (사용자 신고, 채팅신고, 게시글)  
  - [X] 신고 접수 처리  
- [X] 관리자 작업 로그 남기기  

<br>

## 🔨 스택

| Language | FrameWork | DataBase | Platform | Deploy (AWS) | API | ETC |
| --- | --- | --- | --- | --- | --- | --- |
| TypeScript | NestJS | MySQL | TypeORM | EC2, RDS | GraphQL | Github |
|  |  | Redis | Socket.io | S3, ElastiCache, ECS |  | Slack |
|  |  | ElasticSearch |  |  |  | Notion |

<br>

## 📅 일정

**2022.08.25 - 2022.09.25**

[구글 스프레드시트로 상세한 일정관리](https://docs.google.com/spreadsheets/d/1NEJJEXuimt5pyy7hs0ncrXQXePuCDBNiO_JKWltWYK0/edit#gid=0)

![일정](https://user-images.githubusercontent.com/94504613/193526827-bff6461d-b847-4a2d-b0bc-bd107d45478e.png)

<br>

## 🙌 역할분담

**[허정연(golgol22)](https://github.com/golgol22)** 
- 게시글 (작성, 수정, 삭제, 상세보기, 목록조회&검색)
- 유저 (인증번호 발급, 회원가입, 로그인, 사용자 프로필 설정)
- 위치 (사용자 위치 기반 근처 동네 목록 조회, 동네 검색, 설정된 동네 목록 조회, 동네 선택 변경, 동네 추가, 동네 삭제, 동네 인증, 보여줄 동네 범위 변경, 선택된 동네 범위에 따른 동네 개수, 선택된 동네 범위에 따른 동네 목록)
- 리뷰 (판매자에 대한 구매후기 작성, 구매자에 대한 구매후기 작성, 판매자에 대한 구매후기 수정, 구매자에 대한 구매후기 수정, 판매자에 대한 구매후기 삭제, 구매자에 대한 구매후기 삭제)
- 관리자 (관리자 계정 로그인, 관리자 계정 생성, 관리자 계정 수정, 게시글 신고록록조회, 채팅신고목록 조회, 유저신고목록 조회)
- S3&Elasticache&ECS 배포 

**[이승연(dltmddus1998)](https://github.com/dltmddus1998)**
- 게시글 (끌어올리기, 가격제시, 신고, 거래상태변경, 숨김처리 및 해제, 좋아요, 조회수)
- 유저 (구매 처리, 구매 및 판매 리스트 조회, 관심목록 조회, 숨김 리스트 조회, 프로필 조회, 거래 후기 조회)
- 채팅 (채팅방 생성, 채팅하기, 채팅방 및 채팅 조회, 채팅 및 유저 신고)
- 관리자 (채팅|게시글|유저 신고 처리, 이용정지자 처리 및 해제, 이용정지자 목록 조회, 사용자 리스트 관리자 권한 조회, 관리자 작업 로그 기록 및 검색)
- EC2&RDS 배포

<br>

## 💬 마무리

→ typescript, nestjs, graphql, typeorm 기술 스택을 팀원 모두 처음 사용해 보기도 하고 자료가 적어서 학습하고 적용하는 부분에서 어려움을 겪었다. 하지만, **끈질기게 공부해서 구현에 성공**하여 뿌듯했다.

→ 프로젝트 기간동안 연휴도 있었고 학교나 강의 수강할 때처럼 **누군가의 관리 없이** 팀원 둘이서만 프로젝트를 잘 끌어나가는데 어려움이 있었지만 계획한 기능 모두 끝내서 좋았다.
