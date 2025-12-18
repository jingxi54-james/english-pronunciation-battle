# 快速推送到 GitHub

## 3 步推送

### 步骤 1: 添加所有文件

```bash
git add .
```

### 步骤 2: 提交

```bash
git commit -m "Deploy: Ready for Netlify"
```

### 步骤 3: 推送

```bash
git push origin main
```

## 完成！

文件已推送到 GitHub。

## 如果是第一次推送

如果出现错误，执行以下命令：

```bash
# 设置远程仓库（替换为你的仓库 URL）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送并设置上游分支
git push -u origin main
```

## 验证

1. 访问你的 GitHub 仓库
2. 应该看到所有文件都已上传

## 下一步

1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. Netlify 会自动部署

详细步骤见 `PUSH_TO_GITHUB.md`。
