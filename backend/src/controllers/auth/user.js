const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/auth/User");

const register = async (req, res, next) => {
  try {
    const { name, username, email, password, role } = req.body;
    console.log(req.body);
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if username already exists
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res.status(400).json({ message: "Username already exists" });
    }
    // Check if email already exists
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Ensure that only "Donor" or "Volunteer" roles are allowed for registration
    if (!["Donor", "Volunteer"].includes(role)) {
      return res.status(400).json({
        message:
          "Invalid role. Only Donor or Volunteer roles are allowed for registration.",
      });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with success message and the saved user data
    res.status(201).json({
      message: "Registration successful",
      user: savedUser,
    });
  } catch (error) {
    // Handle any errors that occur during registration
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.status(200).json({
    message: "Login successful",
    token,
  });
};

module.exports = {
  register,
  login,
};
