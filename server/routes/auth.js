const express = require("express");
const HttpStatus = require("http-status-codes");
const { hash } = require("your-password-hash-lib");
const { generatePasscode,addPasscode,send} = require("../middleware/emailer");
const { check } = require("your-auth-middleware");
const logger = require("your-logger");
const User = require("your-user-model");
const router = express.Router();
const SAUCE = process.env.SAUCE || "chubingo";
require('dotenv').config();
// Signin
router.post("/signin", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username || (email && password)))
      res.status(400).json({ error: "Missing required fields" });

    // Find user by username or email
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user || !(await verify(password, user.password)))
      res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, SAUCE, {
      expiresIn: "1d",
    });

    if (user.password) user.password = "";

    // If two-auth not confirmed
    if (!user.check) {
      const code = generatePasscode();
      addPasscode(email, code);
      await send(email, code);
      res.status(200).json({ user: "twoauth" });
      return;
    }

    // Calculate this month's time range
    const now = new Date();
    const startTimestamp = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getTime();
    const endTimestamp = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getTime();

    const todo = await Task.find({
      user: user._id,
      $or: [
        { start: { $gte: startTimestamp, $lte: endTimestamp } },
        { end: { $gte: startTimestamp, $lte: endTimestamp } },
        {
          $and: [
            { start: { $lte: startTimestamp } },
            { end: { $gte: endTimestamp } },
          ],
        },
      ],
    });

    res.cookie("Authorization", `Bearer ${token}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user, todo });
  } catch (error) {
    logger.error("Signin Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const exists = await User.findOne({ username });
    if (exists) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }

    const hashed = await hash(password);
    const newUser = new User({
      username,
      email,
      password: hashed,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    logger.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// TwoAuth
router.post("/twoauth", async (req, res) => {
  try {
    const { email, passcode } = req.body;

    if (!email || !passcode) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const num = Number(passcode);
    const found = await findPasscode(email);

    if (!found || found !== num) {
      res.status(403).json({ error: "Invalid credentials" });
      return;
    }

    removePasscode(email);

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const token = jwt.sign({ id: user._id, username: user.username }, SAUCE, {
      expiresIn: "1d",
    });

    user.check = true;
    await user.save();
    user.password = "";

    res.cookie("Authorization", `Bearer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user });
  } catch (error) {
    logger.error("TwoAuth Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Forgot Password → triggers 2FA with code
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const token = jwt.sign({ id: user._id, username: user.username }, SAUCE, {
      expiresIn: "1d",
    });

    res.cookie("Authorization", `Bearer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const code = generatePasscode();
    addPasscode(email, code);
    await send(email, code);

    res.status(200).json({ go: "twoauth" });
  } catch (error) {
    logger.error("Forgot Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ========== PUT /user - Update User ==========
router.put("/user", check, async (req, res) => {
  try {
    const {
      username,
      email,
      lastname,
      firstname,
      country,
      passportId,
      password,
      phone,
      age,
      img,
      news,
      bio,
      field,
      tips,
      lang,
      theme,
    } = req.body;

    if (!req.user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }

    if (!username || username !== req.user.username) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Invalid username" });
    }

    let user = await User.findOne({ username });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
    }

    const hashedPassword = password ? await hash(password) : user.password;

    const emailChanged = user.email !== email;

    // Update user fields
    user.email = email || user.email;
    user.lastname = lastname || user.lastname;
    user.firstname = firstname || user.firstname;
    user.country = country || user.country;
    user.img_url = img || user.img_url;
    user.password = hashedPassword;
    user.modified = new Date();
    user.news = news || user.news;
    user.bio = bio || user.bio;
    user.field = field || user.field;
    user.tips = tips || user.tips;
    user.lang = lang || user.lang;
    user.age = age || user.age;
    user.theme = theme || user.theme;

    await user.save();

    if (emailChanged) {
      const code = generatePasscode();
      addPasscode(email, code);
      await send(email, code);
      return res.status(HttpStatus.OK).json({ success: true, twoauth: true });
    }

    user.password = "";
    return res.status(HttpStatus.OK).json({ success: true, user });
  } catch (error) {
    logger.error("Error updating user:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
});

// ========== DELETE /user - Delete Another User ==========
router.delete("/user", check, async (req, res) => {
  try {
    const { username } = req.body;

    if (!req.user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }

    if (!username || username === req.user.username) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Cannot delete own account here" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
    }

    await User.deleteOne({ username });

    return res
      .status(HttpStatus.OK)
      .json({ message: "Account deleted successfully" });
  } catch (error) {
    logger.error("Error deleting user:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
});

// ========== DELETE /history - Clear Current User's History ==========
router.delete("/history", check, async (req, res) => {
  try {
    const { username } = req.body;

    if (!req.user || username !== req.user.username) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Invalid username" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
    }

    // Assume you have a history array or related model to clear
    user.history = []; // or History.deleteMany({ userId: user._id });
    await user.save();

    return res
      .status(HttpStatus.OK)
      .json({ message: "History deleted successfully" });
  } catch (error) {
    logger.error("Error clearing history:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
});

// ========== POST /logout - Clear Auth Cookie ==========
router.post("/logout", (req, res) => {
  res.clearCookie("Authorization", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
  return res.json({ message: "Logged out successfully" });
});

export default router;
