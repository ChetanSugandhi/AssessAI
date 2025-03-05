require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


// connectivity backend frontend
app.use(cors({
    origin: "http://localhost:5173",       // frontend URL ( React )
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


const Port = process.env.PORT || 9999;

app.listen(Port, (req, res) => {
    console.log(`Backend is running on port ${Port}`);
})