const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
