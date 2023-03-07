require('dotenv').config()
const express = require('express')
var cors = require('cors');
var cookieParser = require('cookie-parser');
var request = require('request');
const path = require('path')
var querystring = require('querystring');
const PORT = process.env.PORT || 5163

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

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
  .use(cors())
  .use(cookieParser())
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
  .get('/account', function (req, res) {
    const ejsData = {

    }
    res.render('pages/account', ejsData)
  })
  .post('/search', async function (req, res) {
    res.set({ 'Content-Type': 'application/json' })

    if (req.body.searchBox !== "") {
      res.json({ ok: true })
    } else {
      res.status(400).json({ ok: false })
    }

  })
  .get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state: state
      }))
  })
  .get('/callback', function(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
  
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }))
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
        },
        json: true
      }
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
  
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);
          });
  
          // we can also pass the token to the browser to make requests from there
          res.redirect('/account#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }))
        }
      })
    }
  })
  .get('/refresh_token', function(req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    }
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        })
      }
    })
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
