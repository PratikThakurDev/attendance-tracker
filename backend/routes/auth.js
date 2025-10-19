import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";

dotenv.config();
const router = express.Router();

router.post(
  "/signup",
  [
    body("name")
      .isString()
      .isLength({ min: 2, max: 36 })
      .trim()
      .escape(),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Provide a valid email"),
    body("password")
      .isString()
      .isLength({ min: 6, max: 72 })
      .withMessage("Password must be 6-72 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { name, email, password } = req.body;
      const hashed = await bcrypt.hash(password, 10);

      const user = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashed]
      );

      res.json({ message: "User registered", user: user.rows[0] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Registration failed" });
    }
  }
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Provide a valid email"),
    body("password")
      .isString()
      .isLength({ min: 6, max: 72 })
      .withMessage("Password must be 6-72 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;
      const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

      if (!user.rows.length)
        return res.status(400).json({ error: "User not found" });

      const valid = await bcrypt.compare(password, user.rows[0].password);
      if (!valid) return res.status(401).json({ error: "Invalid password" });

      const token = jwt.sign(
        {
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.json({ token, user: user.rows[0] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

export default router;
