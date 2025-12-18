# 更新代码到 GitHub

## 快速步骤（3 步）

### 步骤 1: 打开终端

**Windows:**
- 按 `Win + X`
- 选择 "Windows PowerShell" 或 "Terminal"

**Mac:**
- 按 `Cmd + Space`
- 输入 `terminal`

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

如果你想一次性复制所有命令：

```bash
cd D:\ownproject\testgame
git add .
git commit -m "Update: Fix Supabase configuration and RLS policies"
git push origin main
```

## 验证更新成功

1. 打开浏览器
2. 访问 https://github.com/jingxi54-james/english-pronunciation-battle
3. 应该看到最新的提交信息

## Netlify 自动部署

推送成功后，Netlify 会自动检测到更新并重新部署。

1. 访问你的 Netlify Dashboard
2. 查看部署进度
3. 部署完成后，你的网站会自动更新

## 完成！

代码已更新到 GitHub，Netlify 会自动部署。
