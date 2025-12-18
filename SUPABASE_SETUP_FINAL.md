# Supabase 最终设置指南

## 你的 Supabase 项目信息

- **Project URL**: https://wmaxoenjqvdnwlramwvp.supabase.co
- **API Key**: 已在 game.js 中配置

## 完整的设置步骤

### 步骤 1: 登录 Supabase

1. 访问 https://supabase.com
2. 登录你的账户
3. 选择你的项目（URL 为 https://wmaxoenjqvdnwlramwvp.supabase.co）

### 步骤 2: 进入 SQL Editor

1. 在左侧菜单中点击 "SQL Editor"
2. 或者点击 "New Query"

### 步骤 3: 创建表和配置 RLS

复制以下完整的 SQL 代码，粘贴到 SQL Editor 中，点击 "Run"：

```sql
-- 创建 leaderboard 表
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

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_leaderboard_boss_kills ON leaderboard(boss_kills DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_time_taken ON leaderboard(time_taken ASC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_grade ON leaderboard(grade);
CREATE INDEX IF NOT EXISTS idx_leaderboard_submit_time ON leaderboard(submit_time DESC);

-- 启用 RLS
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果有）
DROP POLICY IF EXISTS "Allow all selects" ON leaderboard;
DROP POLICY IF EXISTS "Allow all inserts" ON leaderboard;
DROP POLICY IF EXISTS "Allow all updates" ON leaderboard;
DROP POLICY IF EXISTS "Allow all deletes" ON leaderboard;

-- 创建允许所有人读取的策略
CREATE POLICY "Allow all selects" ON leaderboard
FOR SELECT USING (true);

-- 创建允许所有人插入的策略
CREATE POLICY "Allow all inserts" ON leaderboard
FOR INSERT WITH CHECK (true);

-- 创建允许所有人更新的策略
CREATE POLICY "Allow all updates" ON leaderboard
FOR UPDATE USING (true) WITH CHECK (true);

-- 创建允许所有人删除的策略
CREATE POLICY "Allow all deletes" ON leaderboard
FOR DELETE USING (true);

-- 验证表是否创建成功
SELECT * FROM information_schema.tables WHERE table_name = 'leaderboard';

-- 验证 RLS 策略是否创建成功
SELECT * FROM pg_policies WHERE tablename = 'leaderboard';
```

### 步骤 4: 验证设置

执行以下查询验证：

```sql
-- 查看表结构
SELECT * FROM information_schema.columns WHERE table_name = 'leaderboard';

-- 查看 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'leaderboard';

-- 查看索引
SELECT * FROM pg_indexes WHERE tablename = 'leaderboard';
```

应该看到：
- ✅ 表 "leaderboard" 已创建
- ✅ 4 个 RLS 策略已创建
- ✅ 5 个索引已创建

### 步骤 5: 测试游戏

1. 打开你的 Netlify 网址
2. 登录并完成一局游戏
3. 点击"保存并退出"
4. 打开 F12 查看 Console 日志

**应该看到的日志：**
```
=== 开始保存成绩 ===
✅ Supabase 已初始化
正在保存成绩到 Supabase...
✅ 成绩已保存到 Supabase
=== 保存成绩完成 ===
```

### 步骤 6: 验证数据

1. 在 Supabase Dashboard 中进入 "leaderboard" 表
2. 应该看到你保存的成绩数据

## 完整的 SQL 脚本

如果你想一次性执行所有操作，这是完整的脚本：

```sql
-- 完整的 Supabase 设置脚本

-- 1. 创建表
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

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_leaderboard_boss_kills ON leaderboard(boss_kills DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_time_taken ON leaderboard(time_taken ASC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_grade ON leaderboard(grade);
CREATE INDEX IF NOT EXISTS idx_leaderboard_submit_time ON leaderboard(submit_time DESC);

-- 3. 启用 RLS
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 4. 删除现有策略
DROP POLICY IF EXISTS "Allow all selects" ON leaderboard;
DROP POLICY IF EXISTS "Allow all inserts" ON leaderboard;
DROP POLICY IF EXISTS "Allow all updates" ON leaderboard;
DROP POLICY IF EXISTS "Allow all deletes" ON leaderboard;

-- 5. 创建 RLS 策略
CREATE POLICY "Allow all selects" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow all inserts" ON leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates" ON leaderboard FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all deletes" ON leaderboard FOR DELETE USING (true);
```

## 常见问题

### Q: 如何查看已保存的数据？

A: 在 Supabase Dashboard 中：
1. 进入 "Tables"
2. 选择 "leaderboard"
3. 应该看到所有保存的成绩

### Q: 如何删除所有数据？

A: 执行以下 SQL：
```sql
DELETE FROM leaderboard;
```

### Q: 如何重置表？

A: 执行以下 SQL：
```sql
DROP TABLE IF EXISTS leaderboard;
```

然后重新执行创建表的 SQL。

## 完成！

按照上面的步骤设置后，你的游戏应该能正常保存成绩到 Supabase 数据库了。
