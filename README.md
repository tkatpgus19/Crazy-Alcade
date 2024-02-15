# Crazy-Alcade

### 🗓️ 프로젝트 진행 기간

2024.01.02 - 2024.01.21 기획

2024.01.22 - 2024.02.16 개발

<br>

### 🧚‍♀️ 서비스 소개

알고리즘만 풀기 지루하지 않으셨나요?

친구와 함께 즐겁게 알고리즘 문제를 풀어보세요!

노말 모드에서는 친구들과 함께 코딩 테스트를 대비해 문제를 풀고,

아이템 모드에서는 아이템을 사용하여 친구의 알고리즘 문제 풀이를 방해하면서 문제를 풀 수 있어요.

알고리즘 문제 풀이에 게임의 재미를 더한 알고리즘 배틀 서비스!

<br>

### 📍 주요 기능

- 시작 화면
    
    ![Untitled](/uploads/ff56b8ba7b146a2405217df94c7f0523/Untitled.png)
    
    ![Untitled_1](/uploads/f34170dfff692fc51e80804580ec28df/Untitled_1.png)
    
    - 소셜 로그인: 카카오/구글
- 메인 화면
    
    ![Untitled_2](/uploads/c6f4cb548be826847285eef9c3739981/Untitled_2.png)
    
    - 내 기본 정보 + 보유 아이템 확인
    - 전체 채팅
    - 방을 선택하여 들어갈 수 있다.
- 방 만들기
    
    ![Untitled_3](/uploads/aa4eb331fcb0ae64d0f1a959d5609427/Untitled_3.png)
    
    - 노말전, 아이템전 여부를 선택한다.
    - 방 정보를 기입하여 방을 만들 수 있다.
- 대기방 입장
    
    ![Untitled_4](/uploads/b2706072b4553478deffc92b4dd8254c/Untitled_4.png)
    
    - 채팅
    - 방 정보를 확인할 수 있다.
    - 방장이 아닌 유저들은 게임에 참여할 준비가 되면 READY 상태로 변경한다.
    
    ![Untitled_5](/uploads/8369335d55360a4a61db84bbd27814ff/Untitled_5.png)
    
    - 방장은 모든 유저들이 READY 상태일 때 START 버튼을 눌러 게임을 시작할 수 있다.
    
    ![Untitled_6](/uploads/e39075f7d6430ffeddb114c98145ce25/Untitled_6.png)
    
    - 방장은 악성 유저를 강퇴시킬 수 있다.
- 게임 시작 (노말 모드, 아이템 모드 동일)
    
    ![Untitled_7](/uploads/ab63f63925b7b2ccef00c029ca470a6b/Untitled_7.png)
    
    - 문제를 확인하고 풀 수 있다.
    - 코드 실행을 누르면 예제 채점 결과가 출력된다. 게임 결과에는 반영되지 않는다.
    
    ![Untitled_8](/uploads/ecbf1f9b7d0f28150eca74ed5667c515/Untitled_8.png)
    
    - 코드 제출을 누르면 실제 채점 결과가 출력된다. 게임 결과에 반영된다.
    
    ![Untitled_9](/uploads/669f0fd4877b41d4f1ba981733572b6a/Untitled_9.png)
    
    - 문제 풀이 시간이 모두 끝나면 게임 결과가 출력된다.
    - 게임 결과는 시간이 빠른 순, 메모리가 빠른 순으로 출력된다.
    - 문제 난이도, 게임 결과에 따라 경험치와 코인을 얻는다.
- 아이템 상점
    
    ![Untitled_10](/uploads/35d31705eafdaebea4416dad7f68adbe/Untitled_10.png)
    
    - 게임에서 얻은 코인을 이용해 아이템을 구매할 수 있다.
    
    ![Untitled_11](/uploads/485a3944789b352eadeed393bac2baae/Untitled_11.png)
    
    - 아이템 종류: 문어(화면 가리기), 병아리(방해하기), 물풍선(버튼 숨기기), 요술봉(화면 뒤집기), 쉴드(아이템 무력화)
