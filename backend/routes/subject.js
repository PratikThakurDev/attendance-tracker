import express from "express";
import pool from "../db.js";
const router = express.Router();

router.get("/:userId", async (req, res) => {
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
});

router.post("/", async (req, res) => {
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
});

export default router;
