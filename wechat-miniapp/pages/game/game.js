import { wordsByGrade } from '../../utils/vocabulary.js';
import { bossConfig } from '../../utils/boss-config.js';

Page({
  data: {
    // 游戏状态
    currentLevel: 1,
    bossHealth: 100,
    initialBossHealth: 100,
    score: 0,
    attackCount: 0,
    maxAttacks: 20,
    bossKills: 0,
    
    // 单词相关
    currentWord: { word: '', phonetic: '', meaning: '' },
    currentWords: [],
    usedWordsInRound: [],
    
    // 录音相关
    isRecording: false,
    recordingStatus: '',
    recordManager: null,
    
    // 准确率相关
    showAccuracy: false,
    currentAccuracy: 0,
    currentDamage: 0,
    showNextBtn: false,
    
    // BOSS相关
    bossEmoji: '👹',
    bossName: '小怪兽',
    healthPercent: 100,
    
    // 游戏结束
    showGameOver: false,
    gameOverTitle: '',
    gameOverMessage: '',
    canNextLevel: false,
    
    // 用户信息
    userName: '',
    userGrade: '',
    gameStartTime: null
  },

  onLoad() {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }

    this.setData({
      userName: userInfo.name,
      userGrade: userInfo.grade,
      gameStartTime: userInfo.gameStartTime
    });

    // 初始化游戏
    this.initGame();
  },

  initGame() {
    // 获取当前年级的词汇
    const currentWords = wordsByGrade[this.data.userGrade] || [];
    
    this.setData({
      currentWords: currentWords,
      currentLevel: 1,
      score: 0,
      bossKills: 0,
      attackCount: 0
    });

    // 初始化录音管理器
    this.initRecordManager();
    
    // 初始化 BOSS
    this.initNewBoss();
    
    // 加载第一个单词
    this.loadWord();
  },

  initRecordManager() {
    const recordManager = wx.getRecordManager();
    
    recordManager.onStart(() => {
      console.log('录音开始');
    });

    recordManager.onStop((res) => {
      console.log('录音停止', res);
      this.analyzeAudio(res.tempFilePath);
    });

    recordManager.onError((err) => {
      console.error('录音错误:', err);
      wx.showToast({
        title: '录音失败，请重试',
        icon: 'none'
      });
    });

    this.setData({
      recordManager: recordManager
    });
  },

  initNewBoss() {
    const { currentLevel, bossKills } = this.data;
    
    // BOSS血量：起点20点，每关增加20点
    const initialBossHealth = 20 + (currentLevel - 1) * 20;
    
    // 每打败5个BOSS增加5次机会
    const bonusAttacks = Math.floor(bossKills / 5) * 5;
    const maxAttacks = 20 + bonusAttacks;
    
    // 获取BOSS配置
    const configLevel = ((currentLevel - 1) % 10) + 1;
    const boss = bossConfig[configLevel] || bossConfig[1];
    
    const healthPercent = 100;
    
    this.setData({
      initialBossHealth: initialBossHealth,
      bossHealth: initialBossHealth,
      maxAttacks: maxAttacks,
      bossEmoji: boss.emoji,
      bossName: boss.name,
      healthPercent: healthPercent
    });
  },

  loadWord() {
    const { currentWords, usedWordsInRound } = this.data;
    
    // 从未使用过的词语中随机选择
    let availableWords = currentWords.filter(word => !usedWordsInRound.includes(word.word));
    
    // 如果所有词语都用过了，重置已使用列表
    if (availableWords.length === 0) {
      this.setData({ usedWordsInRound: [] });
      availableWords = currentWords;
    }
    
    // 随机选择一个单词
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const currentWord = availableWords[randomIndex];
    
    // 标记为已使用
    const newUsedWords = [...usedWordsInRound, currentWord.word];
    
    this.setData({
      currentWord: currentWord,
      usedWordsInRound: newUsedWords,
      showAccuracy: false,
      showNextBtn: false,
      recordingStatus: '',
      isRecording: false
    });

    // 自动播放发音
    setTimeout(() => {
      this.playWordAudio();
    }, 500);
  },

  playWordAudio() {
    const { currentWord } = this.data;
    
    // 使用微信小程序的文字转语音 API
    // 注意：小程序没有原生的 SpeechSynthesis API
    // 需要使用云函数或第三方服务
    // 这里使用简单的提示
    wx.showToast({
      title: `发音: ${currentWord.word}`,
      icon: 'none',
      duration: 1000
    });
  },

  toggleRecording() {
    const { isRecording, recordManager } = this.data;
    
    if (!isRecording) {
      // 开始录音
      this.startRecording();
    } else {
      // 停止录音
      this.stopRecording();
    }
  },

  startRecording() {
    const { recordManager } = this.data;
    
    // 请求麦克风权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: () => {
              recordManager.start({ format: 'mp3' });
              this.setData({
                isRecording: true,
                recordingStatus: '正在录音...'
              });
            },
            fail: () => {
              wx.showToast({
                title: '需要麦克风权限',
                icon: 'none'
              });
            }
          });
        } else {
          recordManager.start({ format: 'mp3' });
          this.setData({
            isRecording: true,
            recordingStatus: '正在录音...'
          });
        }
      }
    });
  },

  stopRecording() {
    const { recordManager } = this.data;
    
    recordManager.stop();
    this.setData({
      isRecording: false,
      recordingStatus: '分析中...'
    });
  },

  analyzeAudio(filePath) {
    // 简化版准确率计算（基于文件大小）
    wx.getFileInfo({
      filePath: filePath,
      success: (res) => {
        const size = res.size;
        const minSize = 5000;
        const maxSize = 50000;
        
        let accuracy = Math.min(100, Math.max(0, ((size - minSize) / (maxSize - minSize)) * 100));
        accuracy = accuracy + (Math.random() * 20 - 10);
        accuracy = Math.min(100, Math.max(0, accuracy));
        accuracy = Math.round(accuracy);
        
        this.showAccuracyResult(accuracy);
      },
      fail: () => {
        wx.showToast({
          title: '分析失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  showAccuracyResult(accuracy) {
    const { initialBossHealth } = this.data;
    const damage = accuracy * 20 / 100;
    
    this.setData({
      showAccuracy: true,
      currentAccuracy: accuracy,
      currentDamage: damage,
      recordingStatus: ''
    });
  },

  attackBoss() {
    const { bossHealth, initialBossHealth, currentDamage, attackCount, maxAttacks, score } = this.data;
    
    // 增加攻击次数
    const newAttackCount = attackCount + 1;
    
    // 减少BOSS血量
    const newBossHealth = Math.max(0, bossHealth - currentDamage);
    const newScore = score + Math.round(currentDamage);
    
    // 计算血量百分比
    const healthPercent = (newBossHealth / initialBossHealth) * 100;
    
    this.setData({
      bossHealth: newBossHealth,
      attackCount: newAttackCount,
      score: newScore,
      healthPercent: healthPercent,
      showAccuracy: false,
      showNextBtn: true
    });

    // 播放伤害动画
    this.playDamageAnimation();

    // 检查BOSS是否被击败
    if (newBossHealth <= 0) {
      setTimeout(() => {
        this.endLevel(true);
      }, 500);
    }
    // 检查攻击次数是否达到上限
    else if (newAttackCount >= maxAttacks) {
      setTimeout(() => {
        wx.showToast({
          title: `攻击次数已达到上限(${maxAttacks}次)！`,
          icon: 'none'
        });
        this.endLevel(false);
      }, 500);
    }
  },

  playDamageAnimation() {
    // 在小程序中实现简单的视觉反馈
    wx.vibrateShort({
      type: 'medium'
    });
  },

  retryRecording() {
    this.setData({
      showAccuracy: false,
      recordingStatus: '',
      isRecording: false
    });
  },

  nextWord() {
    this.loadWord();
  },

  endLevel(won) {
    if (won) {
      const newBossKills = this.data.bossKills + 1;
      this.setData({
        bossKills: newBossKills,
        canNextLevel: true,
        showGameOver: true,
        gameOverTitle: '🎉 BOSS被击败！',
        gameOverMessage: `恭喜！你击败了第 ${this.data.currentLevel} 关的BOSS！\n已击杀BOSS: ${newBossKills} 个\n总得分: ${this.data.score}`
      });
    } else {
      this.setData({
        canNextLevel: false,
        showGameOver: true,
        gameOverTitle: '💀 游戏结束',
        gameOverMessage: `BOSS击败了你！\n最终得分: ${this.data.score}\n已击杀BOSS: ${this.data.bossKills} 个`
      });
      
      // 保存成绩
      this.saveScore();
    }
  },

  nextLevel() {
    this.setData({
      currentLevel: this.data.currentLevel + 1,
      showGameOver: false,
      usedWordsInRound: []
    });
    
    this.initNewBoss();
    this.loadWord();
  },

  restartGame() {
    this.setData({
      currentLevel: 1,
      score: 0,
      bossKills: 0,
      attackCount: 0,
      showGameOver: false,
      usedWordsInRound: []
    });
    
    this.initNewBoss();
    this.loadWord();
  },

  saveAndLogout() {
    if (this.data.bossKills > 0 || this.data.score > 0) {
      this.saveScore();
      wx.showToast({
        title: '游戏已保存',
        icon: 'success'
      });
    }
    
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }, 1000);
  },

  async saveScore() {
    const { userName, userGrade, score, bossKills, gameStartTime } = this.data;
    const timeTaken = Math.floor((Date.now() - gameStartTime) / 1000);
    
    const entry = {
      name: userName,
      grade: userGrade,
      score: score,
      boss_kills: bossKills,
      time_taken: timeTaken,
      submit_time: new Date().toISOString(),
      date: new Date().toLocaleDateString('zh-CN')
    };

    try {
      const app = getApp();
      await app.supabaseRequest('POST', 'leaderboard', entry);
      console.log('成绩已保存到 Supabase');
    } catch (error) {
      console.error('保存成绩失败:', error);
      // 保存到本地存储作为备份
      let scores = wx.getStorageSync('scores') || [];
      scores.push(entry);
      wx.setStorageSync('scores', scores);
    }
  },

  viewLeaderboard() {
    wx.navigateTo({
      url: '/pages/leaderboard/leaderboard'
    });
  }
});
