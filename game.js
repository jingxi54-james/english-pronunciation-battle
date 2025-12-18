// 词汇库已移至 vocabulary.js 文件

// Supabase 配置
const SUPABASE_URL = 'https://wmaxoenjqvdnwlramwvp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYXhvZW5qcXZkbndscmFtd3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDM1OTIsImV4cCI6MjA4MTU3OTU5Mn0.tgsZ69e7TxNNqMwSjqyZsx8eM7p2tAs04fetHeJyemg';

// 初始化 Supabase
let supabaseClient = null;

// 初始化 Supabase 客户端
function initSupabaseClient() {
    if (supabaseClient) return; // 已初始化
    
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        try {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('✅ Supabase 已初始化');
            return true;
        } catch (error) {
            console.error('❌ Supabase 初始化失败:', error);
            return false;
        }
    } else {
        console.warn('⚠️ Supabase 库未加载');
        return false;
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabaseClient);
} else {
    initSupabaseClient();
}

// 游戏状态
let gameState = {
    currentLevel: 1,
    currentWordIndex: 0,
    bossHealth: 100,
    initialBossHealth: 100,
    score: 0,
    isRecording: false,
    mediaRecorder: null,
    audioStream: null,
    audioChunks: [],
    currentWord: null,
    userName: '',
    userGrade: '',
    currentWords: [],
    gameMode: 'pronunciation', // 'pronunciation' 或 'fillIn'
    bossKills: 0, // 击杀BOSS数量
    usedWordsInRound: [], // 当前轮次已使用的词语（同一轮不重复）
    currentAccuracy: 0, // 当前准确率
    currentDamage: 0, // 当前伤害值
    attackCount: 0, // 当前轮次的攻击次数
    maxAttacks: 20, // 每轮最多攻击次数
    gameStartTime: null, // 游戏开始时间
    timeTaken: 0, // 游戏用时（秒）
    lastSavedId: null, // 最后保存的成绩ID
    isMockMode: false // 是否使用模拟录音模式
};

// 排行榜数据（本地存储）
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// BOSS配置（按关卡）
const bossConfig = {
    1: { emoji: '👹', name: '小怪兽' },
    2: { emoji: '👿', name: '恶魔' },
    3: { emoji: '🤖', name: '机器人' },
    4: { emoji: '👾', name: '外星人' },
    5: { emoji: '🧟', name: '僵尸' },
    6: { emoji: '🐉', name: '龙' },
    7: { emoji: '🦑', name: '章鱼怪' },
    8: { emoji: '👻', name: '幽灵' },
    9: { emoji: '🦇', name: '蝙蝠怪' },
    10: { emoji: '🐲', name: '恐龙' }
};

// 获取BOSS配置
function getBossConfig(level) {
    // 如果超过10关，循环使用配置
    const configLevel = ((level - 1) % 10) + 1;
    return bossConfig[configLevel] || bossConfig[1];
}

// DOM元素
let elements = {};

