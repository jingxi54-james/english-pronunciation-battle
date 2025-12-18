// 小程序应用入口
App({
  onLaunch() {
    // 初始化 Supabase 客户端
    this.initSupabase();
  },

  initSupabase() {
    // 在小程序中使用 Supabase，需要通过 HTTP 请求
    // 这里存储 Supabase 配置供全局使用
    this.globalData.supabaseUrl = 'https://wmaxoenjqvdnwlramwvp.supabase.co';
    this.globalData.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYXhvZW5qcXZkbndscmFtd3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDM1OTIsImV4cCI6MjA4MTU3OTU5Mn0.tgsZ69e7TxNNqMwSjqyZsx8eM7p2tAs04fetHeJyemg';
  },

  // 调用 Supabase API
  async supabaseRequest(method, table, data = null, query = null) {
    const url = `${this.globalData.supabaseUrl}/rest/v1/${table}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.globalData.supabaseKey}`,
      'apikey': this.globalData.supabaseKey
    };

    try {
      return new Promise((resolve, reject) => {
        let requestUrl = url;
        if (query) {
          requestUrl += '?' + new URLSearchParams(query).toString();
        }

        wx.request({
          url: requestUrl,
          method: method,
          header: headers,
          data: data,
          success: (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(res.data);
            } else {
              reject(res.data);
            }
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    } catch (error) {
      console.error('Supabase 请求失败:', error);
      throw error;
    }
  },

  globalData: {
    supabaseUrl: '',
    supabaseKey: '',
    userInfo: null
  }
});
