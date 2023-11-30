// start file of nodejs

const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const db = require("./src/config/dbConnect"); 
const productRoutes = require("./src/routes/productRoutes"); 

// Connect to the database
db.sync({ alter: false })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Error connecting to the database:", err));


const corsOptions = {
    origin: '*', // Replace with your allowed origin
  };
  
app.use(cors(corsOptions));


// Configure Multer for handling multipart/form-data
const upload = multer();

// Middleware for parsing form data
app.use(upload.any());

// Middleware
app.use(express.json());

// Routes
app.use('/product',productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