// 初始化DOM元素和事件监听器
function initializeDOM() {
    elements = {
        loginPage: document.getElementById('loginPage'),
        gameContainer: document.getElementById('gameContainer'),
        leaderboardPage: document.getElementById('leaderboardPage'),
        loginForm: document.getElementById('loginForm'),
        userName: document.getElementById('userName'),
        userGrade: document.getElementById('userGrade'),
        wordDisplay: document.getElementById('wordDisplay'),
        wordPhonetic: document.getElementById('wordPhonetic'),
        playAudioBtn: document.getElementById('playAudio'),
        recordBtn: document.getElementById('recordBtn'),
        recordingStatus: document.getElementById('recordingStatus'),
        accuracyDisplay: document.getElementById('accuracyDisplay'),
        accuracyValue: document.getElementById('accuracyValue'),
        accuracyFeedback: document.getElementById('accuracyFeedback'),
        bossHealth: document.getElementById('bossHealth'),
        healthFill: document.getElementById('healthFill'),
        level: document.getElementById('level'),
        score: document.getElementById('score'),
        gameOverModal: document.getElementById('gameOverModal'),
        gameOverTitle: document.getElementById('gameOverTitle'),
        gameOverMessage: document.getElementById('gameOverMessage'),
        nextLevelBtn: document.getElementById('nextLevelBtn'),
        restartBtn: document.getElementById('restartBtn'),
        leaderboardBtn: document.getElementById('leaderboardBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        backBtn: document.getElementById('backBtn'),
        leaderboardList: document.getElementById('leaderboardList'),
        filterGrade: document.getElementById('filterGrade'),
        gradeFilter: document.getElementById('gradeFilter')
    };

    // 登录处理
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        gameState.userName = elements.userName.value.trim();
        gameState.userGrade = elements.userGrade.value;
        
        if (gameState.userName && gameState.userGrade) {
            startGame();
        }
    });

    // 其他事件监听器
    elements.nextLevelBtn.addEventListener('click', nextLevel);
    elements.restartBtn.addEventListener('click', resetGame);
    elements.playAudioBtn.addEventListener('click', playWordAudio);
    elements.recordBtn.addEventListener('click', () => {
        if (!gameState.isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    });
    elements.leaderboardBtn.addEventListener('click', showLeaderboard);
    elements.backBtn.addEventListener('click', () => {
        elements.leaderboardPage.style.display = 'none';
        elements.gameContainer.style.display = 'block';
    });
    elements.logoutBtn.addEventListener('click', () => {
        elements.gameContainer.style.display = 'none';
        elements.loginPage.style.display = 'flex';
        elements.loginForm.reset();
        gameState.userName = '';
        gameState.userGrade = '';
    });

    // 排行榜筛选
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.dataset.filter;
            if (filter === 'grade') {
                elements.gradeFilter.style.display = 'block';
            } else {
                elements.gradeFilter.style.display = 'none';
                renderLeaderboard('all');
            }
        });
    });

    elements.filterGrade.addEventListener('change', () => {
        renderLeaderboard('grade');
    });

    // 成绩数据库功能
    const viewScoresBtn = document.getElementById('viewScoresBtn');
    const scoresDatabasePage = document.getElementById('scoresDatabasePage');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    const scoresList = document.getElementById('scoresList');
    const scoresFilterBtns = document.querySelectorAll('.scores-filter-btn');
    const scoresGradeFilter = document.getElementById('scoresGradeFilter');
    const scoresNameFilter = document.getElementById('scoresNameFilter');
    const scoresFilterGrade = document.getElementById('scoresFilterGrade');
    const scoresFilterName = document.getElementById('scoresFilterName');

    // 查看成绩数据库
    if (viewScoresBtn) {
        viewScoresBtn.addEventListener('click', async () => {
            elements.loginPage.style.display = 'none';
            scoresDatabasePage.style.display = 'flex';
            await loadLeaderboardFromServer();
            renderScoresDatabase('all');
        });
    }

    // 返回登录页面
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', () => {
            scoresDatabasePage.style.display = 'none';
            elements.loginPage.style.display = 'flex';
        });
    }

    // 成绩数据库筛选
    scoresFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            scoresFilterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.dataset.filter;
            scoresGradeFilter.style.display = 'none';
            scoresNameFilter.style.display = 'none';
            
            if (filter === 'grade') {
                scoresGradeFilter.style.display = 'block';
            } else if (filter === 'name') {
                scoresNameFilter.style.display = 'block';
            } else {
                renderScoresDatabase('all');
            }
        });
    });

    if (scoresFilterGrade) {
        scoresFilterGrade.addEventListener('change', () => {
            renderScoresDatabase('grade');
        });
    }

    if (scoresFilterName) {
        scoresFilterName.addEventListener('input', () => {
            renderScoresDatabase('name');
        });
    }

    // 攻击按钮
    const attackBtn = document.getElementById('attackBtn');
    if (attackBtn) {
        attackBtn.addEventListener('click', () => {
            gameState.attackCount++;
            
            const damage = gameState.currentDamage;
            
            gameState.bossHealth = Math.max(0, gameState.bossHealth - damage);
            gameState.score += Math.round(damage);
            
            updateBossDisplay();
            elements.score.textContent = '得分: ' + gameState.score;
            document.getElementById('attackCount').textContent = `攻击次数: ${gameState.attackCount}/${gameState.maxAttacks}`;
            
            playDamageAnimation();
            
            document.getElementById('attackBtn').style.display = 'none';
            document.getElementById('retryBtn').style.display = 'none';
            document.getElementById('nextButtons').style.display = 'flex';
            
            if (gameState.bossHealth <= 0) {
                setTimeout(() => endLevel(true), 500);
            }
            else if (gameState.attackCount >= gameState.maxAttacks) {
                setTimeout(() => {
                    alert(`攻击次数已达到上限(${gameState.maxAttacks}次)！本轮结束，强制退出。`);
                    endLevel(false);
                }, 500);
            }
        });
    }

    // 下一题按钮
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextWord();
        });
    }

    // 重新录制按钮
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            elements.accuracyDisplay.style.display = 'none';
            elements.recordBtn.disabled = false;
            elements.recordBtn.style.opacity = '1';
            elements.recordBtn.textContent = '🎤 开始录音';
            elements.recordBtn.classList.remove('recording');
            elements.recordingStatus.textContent = '';
            gameState.isRecording = false;
            gameState.audioChunks = [];
            
            if (gameState.mediaRecorder && gameState.mediaRecorder.state === 'recording') {
                gameState.mediaRecorder.stop();
            }
            
            if (gameState.audioStream) {
                gameState.audioStream.getTracks().forEach(track => track.stop());
            }
            
            // 如果是模拟模式，直接重新设置
            if (gameState.isMockMode) {
                setupMockRecording();
                return;
            }
            
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                setupRecording(stream);
            }).catch(error => {
                console.error('麦克风访问错误:', error);
                console.warn('⚠️ 麦克风访问失败，切换到模拟录音模式');
                setupMockRecording();
            });
        });
    }

    // 保存并退出登录
    const saveLogoutBtn = document.getElementById('saveLogoutBtn');
    if (saveLogoutBtn) {
        saveLogoutBtn.addEventListener('click', async () => {
            if (gameState.bossKills > 0 || gameState.score > 0) {
                await saveToLeaderboard();
                const timeTaken = gameState.timeTaken;
                const minutes = Math.floor(timeTaken / 60);
                const seconds = timeTaken % 60;
                alert(`游戏已保存！\n已击杀BOSS: ${gameState.bossKills} 个\n总得分: ${gameState.score}\n用时: ${minutes}分${seconds}秒`);
            }
            
            elements.gameContainer.style.display = 'none';
            elements.loginPage.style.display = 'flex';
            elements.loginForm.reset();
            gameState.userName = '';
            gameState.userGrade = '';
        });
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔧 DOMContentLoaded 事件触发，开始初始化...');
        try {
            initializeDOM();
            console.log('✅ initializeDOM 执行成功');
        } catch (error) {
            console.error('❌ initializeDOM 执行失败:', error);
            console.error('错误堆栈:', error.stack);
        }
    });
} else {
    console.log('🔧 DOM 已加载，直接初始化...');
    try {
        initializeDOM();
        console.log('✅ initializeDOM 执行成功');
    } catch (error) {
        console.error('❌ initializeDOM 执行失败:', error);
        console.error('错误堆栈:', error.stack);
    }
}

