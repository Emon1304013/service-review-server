const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(`Welcome to Roza's flavor fusion`)
})

app.listen(port, () => {
  console.log(`Roza's flavor fusion server runing on port ${port}`)
})