const jwt = require('jsonwebtoken')
const { AppError } = require('../utils/errors')

function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('未登录，请先登录', 401))
  }
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.sub
    next()
  } catch {
    next(new AppError('登录已过期，请重新登录', 401))
  }
}

module.exports = { requireAuth }
