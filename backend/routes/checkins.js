const router = require('express').Router()
const { randomUUID } = require('crypto')
const db = require('../db/database')
const { requireAuth } = require('../middleware/auth')
const { AppError } = require('../utils/errors')

router.use(requireAuth)

function toClient(row) {
  return { id: row.id, planId: row.plan_id, date: row.date, checkedAt: row.checked_at }
}

// GET /api/checkins?since=YYYY-MM-DD
router.get('/', (req, res, next) => {
  try {
    const { since } = req.query
    const rows = since
      ? db.prepare('SELECT * FROM checkins WHERE user_id = ? AND date >= ? ORDER BY date ASC').all(req.userId, since)
      : db.prepare('SELECT * FROM checkins WHERE user_id = ? ORDER BY date ASC').all(req.userId)
    res.json(rows.map(toClient))
  } catch (err) { next(err) }
})

// POST /api/checkins
router.post('/', (req, res, next) => {
  try {
    const { id, planId, date, checkedAt } = req.body
    if (!planId || !date) throw new AppError('planId 和 date 是必填项', 400)

    // Verify plan belongs to this user
    const plan = db.prepare('SELECT id FROM plans WHERE id = ? AND user_id = ?').get(planId, req.userId)
    if (!plan) throw new AppError('计划不存在', 404)

    const checkinId = id || randomUUID()
    try {
      db.prepare(`
        INSERT INTO checkins (id, user_id, plan_id, date, checked_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(checkinId, req.userId, planId, date, checkedAt || new Date().toISOString())
    } catch (e) {
      // UNIQUE constraint: already checked in — idempotent success
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        const existing = db.prepare('SELECT * FROM checkins WHERE plan_id = ? AND date = ?').get(planId, date)
        return res.status(200).json(toClient(existing))
      }
      throw e
    }

    const row = db.prepare('SELECT * FROM checkins WHERE id = ?').get(checkinId)
    res.status(201).json(toClient(row))
  } catch (err) { next(err) }
})

// DELETE /api/checkins?planId=X&date=YYYY-MM-DD
router.delete('/', (req, res, next) => {
  try {
    const { planId, date } = req.query
    if (!planId || !date) throw new AppError('planId 和 date 是必填项', 400)

    db.prepare('DELETE FROM checkins WHERE plan_id = ? AND date = ? AND user_id = ?').run(planId, date, req.userId)
    res.status(204).end()
  } catch (err) { next(err) }
})

module.exports = router
