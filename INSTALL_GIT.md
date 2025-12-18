# 快速安装 Git

## 问题

你的系统上没有安装 Git。

## 解决方案

### Windows 用户（最简单）

1. 访问 https://git-scm.com/download/win
2. 点击下载按钮
3. 运行下载的安装程序
4. 一直点 "Next" 直到完成
5. **重启 PowerShell 或 CMD**
6. 输入 `git --version` 验证安装

### Mac 用户

**方法 1: 使用 Homebrew（推荐）**

```bash
brew install git
```

**方法 2: 从官网下载**

访问 https://git-scm.com/download/mac

### Linux 用户

**Ubuntu/Debian:**

```bash
sudo apt-get install git
```

**Fedora/CentOS:**

```bash
sudo yum install git
```

## 验证安装

安装完成后，重启终端，输入：

```bash
git --version
```

应该看到版本号，例如：
```
git version 2.40.0
```

## 配置 Git（首次使用）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

## 现在可以推送代码了

```bash
cd D:\ownproject\testgame
git init
git remote add origin https://github.com/jingxi54-james/english-pronunciation-battle.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## 完成！

Git 已安装，现在可以推送代码到 GitHub 了。
