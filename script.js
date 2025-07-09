// Firebase 설정 및 초기화
let database;
let isAdmin = false;

// 투표 데이터 저장소
let votes = {
    see: {},
    think: {},
    wonder: {}
};

// 사용자 투표 기록 (중복 투표 방지)
let userVotes = {
    see: {},
    think: {},
    wonder: {}
};

// Firebase 초기화
function initializeFirebase() {
    try {
        // Firebase 설정이 로드되었는지 확인
        if (typeof firebase !== 'undefined') {
            database = firebase.database();
            console.log('Firebase 초기화 성공');
            loadVotes();
        } else {
            console.log('Firebase 로드 대기 중...');
            setTimeout(initializeFirebase, 1000);
        }
    } catch (error) {
        console.error('Firebase 초기화 오류:', error);
        // Firebase 없이도 작동하도록 로컬 스토리지 사용
        loadVotesFromLocalStorage();
    }
}

// 투표 데이터 로드
function loadVotes() {
    if (database) {
        database.ref('votes').once('value')
            .then((snapshot) => {
                const data = snapshot.val();
                if (data) {
                    votes = data;
                }
                updateAllVoteCounts();
            })
            .catch((error) => {
                console.error('투표 데이터 로드 오류:', error);
                loadVotesFromLocalStorage();
            });
    } else {
        loadVotesFromLocalStorage();
    }
}

// 로컬 스토리지에서 투표 데이터 로드
function loadVotesFromLocalStorage() {
    const savedVotes = localStorage.getItem('stw_votes');
    if (savedVotes) {
        votes = JSON.parse(savedVotes);
    }
    updateAllVoteCounts();
}

// 투표 데이터 저장
function saveVotes() {
    if (database) {
        database.ref('votes').set(votes)
            .then(() => {
                console.log('투표 데이터 저장 성공');
            })
            .catch((error) => {
                console.error('투표 데이터 저장 오류:', error);
                saveVotesToLocalStorage();
            });
    } else {
        saveVotesToLocalStorage();
    }
}

// 로컬 스토리지에 투표 데이터 저장
function saveVotesToLocalStorage() {
    localStorage.setItem('stw_votes', JSON.stringify(votes));
}

// 공감 투표 함수
function empathyVote(category, optionNumber) {
    const userId = getUserId();
    const voteKey = `${category}_${optionNumber}`;
    
    // 이미 투표했는지 확인
    if (userVotes[category][userId] === optionNumber) {
        // 투표 취소
        if (votes[category][optionNumber]) {
            votes[category][optionNumber]--;
            if (votes[category][optionNumber] <= 0) {
                delete votes[category][optionNumber];
            }
        }
        delete userVotes[category][userId];
        
        // UI 업데이트
        const optionElement = document.querySelector(`[onclick="empathyVote('${category}', ${optionNumber})"]`);
        optionElement.classList.remove('voted');
    } else {
        // 이전 투표가 있다면 취소
        const previousVote = userVotes[category][userId];
        if (previousVote) {
            if (votes[category][previousVote]) {
                votes[category][previousVote]--;
                if (votes[category][previousVote] <= 0) {
                    delete votes[category][previousVote];
                }
            }
            
            // 이전 투표 UI 업데이트
            const previousElement = document.querySelector(`[onclick="empathyVote('${category}', ${previousVote})"]`);
            if (previousElement) {
                previousElement.classList.remove('voted');
            }
        }
        
        // 새 투표
        if (!votes[category][optionNumber]) {
            votes[category][optionNumber] = 0;
        }
        votes[category][optionNumber]++;
        userVotes[category][userId] = optionNumber;
        
        // UI 업데이트
        const optionElement = document.querySelector(`[onclick="empathyVote('${category}', ${optionNumber})"]`);
        optionElement.classList.add('voted');
    }
    
    // 데이터 저장 및 UI 업데이트
    saveVotes();
    updateVoteCount(category, optionNumber);
    updateResults(category);
}

// 투표 수 업데이트
function updateVoteCount(category, optionNumber) {
    const countElement = document.getElementById(`empathy-count-${category}-${optionNumber}`);
    if (countElement) {
        const count = votes[category][optionNumber] || 0;
        countElement.textContent = count;
    }
}

