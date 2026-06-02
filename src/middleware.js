function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message
  });
}

function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.info(`[${res.statusCode}] ${req.method} ${req.path} - ${duration}ms`);
  });
  next();
}

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, error: '接口不存在' });
}

module.exports = { errorHandler, requestLogger, notFoundHandler };
