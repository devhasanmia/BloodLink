const bcrypt = require("bcrypt");
const User = require("../../models/auth/User");

const registration = async (req, res, next) => {
  try {
    const { name, username, email, password, role } = req.body;
    console.log(req.body)

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
        message: 'Invalid role. Only "Donor" or "Volunteer" roles are allowed for registration.',
      });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Issue here

    // Create a new user instance
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword, // This would be a Promise, not the actual hashed password
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

module.exports = registration;
