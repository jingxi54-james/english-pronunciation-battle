Page({
  data: {
    scores: [],
    filteredScores: [],
    filterType: 'all',
    gradeIndex: 0,
    searchName: '',
    grades: [
      { label: '-- 选择年级 --', value: '' },
      { label: '小学一年级', value: '1' },
      { label: '小学二年级', value: '2' },
      { label: '小学三年级', value: '3' },
      { label: '小学四年级', value: '4' },
      { label: '小学五年级', value: '5' },
      { label: '小学六年级', value: '6' },
      { label: '初中一年级', value: '7' },
      { label: '初中二年级', value: '8' },
      { label: '初中三年级', value: '9' },
      { label: '高中一年级', value: '10' },
      { label: '高中二年级', value: '11' },
      { label: '高中三年级', value: '12' }
    ],
    gradeNames: {
      '1': '小学一年级', '2': '小学二年级', '3': '小学三年级',
      '4': '小学四年级', '5': '小学五年级', '6': '小学六年级',
      '7': '初中一年级', '8': '初中二年级', '9': '初中三年级',
      '10': '高中一年级', '11': '高中二年级', '12': '高中三年级'
    }
  },

  onLoad() {
    this.loadScores();
  },

  async loadScores() {
    try {
      const app = getApp();
      const data = await app.supabaseRequest('GET', 'leaderboard', null, {
        order: 'boss_kills.desc,score.desc,time_taken.asc',
        limit: 100
      });

      this.setData({
        scores: data || [],
        filteredScores: data || []
      });

      // 保存到本地存储
      wx.setStorageSync('scores', data || []);
    } catch (error) {
      console.error('加载成绩失败:', error);
      
      // 使用本地存储的数据
      const localData = wx.getStorageSync('scores') || [];
      this.setData({
        scores: localData,
        filteredScores: localData
      });
    }
  },

  setFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({
      filterType: filter,
      gradeIndex: 0,
      searchName: ''
    });

    if (filter === 'all') {
      this.renderScores('all');
    }
  },

  handleGradeChange(e) {
    const index = e.detail.value;
    this.setData({
      gradeIndex: index
    });

    if (index > 0) {
      const grade = this.data.grades[index].value;
      this.renderScores('grade', grade);
    }
  },

  handleNameInput(e) {
    const searchName = e.detail.value;
    this.setData({
      searchName: searchName
    });

    this.renderScores('name', searchName);
  },

  renderScores(filter, value = null) {
    let data = this.data.scores;

    if (filter === 'grade' && value) {
      data = data.filter(item => item.grade === value);
    } else if (filter === 'name' && value) {
      const searchName = value.toLowerCase();
      data = data.filter(item => item.name.toLowerCase().includes(searchName));
    }

    this.setData({
      filteredScores: data
    });
  },

  formatTime(seconds) {
    const time = parseInt(seconds) || 0;
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes}分${secs}秒`;
  },

  goBack() {
    wx.navigateBack();
  }
});
