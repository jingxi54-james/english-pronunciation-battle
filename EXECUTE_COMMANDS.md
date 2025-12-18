# 如何执行 Git 命令

## 前置条件

确保你已经安装了 Git。检查方法：

```bash
git --version
```

如果没有安装，访问 https://git-scm.com 下载安装。

## 打开终端/命令行

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
2. 进入你的项目文件夹
3. 在地址栏输入 `cmd` 或 `powershell`
4. 按 Enter

### Mac

1. 按 `Cmd + Space`
2. 输入 `terminal`
3. 按 Enter

### Linux

按 `Ctrl + Alt + T`

## 执行命令步骤

### 步骤 1: 进入项目目录

```bash
cd D:\ownproject\testgame
```

或者如果你已经在项目目录中，跳过这一步。

### 步骤 2: 初始化 Git

```bash
git init
```

### 步骤 3: 添加远程仓库

**替换 `你的GitHub地址` 为你的实际仓库地址**

例如：`https://github.com/你的用户名/english-pronunciation-battle.git`

```bash
git remote add origin 你的GitHub地址
```

**完整示例：**
```bash
git remote add origin https://github.com/john/english-pronunciation-battle.git
```

### 步骤 4: 验证远程仓库

```bash
git remote -v
```

应该看到：
```
origin  你的GitHub地址 (fetch)
origin  你的GitHub地址 (push)
```

### 步骤 5: 添加所有文件

```bash
git add .
```

### 步骤 6: 提交

```bash
git commit -m "Initial commit: English Pronunciation Battle Game"
```

### 步骤 7: 重命名分支为 main

```bash
git branch -M main
```

### 步骤 8: 推送到 GitHub

```bash
git push -u origin main
```

## 完整的命令序列

复制以下所有命令，一个接一个执行：

```bash
git init
git remote add origin 你的GitHub地址
git add .
git commit -m "Initial commit: English Pronunciation Battle Game"
git branch -M main
git push -u origin main
```

## 详细的执行步骤

### 1. 打开终端

- Windows: 按 `Win + X`，选择 "Windows PowerShell"
- Mac: 按 `Cmd + Space`，输入 `terminal`
- Linux: 按 `Ctrl + Alt + T`

### 2. 进入项目目录

```bash
cd D:\ownproject\testgame
```

（根据你的实际路径修改）

### 3. 执行第一个命令

```bash
git init
```

按 Enter，等待完成。

### 4. 执行第二个命令

```bash
git remote add origin https://github.com/你的用户名/english-pronunciation-battle.git
```

**重要：替换 `你的用户名` 和 `english-pronunciation-battle` 为你的实际信息**

按 Enter。

### 5. 验证

```bash
git remote -v
```

应该看到你的仓库地址。

### 6. 执行第三个命令

```bash
git add .
```

按 Enter。

### 7. 执行第四个命令

```bash
git commit -m "Initial commit: English Pronunciation Battle Game"
```

按 Enter。

### 8. 执行第五个命令

```bash
git branch -M main
```

按 Enter。

### 9. 执行第六个命令

```bash
git push -u origin main
```

按 Enter。

系统可能会要求输入 GitHub 用户名和密码（或 Personal Access Token）。

## 常见问题

### Q: 命令执行后没有反应

A: 这是正常的。大多数 Git 命令执行成功后不会显示任何消息。

### Q: 出现 "fatal: not a git repository"

A: 确保你在项目目录中。执行 `git init` 初始化。

### Q: 出现 "fatal: 'origin' does not appear to be a 'git' repository"

A: 检查你的 GitHub 地址是否正确。重新执行：
```bash
git remote add origin 你的GitHub地址
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

## 验证推送成功

1. 访问你的 GitHub 仓库
2. 应该看到所有文件都已上传
3. 提交历史应该显示你的提交

## 下一步

推送成功后：

1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. Netlify 会自动部署

## 完成！

代码已推送到 GitHub，现在可以在 Netlify 中部署了。
