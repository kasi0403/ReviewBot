const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { RegisterModel, Product } = require("./schemas/allSchemas");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

const saltRounds = 10;  // Number of salt rounds for bcrypt hashing

const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const { protect } = require("./middleware/authmiddleware");

const API_URL = "https://api-inference.huggingface.co/models/siebert/sentiment-roberta-large-english";
const headers = {
    "Authorization": "Bearer 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"
};

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
                    .then(() => {
                        const token = generateJWT(newUser.id);
                        res.json({ message: "User registered successfully", id: newUser.id, email: newUser.email, token });
                    })
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
                    const token = generateJWT(user.id);
                    res.json({ message: "User logged in successfully", id: user.id, email: user.email, token });
                } else {
                    res.status(400).json({ error: "Invalid credentials" });
                }
            });
        })
        .catch(err => res.status(500).json({ error: "Error finding user" }));
});

app.get('/linkInput', protect, async (req, res) => {
    const { link } = req.body;  // Get the link input from the user

    try {
        // Step 1: Verify the user
        const user = await RegisterModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Call the Flask server to scrape the product URL
        const response = await axios.get("http://localhost:5002/scrape", {
            params: {
                url: link,  // Pass the link provided by the user
                len_page: 4 // You can also make this dynamic based on the user's input
            }
        });

        // Step 3: Send back the scraped data (reviews) from Flask
        res.status(200).json({
            message: "Scraped reviews successfully",
            id: user.id,
            name: user.name,
            email: user.email,
            reviews: response.data // Data from Flask (reviews)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred', error: error.message });
    }
});

async function querySentimentAPI(reviews) {
    const payload = {
        "inputs": reviews.join(" ")  // Concatenate reviews into a single string
    };
    
    try {
        const response = await axios.post(API_URL, payload, { headers });
        return response.data;
    } catch (error) {
        console.error("Error querying Hugging Face API", error);
        throw new Error('Failed to perform sentiment analysis');
    }
}

app.post('/analyzeSentiment', async (req, res) => {
    const { reviews } = req.body;  // Get the reviews array from the request body

    try {
        // Step 1: Call the Hugging Face API for sentiment analysis
        const sentimentResult = await querySentimentAPI(reviews);

        // Step 2: Count positive and negative sentiments
        let positiveCount = 0;
        let negativeCount = 0;

        sentimentResult.forEach(result => {
            if (result.label === 'POSITIVE') {
                positiveCount++;
            } else if (result.label === 'NEGATIVE') {
                negativeCount++;
            }
        });

        // Step 3: Send back the sentiment results
        res.status(200).json({
            message: 'Sentiment analysis completed successfully',
            positiveCount,
            negativeCount,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred during sentiment analysis', error: error.message });
    }
});

app.get('/products', protect, async (req, res) => {
    try {
        const products = await Product.find(); // Await the result of Product.find()
        res.status(200).json(products); // Send the products as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
