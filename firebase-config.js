// Firebase 설정
// 아래 설정값을 본인의 Firebase 프로젝트 설정으로 교체하세요

// Firebase 초기화
const firebaseConfig = {
    // 여기에 Firebase Console에서 복사한 설정값을 붙여넣기
    apiKey: "AIzaSyAhCmse79y23Xrc_kwXCGBGQDgtOYW7M40",
    authDomain: "stw-voting-system2.firebaseapp.com",
    databaseURL: "https://stw-voting-system2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "stw-voting-system2",
    storageBucket: "stw-voting-system2.firebasestorage.app",
    messagingSenderId: "272905456531",
    appId: "1:272905456531:web:ef3720466f2a4cdef3b666",
    measurementId: "G-WPH1C2V8MC"

// Firebase 초기화
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase 설정 완료');
} else {
    console.log('Firebase SDK가 로드되지 않았습니다. 로컬 스토리지 모드로 작동합니다.');
}

// 개발용 설정 (Firebase 없이도 작동)
if (typeof firebase === 'undefined') {
    console.log('Firebase를 사용할 수 없습니다. 로컬 스토리지 모드로 작동합니다.');
} 