# 개념기반 탐구학습 S-T-W 실시간 투표 시스템

## 개요

이 프로젝트는 개념기반 탐구학습의 S-T-W(SEE-THINK-WONDER) 방법론을 활용한 실시간 투표 시스템입니다. 학생들이 영상이나 수업 내용을 바탕으로 관찰(SEE), 분석(THINK), 질문(WONDER)의 관점에서 공감 투표를 할 수 있습니다.

## 주요 기능

### 🎯 공감 투표 시스템
- **SEE (관찰)**: 영상 속 수업에서 가장 먼저 눈에 띄는 장면에 대한 투표
- **THINK (분석)**: 교사와 학생의 활동, 교사의 의도나 전략에 대한 투표  
- **WONDER (질문)**: 수업 방식의 영향과 실천 가능성에 대한 투표

### 💝 하트 투표 방식
- 각 문항에 대해 하트(♡) 버튼으로 공감 투표
- 중복 투표 방지 (한 카테고리당 하나의 선택만 가능)
- 투표 취소 가능 (같은 항목 재클릭)

### 📊 실시간 결과 표시
- 각 섹션별 상위 3개 투표 결과 표시
- 투표 수와 백분율 계산
- 실시간 업데이트

### 🔧 관리자 기능
- 관리자 로그인 (비밀번호: 1234)
- 투표 초기화 기능
- 테스트 투표 기능

## 파일 구조

```
STW2/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 기능
├── firebase-config.js  # Firebase 설정
└── README.md          # 프로젝트 설명서
```

## 사용법

### 1. 기본 사용
1. `index.html` 파일을 웹 브라우저에서 열기
2. 각 섹션(SEE, THINK, WONDER)의 문항들을 읽고 공감하는 항목에 하트 클릭
3. 각 섹션 하단에서 실시간 투표 결과 확인

### 2. 관리자 기능
1. 상단의 관리자 비밀번호 입력란에 "1234" 입력
2. "관리자 로그인" 버튼 클릭
3. "투표 초기화" 버튼으로 모든 투표 데이터 초기화
4. "테스트 공감투표" 버튼으로 랜덤 테스트 투표 생성

### 3. 키보드 단축키
- `Ctrl + R`: 투표 초기화 (관리자 모드에서만)
- `Ctrl + T`: 테스트 투표 생성

## 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **스타일링**: CSS Grid, Flexbox, CSS Animations
- **데이터 저장**: Firebase Realtime Database (선택사항)
- **폴백**: LocalStorage (Firebase 없이도 작동)

## Firebase 설정 (선택사항)

실시간 데이터베이스 기능을 사용하려면:

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Realtime Database 활성화
3. `firebase-config.js` 파일의 설정값을 본인의 프로젝트 설정으로 교체

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## 특징

### 🎨 사용자 경험
- 직관적인 하트 투표 인터페이스
- 부드러운 애니메이션 효과
- 반응형 디자인 (모바일 지원)

### 🔒 데이터 관리
- 중복 투표 방지
- 투표 취소 기능
- 실시간 데이터 동기화

### 📱 호환성
- 모든 현대 브라우저 지원
- 모바일 디바이스 최적화
- Firebase 없이도 로컬 스토리지로 작동

## 커스터마이징

### 문항 수정
`index.html` 파일에서 각 섹션의 문항을 수정할 수 있습니다:

```html
<div class="empathy-option" onclick="empathyVote('see', 1)">
    <div class="empathy-number">1</div>
    <span class="empathy-text">여기에 새로운 문항을 입력하세요</span>
    <div class="empathy-heart">
        <span class="empathy-heart-icon">♡</span>
        <span class="empathy-count" id="empathy-count-see-1">0</span>
    </div>
</div>
```

### 스타일 수정
`styles.css` 파일에서 색상, 폰트, 레이아웃을 수정할 수 있습니다.

## 라이선스

이 프로젝트는 교육 목적으로 자유롭게 사용할 수 있습니다.

## 문의

프로젝트에 대한 문의사항이나 개선 제안이 있으시면 언제든 연락주세요. 