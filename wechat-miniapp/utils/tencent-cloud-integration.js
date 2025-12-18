/**
 * 腾讯云 TTS 和 ASR 集成模块
 * 用于微信小程序的文字转语音和语音识别
 */

// ==================== 配置 ====================

const TENCENT_CONFIG = {
  // 替换为你的后端 API 地址
  backendUrl: 'https://your-backend-url.com',
  
  // TTS 配置
  tts: {
    voiceType: 0,      // 0: 女声, 1: 男声
    speed: 1.0,        // 语速 (0.5-2.0)
    volume: 5,         // 音量 (0-10)
    language: 1        // 1: 中文, 2: 英文
  },
  
  // ASR 配置
  asr: {
    engineServiceType: '16k_en',  // 16k 英文识别
    sourceType: 1                  // 1: 本地文件
  }
};

// ==================== TTS 服务 ====================

/**
 * 调用腾讯云 TTS 服务进行文字转语音
 * @param {string} text - 要转换的文本
 * @param {object} options - 可选配置
 * @returns {Promise<boolean>} - 是否成功播放
 */
export async function playTextToSpeech(text, options = {}) {
  try {
    // 合并配置
    const config = { ...TENCENT_CONFIG.tts, ...options };
    
    // 调用后端 API
    const response = await callBackendAPI('/api/tts', {
      text: text,
      voiceType: config.voiceType,
      speed: config.speed,
      volume: config.volume,
      language: config.language
    });
    
    if (response.success && response.audioUrl) {
      // 播放音频
      return await playAudio(response.audioUrl);
    } else {
      console.error('TTS 失败:', response.error);
      return false;
    }
  } catch (error) {
    console.error('TTS 调用异常:', error);
    return false;
  }
}

/**
 * 播放音频
 * @param {string} audioUrl - 音频 URL 或 Base64 数据
 * @returns {Promise<boolean>}
 */
function playAudio(audioUrl) {
  return new Promise((resolve) => {
    try {
      const audio = wx.createInnerAudioContext();
      
      // 如果是 Base64 数据，需要先转换为临时文件
      if (audioUrl.startsWith('data:') || audioUrl.length > 1000) {
        // 保存 Base64 为临时文件
        const fs = wx.getFileSystemManager();
        const tempPath = `${wx.env.USER_DATA_PATH}/temp_audio.mp3`;
        
        // 解码 Base64
        const base64Data = audioUrl.replace(/^data:audio\/\w+;base64,/, '');
        fs.writeFile({
          filePath: tempPath,
          data: base64Data,
          encoding: 'base64',
          success: () => {
            audio.src = tempPath;
            audio.play();
            audio.onEnded(() => resolve(true));
            audio.onError(() => resolve(false));
          },
          fail: () => resolve(false)
        });
      } else {
        // 直接使用 URL
        audio.src = audioUrl;
        audio.play();
        audio.onEnded(() => resolve(true));
        audio.onError(() => resolve(false));
      }
    } catch (error) {
      console.error('播放音频失败:', error);
      resolve(false);
    }
  });
}

// ==================== ASR 服务 ====================

/**
 * 调用腾讯云 ASR 服务进行语音识别
 * @param {string} audioPath - 音频文件路径
 * @returns {Promise<object>} - 识别结果 { text, confidence }
 */
export async function recognizeSpeech(audioPath) {
  try {
    // 调用后端 API
    const response = await callBackendAPI('/api/asr', {
      audioPath: audioPath,
      engineServiceType: TENCENT_CONFIG.asr.engineServiceType
    });
    
    if (response.success) {
      return {
        text: response.text || '',
        confidence: response.confidence || 0
      };
    } else {
      console.error('ASR 失败:', response.error);
      return { text: '', confidence: 0 };
    }
  } catch (error) {
    console.error('ASR 调用异常:', error);
    return { text: '', confidence: 0 };
  }
}

/**
 * 计算发音准确率
 * @param {string} targetWord - 目标单词
 * @param {string} recognizedText - 识别结果
 * @returns {number} - 准确率 (0-100)
 */
export function calculateAccuracy(targetWord, recognizedText) {
  if (!recognizedText) {
    return 0;
  }
  
  const target = targetWord.toLowerCase().trim();
  const recognized = recognizedText.toLowerCase().trim();
  
  // 完全匹配
  if (target === recognized) {
    return 100;
  }
  
  // 计算编辑距离
  const distance = levenshteinDistance(target, recognized);
  const maxLength = Math.max(target.length, recognized.length);
  
  // 根据编辑距离计算准确率
  const accuracy = Math.max(0, 100 - (distance / maxLength) * 100);
  
  return Math.round(accuracy);
}

/**
 * 编辑距离算法（Levenshtein Distance）
 * 用于计算两个字符串的相似度
 * @param {string} str1
 * @param {string} str2
 * @returns {number}
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  // 初始化第一列
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  // 初始化第一行
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  // 填充矩阵
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,  // 替换
          matrix[i][j - 1] + 1,      // 插入
          matrix[i - 1][j] + 1       // 删除
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// ==================== 后端 API 调用 ====================

/**
 * 调用后端 API
 * @param {string} endpoint - API 端点
 * @param {object} data - 请求数据
 * @returns {Promise<object>}
 */
function callBackendAPI(endpoint, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${TENCENT_CONFIG.backendUrl}${endpoint}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: data,
      timeout: 30000,  // 30 秒超时
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// ==================== 工具函数 ====================

/**
 * 检查后端服务是否可用
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const response = await callBackendAPI('/health', {});
    return response.status === 'ok';
  } catch (error) {
    console.error('后端服务不可用:', error);
    return false;
  }
}

/**
 * 获取 TTS 配置
 * @returns {object}
 */
export function getTTSConfig() {
  return TENCENT_CONFIG.tts;
}

/**
 * 更新 TTS 配置
 * @param {object} config
 */
export function updateTTSConfig(config) {
  Object.assign(TENCENT_CONFIG.tts, config);
}

/**
 * 获取 ASR 配置
 * @returns {object}
 */
export function getASRConfig() {
  return TENCENT_CONFIG.asr;
}

/**
 * 更新 ASR 配置
 * @param {object} config
 */
export function updateASRConfig(config) {
  Object.assign(TENCENT_CONFIG.asr, config);
}

/**
 * 设置后端 URL
 * @param {string} url
 */
export function setBackendUrl(url) {
  TENCENT_CONFIG.backendUrl = url;
}

// ==================== 导出 ====================

export default {
  playTextToSpeech,
  recognizeSpeech,
  calculateAccuracy,
  checkBackendHealth,
  getTTSConfig,
  updateTTSConfig,
  getASRConfig,
  updateASRConfig,
  setBackendUrl
};
