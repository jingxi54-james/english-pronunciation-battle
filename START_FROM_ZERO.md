# 从零开始部署到 Netlify

## 完整流程（15 分钟）

### 第 1 部分：创建 GitHub 账户和仓库（5 分钟）

#### 步骤 1.1: 创建 GitHub 账户

1. 访问 https://github.com
2. 点击 "Sign up"
3. 填写邮箱、密码、用户名
4. 完成验证

#### 步骤 1.2: 创建新仓库

1. 登录 GitHub
2. 点击右上角的 "+" 图标
3. 选择 "New repository"
4. 填写信息：
   - Repository name: `english-pronunciation-battle`
   - Description: `英语发音大作战`
   - Public: 选择
5. 点击 "Create repository"

#### 步骤 1.3: 复制仓库 URL

页面会显示你的仓库 URL，复制它。

### 第 2 部分：推送代码到 GitHub（5 分钟）

#### 步骤 2.1: 初始化 Git

在项目目录中打开终端，执行：

```bash
git init
```

#### 步骤 2.2: 添加远程仓库

```bash
git remote add origin https://github.com/你的用户名/english-pronunciation-battle.git
```

#### 步骤 2.3: 添加文件

```bash
git add .
```

#### 步骤 2.4: 提交

```bash
git commit -m "Initial commit: English Pronunciation Battle Game"
```

#### 步骤 2.5: 推送

```bash
git push -u origin main
```

如果出现错误，执行：
```bash
git branch -M main
git push -u origin main
```

#### 步骤 2.6: 验证

访问你的 GitHub 仓库，应该看到所有文件都已上传。

### 第 3 部分：在 Netlify 中部署（5 分钟）

#### 步骤 3.1: 访问 Netlify

访问 https://netlify.com

#### 步骤 3.2: 登录或注册

使用 GitHub 账户登录（或创建新账户）。

#### 步骤 3.3: 创建新网站

1. 点击 "New site from Git"
2. 选择 "GitHub"
3. 授权 Netlify 访问你的 GitHub 账户
4. 选择你的仓库 `english-pronunciation-battle`

#### 步骤 3.4: 配置构建设置

Netlify 会自动检测配置。应该看到：
- Build command: (空)
- Publish directory: .

点击 "Deploy site"

#### 步骤 3.5: 等待部署

Netlify 会自动部署，通常需要 1-2 分钟。

#### 步骤 3.6: 获取网址

部署完成后，Netlify 会分配一个网址，例如：
```
https://your-site-name.netlify.app
```

### 第 4 部分：测试游戏（可选）

1. 打开 Netlify 分配的网址
2. 登录并完成一局游戏
3. 点击"保存并退出"
4. 打开 F12 查看 Console
5. 应该看到 ✅ 成绩已保存到 Supabase

## 完整的命令列表

```bash
# 初始化 Git
git init

# 添加远程仓库
git remote add origin https://github.com/你的用户名/english-pronunciation-battle.git

# 添加文件
git add .

# 提交
git commit -m "Initial commit: English Pronunciation Battle Game"

# 重命名分支为 main
git branch -M main

# 推送
git push -u origin main
```

## 常见问题

### Q: 我没有 GitHub 账户怎么办？

A: 访问 https://github.com，点击 "Sign up" 创建账户。

### Q: 推送时出现错误怎么办？

A: 查看 `CREATE_GITHUB_REPO.md` 中的常见问题部分。

### Q: 部署后页面空白怎么办？

A: 打开 F12 查看 Console 中的错误信息。

### Q: 如何更新已部署的网站？

A: 在本地修改代码，然后：
```bash
git add .
git commit -m "Update: ..."
git push origin main
```

Netlify 会自动重新部署。

## 完成！

你的游戏已部署到 Netlify！

## 相关文档

- `QUICK_CREATE_REPO.md` - 快速创建仓库
- `CREATE_GITHUB_REPO.md` - 详细创建步骤
- `COMPLETE_DEPLOYMENT_GUIDE.md` - 完整部署流程
