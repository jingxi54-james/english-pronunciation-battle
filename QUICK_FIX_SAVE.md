# 快速修复成绩保存问题

## 问题

代码推送后，成绩仍然无法保存到数据库。

## 快速修复（5 分钟）

### 步骤 1: 登录 Supabase

访问 https://supabase.com，登录你的账户

### 步骤 2: 进入 SQL Editor

选择你的项目，点击 "SQL Editor"

### 步骤 3: 执行 SQL

复制以下代码，粘贴到 SQL Editor，点击 "Run"：

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

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all selects" ON leaderboard;
DROP POLICY IF EXISTS "Allow all inserts" ON leaderboard;

CREATE POLICY "Allow all selects" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow all inserts" ON leaderboard FOR INSERT WITH CHECK (true);
```

### 步骤 4: 验证

执行以下查询：

```sql
SELECT * FROM pg_policies WHERE tablename = 'leaderboard';
```

应该看到两个策略。

### 步骤 5: 测试

1. 刷新你的 Netlify 网址
2. 完成一局游戏
3. 点击"保存并退出"
4. 打开 F12 查看 Console
5. 应该看到 ✅ 成绩已保存到 Supabase

## 完成！

成绩现在应该能正常保存了。

详细步骤见 `FIX_SAVE_ISSUE.md`。
