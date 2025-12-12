import User from "../models/User.js";
import jwt from "jsonwebtoken";

// REGISTER USER (plain password)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.json({ message: "User already exists" });

    // STORE PLAIN PASSWORD (NOT HASHED)
    const user = await User.create({
      name,
      email,
      password, // store plain password
      role: role || "client",
    });

    res.json({
      message: "User created successfully",
      userId: user._id,
      email: user.email,
      password: password,
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

// LOGIN USER (plain password compare)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    // PLAIN STRING COMPARE
    if (password !== user.password) {
      return res.json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};