- 아이템 모드
    
    ![Untitled_12](/uploads/78f68a061d0879977231711058e1161f/Untitled_12.png)
    
    - 쓰고 싶은 아이템을 누르고, 공격할 유저의 닉네임을 누르면 해당 유저에게 아이템이 사용된다.
    - 아이템 현황은 화면 공유를 통해 다른 유저들에게도 보여진다.
    - 쉴드를 사용하여 공격을 방어할 수도 있다.

<br>

### 📱 와이어 프레임 & 프로토타입

![Untitled_13](/uploads/860dbd422a64c4ab023a6c9a840fe78f/Untitled_13.png)

![Untitled_14](/uploads/547159b461a0c2837e87ac8fd291b551/Untitled_14.png)

<br>

### 🗂️ ERD

<기획 ERD>

![Untitled_15](/uploads/a083e18128bbe05253c28c19b1490b34/Untitled_15.png)

<최종 ERD>

![Untitled_16](/uploads/2214533ffaba497ffd4a900110ab5164/Untitled_16.png)

- 방은 서버에서 관리하기로 결정

<br>

### 🎞️ 시스템 구성도

![Untitled_17](/uploads/ad64b93469693138c7192e5a81bdcbba/Untitled_17.png)

<br>

### 🔌 기술 스택

- Frontend
    - React 18.2.0
    - npm 10.2.5
    - Node.js 20.11.0
    - Redux 5.0.1
    - Redux-toolkit 2.1.0
    - React-router 6.21.4
    - Ace-Editor 1.13.2
    - open-vidu
    - socket.js
    - stomp.js
- Backend
    - Java 17
    - SpringBoot 3.2.2
    - Spring Data JPA
    - Spring Web
    - Spring Validation
    - Spring Web
    - QueryDSL
    - oauth2-client
    - socket.io
    - MariaDB
- Infra
    - AWS EC2
    - NGINX
    - Jenkins
    - Docker
- Tools
    - Jira
    - Postman
    - Gerrit
    - Notion
    - Figma
    - GitLab

<br>

### 📝 개발 문서

- [API 명세서](https://www.notion.so/API-ef3550d3415d40d3a5e011901c29410d?pvs=21)
- [기능 명세서](https://www.notion.so/08f85c26c7114c10b734a3c1d87a7da6?pvs=21)

<br>

### 🏷️ 커밋 컨벤션

📌 제목 : 코드의 변경 사항에 대해 짧은 요약 (필수)

| 태그       | 설명                                                 |
| ---------- | ---------------------------------------------------- |
| `Feat`     | 새로운 기능 추가                                     |
| `Fix`      | 버그 수정                                            |
| `Docs`     | 문서 수정                                            |
| `Style`    | 코드 포맷 변경, 세미콜론 누락, 코드 수정이 없는 경우 |
| `Refactor` | 코드 리팩토링                                        |
| `Test`     | 테스트 코드                                          |
| `Chore`    | 빌드 업무 수정, 패키지 매니저 수정                   |
| `Design`   | 디자인 변경                                          |
| `Add`      | 코드, 테스트, 예제, 문서 등의 추가 생성이 있는 경우  |
| `Rename`   | 파일명, 폴더명을 수정한 경우                         |
| `Move`     | 코드의 이동이 있는 경우                              |
| `Remove`   | 코드(파일)의 삭제가 있는 경우                        |
| `Comment`  | 필요한 주석 추가 및 변경                             |


📌 본문 : 부연 설명 (선택)

- 제목과 구분되기 위해 공백 한 줄을 띄워서 작성


📌 꼬리말 : issue tracker id 작성 (선택)

- `유형: #이슈 번호`

✨ 예시

```
Feat: 로그인 API 개발

카카오 소셜 로그인

Resolves: #123
Ref: #456
Related to: #48, #45
```

<br>

### 👥 팀 소개
(수정 예정)
[D104] 진영과 I들

김진영 : 잠은 죽어서 자자 !!!!
<br>
임수빈 : 죽을 준비가 되어 있다.
<br>
김세현 : 난 살래
<br>
한채연 : 강해져라, 독해져라, 냉정해져라.
<br>
박창준 : 현지기지기직 생축해 !
<br>
이현직 : 프로젝트 끝나고 자자.
