const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 30,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: 5,
      maxlength: 30,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (prop) => `Invalid email: ${prop.value}`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Donor", "Volunteer", "Admin"],
      default: "Volunteer",
      required: true,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
module.exports = User;
