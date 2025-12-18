# 立即部署到 Netlify

## 快速部署（5 分钟）

### 步骤 1: 推送到 GitHub

```bash
git add .
git commit -m "Deploy: Ready for Netlify"
git push origin main
```

### 步骤 2: 在 Netlify 中部署

1. 访问 https://netlify.com
2. 登录
3. 点击 "New site from Git"
4. 选择 GitHub 仓库
5. 点击 "Deploy site"

### 步骤 3: 等待部署

Netlify 会自动部署，通常需要 1-2 分钟。

### 步骤 4: 测试

1. 打开 Netlify 分配的网址
2. 完成一局游戏
3. 点击"保存并退出"
4. 打开 F12 查看 Console
5. 应该看到 ✅ 成绩已保存到 Supabase

## 完成！

游戏已部署到 Netlify！

## 项目结构

```
核心文件:
  ✓ index.html (主页面)
  ✓ game.js (游戏逻辑)
  ✓ vocabulary.js (词汇库)
  ✓ style.css (样式)

配置文件:
  ✓ package.json (项目配置)
  ✓ netlify.toml (Netlify 配置)
  ✓ .gitignore (Git 忽略)

文档:
  ✓ README.md (项目说明)
  ✓ DEPLOYMENT_READY.md (部署说明)
```

## 需要帮助？

查看 `DEPLOYMENT_READY.md` 获取详细步骤。
