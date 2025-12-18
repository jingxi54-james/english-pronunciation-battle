# 英语发音大作战 - 微信小程序版本

这是英语发音大作战游戏的微信小程序版本。

## 项目结构

```
wechat-miniapp/
├── app.json              # 小程序配置文件
├── app.js                # 小程序主文件
├── pages/
│   ├── login/            # 登录页面
│   │   ├── login.wxml
│   │   ├── login.wxss
│   │   └── login.js
│   ├── game/             # 游戏页面
│   │   ├── game.wxml
│   │   ├── game.wxss
│   │   └── game.js
│   ├── leaderboard/      # 排行榜页面
│   │   ├── leaderboard.wxml
│   │   ├── leaderboard.wxss
│   │   └── leaderboard.js
│   └── scores/           # 成绩数据库页面
│       ├── scores.wxml
│       ├── scores.wxss
│       └── scores.js
└── utils/
    ├── vocabulary.js     # 词汇库
    └── boss-config.js    # BOSS配置
```

## 主要特性

- ✅ 登录系统（姓名 + 年级选择）
- ✅ BOSS 战斗系统（10 种不同的 BOSS）
- ✅ 发音录制和评分
- ✅ 排行榜系统
- ✅ 成绩数据库
- ✅ Supabase 数据持久化
- ✅ 本地存储备份

## 与网页版本的主要差异

### 1. 录音系统
- **网页版**：使用 `MediaRecorder` API
- **小程序版**：使用 `wx.getRecordManager()` API

### 2. 文字转语音
- **网页版**：使用 `SpeechSynthesisUtterance` API
- **小程序版**：使用 Toast 提示（需要集成第三方 TTS 服务）

### 3. 本地存储
- **网页版**：使用 `localStorage`
- **小程序版**：使用 `wx.setStorageSync()` / `wx.getStorageSync()`

### 4. 数据库访问
- **网页版**：直接使用 Supabase JavaScript 客户端
- **小程序版**：通过 HTTP 请求调用 Supabase REST API

### 5. 页面导航
- **网页版**：使用 DOM 操作和 CSS 显示/隐藏
- **小程序版**：使用 `wx.navigateTo()` 进行页面跳转

## 开发指南

### 1. 安装微信开发者工具
下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 2. 导入项目
1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `wechat-miniapp` 文件夹
4. 输入你的小程序 AppID（如果没有，可以先用测试号）

### 3. 配置 Supabase
在 `app.js` 中修改 Supabase 配置：
```javascript
this.globalData.supabaseUrl = 'YOUR_SUPABASE_URL';
this.globalData.supabaseKey = 'YOUR_SUPABASE_KEY';
```

### 4. 测试
在微信开发者工具中点击"预览"或"真机调试"进行测试

## 功能说明

### 登录页面
- 输入玩家姓名
- 选择年级（1-12 年级）
- 开始游戏或查看成绩数据库

### 游戏页面
- 显示当前关卡、得分、攻击次数
- BOSS 区域显示 BOSS 形象和血量
- 单词卡片显示要发音的单词
- 录音按钮进行发音录制
- 准确率显示和伤害计算
- 攻击按钮对 BOSS 造成伤害

### 排行榜页面
- 显示全部玩家排行榜
- 支持按年级筛选
- 显示击杀 BOSS 数、得分、用时

### 成绩数据库页面
- 显示所有成绩记录
- 支持按年级筛选
- 支持按姓名搜索
- 显示详细的成绩信息

## 已知限制

1. **文字转语音**：小程序没有原生的 TTS API，需要集成第三方服务
2. **音频分析**：准确率计算基于文件大小，实际应用中需要集成语音识别 API
3. **权限**：需要用户授予麦克风权限才能进行录音
4. **网络**：需要网络连接才能同步数据到 Supabase

## 改进建议

1. 集成腾讯云 TTS 服务进行文字转语音
2. 集成腾讯云语音识别 API 进行准确率计算
3. 添加音效和动画效果
4. 优化 UI 设计以适应不同屏幕尺寸
5. 添加分享功能
6. 添加成就系统

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发者。
