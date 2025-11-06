
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./src/configs/db.js");
const route = require('./src/routes/admin/index.js');

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // gọi sau khi dotenv đã load

route(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
