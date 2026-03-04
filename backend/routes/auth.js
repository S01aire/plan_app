const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const db = require('../db/database')
const { AppError } = require('../utils/errors')

function signToken(userId) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  )
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username?.trim() || !password) throw new AppError('用户名和密码不能为空', 400)
    if (username.trim().length < 3) throw new AppError('用户名至少3个字符', 400)
    if (password.length < 6)        throw new AppError('密码至少6位', 400)

    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.trim())
    if (existing) throw new AppError('用户名已被占用', 409)

    const hashed = await bcrypt.hash(password, 10)
    const id = uuid()
    db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)').run(id, username.trim(), hashed)

    const token = signToken(id)
    res.status(201).json({ token, user: { id, username: username.trim() } })
  } catch (err) { next(err) }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) throw new AppError('用户名和密码不能为空', 400)

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim())
    if (!user) throw new AppError('用户名或密码错误', 401)

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new AppError('用户名或密码错误', 401)

    const token = signToken(user.id)
    res.json({ token, user: { id: user.id, username: user.username } })
  } catch (err) { next(err) }
})

module.exports = router
