#!/usr/bin/env node

const app = require('express')()
const {
  clientOrigin,
  useCors,
  uri,
  serverPort: port,
  dbRoute,
  dbName
} = require('./env')

if (useCors) {
  const cors = require('cors')
  const corsOptions = {
    origin: `${clientOrigin}`,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  app.use(cors(corsOptions))
}

const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

client
  .connect()
  .then(client => {
    console.log('db connection established')

    app.get(dbRoute, (req, res) => {
      //  console.log(req.headers)
      //  console.log(req.headers.origin)
      if (
        req.headers['sec-fetch-site'] !== 'same-site' ||
        req.headers['sec-fetch-mode'] !== 'cors' ||
        req.headers.origin !== `${clientOrigin}`
      ) {
        res.sendStatus(403)
        return
      }
      const { state, date } = req.query
      if (!state) {
        res.sendStatus(400)
        return
      }

      const findQuery = date ? { DATE: date } : {}
      const collection = client.db(dbName).collection(state)
      collection
        .find(findQuery)
        .sort({ POSITIVE: -1 })
        .toArray((err, result) => {
          if (err) {
            res.sendStatus(500)
            return
          }
          res.send(result)
        })
    })

    app.get('/', (req, res) => {
      console.log(req.headers.host)
      res.sendStatus(200)
    })

    app.listen(port, () => console.log(`Server listening on port ${port}`))
  })
  .catch(err => {
    console.log(err)
  })
