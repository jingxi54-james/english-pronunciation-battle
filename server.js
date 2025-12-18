const express = require('express');
const path = require('path');
const app = express();

// 中间件
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// SPA 路由处理
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
