const mongoose=require('mongoose');
const dotenv=require('dotenv');
const express=require('express');
const app=require('./app.js');
const User = require('./models/User');

dotenv.config();
const port =5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(5000, () => {
      console.log(`Server started on port ${port}`);
    });

  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });
