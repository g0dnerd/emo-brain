import express from 'express'
import cors from 'cors'
import request from 'request'

const port = 5000

global.access_token = ''

const spotifyApiUri = 'https://api.spotify.com/v1'

var spotify_client_id = '5c7dfb57f6f14c89b6028d78d721eeb5'
var spotify_client_secret = '97f5b635e14d4f098659c1729bd05382'
var redirect_uri = 'http://127.0.0.1:5000/auth/callback'

var app = express()

app.use(cors())

app.get('/auth/login', (_, res) => {
  var scope =
    'streaming \
               user-read-email \
               user-read-private'

  var state = generateRandomString(16)

  var auth_query_parameters = new URLSearchParams({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri,
    state: state,
  })

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString())
})

app.get('/auth/callback', (req, res) => {
  var code = req.query.code

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization:
        'Basic ' + Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true,
  }

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token
      res.redirect('http://127.0.0.1:5173/')
    }
  })
})

app.get('/api/playlists', (req, res) => {
  request.get(
    `${spotifyApiUri}/me/playlists`,
    {
      method: 'GET',
      headers: {
        authorization: req.headers.authorization,
      },
    },
    function (_error, _response, body) {
      res.json(JSON.parse(body))
    },
  )
})

app.get('/auth/token', (_, res) => {
  res.json({
    access_token,
  })
})

app.listen(port, () => {
  console.log(`Listening at http://127.0.0.1:${port}`)
})

var generateRandomString = function (length) {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
