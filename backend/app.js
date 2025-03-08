require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// connectivity backend frontend
app.use(cors({
    origin: "http://localhost:5174",       // frontend URL ( React )
    credentials: true
}));


// mongodb connection 
main()
    .then(() => {
        console.log("Mongo DB Connection Successfully..");
    })
    .catch((err) => {
        console.log("Mongo DB not Connected..");
    })

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}


app.get("/", (req, res) => {
    res.send("Backend Root path");
})

app.get("/test/:id", (req, res) => {
    let {id} = req.params;
    res.send(`received id from frontend is : ${id}`);
})


app.post('/registerUser', (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);  // Now, this should print the values correctly
  
    // Process the data (e.g., save to database)
    res.status(200).json({ message: 'User registered successfully!' });
  });

const Port = process.env.PORT || 9999;

app.listen(Port, (req, res) => {
    console.log(`Backend is running on port ${Port}`);
})