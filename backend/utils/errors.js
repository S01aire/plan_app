class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500
  const message = err.statusCode ? err.message : '服务器内部错误'

  if (!err.statusCode) {
    console.error('[ERROR]', err)
  }

  res.status(status).json({ error: message })
}

module.exports = { AppError, errorHandler }
