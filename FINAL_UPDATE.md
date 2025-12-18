# 最终更新到 GitHub

## 你的 GitHub 仓库

https://github.com/jingxi54-james/english-pronunciation-battle

## 快速更新（3 步）

### 步骤 1: 打开终端

**Windows:**
- 按 `Win + X` → 选择 "Windows PowerShell"

**Mac:**
- 按 `Cmd + Space` → 输入 "terminal"

**Linux:**
- 按 `Ctrl + Alt + T`

### 步骤 2: 进入项目目录

```bash
cd D:\ownproject\testgame
```

### 步骤 3: 执行更新命令

逐个执行以下命令，**每个命令后按 Enter**：

```bash
git add .
```

```bash
git commit -m "Update: Fix Supabase configuration and RLS policies"
```

```bash
git push origin main
```

## 完整的命令序列

```bash
cd D:\ownproject\testgame
git add .
git commit -m "Update: Fix Supabase configuration and RLS policies"
git push origin main
```

## 验证更新

1. 访问 https://github.com/jingxi54-james/english-pronunciation-battle
2. 应该看到最新的提交

## Netlify 自动部署

推送成功后，Netlify 会自动：
1. 检测到 GitHub 更新
2. 自动重新部署
3. 你的网站会自动更新

## 完成！

代码已更新到 GitHub，Netlify 会自动部署。

现在打开终端执行命令！
