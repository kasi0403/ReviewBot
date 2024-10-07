const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const RegisterModel = require("./schemas/allSchemas")
const bcrypt = require('bcrypt');
require('dotenv').config(); 


const app = express()
app.use(express.json())
//will convert the data passing from fronted to backend into json format
app.use(cors())

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

const saltRounds = 10;  // Number of salt rounds for bcrypt hashing

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    RegisterModel.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.status(400).json({ error: "User with this email already exists" });
            } else {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: "Error hashing password" });
                    }
                    RegisterModel.create({ name, email, password: hash })
                        .then(newUser => res.json({ message: "User registered successfully", newUser }))
                        .catch(err => res.status(500).json({ error: "Error creating user" }));
                });
            }
        })
        .catch(err => res.status(500).json({ error: "Error checking for existing user" }));
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    RegisterModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ error: "User does not exist" });
            }
            // Compare the entered password with the hashed password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ error: "Error during password comparison" });
                }
                if (isMatch) {
                    res.json("Success");
                } else {
                    res.status(400).json({ error: "Password is incorrect" });
                }
            });
        })
        .catch(err => res.status(500).json({ error: "Error finding user" }));
});


app.listen(3001,()=>{
    console.log("server is running")
})