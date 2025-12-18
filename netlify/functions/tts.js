// Netlify Function - 腾讯云 TTS 代理
const tencentcloud = require('tencentcloud-sdk-nodejs');

const ttsClient = tencentcloud.tts.v20190823;
const models = tencentcloud.tts.v20190823.Models;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

// 初始化腾讯云客户端
const credential = {
  secretId: process.env.TENCENT_SECRET_ID,
  secretKey: process.env.TENCENT_SECRET_KEY
};

const httpProfile = new HttpProfile();
httpProfile.setReqTimeout(30);

const clientProfile = new ClientProfile();
clientProfile.setHttpProfile(httpProfile);

const client = new ttsClient({
  credential,
  region: 'ap-beijing',
  profile: clientProfile
});

exports.handler = async (event, context) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { text } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '文本不能为空' })
      };
    }

    const params = {
      Text: text,
      SessionId: Date.now().toString(),
      ModelType: 1,
      SampleRate: 16000,
      Codec: 'mp3',
      VoiceType: 0,
      Language: 1, // 英文
      Speed: 1.0,
      Volume: 5.0,
      ProjectId: 0
    };

    const response = await client.TextToSpeech(params);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        audio: response.Audio
      })
    };
  } catch (error) {
    console.error('TTS 错误:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
