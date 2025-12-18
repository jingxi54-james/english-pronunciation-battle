# 腾讯云 TTS/ASR 完整集成指南

## 📋 目录

1. [申请服务](#申请服务)
2. [后端部署](#后端部署)
3. [小程序集成](#小程序集成)
4. [测试验证](#测试验证)
5. [常见问题](#常见问题)

## 申请服务

### 第一步：注册腾讯云账号

1. 访问 https://cloud.tencent.com/
2. 点击"登录"或"注册"
3. 使用邮箱或微信注册
4. 完成实名认证（1-3 天）

### 第二步：开通 TTS 服务

1. 登录腾讯云控制台
2. 搜索"文字转语音"
3. 点击"立即开通"
4. 选择"按量计费"（推荐）
5. 确认开通

**免费额度**：10 万字符/月

### 第三步：开通 ASR 服务

1. 登录腾讯云控制台
2. 搜索"语音识别"
3. 点击"立即开通"
4. 选择"按量计费"（推荐）
5. 确认开通

**免费额度**：15 小时/月

### 第四步：获取 API 凭证

1. 进入"访问管理" → "API 密钥管理"
2. 点击"新建密钥"
3. 复制 **SecretId** 和 **SecretKey**
4. 妥善保管（不要泄露）

## 后端部署

### 方案 A：本地开发

#### 1. 安装 Node.js

- 下载：https://nodejs.org/
- 选择 LTS 版本
- 安装完成后验证：`node -v` 和 `npm -v`

#### 2. 配置后端项目

```bash
# 进入后端目录
cd backend-example

# 复制环境配置文件
cp .env.example .env

# 编辑 .env 文件，填入你的腾讯云凭证
# TENCENT_SECRET_ID=你的SecretId
# TENCENT_SECRET_KEY=你的SecretKey
```

#### 3. 安装依赖

```bash
npm install
```

#### 4. 启动服务

```bash
# 开发模式（需要安装 nodemon）
npm run dev

# 或生产模式
npm start
```

服务器将在 `http://localhost:3000` 启动

#### 5. 测试 API

```bash
# 测试 TTS
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"hello world"}'

# 测试 ASR
curl -X POST http://localhost:3000/api/asr \
  -H "Content-Type: application/json" \
  -d '{"audioPath":"/path/to/audio.mp3"}'

# 健康检查
curl http://localhost:3000/health
```

### 方案 B：云服务器部署

#### 1. 购买云服务器

- 腾讯云 CVM：https://cloud.tencent.com/product/cvm
- 推荐配置：1核 2GB 内存，1Mbps 带宽
- 系统：Ubuntu 20.04 LTS

#### 2. 连接服务器

```bash
# 使用 SSH 连接
ssh -i your-key.pem ubuntu@your-server-ip
```

#### 3. 安装 Node.js

```bash
# 更新包管理器
sudo apt update
sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
npm -v
```

#### 4. 部署应用

```bash
# 克隆项目
git clone your-repo-url
cd backend-example

# 安装依赖
npm install

# 配置环境变量
nano .env
# 填入腾讯云凭证

# 使用 PM2 管理进程
sudo npm install -g pm2
pm2 start server.js --name "tts-asr-backend"
pm2 startup
pm2 save
```

#### 5. 配置 Nginx 反向代理

```bash
# 安装 Nginx
sudo apt install -y nginx

# 编辑配置文件
sudo nano /etc/nginx/sites-available/default
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

重启 Nginx：

```bash
sudo systemctl restart nginx
```

#### 6. 配置 SSL 证书

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo systemctl enable certbot.timer
```

### 方案 C：云函数部署（推荐）

腾讯云云函数可以自动处理 TTS 和 ASR 请求，无需管理服务器。

1. 进入腾讯云控制台 → 云函数
2. 创建新函数
3. 上传 `server.js` 代码
4. 配置环境变量
5. 设置触发器（API 网关）
6. 获取函数 URL

## 小程序集成

### 第一步：配置后端 URL

编辑 `wechat-miniapp/utils/tencent-cloud-integration.js`：

```javascript
const TENCENT_CONFIG = {
  backendUrl: 'https://your-backend-url.com',  // 替换为你的后端地址
  // ... 其他配置
};
```

### 第二步：在游戏页面中使用

编辑 `wechat-miniapp/pages/game/game.js`：

```javascript
import {
  playTextToSpeech,
  recognizeSpeech,
  calculateAccuracy
} from '../../utils/tencent-cloud-integration.js';

Page({
  // ... 其他代码

  // 播放单词发音
  async playWordAudio() {
    const { currentWord } = this.data;
    
    // 使用腾讯云 TTS
    const success = await playTextToSpeech(currentWord.word, {
      voiceType: 0,  // 女声
      speed: 0.8,    // 稍慢
      language: 2    // 英文
    });
    
    if (!success) {
      wx.showToast({
        title: '发音播放失败',
        icon: 'none'
      });
    }
  },

  // 分析录音
  async analyzeAudio(filePath) {
    // 显示加载提示
    wx.showLoading({
      title: '识别中...'
    });

    try {
      // 使用腾讯云 ASR 识别
      const result = await recognizeSpeech(filePath);
      
      // 计算准确率
      const accuracy = calculateAccuracy(
        this.data.currentWord.word,
        result.text
      );
      
      console.log('识别结果:', result.text);
      console.log('准确率:', accuracy);
      
      this.showAccuracyResult(accuracy);
    } catch (error) {
      console.error('识别失败:', error);
      wx.showToast({
        title: '识别失败，请重试',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // ... 其他方法
});
```

### 第三步：处理权限

在 `app.json` 中确保已配置麦克风权限：

```json
{
  "permission": {
    "scope.record": {
      "desc": "需要使用麦克风进行发音录制"
    }
  }
}
```

## 测试验证

### 1. 测试后端 API

```bash
# 测试 TTS
curl -X POST https://your-backend-url.com/api/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "hello world",
    "voiceType": 0,
    "speed": 1.0,
    "volume": 5,
    "language": 2
  }'

# 预期响应
{
  "success": true,
  "audioUrl": "data:audio/mp3;base64,...",
  "requestId": "xxx"
}
```

### 2. 测试小程序

1. 在微信开发者工具中打开项目
2. 点击"预览"
3. 用微信扫描二维码
4. 在手机上测试：
   - 点击"播放发音"按钮
   - 点击"开始录音"按钮
   - 说出单词
   - 查看识别结果和准确率

### 3. 监控成本

1. 登录腾讯云控制台
2. 进入"费用中心" → "账单详情"
3. 查看 TTS 和 ASR 的使用量
4. 设置消费告警

## 常见问题

### Q1: 后端无法连接到腾讯云

**原因**：SecretId 或 SecretKey 错误

**解决**：
1. 检查 `.env` 文件中的凭证
2. 确保凭证没有多余空格
3. 重启后端服务

### Q2: 小程序无法连接到后端

**原因**：后端 URL 错误或跨域问题

**解决**：
1. 检查 `tencent-cloud-integration.js` 中的 URL
2. 确保后端已启动
3. 检查防火墙设置
4. 查看浏览器控制台错误信息

### Q3: TTS 播放没有声音

**原因**：音频格式不支持或音量设置过低

**解决**：
1. 检查音量设置（0-10）
2. 尝试增加音量
3. 检查手机音量设置
4. 查看浏览器控制台错误

### Q4: ASR 识别准确率低

**原因**：录音质量差或背景噪音

**解决**：
1. 在安静环境中录音
2. 靠近麦克风
3. 清晰发音
4. 调整识别引擎（16k_en vs 16k_zh）

### Q5: 超出免费额度怎么办

**解决**：
1. 购买预付费套餐（更便宜）
2. 设置消费限额
3. 优化使用（缓存结果）
4. 考虑其他服务商

## 成本优化建议

1. **缓存结果**
   - 缓存常用单词的 TTS 结果
   - 避免重复调用

2. **批量处理**
   - 合并多个请求
   - 减少 API 调用次数

3. **选择合适的引擎**
   - 16k 引擎更便宜
   - 根据需求选择

4. **监控使用量**
   - 定期检查账单
   - 及时发现异常

## 相关资源

- [腾讯云 TTS 文档](https://cloud.tencent.com/document/product/1073)
- [腾讯云 ASR 文档](https://cloud.tencent.com/document/product/1093)
- [腾讯云 SDK](https://cloud.tencent.com/document/sdk)
- [Node.js 官网](https://nodejs.org/)
- [Express 文档](https://expressjs.com/)

## 支持

遇到问题？

1. 查看腾讯云官方文档
2. 提交工单到腾讯云
3. 查看项目 GitHub Issues
4. 联系技术支持

---

**提示**：建议先在本地开发环境测试，确认功能正常后再部署到生产环境。
