import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/db.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Change Password route with validation
router.put(
  "/change-password/:userId",
  [
    body("currentPassword")
      .isString()
      .isLength({ min: 6, max: 72 })
      .withMessage("Current password must be 6-72 characters."),
    body("newPassword")
      .isString()
      .isLength({ min: 6, max: 72 })
      .withMessage("New password must be 6-72 characters."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { userId } = req.params;
      const { currentPassword, newPassword } = req.body;

      const userResult = await pool.query(
        "SELECT password FROM users WHERE id = $1",
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const validPassword = await bcrypt.compare(
        currentPassword,
        userResult.rows[0].password
      );

      if (!validPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await pool.query(
        "UPDATE users SET password = $1 WHERE id = $2",
        [hashedPassword, userId]
      );

      res.json({ message: "Password changed successfully" });
    } catch (err) {
      console.error("Error:", err.message);
      res.status(500).json({ error: "Failed to change password" });
    }
  }
);

// Delete Account route with validation
router.delete(
  "/delete-account/:userId",
  [
    body("password")
      .isString()
      .isLength({ min: 6, max: 72 })
      .withMessage("Password must be 6-72 characters."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { userId } = req.params;
      const { password } = req.body;

      const userResult = await pool.query(
        "SELECT password FROM users WHERE id = $1",
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const validPassword = await bcrypt.compare(
        password,
        userResult.rows[0].password
      );

      if (!validPassword) {
        return res.status(401).json({ error: "Password is incorrect" });
      }

      await pool.query("DELETE FROM users WHERE id = $1", [userId]);

      res.json({ message: "Account deleted successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to delete account" });
    }
  }
);

export default router;
