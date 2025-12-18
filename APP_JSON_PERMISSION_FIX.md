# app.json 权限配置修复

## 问题描述

微信开发者工具报错：
```
无效的 app.json permission["scope.record"]
```

## 原因分析

微信小程序的权限配置格式在不同版本中有所不同：

### 旧版本（已弃用）
```json
"permission": {
  "scope.record": {
    "desc": "需要使用麦克风进行发音录制"
  }
}
```

### 新版本（当前标准）
```json
"requiredPrivateInfos": [
  "getRecordManager"
]
```

## 解决方案

将 `app.json` 中的 `permission` 配置改为 `requiredPrivateInfos`。

### 修改前
```json
{
  "permission": {
    "scope.record": {
      "desc": "需要使用麦克风进行发音录制"
    }
  }
}
```

### 修改后
```json
{
  "requiredPrivateInfos": [
    "getRecordManager"
  ]
}
```

## 修改的文件

- ✅ `wechat-miniapp/app.json` - 已修改

## 权限说明

### requiredPrivateInfos 常见值

| 权限 | 说明 |
|------|------|
| `getRecordManager` | 使用麦克风录音 |
| `getUserInfo` | 获取用户信息 |
| `getLocation` | 获取地理位置 |
| `getPhoneNumber` | 获取手机号 |
| `getWeRunData` | 获取微信运动数据 |

### 使用方式

在 `app.json` 中声明需要的权限：

```json
{
  "requiredPrivateInfos": [
    "getRecordManager",
    "getUserInfo",
    "getLocation"
  ]
}
```

## 测试方法

1. 在微信开发者工具中重新加载项目
2. 检查是否还有错误提示
3. 点击"预览"进行测试
4. 在手机上测试录音功能

## 相关知识

### 微信小程序权限管理

微信小程序对用户隐私信息的访问有严格的管理：

1. **声明权限**
   - 在 `app.json` 中声明需要的权限
   - 用户可以在设置中查看和管理权限

2. **请求权限**
   - 某些权限需要用户主动授权
   - 使用 `wx.authorize()` 请求权限

3. **检查权限**
   - 使用 `wx.getSetting()` 检查权限状态
   - 根据权限状态决定是否调用相关 API

### 录音权限示例

```javascript
// 请求麦克风权限
wx.authorize({
  scope: 'scope.record',
  success: () => {
    // 用户已授权，可以使用麦克风
    const recordManager = wx.getRecordManager();
    recordManager.start();
  },
  fail: () => {
    // 用户拒绝授权
    wx.showToast({
      title: '需要麦克风权限',
      icon: 'none'
    });
  }
});
```

## 最佳实践

1. **最小权限原则**
   - 只声明必要的权限
   - 避免过度请求权限

2. **用户体验**
   - 在需要权限时才请求
   - 提供清晰的权限说明

3. **错误处理**
   - 处理用户拒绝授权的情况
   - 提供替代方案

## 常见问题

### Q: 为什么需要声明权限？
A: 微信小程序需要声明权限以保护用户隐私。用户可以在设置中查看和管理权限。

### Q: 声明权限后用户会看到什么？
A: 用户在首次使用相关功能时会看到权限请求弹窗。

### Q: 如何检查用户是否已授权？
A: 使用 `wx.getSetting()` 检查权限状态。

### Q: 如果用户拒绝授权怎么办？
A: 应该提供清晰的提示，并提供替代方案或引导用户在设置中授权。

---

**权限配置已修复，错误应该消失！** ✨