// 开始游戏
function startGame() {
    elements.loginPage.style.display = 'none';
    elements.gameContainer.style.display = 'block';
    
    // 初始化 AudioContext（获得用户交互权限）
    const audioContext = getAudioContext();
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(e => console.warn('AudioContext 恢复失败:', e));
    }
    
    // 根据年级获取词汇
    gameState.currentWords = wordsByGrade[gameState.userGrade];
    gameState.currentLevel = 1;
    gameState.currentWordIndex = 0;
    gameState.bossKills = 0;
    gameState.score = 0;
    gameState.attackCount = 0;
    gameState.gameStartTime = Date.now(); // 记录游戏开始时间
    
    initGame();
}

// 检测是否在WeChat浏览器中
function isWeChatBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return /micromessenger/.test(ua);
}

// 检测浏览器是否支持getUserMedia
function isMicrophoneSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// 初始化游戏
async function initGame() {
    try {
        // 确保 Supabase 已初始化
        if (!supabaseClient) {
            console.log('游戏启动时初始化 Supabase...');
            initSupabaseClient();
        }
        
        // 加载排行榜数据
        await loadLeaderboardFromServer();
        
        // 检测WeChat浏览器
        if (isWeChatBrowser()) {
            console.warn('⚠️ 检测到WeChat浏览器，使用模拟录音模式');
            setupMockRecording();
            initNewBoss();
            loadWord();
            return;
        }
        
        // 检测麦克风支持
        if (!isMicrophoneSupported()) {
            console.warn('⚠️ 浏览器不支持麦克风访问，使用模拟录音模式');
            setupMockRecording();
            initNewBoss();
            loadWord();
            return;
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setupRecording(stream);
        initNewBoss();
        loadWord();
    } catch (error) {
        console.error('麦克风访问错误:', error);
        console.warn('⚠️ 麦克风访问失败，使用模拟录音模式');
        setupMockRecording();
        initNewBoss();
        loadWord();
    }
}

// 设置录音
function setupRecording(stream) {
    // 保存stream以便后续关闭
    gameState.audioStream = stream;
    
    gameState.mediaRecorder = new MediaRecorder(stream);
    
    gameState.mediaRecorder.ondataavailable = (event) => {
        gameState.audioChunks.push(event.data);
    };
    
    gameState.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(gameState.audioChunks, { type: 'audio/wav' });
        analyzeAudio(audioBlob);
        gameState.audioChunks = [];
    };
}

// 设置模拟录音（用于WeChat或不支持麦克风的环境）
function setupMockRecording() {
    gameState.isMockMode = true;
    console.log('✅ 模拟录音模式已启用');
    
    // 创建虚拟的mediaRecorder对象
    gameState.mediaRecorder = {
        start: function() {
            console.log('模拟录音开始');
        },
        stop: function() {
            console.log('模拟录音停止');
            // 模拟分析音频
            setTimeout(() => {
                const mockAccuracy = 70 + Math.random() * 30; // 70-100%的准确率
                showAccuracyResult(Math.round(mockAccuracy));
            }, 500);
        },
        state: 'inactive'
    };
}

