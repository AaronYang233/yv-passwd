const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const apiRoutes = require('./src/routes');
const { errorHandler, requestLogger, notFoundHandler } = require('./src/middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件（启用 CSP）
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'", "data:"]
    }
  }
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger);

// 速率限制
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// API 路由
app.use('/api', apiRoutes);

// API 404 兜底
app.use('/api/', notFoundHandler);

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 全局错误处理
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`企业级密码生成器运行在: http://localhost:${PORT}`);
});
