const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const {Product} = require("./schemas/allSchemas")

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ReviewBot")
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// Function to read CSV and map reviews to products
const parseCSVAndStoreInMongo = async (csvFilePath) => {
  const productsMap = new Map(); // Map to store products by their ASIN
  let productIdCounter = 0; // Initialize the productId counter

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const { asin, name,date, rating, review } = row;

        // Check if product already exists in the map
        if (productsMap.has(asin)) {
          // Add the new review to the existing product
          productsMap.get(asin).reviewList.push({
            reviewText: review,
            reviewRating: Number(rating),
          });
        } else {
          // Create a new product entry if it doesn't exist
          productsMap.set(asin, {
            productId: productIdCounter++, // Assign productId and increment
            productName: name,
            reviewList: [{
              reviewText: review,
              reviewRating: Number(rating),
            }],
            rating: Number(rating),
            reviewSummary: "Summary for " + name, // You can dynamically create this later
            pros: [],
            cons: [],
          });
        }
      })
      .on('end', async () => {
        try {
          // Convert map to an array of products
          const products = Array.from(productsMap.values());

          // Insert products into MongoDB
          await Product.insertMany(products);
          console.log('CSV data inserted into MongoDB successfully');
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Run the CSV import function
const importData = async () => {
  try {
    // Check if products already exist in the database
    const count = await Product.countDocuments();
    
    if (count > 0) {
      console.log('Products already exist in the database. Skipping CSV import.');
      return;
    }

    // Specify the path to your CSV file
    const csvFilePath = './reviews.csv';

    // Parse CSV and store data
    await parseCSVAndStoreInMongo(csvFilePath);

    // Close the MongoDB connection once done
    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing data:', error);
    mongoose.connection.close();
  }
};

importData();
