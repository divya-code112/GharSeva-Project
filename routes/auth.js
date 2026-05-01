require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const User = require("../models/User");


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

/* ================= EMAIL SETUP ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ================= REGISTER ================= */
router.post("/register", upload.any(), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      serviceType,
      experience,
      aadhaarNumber
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      serviceType,
      experience: experience ? Number(experience) : undefined,
      aadhaarNumber,
      idProofImage: req.files?.find(f => f.fieldname === "idProofImage")?.filename,
      certificateImage: req.files?.find(f => f.fieldname === "certificateImage")?.filename,
      profilePhoto: req.files?.find(f => f.fieldname === "profilePhoto")?.filename,
      isVerified: true, // 🔥 No OTP anymore
      status: role === "provider" ? "pending" : "active"
    });

    await newUser.save();

    res.json({
      message:
        role === "provider"
          ? "Registered successfully. Wait for admin approval."
          : "Registered successfully. You can login now."
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and save
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourgmail@gmail.com",
        pass: "your_app_password"
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click below link to reset password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `
    });

    res.json({ message: "Reset link sent to email" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/reset-password/:token", async (req, res) => {
  try {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }

    // Set new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email" });

    if (user.role === "provider" && user.status !== "active")
      return res.status(403).json({ message: "Wait for admin approval" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
  token,
  role: user.role,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
});

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;