// 初始化新BOSS
function initNewBoss() {
    // BOSS血量：起点20点，每关增加20点
    gameState.initialBossHealth = 20 + (gameState.currentLevel - 1) * 20;
    gameState.bossHealth = gameState.initialBossHealth;
    
    // 每打败5个BOSS增加5次机会
    const bonusAttacks = Math.floor(gameState.bossKills / 5) * 5;
    gameState.maxAttacks = 20 + bonusAttacks;
    
    // 更新BOSS外观
    const bossConfig = getBossConfig(gameState.currentLevel);
    document.getElementById('bossCharacter').textContent = bossConfig.emoji;
    document.getElementById('bossName').textContent = bossConfig.name;
    
    // 不重置攻击次数，继续累加
    updateBossDisplay();
    document.getElementById('attackCount').textContent = `攻击次数: ${gameState.attackCount}/${gameState.maxAttacks}`;
}

// 加载单词
function loadWord() {
    // 从当前轮次未使用过的词语中随机选择
    const availableWords = gameState.currentWords.filter(word => !gameState.usedWordsInRound.includes(word.word));
    
    // 如果没有可用词语了，说明本轮所有词都用过了
    if (availableWords.length === 0) {
        console.warn('⚠️ 本轮所有词语已用完，无法继续出题');
        alert('本轮所有词语已用完！');
        return;
    }
    
    // 从可用词语中随机选择
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    gameState.currentWord = availableWords[randomIndex];
    
    // 标记为当前轮次已使用
    gameState.usedWordsInRound.push(gameState.currentWord.word);
    
    console.log(`📝 加载单词: ${gameState.currentWord.word} (本轮已用: ${gameState.usedWordsInRound.length}/${gameState.currentWords.length})`);
    
    // 只使用发音训练模式
    gameState.gameMode = 'pronunciation';
    
    elements.wordDisplay.textContent = gameState.currentWord.word;
    elements.wordPhonetic.textContent = gameState.currentWord.phonetic;
    elements.accuracyDisplay.style.display = 'none';
    
    // 确保录音按钮可用
    elements.recordBtn.disabled = false;
    elements.recordBtn.style.opacity = '1';
    elements.recordBtn.textContent = '🎤 开始录音';
    elements.recordingStatus.textContent = '';
    
    // 自动播放发音
    setTimeout(() => playWordAudio(), 500);
}

