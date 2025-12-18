# 一步一步执行命令

## 准备工作

1. 确保已安装 Git
2. 获取你的 GitHub 仓库地址
3. 打开终端

## 执行步骤

### 第 1 步: 打开终端

**Windows 用户:**
```
按 Win + X → 选择 "Windows PowerShell"
```

**Mac 用户:**
```
按 Cmd + Space → 输入 "terminal" → 按 Enter
```

**Linux 用户:**
```
按 Ctrl + Alt + T
```

### 第 2 步: 进入项目目录

在终端中输入：

```bash
cd D:\ownproject\testgame
```

按 Enter。

**注意：** 如果你的项目路径不同，请修改为你的实际路径。

### 第 3 步: 初始化 Git

输入：

```bash
git init
```

按 Enter。

**预期结果：** 可能没有任何输出，或显示 "Initialized empty Git repository"

### 第 4 步: 添加远程仓库

输入：

```bash
git remote add origin https://github.com/你的用户名/english-pronunciation-battle.git
```

**重要：** 替换 `你的用户名` 和 `english-pronunciation-battle` 为你的实际信息。

按 Enter。

**预期结果：** 没有任何输出

### 第 5 步: 验证远程仓库（可选）

输入：

```bash
git remote -v
```

按 Enter。

**预期结果：** 应该看到你的仓库地址

### 第 6 步: 添加所有文件

输入：

```bash
git add .
```

按 Enter。

**预期结果：** 没有任何输出

### 第 7 步: 提交

输入：

```bash
git commit -m "Initial commit: English Pronunciation Battle Game"
```

按 Enter。

**预期结果：** 显示提交信息，例如：
```
[main (root-commit) abc1234] Initial commit: English Pronunciation Battle Game
 8 files changed, 1000 insertions(+)
```

### 第 8 步: 重命名分支为 main

输入：

```bash
git branch -M main
```

按 Enter。

**预期结果：** 没有任何输出

### 第 9 步: 推送到 GitHub

输入：

```bash
git push -u origin main
```

按 Enter。

**预期结果：** 显示推送进度，最后显示成功消息

**可能需要输入：** GitHub 用户名和密码（或 Personal Access Token）

## 完整的命令列表

如果你想一次性复制所有命令，这是完整的列表：

```bash
cd D:\ownproject\testgame
git init
git remote add origin https://github.com/你的用户名/english-pronunciation-battle.git
git add .
git commit -m "Initial commit: English Pronunciation Battle Game"
git branch -M main
git push -u origin main
```

## 验证推送成功

1. 打开浏览器
2. 访问你的 GitHub 仓库
3. 应该看到所有文件都已上传

## 常见错误及解决方案

### 错误 1: "fatal: not a git repository"

**原因：** 没有初始化 Git

**解决方案：** 执行 `git init`

### 错误 2: "fatal: 'origin' does not appear to be a 'git' repository"

**原因：** 远程仓库地址错误或未添加

**解决方案：** 检查你的 GitHub 地址，重新执行：
```bash
git remote add origin 你的GitHub地址
```

### 错误 3: "fatal: The current branch main has no upstream branch"

**原因：** 分支名称不是 main

**解决方案：** 执行：
```bash
git branch -M main
git push -u origin main
```

### 错误 4: 推送时要求输入密码

**原因：** 这是正常的

**解决方案：** 输入你的 GitHub 用户名和密码

## 下一步

推送成功后：

1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. Netlify 会自动部署

## 完成！

代码已推送到 GitHub，现在可以在 Netlify 中部署了。
