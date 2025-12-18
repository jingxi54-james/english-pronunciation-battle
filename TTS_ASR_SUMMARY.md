# 腾讯云 TTS/ASR 申请和集成完整方案

## 📦 已创建的文件

### 文档文件
- ✅ `TENCENT_CLOUD_SETUP.md` - 申请指南（详细步骤）
- ✅ `TENCENT_INTEGRATION_GUIDE.md` - 完整集成指南
- ✅ `TTS_ASR_SUMMARY.md` - 本文件

### 代码文件
- ✅ `wechat-miniapp/utils/tencent-cloud-integration.js` - 小程序集成模块
- ✅ `backend-example/server.js` - 后端服务示例
- ✅ `backend-example/package.json` - 后端依赖配置
- ✅ `backend-example/.env.example` - 环境变量示例

## 🚀 快速开始（3 步）

### 第一步：申请腾讯云服务（5 分钟）

1. **注册账号**
   - 访问 https://cloud.tencent.com/
   - 注册并完成实名认证

2. **开通 TTS 服务**
   - 搜索"文字转语音"
   - 点击"立即开通"
   - 免费额度：10 万字符/月

3. **开通 ASR 服务**
   - 搜索"语音识别"
   - 点击"立即开通"
   - 免费额度：15 小时/月

4. **获取 API 凭证**
   - 进入"访问管理" → "API 密钥管理"
   - 创建新密钥
   - 复制 SecretId 和 SecretKey

### 第二步：部署后端服务（10 分钟）

#### 本地开发

```bash
# 1. 进入后端目录
cd backend-example

# 2. 复制环境配置
cp .env.example .env

# 3. 编辑 .env，填入腾讯云凭证
# TENCENT_SECRET_ID=你的SecretId
# TENCENT_SECRET_KEY=你的SecretKey

# 4. 安装依赖
npm install

# 5. 启动服务
npm run dev
```

服务器将在 `http://localhost:3000` 启动

#### 云服务器部署

参考 `TENCENT_INTEGRATION_GUIDE.md` 中的"云服务器部署"部分

### 第三步：集成到小程序（5 分钟）

1. **配置后端 URL**
   ```javascript
   // wechat-miniapp/utils/tencent-cloud-integration.js
   const TENCENT_CONFIG = {
     backendUrl: 'https://your-backend-url.com'
   };
   ```

2. **在游戏页面中使用**
   ```javascript
   import {
     playTextToSpeech,
     recognizeSpeech,
     calculateAccuracy
   } from '../../utils/tencent-cloud-integration.js';

   // 播放发音
   await playTextToSpeech('hello');

   // 识别语音
   const result = await recognizeSpeech(audioPath);

   // 计算准确率
   const accuracy = calculateAccuracy('hello', result.text);
   ```

3. **测试**
   - 在微信开发者工具中预览
   - 测试播放发音和语音识别

## 📊 架构图

```
┌─────────────────────────────────────────────────────────┐
│                    微信小程序                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  游戏页面 (game.js)                              │  │
│  │  - 播放发音: playTextToSpeech()                  │  │
│  │  - 识别语音: recognizeSpeech()                   │  │
│  │  - 计算准确率: calculateAccuracy()               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP 请求
┌─────────────────────────────────────────────────────────┐
│                   后端服务 (Node.js)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Express 服务器                                  │  │
│  │  - POST /api/tts - 文字转语音                    │  │
│  │  - POST /api/asr - 语音识别                      │  │
│  │  - GET /health - 健康检查                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ API 调用
┌─────────────────────────────────────────────────────────┐
│                   腾讯云服务                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  TTS (文字转语音)                                │  │
│  │  - 输入: 文本                                    │  │
│  │  - 输出: MP3 音频                                │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  ASR (语音识别)                                  │  │
│  │  - 输入: MP3 音频                                │  │
│  │  - 输出: 识别文本                                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 💰 费用估算

### TTS 费用
| 使用量 | 费用 |
|--------|------|
| 10 万字符/月 | 免费 |
| 100 万字符/月 | 100 元 |
| 1000 万字符/月 | 1000 元 |

### ASR 费用
| 使用量 | 费用 |
|--------|------|
| 15 小时/月 | 免费 |
| 100 小时/月 | 540 元 |
| 1000 小时/月 | 5400 元 |

### 优化建议
1. 使用预付费套餐（便宜 30-50%）
2. 缓存常用单词的 TTS 结果
3. 合并多个请求减少调用次数
4. 监控使用量避免超支

## 🔧 API 接口说明

### TTS 接口

**请求**：
```bash
POST /api/tts
Content-Type: application/json