// 播放单词发音
function playWordAudio() {
    const utterance = new SpeechSynthesisUtterance(gameState.currentWord.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
}

// 分析音频
function analyzeAudio(audioBlob) {
    const accuracy = calculateAccuracy(audioBlob);
    showAccuracyResult(accuracy);
}

// 计算准确率（简化版）
function calculateAccuracy(audioBlob) {
    const size = audioBlob.size;
    const minSize = 5000;
    const maxSize = 50000;
    
    let accuracy = Math.min(100, Math.max(0, ((size - minSize) / (maxSize - minSize)) * 100));
    accuracy = accuracy + (Math.random() * 20 - 10);
    accuracy = Math.min(100, Math.max(0, accuracy));
    
    return Math.round(accuracy);
}

// 显示准确率结果
function showAccuracyResult(accuracy) {
    elements.accuracyDisplay.style.display = 'block';
    elements.accuracyValue.textContent = accuracy + '%';
    
    // 根据准确度计算伤害（准确率 * 20）
    const damage = accuracy * 20 / 100; // 准确率 * 20 / 100 = 准确率 * 0.2
    
    // 显示单词的中文意思
    const chineseMeaning = gameState.currentWord.meaning;
    elements.accuracyFeedback.textContent = `✓ 发音已评分！\n${gameState.currentWord.word} = ${chineseMeaning}`;
    elements.accuracyFeedback.className = 'accuracy-feedback success';
    document.getElementById('damageInfo').textContent = `将对BOSS造成 ${Math.round(damage)} 点伤害`;
    
    // 保存当前准确率和伤害值，等待用户点击攻击按钮
    gameState.currentAccuracy = accuracy;
    gameState.currentDamage = damage;
    
    // 显示攻击按钮和重新录制按钮
    document.getElementById('attackBtn').style.display = 'inline-block';
    document.getElementById('retryBtn').style.display = 'inline-block';
    document.getElementById('nextButtons').style.display = 'none';
    
    // 禁用开始录音按钮但保持可见
    elements.recordBtn.disabled = true;
    elements.recordBtn.style.opacity = '0.5';
}

// BOSS受伤
function damageTowardsBoss(damagePercent = 0.2) {
    const damage = gameState.initialBossHealth * damagePercent;
    gameState.bossHealth = Math.max(0, gameState.bossHealth - damage);
    gameState.score += Math.round(damage);
    
    updateBossDisplay();
    elements.score.textContent = '得分: ' + gameState.score;
    
    playDamageAnimation();
    
    if (gameState.bossHealth <= 0) {
        endLevel(true);
    }
}

// 播放BOSS被攻击的音效
// 全局 AudioContext
let audioContextInstance = null;

function getAudioContext() {
    if (!audioContextInstance) {
        try {
            audioContextInstance = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('⚠️ AudioContext 不可用:', e);
            return null;
        }
    }
    return audioContextInstance;
}

// 生成攻击音效的 Data URL
function generateAttackSoundDataUrl() {
    const audioContext = getAudioContext();
    if (!audioContext) return null;
    
    try {
        const sampleRate = audioContext.sampleRate;
        const duration = 0.15;
        const samples = sampleRate * duration;
        const audioBuffer = audioContext.createAudioBuffer(1, samples, sampleRate);
        const data = audioBuffer.getChannelData(0);
        
        // 生成简单的打击音效波形
        for (let i = 0; i < samples; i++) {
            const t = i / sampleRate;
            const freq1 = 300 * Math.exp(-t * 10);
            const freq2 = 600 * Math.exp(-t * 15);
            const wave1 = Math.sin(2 * Math.PI * freq1 * t) * Math.exp(-t * 10);
            const wave2 = Math.sin(2 * Math.PI * freq2 * t) * Math.exp(-t * 15);
            data[i] = (wave1 * 0.5 + wave2 * 0.4) * 0.7;
        }
        
        return audioBuffer;
    } catch (e) {
        console.warn('⚠️ 无法生成音效:', e);
        return null;
    }
}

function playAttackSound() {
    try {
        const audioContext = getAudioContext();
        if (!audioContext) {
            console.warn('⚠️ AudioContext 不可用，尝试使用备用音效');
            playAttackSoundFallback();
            return;
        }
        
        // 恢复 AudioContext 如果被暂停
        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(e => console.warn('AudioContext 恢复失败:', e));
        }
        
        const now = audioContext.currentTime;
        
        // 创建多个振荡器和增益节点以产生更激烈的音效
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        const gain2 = audioContext.createGain();
        const masterGain = audioContext.createGain();
        
        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(masterGain);
        gain2.connect(masterGain);
        masterGain.connect(audioContext.destination);
        
        // 第一个音效：低频打击音
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(300, now);
        osc1.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        gain1.gain.setValueAtTime(0.5, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        // 第二个音效：高频冲击音
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(600, now);
        osc2.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        gain2.gain.setValueAtTime(0.4, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        // 主音量更大
        masterGain.gain.setValueAtTime(0.7, now);
        
        osc1.start(now);
        osc1.stop(now + 0.15);
        osc2.start(now);
        osc2.stop(now + 0.1);
        
        console.log('✅ 攻击音效已播放');
    } catch (e) {
        console.warn('⚠️ 音效播放失败:', e);
        playAttackSoundFallback();
    }
}

// 备用音效方案（使用振动或视觉反馈）
function playAttackSoundFallback() {
    try {
        // 尝试使用振动 API
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
            console.log('✅ 使用振动反馈');
        }
    } catch (e) {
        console.warn('⚠️ 振动 API 不可用');
    }
}

// 播放过关音效
function playVictorySound() {
    try {
        const audioContext = getAudioContext();
        if (!audioContext) {
            console.warn('⚠️ AudioContext 不可用，尝试使用备用音效');
            playVictorySoundFallback();
            return;
        }
        
        // 恢复 AudioContext 如果被暂停
        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(e => console.warn('AudioContext 恢复失败:', e));
        }
        
        const now = audioContext.currentTime;
        
        // 创建胜利音效：上升的音调
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.type = 'sine';
        
        // 第一个音符：低音
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.2);
        
        // 第二个音符：中音
        osc.frequency.setValueAtTime(600, now + 0.2);
        osc.frequency.linearRampToValueAtTime(800, now + 0.4);
        gain.gain.setValueAtTime(0.3, now + 0.2);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.4);
        
        // 第三个音符：高音
        osc.frequency.setValueAtTime(800, now + 0.4);
        osc.frequency.linearRampToValueAtTime(1000, now + 0.6);
        gain.gain.setValueAtTime(0.2, now + 0.4);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.6);
        
        osc.start(now);
        osc.stop(now + 0.6);
        
        console.log('✅ 过关音效已播放');
    } catch (e) {
        console.warn('⚠️ 过关音效播放失败:', e);
        playVictorySoundFallback();
    }
}

