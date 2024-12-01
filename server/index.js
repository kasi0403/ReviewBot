const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { RegisterModel, Product } = require("./schemas/allSchemas");
const bcrypt = require('bcrypt');
require('dotenv').config();
const axios = require('axios');
const qs = require('qs');
const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(process.env.HUGGING_FACE);

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
                        res.json({ message: "User registered successfully", id: newUser.id, email: newUser.email});
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
                    res.json({ message: "User logged in successfully", id: user.id, email: user.email});
                } else {
                    res.status(400).json({ error: "Invalid credentials" });
                }
            });
        })
        .catch(err => res.status(500).json({ error: "Error finding user" }));
});

app.post('/linkInput', async (req, res,next) => {
    const { inputValue} = req.body;  // Get the link input from the user
    try {
        const data = qs.stringify({
            url: inputValue,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
        const response = await axios.post('http://localhost:5000/scrape', data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
        console.log("data received in express = ",response.data)
        // req.reviews = response.data;
        res.status(200).json({
            message: "Scraped reviews successfully",
            reviews: response.data 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred', error: error.message });
    }
    
});
async function querySentimentAPI(reviews) {
    try {
        const sentiments = []; // Array to store sentiment results for each review

        // Loop through each review and query the API
        for (let i = 0; i < reviews.length; i++) {
            const payload = { text: reviews[i] }; // Use `text` as the key
            const response = await axios.post(API_URL, payload, { headers });

            if (response.status === 200) {
                // Add the review and its sentiment to the results
                sentiments.push({
                    review: reviews[i],
                    sentiment: response.data[0], // Assuming API returns an array of sentiments
                });
            } else {
                console.error(`Unexpected response status for review ${i}:`, response.status);
            }
        }

        return sentiments; // Return the sentiments array
    } catch (error) {
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
        } else {
            console.error("Network or other error:", error.message);
        }
        throw new Error("Failed to perform sentiment analysis");
    }
}

// Route for sentiment analysis
app.post('/analyzeSentiment', async (req, res) => {
    reviews = req.body;
    console.log(reviews)
    if (!reviews || !Array.isArray(reviews)) {
        return res.status(400).json({ message: 'Invalid input. Expected an array of reviews.' });
    }

    try {
        // Step 1: Call the Hugging Face API for sentiment analysis
        const sentimentResults = await querySentimentAPI(reviews.sentance);

        // Step 2: Count positive and negative sentiments
        let positiveCount = 0;
        let negativeCount = 0;

        sentimentResults.forEach(result => {
            if (result.sentiment.label === 'POSITIVE') {
                positiveCount++;
            } else if (result.sentiment.label === 'NEGATIVE') {
                negativeCount++;
            }
        });

        // Step 3: Send back the sentiment results
        res.status(200).json({
            message: 'Sentiment analysis completed successfully',
            results: sentimentResults, // Array of reviews and their sentiments
            positiveCount,
            negativeCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred during sentiment analysis', error: error.message });
    }
});


app.get('/products', async (req, res) => {
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
