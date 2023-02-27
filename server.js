require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5163

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const query = async function (sql, params) {
  let client
  let results = []

  client = await pool.connect()
  const response = await client.query(sql, params)
  if (response && response.rows) {
    results = response.rows
  }

  if (client) client.release()
  return results
}

const queryAllVideos = async function () {
  const sql = `SELECT *
    FROM videos
    ORDER BY id;`
  const results = await query(sql)
  return { videos: results }
}

module.exports = {
  query,
  queryAllVideos
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async function (req, res) {
    const videos = await queryAllVideos()
    res.render('pages/index', videos)
  })
  .get('/health', async function (req, res) {
    const videos = await queryAllVideos()
    if (videos != null) {
      res.status(200).send('healthy')
    } else {
      res.status(500).send('Database query failed')
    }
  })
  .get('/about', function (req, res) {
    const ejsData = {

    }
    res.render('pages/about', ejsData)
  })
  .get('/search', function (req, res) {
    const ejsData = {

    }
    res.render('pages/search', ejsData)
  })
  .post('/search', async function (req, res) {
    res.set({ 'Content-Type': 'application/json' })

    if (req.body.searchBox !== "") {
      res.json({ ok: true })
    } else {
      res.status(400).json({ ok: false })
    }

  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
