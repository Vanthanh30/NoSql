
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./src/configs/db.js");
const adminroute = require('./src/routes/admin/index.js');
const clientRoute = require('./src/routes/client/index.js');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

adminroute(app);
clientRoute(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
