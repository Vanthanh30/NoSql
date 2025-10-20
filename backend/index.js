const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});