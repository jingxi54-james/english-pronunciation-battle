# 推送到 GitHub 指南

## 前置条件

确保你已经：
- [ ] 安装了 Git
- [ ] 在 GitHub 上创建了仓库
- [ ] 本地项目已初始化为 Git 仓库

## 快速推送（3 步）

### 步骤 1: 检查 Git 状态

```bash
git status
```

应该看到所有文件都是未跟踪或已修改的状态。

### 步骤 2: 添加所有文件

```bash
git add .
```

### 步骤 3: 提交更改

```bash
git commit -m "Deploy: Final version ready for Netlify"
```

### 步骤 4: 推送到 GitHub

```bash
git push origin main
```

如果是第一次推送，可能需要设置上游分支：

```bash
git push -u origin main
```

## 详细步骤

### 1. 初始化 Git 仓库（如果还没有）

```bash
git init
```

### 2. 添加远程仓库

如果还没有添加远程仓库，执行：

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

### 3. 查看远程仓库

```bash
git remote -v
```

应该看到：
```
origin  https://github.com/你的用户名/你的仓库名.git (fetch)
origin  https://github.com/你的用户名/你的仓库名.git (push)
```

### 4. 检查当前分支

```bash
git branch
```

应该看到 `main` 或 `master` 分支。

### 5. 添加所有文件

```bash
git add .
```

### 6. 查看要提交的文件

```bash
git status
```

应该看到所有文件都是绿色的（已暂存）。

### 7. 提交更改

```bash
git commit -m "Deploy: Final version ready for Netlify"
```

### 8. 推送到 GitHub

```bash
git push origin main
```

## 完整的命令序列

如果你是第一次推送，可以按照以下顺序执行：

```bash
# 1. 初始化 Git（如果还没有）
git init

# 2. 添加远程仓库（替换为你的仓库 URL）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "Initial commit: English Pronunciation Battle Game"

# 5. 推送到 GitHub
git push -u origin main
```

## 验证推送成功

1. 访问你的 GitHub 仓库
2. 应该看到所有文件都已上传
3. 提交历史应该显示你的提交

## 常见问题

### Q: 推送时出现 "fatal: 'origin' does not appear to be a 'git' repository"

**解决方案:**
```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

### Q: 推送时出现 "Permission denied (publickey)"

**解决方案:**
1. 生成 SSH 密钥：
```bash
ssh-keygen -t rsa -b 4096 -C "你的邮箱"
```

2. 将公钥添加到 GitHub：
   - 访问 https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥内容

3. 使用 SSH URL 而不是 HTTPS：
```bash
git remote set-url origin git@github.com:你的用户名/你的仓库名.git
```

### Q: 推送时出现 "fatal: The current branch main has no upstream branch"

**解决方案:**
```bash
git push -u origin main
```

### Q: 如何修改最后一次提交？

```bash
git commit --amend -m "新的提交信息"
git push origin main --force
```

## 推送后的下一步

1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. Netlify 会自动部署

## 完成！

推送到 GitHub 后，Netlify 会自动部署你的网站。
