const app = require('express')()
const { serverPort: port, dbRoute, dbName } = require('./env')

const MongoClient = require('mongodb').MongoClient
const { uri } = require('./env')
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

client
  .connect()
  .then(client => {
    console.log('db connection established')

    app.get(dbRoute, (req, res) => {
      console.log(req.headers.host)
      // if (req.headers.host !== `localhost:${port}`) {
      //   res.sendStatus(401)
      //   return
      // }
      const { state, date } = req.query
      if (!state || !date) {
        res.sendStatus(400)
        return
      }

      const collection = client.db(dbName).collection(state)
      collection.find({ DATE: date }).sort({ POSITIVE: -1 }).toArray((err, result) => {
        if (err) {
          res.sendStatus(500)
          return
        }
        res.send(result)
      })
    })

    app.get('/', (req, res) => {
      res.sendStatus(200)
    })

    app.listen(port, () => console.log(`Server listening on port ${port}`))
  })
  .catch(err => {
    console.log(err)
  })
