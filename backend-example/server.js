/**
 * 后端服务示例 - Node.js + Express
 * 用于处理腾讯云 TTS 和 ASR 请求
 * 
 * 安装依赖：
 * npm install express tencentcloud-sdk-nodejs dotenv cors
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// ==================== 腾讯云 SDK 配置 ====================

const tencentcloud = require('tencentcloud-sdk-nodejs');

// TTS 客户端
const TtsClient = tencentcloud.tts.v20190823.Client;
const ttsClientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: process.env.TENCENT_REGION || 'ap-beijing',
  profile: {
    httpProfile: {
      endpoint: 'tts.tencentcloudapi.com',
    },
  },
};

// ASR 客户端
const AsrClient = tencentcloud.asr.v20190614.Client;
const asrClientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: process.env.TENCENT_REGION || 'ap-beijing',
  profile: {
    httpProfile: {
      endpoint: 'asr.tencentcloudapi.com',
    },
  },
};

const ttsClient = new TtsClient(ttsClientConfig);
const asrClient = new AsrClient(asrClientConfig);

// ==================== 健康检查 ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ==================== TTS 接口 ====================

/**
 * POST /api/tts
 * 文字转语音
 * 
 * 请求体：
 * {
 *   "text": "hello",
 *   "voiceType": 0,
 *   "speed": 1.0,
 *   "volume": 5,
 *   "language": 2
 * }
 */
app.post('/api/tts', async (req, res) => {
  try {
    const {
      text,
      voiceType = 0,
      speed = 1.0,
      volume = 5,
      language = 2  // 2: 英文
    } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: '文本不能为空'
      });
    }

    // 调用腾讯云 TTS API
    const params = {
      Text: text,
      SessionId: `${Date.now()}-${Math.random()}`,
      ModelType: 1,
      SampleRate: 16000,
      VoiceType: voiceType,
      Speed: speed,
      Volume: volume,
      Language: language,
      Codec: 'mp3'
    };

    console.log('TTS 请求:', params);

    const response = await ttsClient.TextToSpeech(params);

    // 返回 Base64 编码的音频数据
    res.json({
      success: true,
      audioUrl: `data:audio/mp3;base64,${response.Audio}`,
      requestId: response.RequestId
    });

  } catch (error) {
    console.error('TTS 错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '文字转语音失败'
    });
  }
});

// ==================== ASR 接口 ====================

/**
 * POST /api/asr
 * 语音识别
 * 
 * 请求体：
 * {
 *   "audioPath": "/path/to/audio.mp3",
 *   "engineServiceType": "16k_en"
 * }
 */
app.post('/api/asr', async (req, res) => {
  try {
    const {
      audioPath,
      engineServiceType = '16k_en'
    } = req.body;

    if (!audioPath) {
      return res.status(400).json({
        success: false,
        error: '音频路径不能为空'
      });
    }

    // 读取音频文件
    const fs = require('fs');
    const audioBuffer = fs.readFileSync(audioPath);
    const audioBase64 = audioBuffer.toString('base64');

    // 调用腾讯云 ASR API
    const params = {
      ProjectId: 0,
      SubServiceType: 2,  // 2: 一句话识别
      EngSerViceType: engineServiceType,
      SourceType: 1,
      Data: audioBase64,
      DataLen: audioBuffer.length,
      VadFlag: 1
    };

    console.log('ASR 请求:', {
      ...params,
      Data: `[Base64 数据, 长度: ${audioBuffer.length}]`
    });

    const response = await asrClient.SentenceRecognition(params);

    res.json({
      success: true,
      text: response.Result || '',
      confidence: response.Confidence || 0,
      requestId: response.RequestId
    });

  } catch (error) {
    console.error('ASR 错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '语音识别失败'
    });
  }
});

// ==================== 错误处理 ====================

app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    error: '服务器内部错误'
  });
});

// ==================== 启动服务器 ====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   腾讯云 TTS/ASR 后端服务已启动        ║
╠════════════════════════════════════════╣
║   服务器地址: http://localhost:${PORT}      ║
║   TTS 接口: POST /api/tts              ║
║   ASR 接口: POST /api/asr              ║
║   健康检查: GET /health                ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
