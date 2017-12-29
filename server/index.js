const app = require('express')()
const bodyParser = require('body-parser')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({
  dev
})
const nextHandler = nextApp.getRequestHandler()

// var globalSocket
io.on('connection', socket => {
  console.log('client connected')
  // globalSocket = socket
  app.set('socket', socket)
})

nextApp.prepare().then(() => {
  app.use(bodyParser.json()) // for parsing application/json
  app.use(bodyParser.urlencoded({
    extended: true
  })) // for parsing application/x-www-form-urlencoded

  app.post('*', (req, res) => {
    io.emit('request', req.body)
    req.app.get('socket').once('response', (data) => {
      res.json(data)
    })
  })

  app.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