// 备用过关音效方案（使用振动）
function playVictorySoundFallback() {
    try {
        // 尝试使用振动 API 产生胜利的振动模式
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
            console.log('✅ 使用振动反馈（胜利）');
        }
    } catch (e) {
        console.warn('⚠️ 振动 API 不可用');
    }
}
}

// 伤害动画
function playDamageAnimation() {
    const bossArea = document.querySelector('.boss-area');
    const bossCharacter = document.querySelector('.boss-character');
    const healthBar = document.querySelector('.health-bar');
    
    // 播放攻击音效
    playAttackSound();
    
    // 重置动画
    bossArea.style.animation = 'none';
    bossCharacter.style.animation = 'none';
    healthBar.style.animation = 'none';
    
    // 触发重排以重新启动动画
    void bossArea.offsetWidth;
    void bossCharacter.offsetWidth;
    void healthBar.offsetWidth;
    
    // 应用shake动画
    bossArea.style.animation = 'shake 0.5s';
    bossCharacter.style.animation = 'shake 0.5s';
    healthBar.style.animation = 'damageFlash 0.5s';
}

// 过关动画
function playVictoryAnimation() {
    const bossArea = document.querySelector('.boss-area');
    const bossCharacter = document.querySelector('.boss-character');
    const gameContainer = document.querySelector('.container');
    
    // 播放过关音效
    playVictorySound();
    
    // BOSS消失动画
    bossCharacter.style.animation = 'none';
    void bossCharacter.offsetWidth;
    bossCharacter.style.animation = 'victoryPop 0.6s ease-out forwards';
    
    // 容器庆祝动画
    gameContainer.style.animation = 'none';
    void gameContainer.offsetWidth;
    gameContainer.style.animation = 'celebrate 0.8s ease-out';
    
    // 创建庆祝粒子效果
    createConfetti();
}

// 更新BOSS显示
function updateBossDisplay() {
    const healthPercent = (gameState.bossHealth / gameState.initialBossHealth) * 100;
    elements.healthFill.style.width = healthPercent + '%';
    elements.bossHealth.textContent = Math.ceil(gameState.bossHealth);
    document.getElementById('bossMaxHealth').textContent = Math.ceil(gameState.initialBossHealth);
}

// 下一个单词
function nextWord() {
    elements.accuracyDisplay.style.display = 'none';
    elements.recordBtn.disabled = false;
    elements.recordBtn.style.opacity = '1';
    elements.recordBtn.textContent = '🎤 开始录音';
    loadWord();
}

// 创建庆祝粒子效果
function createConfetti() {
    const container = document.querySelector('.container');
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = ['#FFD700', '#FF6B6B', '#4CAF50', '#667eea', '#FF9800'][Math.floor(Math.random() * 5)];
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        container.appendChild(confetti);
        
        // 动画结束后移除元素
        setTimeout(() => {
            confetti.remove();
        }, 1300);
    }
}

// 结束关卡
function endLevel(won) {
    if (won) {
        gameState.bossKills++;
        // 播放过关动画
        playVictoryAnimation();
        // BOSS被击败，自动进入下一关
        setTimeout(() => {
            gameState.currentLevel++;
            resetLevel();
        }, 1500);
    } else {
        // BOSS击败玩家或攻击次数达到上限，显示游戏结束
        elements.gameOverModal.style.display = 'flex';
        
        if (gameState.attackCount >= gameState.maxAttacks) {
            elements.gameOverTitle.textContent = '⏰ 攻击次数已满';
            elements.gameOverMessage.textContent = `攻击次数已达到上限(${gameState.maxAttacks}次)！\n最终得分: ${gameState.score}\n已击杀BOSS: ${gameState.bossKills} 个`;
        } else {
            elements.gameOverTitle.textContent = '💀 游戏结束';
            elements.gameOverMessage.textContent = `BOSS击败了你！\n最终得分: ${gameState.score}\n已击杀BOSS: ${gameState.bossKills} 个`;
        }
        
        elements.nextLevelBtn.style.display = 'none';
        
        // 保存到排行榜
        saveToLeaderboard();
    }
}

// 计算游戏用时
function calculateTimeTaken() {
    if (gameState.gameStartTime) {
        gameState.timeTaken = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
    }
    return gameState.timeTaken;
}

