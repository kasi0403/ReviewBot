const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const {RegisterModel} = require("./schemas/allSchemas")
const jwt = require('jsonwebtoken');
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


const generateJWT = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn : '30d'})
}

const {protect} = require("./middleware/authmiddleware")

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Check for existing user
    RegisterModel.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.status(400).json({ error: "User with this email already exists" });
            }
            
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: "Error hashing password" });
                }
                const newUser = new RegisterModel({ name, email, password: hashedPassword });

                newUser.save()
                    .then(() => res.json({ message: "User registered successfully", id: newUser.id, email: newUser.email, token: generateJWT(newUser.id) }))
                    .catch(err => {
                        console.error(err); // Log the error for debugging
                        res.status(500).json({ error: "Error saving user to the database." });
                    });
            });
        })
        .catch(err => {
            console.error(err); // Log the error for debugging
            res.status(500).json({ error: "Error checking for existing user." });
        });
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
                    res.json(res.json({ message: "User registered successfully", id: user.id, email: user.email,token : generateJWT(user.id) }))
                } else {
                    res.status(400).json({ error: "Invalid credentials" });
                }
            });
        })
        .catch(err => res.status(500).json({ error: "Error finding user" }));
});

app.get('/linkInput',protect,async (req,res)=>{
    const {id,name,email} = await RegisterModel.findById(req.user.id)
    res.status(200).json({message:"Verified user",id:id,name:name,email:email})
})

app.get('/products',protect,async (req,res)=>{
    const {id,name,email} = await RegisterModel.findById(req.user.id)
    res.status(200).json({message:"Verified user",id:id,name:name,email:email})
})

app.listen(3001,()=>{
    console.log("server is running")
})