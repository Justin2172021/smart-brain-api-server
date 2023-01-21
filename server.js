const express = require("express");
const bcrypt = require('bcryptjs');
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USERNAME = process.env.DB_USERNAME;
const PORT = process.env.PORT || 4000;

// Instantiate the database and connect to it
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : DB_USERNAME,
      password : DB_PASSWORD,
      database : 'smart-brain'
    }
});

// Instantiate and start Express on this server
const app = express();

// Middleware required for JSON req parsing
app.use(express.json());
// Middleware required for localhost testing mod cors
app.use(cors());

// Root Route/Endpoint
app.get("/", (req, res) => {
    res.send("Success...");
})

// SignIn Route/EndPoint
app.post("/signin", (req, res) => { signin.HandleSignin(req, res, db, bcrypt) })

// Register Route/EndPoint
app.post("/register", (req, res) => { register.HandleRegister(req, res, db, bcrypt) })

// Get Profile by ID Route/EndPoint
app.get("/profile/:id", (req, res) => { profile.HandleProfile(req, res, db) })

// Increase Entry Count Route/EndPoint
app.put("/image", (req, res) => { image.HandleImage(req, res, db) })

// Clarifai API Call Route/EndPoint
app.post("/imageURL", (req, res) => { image.HandleAPICall(req, res) })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})