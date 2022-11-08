const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://process.env.DB_USER:process.env.DB_PASSWORD@cluster0.ph4ajav.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



app.get('/', (req, res) => {
  res.send(`Welcome to Roza's flavor fusion`)
})

app.listen(port, () => {
  console.log(`Roza's flavor fusion server runing on port ${port}`)
})