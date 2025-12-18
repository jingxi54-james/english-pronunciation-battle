# 英语发音大作战 - 微信公众号版

这是针对微信公众号优化的网页版本。

## 版本特点

### 1. 微信 JSSDK 集成
- 支持微信分享功能
- 支持微信支付（可选）
- 支持微信授权登录（可选）

### 2. 响应式设计
- 完全适配微信内置浏览器
- 优化移动端体验
- 支持全屏模式

### 3. 功能特性
- 发音训练游戏
- 排行榜系统
- 成绩数据库
- 本地存储备份
- Supabase 云端存储

## 部署方式

### 方式 1: 直接部署到服务器

1. 将文件上传到服务器
2. 配置微信公众号后台：
   - 设置服务器地址
   - 配置 JSSDK 权限域名
   - 获取 AppID 和 AppSecret

3. 修改 game.js 中的配置：
```javascript
// 微信 JSSDK 配置
const WECHAT_CONFIG = {
    appId: 'YOUR_APP_ID',
    timestamp: 0,
    nonceStr: '',
    signature: ''
};
```

### 方式 2: 使用 Netlify 部署

1. 连接 GitHub 仓库
2. 设置构建命令（如果需要）
3. 配置环境变量
4. 自动部署

### 方式 3: 使用 Vercel 部署

1. 导入项目
2. 配置环境变量
3. 部署

## 微信公众号配置

### 1. 获取 JSSDK 权限

在公众号后台：
- 设置 → 公众号设置 → 功能设置
- 添加 JS 接口安全域名

### 2. 获取签名

后端需要实现签名接口：
```
GET /api/wechat/signature?url=<当前页面URL>
```

返回格式：
```json
{
    "appId": "YOUR_APP_ID",
    "timestamp": 1234567890,
    "nonceStr": "random_string",
    "signature": "signature_hash"
}
```

### 3. 分享配置

```javascript
wx.ready(function() {
    wx.updateAppMessageShare({
        title: '英语发音大作战',
        desc: '一起来挑战英语发音吧！',
        link: 'https://your-domain.com/wechat-official-account/',
        imgUrl: 'https://your-domain.com/share-icon.png'
    });
});
```

## 文件结构

```
wechat-official-account/
├── index.html           # 主页面
├── game.js             # 游戏逻辑
├── style.css           # 样式表
├── vocabulary.js       # 词汇库
└── README.md          # 说明文档
```

## 与 Web 版本的区别

| 功能 | Web 版 | 公众号版 |
|------|--------|---------|
| 基础游戏 | ✅ | ✅ |
| 排行榜 | ✅ | ✅ |
| 成绩数据库 | ✅ | ✅ |
| 微信分享 | ❌ | ✅ |
| 微信授权 | ❌ | ✅ |
| 微信支付 | ❌ | ✅ |
| 离线使用 | ✅ | ❌ |

## 注意事项

1. **HTTPS 要求**: 微信 JSSDK 只在 HTTPS 环境下工作
2. **域名配置**: 必须在微信公众号后台配置 JS 接口安全域名
3. **跨域问题**: 签名接口需要在同一域名下
4. **浏览器兼容性**: 支持 iOS Safari 和 Android Chrome

## 常见问题

### Q: 如何获取微信 AppID？
A: 在微信公众平台后台 → 设置 → 公众号设置 → 获取 AppID

### Q: 签名验证失败怎么办？
A: 检查：
1. 当前页面 URL 是否正确
2. 签名算法是否正确
3. 权限域名是否配置

### Q: 如何实现微信授权登录？
A: 使用 OAuth 2.0 授权流程：
1. 重定向到微信授权页面
2. 获取授权码
3. 用授权码换取 access_token
4. 获取用户信息

## 后端接口示例

### 获取签名接口

```python
# Python Flask 示例
from flask import Flask, request
import hashlib
import requests

@app.route('/api/wechat/signature')
def get_signature():
    url = request.args.get('url')
    
    # 获取 access_token（需要缓存）
    access_token = get_access_token()
    
    # 获取 jsapi_ticket
    ticket_response = requests.get(
        f'https://api.weixin.qq.com/cgi-bin/ticket/getjsapiticket?access_token={access_token}'
    )
    ticket = ticket_response.json()['ticket']
    
    # 生成签名
    nonce_str = generate_random_string()
    timestamp = int(time.time())
    
    string1 = f'jsapi_ticket={ticket}&noncestr={nonce_str}&timestamp={timestamp}&url={url}'
    signature = hashlib.sha1(string1.encode()).hexdigest()
    
    return {
        'appId': WECHAT_APP_ID,
        'timestamp': timestamp,
        'nonceStr': nonce_str,
        'signature': signature
    }
```

## 支持

如有问题，请联系开发者或提交 Issue。
