const express = require('express');
const cors = require('cors');
const app = express();

// 配置选项（生产环境建议明确指定 origin）
const corsOptions = {
    origin: 'http://localhost:8080', // 允许的域名
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的方法
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
    credentials: true, // 允许携带 Cookie
    optionsSuccessStatus: 204, // 预检请求成功状态码，默认为 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/sse', (req, res) => {
    const query = req.body?.query || '';

    if (!query) {
        return res.status(400).json({ error: 'query 参数不能为空' });
    }

    console.log('[SSE] 收到请求, query:', query);
    console.log('[SSE] 请求来源 Origin:', req.headers.origin);

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let timer;
    const cleanup = reason => {
        console.log('[SSE] 连接关闭, 原因:', reason);
        if (timer) clearInterval(timer);
    };
    // 注意：不能用 req.on('close')，express.json() 消费完请求体后该事件会立即触发，导致 timer 被清
    res.on('close', () => cleanup('res.close'));

    // 准备文本
    const text = new Array(20).fill(query).join('');
    console.log('[SSE] 开始推送, 总字符数:', text.length);

    let i = 0;

    // 逐字推送
    timer = setInterval(() => {
        if (i < text.length) {
            res.write(`data: ${JSON.stringify({ char: text[i], index: i })}\n\n`);
            i++;
        } else {
            console.log('[SSE] 推送完成, 共', i, '字');
            res.write('data: [DONE]\n\n');
            clearInterval(timer);
            res.end();
        }
    }, 80);

    // 第一个 write 自动发送 HTTP headers
    res.write(':ok\n\n');
});

app.listen(3000, () => {
    console.log('SSE 服务启动：http://localhost:3000/sse');
});
