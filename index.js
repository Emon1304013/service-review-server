const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ph4ajav.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//Database Connection
async function dbConnect(){
  try{
    client.connect();
    console.log("Database Connected");
  }
  catch(err){
    console.log(err.name);
  }
}
dbConnect();

//Api endpoint creation

const Service = client.db("rozasFusion").collection("services");
const Review = client.db("rozasFusion").collection("reviews");


//get services
app.get('/limitedServices',async(req,res)=>{
  const cursor = Service.find({})
  const result = await cursor.sort({'_id': -1}).limit(3).toArray();
  if(result){
    res.send({
      success:true,
      data:result,
    })
  }
  else{
    res.send({
      success:false,
      error:"No Data Found",
    })
  }
})

app.get('/services',async(req,res)=>{
  const cursor = Service.find({})
  const result = await cursor.sort({'_id': -1}).toArray();
  if(result){
    res.send({
      success:true,
      data:result,
    })
  }
  else{
    res.send({
      success:false,
      error:"No Data Found",
    })
  }
})

// Get Single Item 

app.get('/services/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: ObjectId(id)}
  const result = await Service.findOne(query);
  console.log(result);
  if(result){
    res.send({
      success:true,
      data:result,
    })
  }
  else{
    res.send({
      success:false,
      error:"No Data Found",
    })
  }
})

//Post services
app.post('/add-service',async(req,res)=>{
  try{
    const result = await Service.insertOne(req.body)
    console.log(req.body);
    if(result.insertedId){
      res.send({
        success: true,
        message: `Inserted service ${req.body.serviceName} with id ${result.insertedId}`
      })
    }
    else{
      res.send({
        success:false,
        error:"Couldn't Insert the service"
      })
    }
  }
  catch(error){
    res.send({
      success: false,
      error: error.message
    })
  }
})

// Post Reviews 

app.post('/add-review',async(req,res)=>{
  try{
    const result = await Review.insertOne(req.body)
    // console.log(req.body);
    if(result.insertedId){
      res.send({
        success: true,
        message: `Inserted Review of ${req.body.reviewerName} with id ${result.insertedId}`
      })
    }
    else{
      res.send({
        success:false,
        error:"Couldn't Insert the service"
      })
    }
  }
  catch(error){
    res.send({
      success: false,
      error: error.message
    })
  }
})

app.get('/', (req, res) => {
  res.send(`Welcome to Roza's flavor fusion`)
})

app.listen(port, () => {
  console.log(`Roza's flavor fusion server runing on port ${port}`)
})