// 모든 투표 수 업데이트
function updateAllVoteCounts() {
    ['see', 'think', 'wonder'].forEach(category => {
        for (let i = 1; i <= 10; i++) {
            updateVoteCount(category, i);
        }
    });
}

// 결과 업데이트
function updateResults(category) {
    const resultsElement = document.getElementById(`${category}-results`);
    if (!resultsElement) return;
    
    const categoryVotes = votes[category] || {};
    const totalVotes = Object.values(categoryVotes).reduce((sum, count) => sum + count, 0);
    
    if (totalVotes === 0) {
        resultsElement.innerHTML = '<p>아직 투표가 없습니다.</p>';
        return;
    }
    
    // 투표 수에 따라 정렬
    const sortedVotes = Object.entries(categoryVotes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3); // 상위 3개만 표시
    
    let resultsHTML = '<h4>투표 결과 (상위 3개)</h4>';
    sortedVotes.forEach(([optionNumber, count], index) => {
        const percentage = ((count / totalVotes) * 100).toFixed(1);
        const rank = index + 1;
        const rankEmoji = ['🥇', '🥈', '🥉'][index] || `${rank}.`;
        
        resultsHTML += `
            <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 8px;">
                <strong>${rankEmoji} ${optionNumber}번</strong> - ${count}표 (${percentage}%)
            </div>
        `;
    });
    
    resultsHTML += `<p style="margin-top: 15px; font-size: 14px; color: #888;">총 ${totalVotes}표</p>`;
    resultsElement.innerHTML = resultsHTML;
}

// 사용자 ID 생성 (간단한 방식)
function getUserId() {
    let userId = localStorage.getItem('stw_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('stw_user_id', userId);
    }
    return userId;
}

// 관리자 확인
function checkAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === '1234') { // 실제 환경에서는 더 안전한 인증 방식 사용
        isAdmin = true;
        document.getElementById('resetBtn').style.display = 'inline-block';
        document.getElementById('adminPassword').style.display = 'none';
        alert('관리자 로그인 성공!');
    } else {
        alert('비밀번호가 올바르지 않습니다.');
    }
}

// 투표 초기화
function resetVotes() {
    if (!isAdmin) {
        alert('관리자 권한이 필요합니다.');
        return;
    }
    
    if (confirm('모든 투표를 초기화하시겠습니까?')) {
        votes = {
            see: {},
            think: {},
            wonder: {}
        };
        userVotes = {
            see: {},
            think: {},
            wonder: {}
        };
        
        // UI 초기화
        document.querySelectorAll('.empathy-option').forEach(option => {
            option.classList.remove('voted');
        });
        
        updateAllVoteCounts();
        ['see', 'think', 'wonder'].forEach(category => {
            updateResults(category);
        });
        
        saveVotes();
        alert('투표가 초기화되었습니다.');
    }
}

// 테스트 공감투표
function testEmpathyVote() {
    // 랜덤 투표 생성
    const categories = ['see', 'think', 'wonder'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const optionNumber = Math.floor(Math.random() * 10) + 1;
    
    empathyVote(category, optionNumber);
    
    // 애니메이션 효과
    const optionElement = document.querySelector(`[onclick="empathyVote('${category}', ${optionNumber})"]`);
    if (optionElement) {
        optionElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            optionElement.style.transform = '';
        }, 300);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeFirebase();
    
    // 결과 업데이트
    setTimeout(() => {
        ['see', 'think', 'wonder'].forEach(category => {
            updateResults(category);
        });
    }, 1000);
    
    // 실시간 업데이트 (Firebase 사용 시)
    if (database) {
        database.ref('votes').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                votes = data;
                updateAllVoteCounts();
                ['see', 'think', 'wonder'].forEach(category => {
                    updateResults(category);
                });
            }
        });
    }
});

// 키보드 단축키
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case 'r':
                event.preventDefault();
                if (isAdmin) {
                    resetVotes();
                }
                break;
            case 't':
                event.preventDefault();
                testEmpathyVote();
                break;
        }
    }
}); 