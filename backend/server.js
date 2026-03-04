require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const { errorHandler } = require('./utils/errors')

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth',     require('./routes/auth'))
app.use('/api/plans',    require('./routes/plans'))
app.use('/api/checkins', require('./routes/checkins'))

app.get('/health', (_, res) => res.json({ ok: true, time: new Date().toISOString() }))

// Global error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 后端运行在 http://localhost:${PORT}`))
