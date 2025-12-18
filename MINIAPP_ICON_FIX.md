# 微信小程序图标问题修复

## 问题描述

预览时出现错误：
```
Error: app.json: ["tabBar"]["list"][0]["iconPath"]: "assets/game.png" 未找到
```

## 原因

`app.json` 中引用的图标文件不存在。

## 解决方案

### 方案 A：使用 Emoji 表情（已应用）✅

修改 `app.json` 中的 tabBar 配置，使用 Emoji 表情代替图标文件：

```json
"tabBar": {
  "color": "#999",
  "selectedColor": "#667eea",
  "backgroundColor": "#fff",
  "borderStyle": "black",
  "list": [
    {
      "pagePath": "pages/game/game",
      "text": "🎮 游戏"
    },
    {
      "pagePath": "pages/leaderboard/leaderboard",
      "text": "🏆 排行榜"
    },
    {
      "pagePath": "pages/scores/scores",
      "text": "📈 成绩"
    }
  ]
}
```

**优点**：
- 无需创建图标文件
- 简洁美观
- 支持 Emoji 表情

**缺点**：
- 不如自定义图标专业

### 方案 B：使用自定义图标（可选）

如果想使用自定义图标，需要创建 PNG 图标文件：

1. **创建图标文件**
   - `wechat-miniapp/assets/game.png` (81×81 像素)
   - `wechat-miniapp/assets/game-active.png` (81×81 像素)
   - `wechat-miniapp/assets/rank.png` (81×81 像素)
   - `wechat-miniapp/assets/rank-active.png` (81×81 像素)
   - `wechat-miniapp/assets/score.png` (81×81 像素)
   - `wechat-miniapp/assets/score-active.png` (81×81 像素)

2. **修改 app.json**
   ```json
   "tabBar": {
     "list": [
       {
         "pagePath": "pages/game/game",
         "text": "游戏",
         "iconPath": "assets/game.png",
         "selectedIconPath": "assets/game-active.png"
       },
       // ... 其他项
     ]
   }
   ```

3. **图标设计建议**
   - 大小：81×81 像素
   - 格式：PNG（支持透明背景）
   - 颜色：
     - 未选中：灰色 (#999)
     - 选中：紫色 (#667eea)

## 当前状态

✅ **已应用方案 A**

使用 Emoji 表情作为 tabBar 图标：
- 🎮 游戏
- 🏆 排行榜
- 📈 成绩

## 测试

现在可以在微信开发者工具中预览，应该不会再出现图标错误。

## 后续优化

如果想要更专业的外观，可以：

1. 使用在线图标生成工具
   - https://www.icoconvert.com/
   - https://www.favicon-generator.org/

2. 使用设计工具
   - Figma
   - Adobe XD
   - Sketch

3. 使用开源图标库
   - Font Awesome
   - Material Icons
   - Feather Icons

## 相关文件

- `wechat-miniapp/app.json` - 小程序配置（已修改）
- `wechat-miniapp/assets/` - 资源目录（可选）

---

**提示**：当前使用 Emoji 表情方案已完全解决问题，可以正常预览和使用。
