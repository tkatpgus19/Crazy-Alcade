# Crazy-Alcade

### 🗓️ 프로젝트 진행 기간

2024.01.02 - 2024.01.21 기획

2024.01.22 - 2024.02.16 개발

<br>

### 🧚‍♀️ 서비스 소개

알고리즘만 풀기 지루하지 않으셨나요?

친구와 함께 즐겁게 알고리즘 문제를 풀어보세요!

노말 모드에서는 친구들과 함께 코딩 테스트를 대비해 문제를 풀고,

아이템 모드에서는 아이템을 사용하여 친구의 알고리즘 문제 풀이를 방해하면서 문제를 풀 수 있어요.

알고리즘 문제 풀이에 게임의 재미를 더한 알고리즘 배틀 서비스!

<br>

### 📍 주요 기능

- 시작 화면
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/615ff40c-5a29-4b08-8ae2-d40bd79d69f0)
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/5dc35f51-b82c-4d19-9108-21ed6f02c01a)

    - 소셜 로그인: 카카오/구글
- 메인 화면
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/8e832286-9b2f-4e2b-a6c0-c5527747b11b)
   
    - 내 기본 정보 + 보유 아이템 확인
    - 전체 채팅
    - 방을 선택하여 들어갈 수 있다.    
- 방 만들기
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/6d2d464b-0865-4016-8e55-4297b982dd4f)
 
    - 노말전, 아이템전 여부를 선택한다.
    - 방 정보를 기입하여 방을 만들 수 있다.
- 대기방 입장
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/61d77388-8e7e-440f-b233-a3fec9248d3d)

    - 채팅
    - 방 정보를 확인할 수 있다.
    - 방장이 아닌 유저들은 게임에 참여할 준비가 되면 READY 상태로 변경한다.
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/789cbc01-fd91-4a00-9ad4-8192a7806c27)
    
    - 방장은 모든 유저들이 READY 상태일 때 START 버튼을 눌러 게임을 시작할 수 있다.
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/641297ea-7100-4e61-a96c-dc35df9f1c94)

    - 방장은 악성 유저를 강퇴시킬 수 있다.
- 게임 시작 (노말 모드, 아이템 모드 동일)
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/df1a8747-ce6f-4605-8cff-85f45cb8212c)

    - 문제를 확인하고 풀 수 있다.
    - 코드 실행을 누르면 예제 채점 결과가 출력된다. 게임 결과에는 반영되지 않는다.
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/2b737af5-dded-4d6c-9a24-733a27d3ca0e)

    - 코드 제출을 누르면 실제 채점 결과가 출력된다. 게임 결과에 반영된다.
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/c89c59eb-36bf-4b43-8776-2111405b305a)

    - 문제 풀이 시간이 모두 끝나면 게임 결과가 출력된다.
    - 게임 결과는 시간이 빠른 순, 메모리가 빠른 순으로 출력된다.
    - 문제 난이도, 게임 결과에 따라 경험치와 코인을 얻는다.
- 아이템 상점
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/bd1434a7-4f2b-4eba-82cc-2de42085adc5)

    - 게임에서 얻은 코인을 이용해 아이템을 구매할 수 있다.
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/39a6fc0a-60a1-4cf2-bd52-d15f52af8c46)

    - 아이템 종류: 문어(화면 가리기), 병아리(방해하기), 물풍선(버튼 숨기기), 요술봉(화면 뒤집기), 쉴드(아이템 무력화)
- 아이템 모드
    
    ![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/b519f53a-20c8-49c8-adf4-731efff27e3d)

    - 쓰고 싶은 아이템을 누르고, 공격할 유저의 닉네임을 누르면 해당 유저에게 아이템이 사용된다.
    - 아이템 현황은 화면 공유를 통해 다른 유저들에게도 보여진다.
    - 쉴드를 사용하여 공격을 방어할 수도 있다.

<br>

### 📱 와이어 프레임 & 프로토타입

![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/6ed6e925-a6e7-45b1-abd9-c7b02014e4b5)

![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/e107ae8a-54eb-4342-945d-0f16e7bb8729)

<br>

### 🗂️ ERD

<기획 ERD>

![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/f8fa88c3-5d53-4e76-9102-c59358d643ed)

<최종 ERD>

![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/87e74082-d55a-4411-9fc8-e91f809efa9d)

- 방은 서버에서 관리하기로 결정

<br>

### 🎞️ 시스템 구성도

![image](https://github.com/limsubinn/Crazy-Alcade/assets/66028419/c77db8ce-56a8-4394-a2e6-39250419f157)

<br>

### 🔌 기술 스택

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

### 📝 개발 문서

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

### 👥 팀 소개
[D104] 진영과 I들
| 이름 | 역할 | 담당 | 각오 |
| - | - | - | - |
| 👑 김진영 | Frontend  | OpenVidu, 대기방 구현 | 잠은 죽어서 자자 !!!! |
| 🐲 박창준 | Frontend | 프로젝트 세팅, 게임방 구현 | 현지기지기직 생축해 ! |
| 🐭 이현직 | Frontend | 로그인 및 메인 화면, Web IDE 구현 | 프로젝트 끝나고 자자. |
| 🤮 김세현 | Backend / Frontend | 게임방 관리, 소켓 | 난 살래 |
| 🐰 임수빈 | Backend / Infra | 문제 관리, 코드 채점, CI/CD | 죽을 준비가 되어 있다. |
| 🐥 한채연 | Backend | 프로젝트 세팅, 소셜 로그인, 회원 관리, 아이템 관리 | 강해져라, 독해져라, 냉정해져라. |

<br>

### 🌱 UCC
- [Link](https://www.youtube.com/watch?v=Bs6Ofbka1j8)