// 保存到排行榜（直接使用 Supabase）
async function saveToLeaderboard() {
    console.log('=== 开始保存成绩 ===');
    console.log('游戏状态:', {
        userName: gameState.userName,
        userGrade: gameState.userGrade,
        score: gameState.score,
        bossKills: gameState.bossKills,
        gameStartTime: gameState.gameStartTime,
        timeTaken: gameState.timeTaken
    });
    
    const timeTaken = calculateTimeTaken();
    console.log('计算的用时:', timeTaken, '秒');
    
    const entry = {
        name: gameState.userName,
        grade: gameState.userGrade,
        score: gameState.score,
        boss_kills: gameState.bossKills,
        time_taken: timeTaken,
        submit_time: new Date().toISOString(),
        date: new Date().toLocaleDateString('zh-CN')
    };
    
    console.log('准备保存的数据:', entry);
    
    // 确保 Supabase 已初始化
    if (!supabaseClient) {
        console.log('Supabase 未初始化，尝试初始化...');
        initSupabaseClient();
    }
    
    console.log('Supabase 客户端状态:', supabaseClient ? '✅ 已初始化' : '❌ 未初始化');
    
    // 尝试保存到 Supabase
    if (supabaseClient) {
        try {
            console.log('正在保存成绩到 Supabase...');
            const { data, error } = await supabaseClient
                .from('leaderboard')
                .insert([entry]);
            
            if (error) {
                console.error('❌ Supabase 保存失败:', error);
                console.error('错误代码:', error.code);
                console.error('错误消息:', error.message);
                console.error('错误详情:', error.details);
                console.error('完整错误:', JSON.stringify(error));
                // 失败时使用本地存储
                console.log('降级到本地存储...');
                saveToLocalStorage(entry);
            } else {
                console.log('✅ 成绩已保存到 Supabase');
                console.log('返回数据:', data);
                gameState.lastSavedId = data[0]?.id;
                console.log('保存的 ID:', gameState.lastSavedId);
                // 同时更新本地存储
                leaderboard.push(entry);
                sortLeaderboard();
                localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
                console.log('本地存储已更新');
            }
        } catch (error) {
            console.error('❌ 保存成绩异常:', error);
            console.error('异常堆栈:', error.stack);
            saveToLocalStorage(entry);
        }
    } else {
        // Supabase 未初始化，使用本地存储
        console.warn('⚠️ Supabase 无法初始化，使用本地存储');
        saveToLocalStorage(entry);
    }
    
    console.log('=== 保存成绩完成 ===');
}

// 本地存储备用方案
function saveToLocalStorage(entry) {
    leaderboard.push(entry);
    sortLeaderboard();
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    console.log('✅ 成绩已保存到本地存储');
}

// 排行榜排序
function sortLeaderboard() {
    leaderboard.sort((a, b) => {
        if (b.boss_kills !== a.boss_kills) {
            return b.boss_kills - a.boss_kills;
        }
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time_taken - b.time_taken;
    });
    leaderboard = leaderboard.slice(0, 100);
}

// 下一关
function nextLevel() {
    gameState.currentLevel++;
    resetLevel();
}

// 重置关卡
function resetLevel() {
    gameState.currentWordIndex = 0;
    gameState.usedWordsInRound = []; // 重置当前轮次已使用词语
    elements.gameOverModal.style.display = 'none';
    elements.level.textContent = gameState.currentLevel;
    initNewBoss();
    loadWord();
}

// 重新开始游戏
function resetGame() {
    gameState.currentLevel = 1;
    gameState.currentWordIndex = 0;
    gameState.bossKills = 0;
    gameState.score = 0;
    gameState.attackCount = 0;
    gameState.usedWordsInRound = []; // 重置当前轮次已使用词语列表
    elements.gameOverModal.style.display = 'none';
    elements.level.textContent = gameState.currentLevel;
    elements.score.textContent = '得分: 0';
    document.getElementById('attackCount').textContent = `攻击次数: 0/${gameState.maxAttacks}`;
    initNewBoss();
    loadWord();
}

// 开始录音
function startRecording() {
    gameState.isRecording = true;
    gameState.mediaRecorder.start();
    elements.recordBtn.textContent = '⏹ 停止录音';
    elements.recordBtn.classList.add('recording');
    
    if (gameState.isMockMode) {
        elements.recordingStatus.textContent = '模拟录音中...';
    } else {
        elements.recordingStatus.textContent = '正在录音...';
    }
}

// 停止录音
function stopRecording() {
    gameState.isRecording = false;
    gameState.mediaRecorder.stop();
    elements.recordBtn.textContent = '🎤 开始录音';
    elements.recordBtn.classList.remove('recording');
    elements.recordingStatus.textContent = '分析中...';
}

// 显示排行榜
async function showLeaderboard() {
    elements.gameContainer.style.display = 'none';
    elements.leaderboardPage.style.display = 'flex';
    await loadLeaderboardFromServer();
    renderLeaderboard('all');
}

