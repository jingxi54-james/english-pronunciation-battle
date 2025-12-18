# 快速执行命令

## 3 步推送到 GitHub

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

（根据你的实际路径修改）

### 步骤 3: 执行以下命令

一个接一个执行，每个命令后按 Enter：

```bash
git init
```

```bash
git remote add origin 你的GitHub地址
```

**重要：替换 `你的GitHub地址` 为你的实际仓库地址**

例如：`https://github.com/john/english-pronunciation-battle.git`

```bash
git add .
```

```bash
git commit -m "Initial commit"
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

## 完成！

代码已推送到 GitHub。

## 验证

访问你的 GitHub 仓库，应该看到所有文件都已上传。

## 下一步

1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. Netlify 会自动部署

详细步骤见 `EXECUTE_COMMANDS.md`。
