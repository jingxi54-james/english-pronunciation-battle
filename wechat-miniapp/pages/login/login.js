Page({
  data: {
    userName: '',
    userGrade: '',
    gradeIndex: 0,
    grades: [
      { label: '-- 请选择年级 --', value: '' },
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
    ]
  },

  onLoad() {
    // 页面加载时的初始化
  },

  handleUserNameInput(e) {
    this.setData({
      userName: e.detail.value
    });
  },

  handleGradeChange(e) {
    const index = e.detail.value;
    this.setData({
      gradeIndex: index,
      userGrade: this.data.grades[index].value
    });
  },

  handleLogin() {
    const { userName, userGrade } = this.data;

    if (!userName || !userGrade) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 保存用户信息到全局数据
    const app = getApp();
    app.globalData.userInfo = {
      name: userName,
      grade: userGrade,
      gameStartTime: Date.now()
    };

    // 保存到本地存储
    wx.setStorageSync('userInfo', app.globalData.userInfo);

    // 跳转到游戏页面
    wx.navigateTo({
      url: '/pages/game/game'
    });
  },

  viewScores() {
    wx.navigateTo({
      url: '/pages/scores/scores'
    });
  }
});