{
  "text": "hello world",
  "voiceType": 0,      // 0: 女声, 1: 男声
  "speed": 1.0,        // 0.5-2.0
  "volume": 5,         // 0-10
  "language": 2        // 1: 中文, 2: 英文
}
```

**响应**：
```json
{
  "success": true,
  "audioUrl": "data:audio/mp3;base64,...",
  "requestId": "xxx"
}
```

### ASR 接口

**请求**：
```bash
POST /api/asr
Content-Type: application/json

{
  "audioPath": "/path/to/audio.mp3",
  "engineServiceType": "16k_en"
}
```

**响应**：
```json
{
  "success": true,
  "text": "hello world",
  "confidence": 0.95,
  "requestId": "xxx"
}
```

## 📚 文件说明

### 小程序集成模块
**文件**：`wechat-miniapp/utils/tencent-cloud-integration.js`

**主要函数**：
- `playTextToSpeech(text, options)` - 播放文字转语音
- `recognizeSpeech(audioPath)` - 识别语音
- `calculateAccuracy(targetWord, recognizedText)` - 计算准确率
- `checkBackendHealth()` - 检查后端服务
- `setBackendUrl(url)` - 设置后端 URL

### 后端服务
**文件**：`backend-example/server.js`

**主要端点**：
- `GET /health` - 健康检查
- `POST /api/tts` - 文字转语音
- `POST /api/asr` - 语音识别

## ⚠️ 注意事项

1. **安全性**
   - 不要在前端代码中硬编码 SecretKey
   - 使用后端服务中转请求
   - 定期轮换 API 密钥

2. **性能**
   - TTS：每秒最多 100 个请求
   - ASR：每秒最多 50 个请求
   - 需要添加请求队列和限流

3. **成本控制**
   - 设置消费限额
   - 监控使用量
   - 定期检查账单

4. **用户体验**
   - 添加加载提示
   - 处理错误情况
   - 提供重试机制

## 🎯 下一步

1. ✅ 申请腾讯云服务（参考 `TENCENT_CLOUD_SETUP.md`）
2. ✅ 部署后端服务（参考 `TENCENT_INTEGRATION_GUIDE.md`）
3. ✅ 集成到小程序（参考本文档）
4. ✅ 本地测试验证
5. ✅ 部署到生产环境
6. ✅ 监控成本和性能

## 📞 获取帮助

### 官方文档
- [腾讯云 TTS 文档](https://cloud.tencent.com/document/product/1073)
- [腾讯云 ASR 文档](https://cloud.tencent.com/document/product/1093)
- [腾讯云 SDK](https://cloud.tencent.com/document/sdk)

### 技术支持
- 腾讯云工单系统：登录控制台 → 工单系统
- 腾讯云社区：https://cloud.tencent.com/developer
- 官方文档：https://cloud.tencent.com/document

## 📋 检查清单

- [ ] 注册腾讯云账号
- [ ] 完成实名认证
- [ ] 开通 TTS 服务
- [ ] 开通 ASR 服务
- [ ] 获取 SecretId 和 SecretKey
- [ ] 部署后端服务
- [ ] 配置小程序后端 URL
- [ ] 本地测试 TTS 功能
- [ ] 本地测试 ASR 功能
- [ ] 部署到生产环境
- [ ] 设置消费告警
- [ ] 监控使用量

---

**提示**：建议先使用免费额度测试，确认功能正常后再考虑付费。

**完整指南**：
- 详细申请步骤 → `TENCENT_CLOUD_SETUP.md`
- 完整集成指南 → `TENCENT_INTEGRATION_GUIDE.md`
- 代码示例 → `backend-example/` 和 `wechat-miniapp/utils/`
