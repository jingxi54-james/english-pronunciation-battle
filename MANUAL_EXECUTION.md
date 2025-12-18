# 手动执行 Git 命令

## 重要提示

你需要在你的计算机上打开终端/命令行，而不是在 Kiro IDE 中执行。

## 步骤 1: 检查 Git 是否已安装

打开你的终端/命令行，输入：

```bash
git --version
```

如果显示版本号，说明 Git 已安装。如果显示 "git 不是内部或外部命令"，需要安装 Git。

## 步骤 2: 安装 Git（如果需要）

访问 https://git-scm.com 下载并安装 Git。

## 步骤 3: 打开终端

### Windows

**方法 1: 使用 PowerShell**
1. 按 `Win + X`
2. 选择 "Windows PowerShell" 或 "Terminal"

**方法 2: 使用 CMD**
1. 按 `Win + R`
2. 输入 `cmd`
3. 按 Enter

**方法 3: 在项目文件夹中打开**
1. 打开文件浏览器
2. 进入 `D:\ownproject\testgame`
3. 在地址栏输入 `powershell`
4. 按 Enter

### Mac

1. 按 `Cmd + Space`
2. 输入 `terminal`
3. 按 Enter

### Linux

按 `Ctrl + Alt + T`

## 步骤 4: 进入项目目录

在终端中输入：

```bash
cd D:\ownproject\testgame
```

按 Enter。

## 步骤 5: 执行命令

现在逐个执行以下命令。**每个命令后按 Enter**：

### 命令 1: 初始化 Git

```bash
git init
```

按 Enter。

### 命令 2: 添加远程仓库

```bash
git remote add origin https://github.com/jingxi54-james/english-pronunciation-battle.git
```

按 Enter。

### 命令 3: 添加所有文件

```bash
git add .
```

按 Enter。

### 命令 4: 提交

```bash
git commit -m "Initial commit: English Pronunciation Battle Game"
```

按 Enter。

### 命令 5: 重命名分支为 main

```bash
git branch -M main
```

按 Enter。

### 命令 6: 推送到 GitHub

```bash
git push -u origin main
```

按 Enter。

系统可能会要求输入 GitHub 用户名和密码。输入后按 Enter。

## 完整的命令列表

如果你想一次性复制所有命令，这是完整的列表：

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

## 常见问题

### Q: 推送时出现 "fatal: The current branch main has no upstream branch"

A: 执行以下命令：
```bash
git branch -M main
git push -u origin main
```

### Q: 推送时要求输入密码

A: 输入你的 GitHub 用户名和密码（或 Personal Access Token）。

### Q: 如何获取 Personal Access Token？

A:
1. 登录 GitHub
2. 进入 Settings → Developer settings → Personal access tokens
3. 点击 "Generate new token"
4. 选择 "repo" 权限
5. 复制 token
6. 推送时使用 token 作为密码

## 下一步

推送成功后：

1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. Netlify 会自动部署

## 完成！

代码已推送到 GitHub。
