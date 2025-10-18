import express from "express";
import pool from "../db/db.js";

const router = express.Router();

// GET all subjects for a user
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

// POST - Add new subject
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

// PUT - Update subject
router.put("/:id", async (req, res) => {
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
});

// DELETE - Delete subject
router.delete("/:id", async (req, res) => {
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
});

export default router;
