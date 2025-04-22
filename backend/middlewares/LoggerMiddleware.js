const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  logger.info({
    type: 'REQUEST',
    method: req.method,
    path: req.path,
    query: req.query,
    body:req.body,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response
  res.on('finish', () => {
    logger.info({
      type: 'RESPONSE',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${Date.now() - start}ms`
    });
  });

  if (req.user && ['admin', 'superadmin'].includes(req.user.role)) {
    const adminLog = {
      admin: req.user.id,
      action: `${req.method} ${req.originalUrl}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: {
        params: req.params,
        query: req.query,
        body: req.method === 'GET' || req.method === 'HEAD' ? null : req.body
      }
    };
    logger.info(adminLog);
  }

  next();
};

module.exports =  requestLogger ;