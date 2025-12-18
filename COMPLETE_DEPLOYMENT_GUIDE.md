# 完整部署流程指南

## 总体流程

```
本地项目 → GitHub → Netlify → 在线游戏
```

## 第 1 部分：推送到 GitHub

### 步骤 1.1: 检查 Git 状态

```bash
git status
```

### 步骤 1.2: 添加所有文件

```bash
git add .
```

### 步骤 1.3: 提交

```bash
git commit -m "Deploy: English Pronunciation Battle Game - Ready for Netlify"
```

### 步骤 1.4: 推送

```bash
git push origin main
```

**如果是第一次推送:**
```bash
git push -u origin main
```

### 步骤 1.5: 验证

访问你的 GitHub 仓库，应该看到所有文件都已上传。

## 第 2 部分：在 Netlify 中部署

### 步骤 2.1: 访问 Netlify

访问 https://netlify.com

### 步骤 2.2: 登录

使用你的 GitHub 账户登录（或创建新账户）。

### 步骤 2.3: 创建新网站

点击 "New site from Git"

### 步骤 2.4: 选择 GitHub

1. 点击 "GitHub"
2. 授权 Netlify 访问你的 GitHub 账户
3. 选择你的仓库

### 步骤 2.5: 配置构建设置

Netlify 会自动检测配置。应该看到：
- Build command: (空)
- Publish directory: .

点击 "Deploy site"

### 步骤 2.6: 等待部署

Netlify 会自动部署，通常需要 1-2 分钟。

### 步骤 2.7: 获取网址

部署完成后，Netlify 会分配一个网址，例如：
```
https://your-site-name.netlify.app
```

## 第 3 部分：测试部署

### 步骤 3.1: 打开网址

在浏览器中打开 Netlify 分配的网址。

### 步骤 3.2: 测试游戏

1. 输入名字和年级
2. 点击"开始游戏"
3. 完成一局游戏
4. 点击"保存并退出"

### 步骤 3.3: 检查 Console

打开 F12 查看 Console 标签，应该看到：
```
✅ Supabase 已初始化
正在保存成绩到 Supabase...
✅ 成绩已保存到 Supabase
```

### 步骤 3.4: 验证数据同步

1. 在浏览器 A 中完成游戏并保存
2. 在浏览器 B 中打开游戏
3. 点击"查看排行榜"
4. 应该看到浏览器 A 中的成绩

## 第 4 部分：自定义网址（可选）

### 步骤 4.1: 进入 Site settings

在 Netlify Dashboard 中，点击 "Site settings"

### 步骤 4.2: 修改网址

1. 点击 "Change site name"
2. 输入新的网址名称
3. 点击 "Save"

新网址会变成：
```
https://你的网址名称.netlify.app
```

## 完整的命令列表

### 本地推送

```bash
# 检查状态
git status

# 添加文件
git add .

# 提交
git commit -m "Deploy: Ready for Netlify"

# 推送
git push origin main
```

### 第一次推送

```bash
# 初始化（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 添加文件
git add .

# 提交
git commit -m "Initial commit"

# 推送
git push -u origin main
```

## 常见问题

### Q: 部署后页面空白

**检查:**
1. 打开 F12 查看 Console 中的错误
2. 检查 Netlify 的构建日志
3. 确保所有文件都已上传

### Q: 数据没有保存

**检查:**
1. Supabase 表是否存在
2. RLS 策略是否正确
3. API Key 是否正确
4. Console 中的错误信息

### Q: 如何更新已部署的网站

**步骤:**
1. 在本地修改代码
2. 推送到 GitHub：`git push origin main`
3. Netlify 会自动重新部署

## 完成！

你的游戏已部署到 Netlify！

## 相关文档

- `QUICK_PUSH.md` - 快速推送指南
- `PUSH_TO_GITHUB.md` - 详细推送步骤
- `FINAL_DEPLOY_CHECKLIST.md` - 部署检查清单
