# Crazy Alcade FrontEnd

테스트 + 브랜치의 브랜치 + 2

### 초기 세팅 내용

```JavaScript
- Create-React-App으로 생성.

- 필요없는 파일들 제거. ex) test, test.css ...
- 필요한 폴더들 생성. ex) images, pages ...

- router, router-dom 설치
- eslint, prettier 설치
```

### 확인할 것.

```bash
// frontend 폴더로 이동.
$cd frontend

// vscode로 열기.
$code .

// package.json에 있는 패키지들 설치 작업.
$npm install

// "프론트의 시작" 글씨 잘 보이나 확인.
$npm start

+ ESLint, Prettier 잘 동작하나 확인.
```

### 브랜치 생성

```bash
1. git push origin 브랜치명

2. gerrit과 gitlab 둘다 생성된 브랜치 반영하기 위해서 기능 관련 작업

3. 작업 완료하면 git add . 와 git commit -m “컨벤션 지켜주세요” 으로 커밋 남기기

4. git push origin HEAD:refs/for/브랜치명

5. 이렇게 푸쉬를 해야 깃랩에는 푸쉬 안되고 gerrit에만 푸쉬가 돼서 코드 리뷰가 가능합니다!

6. 코드 리뷰 gerrit에서 하고 submit 하면 깃랩에 푸쉬 됨!
```

### 브랜치의 브랜치 로컬에 만들기

```bash
1. feature 브랜치(feature/login)를 'frontend' 브랜치('master' 브랜치에서 따는 것이 아니다!)에서 분기
$git checkout -b feature/login frontend

/* ~ 새로운 기능에 대한 작업 수행 ~ */
/* feature 브랜치에서 모든 작업이 끝나면 */

2. 'frontend' 브랜치로 이동한다.
$ git checkout frontend

3. 'frontend' 브랜치에 feature/login 브랜치 내용을 병합(merge)한다.
# --no-ff 옵션: 새로운 커밋 객체를 만들어 'frontend' 브랜치에 merge
$ git merge --no-ff feature/login

선택 (4. 더 이상 사용하지 않는 feature 브랜치면 삭제한다.)
# -d 옵션: feature/login에 해당하는 브랜치를 삭제한다.
$ git branch -d feature/login

5.  'frontend' 브랜치를 원격 중앙 저장소(Gerrit)에 올린다.
$ git push origin HEAD:refs/for/frontend
```

### 폴더 구조

```
Project/
├── src/
│ ├── assets/ # 이미지, 폰트 등
│ ├── components/ # React 컴포넌트들
│ ├── pages/ # 페이지 컴포넌트들 (라우팅)
│ ├── styles/ # CSS 스타일 및 스타일 유틸리티
│ ├── utils/ # 기능들
│ ├── store/ # 상태 관리 파일
│ └── index.js
│ └── App.js
├── public/
│ ├── data/ # 데이터
│ ├── images/ # 정적 이미지 ex) favicon
│ ├── index.html # HTML 템플릿 파일
│ └── ...
├── .eslintrc.json # ESLint 설정 파일(+prettier 설정)
└── ...
```

### 커밋 컨벤션

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

<br>

📌 본문 : 부연 설명 (선택)

- 제목과 구분되기 위해 공백 한 줄을 띄워서 작성

<br>

📌 꼬리말 : issue tracker id 작성 (선택)

- `유형: #이슈 번호`

<br>
✨ 예시

```
Feat: 로그인 API 개발

카카오 소셜 로그인

Resolves: #123
Ref: #456
Related to: #48, #45
```
