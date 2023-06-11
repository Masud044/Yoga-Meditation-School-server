const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.igjj82v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("YogaDb").collection("users");
    const classCollection = client.db("YogaDb").collection("class");

    const myclassCollection = client.db("YogaDb").collection("myclass");
    const instructorCollection = client.db("YogaDb").collection("instructor");

    // instructor related api

     app.post('/instructor',async(req,res)=>{
      const item = req.body;
      console.log(item);
      
      const query = { email: item.email }
      console.log(query)
      const existing = await instructorCollection.findOne(query);
      if (existing) {
        return res.send({ message: 'user already axist' })
      }
      const result = await instructorCollection.insertOne(item);
      res.send(result);
     })

     app.get('/instructor',async(req,res)=>{
         const result = await instructorCollection.find().toArray();
         res.send(result);
     })

    // user related apis

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existing = await usersCollection.findOne(query);
      if (existing) {
        return res.send({ message: 'user already axist' })
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    app.get('/users/admin/:email',async(req,res)=>{
        const email = req.params.email;
        const query = { email: email }
        const user = await usersCollection.findOne(query);
        const result = {admin:user?.role=='admin'}
        res.send(result);
    })
    

    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };
      const result = await usersCollection.updateOne(filter,updateDoc);
      res.send(result);
    })

    app.get('/users/instructor/:email',async(req,res)=>{
      const email = req.params.email;
      const query = { email: email }
      const user = await usersCollection.findOne(query);
      const result = {instructor:user?.role=='instructor'}
      res.send(result);
  })
    app.patch('/users/instructor/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'instructor',
        },
      };
      const result = await usersCollection.updateOne(filter,updateDoc);
      res.send(result);
    })


    // myclass collection;
    app.post('/myclass', async (req, res) => {
      const item = req.body;
      const result = await myclassCollection.insertOne(item);
      res.send(result);
    })
    app.get('/myclass', async (req, res) => {
      const email = req.query.email;
      //  console.log(email)
      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result = await myclassCollection.find(query).toArray();
      res.send(result);
    })

    app.delete('/myclass/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myclassCollection.deleteOne(query);
      res.send(result);
    })

    // class section
    app.get('/class', async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    })
    app.post('/class',async(req,res)=>{
         const newClass = req.body;
         const result = await classCollection.insertOne(newClass)
         res.send(result);
    })

    app.get('/class/:email', async (req, res) => {
      const email = req.params.email;
      //  console.log(email)
      const query = { email: email };
      const result = await classCollection.find(query).toArray();
      res.send(result);
    })

    app.patch('/class/:id',async(req,res)=>{
        const id = req.params.id;
        const filter = {_id:new ObjectId(id)};
        const updateStatus = req.body;
        console.log(updateStatus);
        const updateDoc = {
          $set: {
            status: updateStatus.status
          },
        };
        const result = await classCollection.updateOne(filter,updateDoc);
        res.send(result);

    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Assignment-12 coming..');
})

app.listen(port, () => {
  console.log(`Assignment-12 is sitting on port ${port}`);
})