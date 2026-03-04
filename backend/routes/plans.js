const router = require('express').Router()
const { v4: uuid } = require('uuid')
const db = require('../db/database')
const { requireAuth } = require('../middleware/auth')
const { AppError } = require('../utils/errors')

router.use(requireAuth)

function toClient(row) {
  return {
    id:         row.id,
    type:       row.type,
    title:      row.title,
    note:       row.note,
    icon:       row.icon,
    colorTag:   row.color_tag,
    targetDate: row.target_date  || undefined,
    deadline:   row.deadline     || undefined,
    weekDays:   row.week_days    ? JSON.parse(row.week_days) : undefined,
    archived:   row.archived === 1,
    createdAt:  row.created_at,
  }
}

// GET /api/plans
router.get('/', (req, res, next) => {
  try {
    const rows = db.prepare(
      'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at ASC'
    ).all(req.userId)
    res.json(rows.map(toClient))
  } catch (err) { next(err) }
})

// POST /api/plans
router.post('/', (req, res, next) => {
  try {
    const { id, type, title, note, icon, colorTag, targetDate, deadline, weekDays, archived, createdAt } = req.body
    if (!type || !title) throw new AppError('type 和 title 是必填项', 400)

    const planId = id || uuid()
    db.prepare(`
      INSERT INTO plans (id, user_id, type, title, note, icon, color_tag,
                         target_date, deadline, week_days, archived, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      planId, req.userId, type, title,
      note || '', icon || '🌟', colorTag || '#FF8C42',
      targetDate || null, deadline || null,
      weekDays ? JSON.stringify(weekDays) : null,
      archived ? 1 : 0,
      createdAt || new Date().toISOString()
    )

    const row = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId)
    res.status(201).json(toClient(row))
  } catch (err) { next(err) }
})

// PUT /api/plans/:id
router.put('/:id', (req, res, next) => {
  try {
    const existing = db.prepare(
      'SELECT id FROM plans WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId)
    if (!existing) throw new AppError('计划不存在', 404)

    const { title, note, icon, colorTag, targetDate, deadline, weekDays, archived } = req.body
    db.prepare(`
      UPDATE plans
      SET title=?, note=?, icon=?, color_tag=?,
          target_date=?, deadline=?, week_days=?, archived=?
      WHERE id = ? AND user_id = ?
    `).run(
      title, note || '', icon, colorTag || '#FF8C42',
      targetDate || null, deadline || null,
      weekDays ? JSON.stringify(weekDays) : null,
      archived ? 1 : 0,
      req.params.id, req.userId
    )

    const row = db.prepare('SELECT * FROM plans WHERE id = ?').get(req.params.id)
    res.json(toClient(row))
  } catch (err) { next(err) }
})

// DELETE /api/plans/:id
router.delete('/:id', (req, res, next) => {
  try {
    const existing = db.prepare(
      'SELECT id FROM plans WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId)
    if (!existing) throw new AppError('计划不存在', 404)

    // Transaction: delete checkins then plan (matches reducer behavior)
    const del = db.transaction(() => {
      db.prepare('DELETE FROM checkins WHERE plan_id = ?').run(req.params.id)
      db.prepare('DELETE FROM plans WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
    })
    del()

    res.status(204).end()
  } catch (err) { next(err) }
})

module.exports = router
