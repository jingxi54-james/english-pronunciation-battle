# Git 未安装或未配置

## 问题

错误信息：`git : 无法将"git"项识别为 cmdlet、函数、脚本文件或可运行程序的名称`

这说明 Git 没有安装或没有在系统 PATH 中。

## 解决方案

### 步骤 1: 检查 Git 是否已安装

打开 PowerShell 或 CMD，输入：

```bash
git --version
```

如果显示版本号，说明 Git 已安装。如果显示上面的错误，需要安装 Git。

### 步骤 2: 安装 Git

#### Windows

1. 访问 https://git-scm.com/download/win
2. 下载最新版本的 Git for Windows
3. 运行安装程序
4. 按照默认选项安装（一直点 "Next"）
5. 完成安装后，**重启 PowerShell 或 CMD**

#### Mac

**方法 1: 使用 Homebrew**

```bash
brew install git
```

**方法 2: 从官网下载**

访问 https://git-scm.com/download/mac

#### Linux

**Ubuntu/Debian:**

```bash
sudo apt-get install git
```

**Fedora/CentOS:**

```bash
sudo yum install git
```

### 步骤 3: 验证安装

安装完成后，**重启终端**，然后输入：

```bash
git --version
```

应该看到类似的输出：
```
git version 2.40.0
```

### 步骤 4: 配置 Git（首次使用）

安装完成后，配置你的 Git 用户信息：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

例如：

```bash
git config --global user.name "James"
git config --global user.email "james@example.com"
```

### 步骤 5: 执行 Git 命令

现在你可以执行 Git 命令了。进入项目目录：

```bash
cd D:\ownproject\testgame
```

然后执行：

```bash
git init
git remote add origin https://github.com/jingxi54-james/english-pronunciation-battle.git
git add .
git commit -m "Initial commit: English Pronunciation Battle Game"
git branch -M main
git push -u origin main
```

## 完整的安装和执行步骤

### Windows

1. 访问 https://git-scm.com/download/win
2. 下载并安装 Git
3. 重启 PowerShell
4. 输入以下命令：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
cd D:\ownproject\testgame
git init
git remote add origin https://github.com/jingxi54-james/english-pronunciation-battle.git
git add .
git commit -m "Initial commit: English Pronunciation Battle Game"
git branch -M main
git push -u origin main
```

### Mac

1. 安装 Git：`brew install git`
2. 重启终端
3. 输入以下命令：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
cd /path/to/your/project
git init
git remote add origin https://github.com/jingxi54-james/english-pronunciation-battle.git
git add .
git commit -m "Initial commit: English Pronunciation Battle Game"
git branch -M main
git push -u origin main
```

### Linux

1. 安装 Git：`sudo apt-get install git`
2. 重启终端
3. 输入以下命令：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
cd /path/to/your/project
git init
git remote add origin https://github.com/jingxi54-james/english-pronunciation-battle.git
git add .
git commit -m "Initial commit: English Pronunciation Battle Game"
git branch -M main
git push -u origin main
```

## 常见问题

### Q: 安装后仍然显示 "git 不是内部或外部命令"

A: 重启你的终端或计算机。Windows 需要重新加载 PATH 环境变量。

### Q: 如何检查 Git 是否正确安装？

A: 输入 `git --version`，应该显示版本号。

### Q: 安装时出现错误怎么办？

A: 
1. 卸载 Git
2. 重启计算机
3. 重新下载并安装最新版本

### Q: 如何卸载 Git？

A:
- Windows: 控制面板 → 程序 → 卸载程序 → 找到 Git → 卸载
- Mac: `brew uninstall git`
- Linux: `sudo apt-get remove git`

## 下一步

安装 Git 并配置完成后，执行以下命令推送代码：

```bash
cd D:\ownproject\testgame
git init
git remote add origin https://github.com/jingxi54-james/english-pronunciation-battle.git
git add .
git commit -m "Initial commit: English Pronunciation Battle Game"
git branch -M main
git push -u origin main
```

## 完成！

Git 安装完成后，你就可以推送代码到 GitHub 了。
