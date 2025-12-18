# 腾讯云 TTS 和语音识别 API 申请指南

## 📋 概述

本指南说明如何申请和配置腾讯云的文字转语音（TTS）和语音识别（ASR）服务，用于微信小程序版本。

## 🔑 第一步：注册腾讯云账号

### 1. 访问腾讯云官网
- 网址：https://cloud.tencent.com/
- 点击右上角"登录"或"注册"

### 2. 注册新账号
- 选择"邮箱注册"或"微信注册"
- 填写相关信息
- 完成身份验证（需要实名认证）

### 3. 实名认证
- 登录后进入"账号中心"
- 点击"实名认证"
- 选择"个人认证"或"企业认证"
- 上传身份证照片
- 等待审核（通常 1-3 天）

## 🎯 第二步：开通 TTS 服务

### 1. 进入 TTS 服务页面
- 访问：https://cloud.tencent.com/product/tts
- 或在控制台搜索"文字转语音"

### 2. 点击"立即使用"
- 选择"文字转语音 TTS"
- 点击"立即开通"

### 3. 选择计费方式
- **按量计费**（推荐新用户）
  - 按实际使用量计费
  - 每月有免费额度（10 万字符）
  - 超出部分按 0.0001 元/字符计费

- **预付费套餐**
  - 一次性购买字符包
  - 价格更优惠
  - 适合大量使用

### 4. 开通成功
- 系统会自动分配 SecretId 和 SecretKey
- 保存这些凭证（后续需要使用）

## 🎯 第三步：开通语音识别服务

### 1. 进入语音识别页面
- 访问：https://cloud.tencent.com/product/asr
- 或在控制台搜索"语音识别"

### 2. 点击"立即使用"
- 选择"语音识别 ASR"
- 点击"立即开通"

### 3. 选择计费方式
- **按量计费**（推荐新用户）
  - 按实际使用量计费
  - 每月有免费额度（15 小时）
  - 超出部分按 0.0015 元/秒计费

- **预付费套餐**
  - 一次性购买时长包
  - 价格更优惠
  - 适合大量使用

### 4. 开通成功
- 系统会自动分配 SecretId 和 SecretKey
- 保存这些凭证

## 🔐 第四步：获取 API 凭证

### 1. 进入 API 密钥管理
- 登录腾讯云控制台
- 点击右上角"用户名" → "访问管理"
- 选择"访问密钥" → "API 密钥管理"

### 2. 创建新密钥
- 点击"新建密钥"
- 系统会生成 SecretId 和 SecretKey
- **重要**：妥善保管这些凭证，不要泄露

### 3. 保存凭证
```
SecretId: AKIDxxxxxxxxxxxxxxxxxxxxxxxx
SecretKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📝 第五步：配置小程序

### 1. 在小程序后端创建 API 接口

创建文件 `wechat-miniapp/utils/tencent-cloud.js`：

```javascript
// 腾讯云 TTS 和 ASR 配置
export const tencentCloudConfig = {
  secretId: 'YOUR_SECRET_ID',
  secretKey: 'YOUR_SECRET_KEY',
  region: 'ap-beijing',  // 地域，可选：ap-beijing, ap-shanghai 等
  ttsEndpoint: 'tts.tencentcloudapi.com',
  asrEndpoint: 'asr.tencentcloudapi.com'
};

// TTS 服务调用
export async function callTTS(text) {
  try {
    const response = await wx.request({
      url: 'https://YOUR_BACKEND_URL/api/tts',  // 你的后端 API
      method: 'POST',
      data: {
        text: text,
        voiceType: 0,  // 0: 女声, 1: 男声
        speed: 1.0,
        volume: 5
      }
    });
    
    if (response.statusCode === 200) {
      // 播放音频
      const audio = wx.createInnerAudioContext();
      audio.src = response.data.audioUrl;
      audio.play();
    }
  } catch (error) {
    console.error('TTS 调用失败:', error);
  }
}

// ASR 服务调用
export async function callASR(audioPath) {
  try {
    const response = await wx.request({
      url: 'https://YOUR_BACKEND_URL/api/asr',  // 你的后端 API
      method: 'POST',
      data: {
        audioPath: audioPath
      }
    });
    
    if (response.statusCode === 200) {
      return response.data.text;  // 返回识别结果
    }
  } catch (error) {
    console.error('ASR 调用失败:', error);
  }
}
```

### 2. 在游戏页面中使用

编辑 `wechat-miniapp/pages/game/game.js`：

```javascript
import { callTTS, callASR } from '../../utils/tencent-cloud.js';

// 播放单词发音
playWordAudio() {
  const { currentWord } = this.data;
  
  // 使用腾讯云 TTS
  callTTS(currentWord.word);
}

// 分析录音
async analyzeAudio(filePath) {
  // 使用腾讯云 ASR 识别
  const recognizedText = await callASR(filePath);
  
  // 计算准确率
  const accuracy = this.calculateAccuracy(recognizedText);
  this.showAccuracyResult(accuracy);
}