// 从 Supabase 加载排行榜数据
async function loadLeaderboardFromServer() {
    // 确保 Supabase 已初始化
    if (!supabaseClient) {
        console.log('Supabase 未初始化，尝试初始化...');
        initSupabaseClient();
    }
    
    if (!supabaseClient) {
        console.warn('⚠️ Supabase 无法初始化，使用本地存储');
        const localData = localStorage.getItem('leaderboard');
        if (localData) {
            leaderboard = JSON.parse(localData);
            console.log('使用本地数据，共', leaderboard.length, '条记录');
        }
        return;
    }

    try {
        console.log('正在从 Supabase 加载排行榜...');
        
        const { data, error } = await supabaseClient
            .from('leaderboard')
            .select('*')
            .order('boss_kills', { ascending: false })
            .order('score', { ascending: false })
            .order('time_taken', { ascending: true })
            .limit(100);

        if (error) {
            console.error('❌ Supabase 查询失败:', error);
            console.error('错误详情:', error.message, error.details);
            // 使用本地数据
            const localData = localStorage.getItem('leaderboard');
            if (localData) {
                leaderboard = JSON.parse(localData);
                console.log('使用本地数据，共', leaderboard.length, '条记录');
            }
            return;
        }

        console.log('✅ 排行榜已从 Supabase 加载，共', data.length, '条记录');
        leaderboard = data;
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    } catch (error) {
        console.error('❌ 加载排行榜错误:', error);
        // 使用本地数据
        const localData = localStorage.getItem('leaderboard');
        if (localData) {
            leaderboard = JSON.parse(localData);
            console.log('使用本地数据，共', leaderboard.length, '条记录');
        }
    }
}

// 格式化时间
function formatTime(seconds) {
    // 确保 seconds 是有效的数字
    const time = parseInt(seconds) || 0;
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes}分${secs}秒`;
}

// 渲染排行榜
function renderLeaderboard(filter = 'all') {
    let data = leaderboard;
    
    if (filter === 'grade' && elements.filterGrade.value) {
        data = leaderboard.filter(item => item.grade === elements.filterGrade.value);
    }
    
    if (data.length === 0) {
        elements.leaderboardList.innerHTML = '<p class="empty-message">暂无排行榜数据</p>';
        return;
    }
    
    const gradeNames = {
        '1': '小学一年级', '2': '小学二年级', '3': '小学三年级',
        '4': '小学四年级', '5': '小学五年级', '6': '小学六年级',
        '7': '初中一年级', '8': '初中二年级', '9': '初中三年级',
        '10': '高中一年级', '11': '高中二年级', '12': '高中三年级'
    };
    
    elements.leaderboardList.innerHTML = data.map((item, index) => {
        const timeTaken = parseInt(item.time_taken) || 0;
        return `
        <div class="leaderboard-item">
            <div class="rank rank-${index + 1}">${index + 1}</div>
            <div class="player-info">
                <div class="player-name">${item.name}</div>
                <div class="player-grade">${gradeNames[item.grade]} · ${item.date}</div>
                <div class="player-stats">击杀BOSS: ${item.boss_kills || 0} 个 | 得分: ${item.score} | 用时: ${formatTime(timeTaken)}</div>
            </div>
            <div class="player-score">🏆 ${item.boss_kills || 0}</div>
        </div>
    `;
    }).join('');
}

// 渲染成绩数据库
function renderScoresDatabase(filter = 'all') {
    const scoresList = document.getElementById('scoresList');
    const scoresFilterGrade = document.getElementById('scoresFilterGrade');
    const scoresFilterName = document.getElementById('scoresFilterName');
    
    let data = leaderboard;
    
    if (filter === 'grade' && scoresFilterGrade && scoresFilterGrade.value) {
        data = leaderboard.filter(item => item.grade === scoresFilterGrade.value);
    } else if (filter === 'name' && scoresFilterName && scoresFilterName.value) {
        const searchName = scoresFilterName.value.toLowerCase();
        data = leaderboard.filter(item => item.name.toLowerCase().includes(searchName));
    }
    
    if (data.length === 0) {
        scoresList.innerHTML = '<p class="empty-message">暂无成绩数据</p>';
        return;
    }
    
    const gradeNames = {
        '1': '小学一年级', '2': '小学二年级', '3': '小学三年级',
        '4': '小学四年级', '5': '小学五年级', '6': '小学六年级',
        '7': '初中一年级', '8': '初中二年级', '9': '初中三年级',
        '10': '高中一年级', '11': '高中二年级', '12': '高中三年级'
    };
    
    scoresList.innerHTML = data.map((item, index) => {
        const timeTaken = parseInt(item.time_taken) || 0;
        return `
        <div class="score-item">
            <div class="score-rank rank-${index + 1}">${index + 1}</div>
            <div class="score-details">
                <div class="score-name">${item.name}</div>
                <div class="score-info">${gradeNames[item.grade]} · ${item.date}</div>
                <div class="score-info">击杀BOSS: ${item.boss_kills || 0} 个 | 得分: ${item.score} | 用时: ${formatTime(timeTaken)}</div>
            </div>
            <div class="score-value">${item.score}</div>
        </div>
    `;
    }).join('');
}
