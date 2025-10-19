import express from "express";
import pool from "../db/db.js";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

router.get(
  "/:userId",
  param("userId").isInt().withMessage("User ID must be an integer"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const { userId } = req.params;
      const result = await pool.query(
        "SELECT * FROM subjects WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.post(
  "/",
  [
    body("user_id").isInt().withMessage("User ID must be an integer"),
    body("subject_name")
      .isString()
      .isLength({ min: 2, max: 36 })
      .trim()
      .escape()
      .withMessage("Subject name must be 2-36 chars and valid text"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const { user_id, subject_name } = req.body;
      const result = await pool.query(
        "INSERT INTO subjects (user_id, subject_name) VALUES ($1, $2) RETURNING *",
        [user_id, subject_name]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put(
  "/:id",
  [
    param("id").isInt().withMessage("Subject ID must be an integer"),
    body("subject_name")
      .isString()
      .isLength({ min: 2, max: 36 })
      .trim()
      .escape()
      .withMessage("Subject name must be 2-36 chars and valid text"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const { id } = req.params;
      const { subject_name } = req.body;

      const result = await pool.query(
        "UPDATE subjects SET subject_name = $1 WHERE id = $2 RETURNING *",
        [subject_name, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Subject not found" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.delete(
  "/:id",
  param("id").isInt().withMessage("Subject ID must be an integer"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const { id } = req.params;

      const result = await pool.query(
        "DELETE FROM subjects WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Subject not found" });
      }

      res.json({ message: "Subject deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
