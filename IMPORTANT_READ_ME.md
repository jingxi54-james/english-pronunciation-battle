# ⚠️ 重要：如何执行 Git 命令

## 关键点

**你需要在你的计算机上打开终端/命令行执行这些命令，而不是在 Kiro IDE 中。**

## 快速步骤

### 1. 打开终端

**Windows:**
- 按 `Win + X`
- 选择 "Windows PowerShell" 或 "Terminal"

**Mac:**
- 按 `Cmd + Space`
- 输入 `terminal`

**Linux:**
- 按 `Ctrl + Alt + T`

### 2. 进入项目目录

在终端中输入：

```bash
cd D:\ownproject\testgame
```

按 Enter。

### 3. 执行命令

逐个执行以下命令，**每个命令后按 Enter**：

```bash
git init
```

```bash
git remote add origin https://github.com/jingxi54-james/english-pronunciation-battle.git
```

```bash
git add .
```

```bash
git commit -m "Initial commit: English Pronunciation Battle Game"
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

## 完整的命令序列

你可以复制以下所有命令，粘贴到终端中：

```bash
cd D:\ownproject\testgame
git init
git remote add origin https://github.com/jingxi54-james/english-pronunciation-battle.git
git add .
git commit -m "Initial commit: English Pronunciation Battle Game"
git branch -M main
git push -u origin main
```

## 验证推送成功

1. 打开浏览器
2. 访问 https://github.com/jingxi54-james/english-pronunciation-battle
3. 应该看到所有文件都已上传

## 下一步

推送成功后：

1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. Netlify 会自动部署

## 详细说明

查看 `MANUAL_EXECUTION.md` 获取详细的步骤说明。

## 完成！

按照上面的步骤执行命令，代码就会推送到 GitHub。
