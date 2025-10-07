const User = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
    });
    const newUser = await user.save();
    console.log("User created:", newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.age !== undefined) user.age = req.body.age;

    const updatedUser = await user.save();
    console.log("User updated:", updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    console.log("User deleted:", user);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: err.message });
  }
};
