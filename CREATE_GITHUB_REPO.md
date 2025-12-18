# 创建 GitHub 仓库指南

## 步骤 1: 创建 GitHub 账户（如果还没有）

1. 访问 https://github.com
2. 点击 "Sign up"
3. 填写邮箱、密码、用户名
4. 完成验证

## 步骤 2: 创建新仓库

### 方法 1: 使用网页界面（推荐）

1. 登录 GitHub
2. 点击右上角的 "+" 图标
3. 选择 "New repository"
4. 填写仓库信息：
   - **Repository name**: `english-pronunciation-battle` 或其他名称
   - **Description**: `英语发音大作战 - English Pronunciation Battle Game`
   - **Public**: 选择 Public（公开）
   - **Initialize this repository with**: 不勾选任何选项
5. 点击 "Create repository"

### 方法 2: 使用 GitHub CLI

如果已安装 GitHub CLI：

```bash
gh repo create english-pronunciation-battle --public --source=. --remote=origin --push
```

## 步骤 3: 获取仓库 URL

创建完成后，你会看到一个页面，显示：

```
https://github.com/你的用户名/english-pronunciation-battle.git
```

复制这个 URL。

## 步骤 4: 本地初始化 Git

在你的项目目录中执行：

```bash
# 初始化 Git
git init

# 添加远程仓库（替换为你的仓库 URL）
git remote add origin https://github.com/你的用户名/english-pronunciation-battle.git

# 验证远程仓库
git remote -v
```

应该看到：
```
origin  https://github.com/你的用户名/english-pronunciation-battle.git (fetch)
origin  https://github.com/你的用户名/english-pronunciation-battle.git (push)
```

## 步骤 5: 推送代码

```bash
# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: English Pronunciation Battle Game"

# 推送到 GitHub
git push -u origin main
```

如果出现错误 "fatal: The current branch main has no upstream branch"，执行：

```bash
git branch -M main
git push -u origin main
```

## 步骤 6: 验证

1. 访问你的 GitHub 仓库：`https://github.com/你的用户名/english-pronunciation-battle`
2. 应该看到所有文件都已上传

## 完整的命令序列

```bash
# 1. 初始化 Git
git init

# 2. 添加远程仓库（替换为你的仓库 URL）
git remote add origin https://github.com/你的用户名/english-pronunciation-battle.git

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "Initial commit: English Pronunciation Battle Game"

# 5. 重命名分支为 main（如果需要）
git branch -M main

# 6. 推送
git push -u origin main
```

## 常见问题

### Q: 如何获取我的 GitHub 用户名？

A: 登录 GitHub 后，点击右上角的头像，选择 "Your profile"。你的用户名会显示在 URL 中。

### Q: 推送时出现 "fatal: 'origin' does not appear to be a 'git' repository"

A: 执行以下命令添加远程仓库：
```bash
git remote add origin https://github.com/你的用户名/english-pronunciation-battle.git
```

### Q: 推送时出现 "fatal: The current branch main has no upstream branch"

A: 执行以下命令：
```bash
git branch -M main
git push -u origin main
```

### Q: 如何修改仓库名称？

A: 在 GitHub 仓库页面：
1. 点击 "Settings"
2. 在 "Repository name" 中修改名称
3. 点击 "Rename"

### Q: 如何删除仓库？

A: 在 GitHub 仓库页面：
1. 点击 "Settings"
2. 向下滚动到 "Danger Zone"
3. 点击 "Delete this repository"
4. 输入仓库名称确认

## 下一步

仓库创建并推送代码后：

1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. Netlify 会自动部署

## 完成！

你的 GitHub 仓库已创建，代码已推送。现在可以在 Netlify 中部署了。
