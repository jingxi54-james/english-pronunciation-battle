# 快速创建 GitHub 仓库

## 5 分钟快速指南

### 步骤 1: 创建 GitHub 账户

访问 https://github.com，点击 "Sign up"

### 步骤 2: 创建新仓库

1. 登录 GitHub
2. 点击右上角的 "+" 图标
3. 选择 "New repository"
4. 填写：
   - Repository name: `english-pronunciation-battle`
   - Description: `英语发音大作战`
   - Public: 选择
5. 点击 "Create repository"

### 步骤 3: 复制仓库 URL

页面会显示你的仓库 URL，例如：
```
https://github.com/你的用户名/english-pronunciation-battle.git
```

### 步骤 4: 本地推送代码

在项目目录中执行：

```bash
# 初始化 Git
git init

# 添加远程仓库（替换为你的仓库 URL）
git remote add origin https://github.com/你的用户名/english-pronunciation-battle.git

# 添加文件
git add .

# 提交
git commit -m "Initial commit"

# 推送
git push -u origin main
```

### 步骤 5: 验证

访问你的 GitHub 仓库，应该看到所有文件都已上传。

## 完成！

仓库已创建，代码已推送。

## 下一步

1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. Netlify 会自动部署

详细步骤见 `CREATE_GITHUB_REPO.md`。
