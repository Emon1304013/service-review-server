const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const verifyJWT = require("./middlewares/verifyJWT");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ph4ajav.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Verify JWT

// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).send({ message: "unauthorized access" });
//   }
//   const token = authHeader.split(" ")[1];

//   jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
//     if (err) {
//       return res.status(403).send({ message: "Forbidden access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// }

//Database Connection
async function dbConnect() {
  try {
    client.connect();
  } catch (err) {
    console.log(err.name);
  }
}
dbConnect();

//Api endpoint creation

const Service = client.db("rozasFusion").collection("services");
const Review = client.db("rozasFusion").collection("reviews");

// generate jwt Token and send to client

app.post("/jwt", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.JWT_SECRET);
  res.send({ token });
});

//get services
app.get("/limitedServices", async (req, res) => {
  const cursor = Service.find({});
  const result = await cursor.sort({ created: -1 }).limit(3).toArray();
  if (result) {
    res.send({
      success: true,
      data: result,
    });
  } else {
    res.send({
      success: false,
      error: "No Data Found",
    });
  }
});

app.get("/services", async (req, res) => {
  const cursor = Service.find({});
  const result = await cursor.sort({ created: -1 }).toArray();
  if (result) {
    res.send({
      success: true,
      data: result,
    });
  } else {
    res.send({
      success: false,
      error: "No Data Found",
    });
  }
});

// Get Single Item

app.get("/services/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await Service.findOne(query);
  console.log(result);
  if (result) {
    res.send({
      success: true,
      data: result,
    });
  } else {
    res.send({
      success: false,
      error: "No Data Found",
    });
  }
});

//Post services
app.post("/add-service", async (req, res) => {
  try {
    const result = await Service.insertOne(req.body);
    if (result.insertedId) {
      res.send({
        success: true,
        message: `Inserted service ${req.body.serviceName} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't Insert the service",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Post Reviews

app.post("/add-review", async (req, res) => {
  try {
    const result = await Review.insertOne(req.body);
    if (result.insertedId) {
      res.send({
        success: true,
        message: `Inserted Review of ${req.body.reviewerName} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't Insert the service",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Get Review by serviceid

app.get("/reviews/:id", async (req, res) => {
  const id = req.params.id;

  const query = { serviceId: id };
  const cursor = Review.find(query);
  const result = await cursor.sort({ created: -1 }).toArray();

  if (result) {
    res.send({
      success: true,
      data: result,
    });
  } else {
    res.send({
      success: false,
      error: "No Data Found",
    });
  }
});

//Get customer reviews by customer email

app.get("/user-reviews/:email", verifyJWT, async (req, res) => {
  const email = req.params.email;
  const decoded = req.decoded;


  if (decoded.email !== req.params.email) {
    res.status(403).send({ message: "unauthorized access" });
  }
  const query = { reviewerEmail: email };
  const cursor = Review.find(query);
  const result = await cursor.toArray();

  if (result) {
    res.send({
      success: true,
      data: result,
    });
  } else {
    res.send({
      success: false,
      error: "No Data Found",
    });
  }
});

//Delete Customer review

app.delete("/user-reviews/:id", async (req, res) => {
  const reviewId = req.params.id;
  const query = { _id: ObjectId(reviewId) };
  const result = await Review.deleteOne(query);
  if (result.deletedCount) {
    res.send({
      success: true,
      message: "Review Deleted Successfully",
    });
  } else {
    res.send({
      success: false,
      error: "Something Went Wrong. Please try again",
    });
  }
});

// Update Customer Review

app.patch("/user-reviews/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const filter = { _id: ObjectId(id) };
    const updatedDoc = {
      $set: req.body,
    };
    const result = await Review.updateOne(filter, updatedDoc);
    if (result.matchedCount) {
      res.send({
        success: true,
        message: "Successfully Updated your review",
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't update the review",
      });
    }
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/", (req, res) => {
  res.send(`Welcome to Roza's flavor fusion`);
});

app.listen(port, () => {
  console.log(`Roza's flavor fusion server runing on port ${port}`);
});