// 计算准确率
calculateAccuracy(recognizedText) {
  const { currentWord } = this.data;
  const targetWord = currentWord.word.toLowerCase();
  const recognized = recognizedText.toLowerCase();
  
  // 简单的相似度计算
  if (recognized === targetWord) {
    return 100;
  }
  
  // 计算编辑距离
  const distance = this.levenshteinDistance(targetWord, recognized);
  const maxLength = Math.max(targetWord.length, recognized.length);
  const accuracy = Math.max(0, 100 - (distance / maxLength) * 100);
  
  return Math.round(accuracy);
}

// 编辑距离算法
levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
```

## 🖥️ 第六步：创建后端服务

### 方案 A：使用 Node.js + Express

创建文件 `backend/routes/tts.js`：

```javascript
const express = require('express');
const tencentcloud = require('tencentcloud-sdk-nodejs');
const router = express.Router();

const TtsClient = tencentcloud.tts.v20190823.Client;
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: 'ap-beijing',
  profile: {
    httpProfile: {
      endpoint: 'tts.tencentcloudapi.com',
    },
  },
};

const client = new TtsClient(clientConfig);

router.post('/tts', async (req, res) => {
  try {
    const { text, voiceType = 0, speed = 1.0, volume = 5 } = req.body;
    
    const params = {
      Text: text,
      SessionId: Date.now().toString(),
      ModelType: 1,
      SampleRate: 16000,
      VoiceType: voiceType,
      Speed: speed,
      Volume: volume,
      Language: 1,  // 1: 中文, 2: 英文
    };
    
    const response = await client.TextToSpeech(params);
    
    // 将音频数据保存到文件或返回 URL
    res.json({
      success: true,
      audioUrl: response.Audio,  // Base64 编码的音频数据
    });
  } catch (error) {
    console.error('TTS 错误:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
```

创建文件 `backend/routes/asr.js`：

```javascript
const express = require('express');
const tencentcloud = require('tencentcloud-sdk-nodejs');
const fs = require('fs');
const router = express.Router();

const AsrClient = tencentcloud.asr.v20190614.Client;
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: 'ap-beijing',
  profile: {
    httpProfile: {
      endpoint: 'asr.tencentcloudapi.com',
    },
  },
};

const client = new AsrClient(clientConfig);

router.post('/asr', async (req, res) => {
  try {
    const { audioPath } = req.body;
    
    // 读取音频文件
    const audioData = fs.readFileSync(audioPath);
    const audioBase64 = audioData.toString('base64');
    
    const params = {
      ProjectId: 0,
      SubServiceType: 2,  // 2: 一句话识别
      EngSerViceType: '16k_zh',  // 16k 中文
      SourceType: 1,  // 1: 本地文件
      Data: audioBase64,
      DataLen: audioData.length,
    };
    
    const response = await client.SentenceRecognition(params);
    
    res.json({
      success: true,
      text: response.Result,
      confidence: response.Confidence,
    });
  } catch (error) {
    console.error('ASR 错误:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
```

### 方案 B：使用云函数（推荐）

在腾讯云创建云函数，自动处理 TTS 和 ASR 请求。

## 💰 费用估算

### TTS 费用
- 免费额度：10 万字符/月
- 超出部分：0.0001 元/字符
- 示例：100 万字符 = 100 元

### ASR 费用
- 免费额度：15 小时/月
- 超出部分：0.0015 元/秒
- 示例：100 小时 = 540 元

### 总体估算
- 小规模使用（< 10 万字符 + 15 小时）：**免费**
- 中等规模使用：**50-200 元/月**
- 大规模使用：**500+ 元/月**

## ⚠️ 注意事项

1. **API 凭证安全**
   - 不要在前端代码中硬编码 SecretKey
   - 使用后端服务中转请求
   - 定期轮换密钥

2. **请求限制**
   - TTS：每秒最多 100 个请求
   - ASR：每秒最多 50 个请求
   - 需要添加请求队列和限流

3. **音频格式**
   - TTS 输出：MP3 格式
   - ASR 输入：WAV、MP3、FLAC 等格式
   - 建议使用 16kHz 采样率

4. **成本控制**
   - 设置每日/每月消费限额
   - 监控 API 调用量
   - 定期检查账单

## 🔗 相关链接

- [腾讯云 TTS 文档](https://cloud.tencent.com/document/product/1073)
- [腾讯云 ASR 文档](https://cloud.tencent.com/document/product/1093)
- [腾讯云 SDK 下载](https://cloud.tencent.com/document/sdk)
- [腾讯云控制台](https://console.cloud.tencent.com/)

## 📞 技术支持

- 腾讯云官方文档：https://cloud.tencent.com/document
- 腾讯云社区：https://cloud.tencent.com/developer
- 工单支持：登录控制台 → 工单系统

## ✅ 检查清单

- [ ] 注册腾讯云账号
- [ ] 完成实名认证
- [ ] 开通 TTS 服务
- [ ] 开通 ASR 服务
- [ ] 获取 SecretId 和 SecretKey
- [ ] 创建后端 API 接口
- [ ] 配置小程序调用
- [ ] 测试 TTS 功能
- [ ] 测试 ASR 功能
- [ ] 监控成本

---

**提示**：建议先使用免费额度测试，确认功能正常后再考虑付费。
