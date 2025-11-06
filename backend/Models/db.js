const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL;

console.log("DB_URL:", DB_URL); // should print your connection string

mongoose.connect(DB_URL)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
