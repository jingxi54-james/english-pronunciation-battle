# 修复成绩无法保存问题

## 问题诊断

代码推送后，成绩仍然无法保存到数据库。这通常是因为：

1. **Supabase 表不存在**
2. **RLS 策略配置不正确**
3. **API Key 权限不足**
4. **网络连接问题**

## 解决方案

### 步骤 1: 检查 Supabase 表是否存在

1. 登录 Supabase Dashboard: https://supabase.com
2. 选择你的项目
3. 进入 "Tables" 或 "SQL Editor"
4. 查看是否有 `leaderboard` 表

**如果表不存在，执行以下 SQL 创建表：**

```sql
CREATE TABLE IF NOT EXISTS leaderboard (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    boss_kills INTEGER NOT NULL DEFAULT 0,
    time_taken INTEGER NOT NULL DEFAULT 0,
    submit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_boss_kills ON leaderboard(boss_kills DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_time_taken ON leaderboard(time_taken ASC);
```

### 步骤 2: 检查和配置 RLS 策略

1. 在 Supabase Dashboard 中选择 `leaderboard` 表
2. 点击 "RLS" 标签
3. 查看是否有 SELECT 和 INSERT 策略

**如果没有策略，执行以下 SQL：**

```sql
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all selects" ON leaderboard;
DROP POLICY IF EXISTS "Allow all inserts" ON leaderboard;

CREATE POLICY "Allow all selects" ON leaderboard
FOR SELECT USING (true);

CREATE POLICY "Allow all inserts" ON leaderboard
FOR INSERT WITH CHECK (true);
```

### 步骤 3: 验证 API Key

1. 在 Supabase Dashboard 中进入 "Settings" → "API"
2. 复制 "anon" 密钥（不是 "service_role" 密钥）
3. 检查 `game.js` 中的 `SUPABASE_KEY` 是否正确

**game.js 中的配置应该是：**

```javascript
const SUPABASE_URL = 'https://wmaxoenjqvdnwlramwvp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 步骤 4: 测试保存功能

1. 打开你的 Netlify 网址
2. 完成一局游戏
3. 点击"保存并退出"
4. 打开 F12 查看 Console 日志

**应该看到的日志：**

```
=== 开始保存成绩 ===
游戏状态: {...}
计算的用时: XXX 秒
准备保存的数据: {...}
Supabase 客户端状态: ✅ 已初始化
正在保存成绩到 Supabase...
✅ 成绩已保存到 Supabase
返回数据: [...]
保存的 ID: XXX
本地存储已更新
=== 保存成绩完成 ===
```

**如果看到错误：**

```
❌ Supabase 保存失败: ...
错误代码: ...
错误消息: ...
```

查看错误信息，根据错误类型进行修复。

## 常见错误及解决方案

### 错误 1: "permission denied"

**原因：** RLS 策略限制了访问

**解决方案：** 执行上面的 RLS 策略 SQL

### 错误 2: "relation does not exist"

**原因：** 表不存在

**解决方案：** 执行上面的创建表 SQL

### 错误 3: "column does not exist"

**原因：** 列名不匹配

**解决方案：** 检查列名是否为 snake_case：
- `boss_kills` (不是 `bossKills`)
- `time_taken` (不是 `timeTaken`)
- `submit_time` (不是 `submitTime`)

### 错误 4: "Supabase 客户端状态: ❌ 未初始化"

**原因：** Supabase 库没有加载

**解决方案：**
1. 检查网络连接
2. 刷新页面
3. 检查浏览器 Console 中的其他错误

## 完整的修复步骤

### 1. 登录 Supabase

访问 https://supabase.com，登录你的账户

### 2. 进入 SQL Editor

选择你的项目，点击 "SQL Editor"

### 3. 执行完整的设置 SQL

复制以下所有代码，粘贴到 SQL Editor，点击 "Run"：

```sql
-- 创建表
CREATE TABLE IF NOT EXISTS leaderboard (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    boss_kills INTEGER NOT NULL DEFAULT 0,
    time_taken INTEGER NOT NULL DEFAULT 0,
    submit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_leaderboard_boss_kills ON leaderboard(boss_kills DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_time_taken ON leaderboard(time_taken ASC);

-- 启用 RLS
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 删除现有策略
DROP POLICY IF EXISTS "Allow all selects" ON leaderboard;
DROP POLICY IF EXISTS "Allow all inserts" ON leaderboard;

-- 创建 RLS 策略
CREATE POLICY "Allow all selects" ON leaderboard
FOR SELECT USING (true);

CREATE POLICY "Allow all inserts" ON leaderboard
FOR INSERT WITH CHECK (true);
```

### 4. 验证

执行以下查询验证：

```sql
SELECT * FROM pg_policies WHERE tablename = 'leaderboard';
```

应该看到两个策略。

### 5. 测试

1. 刷新你的 Netlify 网址
2. 完成一局游戏
3. 点击"保存并退出"
4. 打开 F12 查看 Console
5. 应该看到成功的日志

## 完成！

按照上面的步骤修复后，成绩应该能正常保存到数据库。
