const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const DB_PATH = process.env.DB_PATH || './data/planapp.db'

// Ensure data directory exists
const dir = path.dirname(path.resolve(DB_PATH))
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const db = new Database(path.resolve(DB_PATH))

// Execute schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
db.exec(schema)

module.exports = db
