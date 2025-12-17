const account = require("../../models/admin/accounts");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const accountData = await account.findOne({ email });
    if (!accountData) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      accountData.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { account_id: accountData._id, role_Id: accountData.role_Id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      account: {
        _id: accountData._id,
        email: accountData.email,
        name: accountData.name,
        role_Id: accountData.role_Id,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { login };
