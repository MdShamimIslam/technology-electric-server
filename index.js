const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j5nrexn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const brandCollection = client.db("TechDb").collection("brands");
    const productCollection = client.db("TechDb").collection("products");
    const cartCollection = client.db("TechDb").collection("carts");

    // brands related apis
    app.get("/brands", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });

    app.get("/brands/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });

    // products related apis
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // carts related apis
    app.post('/carts',async(req,res)=>{
      const product = req.body;
      const result = await cartCollection.insertOne(product);
      res.send(result);
    })

    app.get('/carts', async(req,res)=>{
      const result = await cartCollection.find().toArray();
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Technology-Electronic server is running");
});

app.listen(port, (req, res) => {
  console.log(`Technology-Electronic server is running on port : ${port}`);
});
