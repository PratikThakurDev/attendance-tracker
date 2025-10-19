import express from "express";
import pool from "../db/db.js";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

// POST - Add new attendance entry
router.post(
  "/",
  [
    body("student_id").isInt().withMessage("Student ID must be an integer"),
    body("subject_id").isInt().withMessage("Subject ID must be an integer"),
    body("status").isBoolean().withMessage("Status must be true or false"),
    body("date")
      .optional()
      .isISO8601()
      .withMessage("Date must be valid (YYYY-MM-DD)"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { student_id, subject_id, status, date } = req.body;
    if (date && new Date(date) > new Date()) {
      return res
        .status(400)
        .json({ error: "Cannot mark attendance for future dates." });
    }
    try {
      const result = await pool.query(
        "INSERT INTO attendance (student_id, subject_id, status, date) VALUES ($1, $2, $3, $4) RETURNING *",
        [student_id, subject_id, status, date || new Date()]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET - Attendance logs for one subject
router.get(
  "/:subjectId",
  param("subjectId").isInt().withMessage("Subject ID must be an integer"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const { subjectId } = req.params;
      const result = await pool.query(
        "SELECT * FROM attendance WHERE subject_id = $1 ORDER BY date DESC",
        [subjectId]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET - Attendance summary for user's dashboard/cards
router.get(
  "/summary/:userId",
  param("userId").isInt().withMessage("User ID must be an integer"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const { userId } = req.params;
      const result = await pool.query(
        `
        SELECT 
          s.id AS subject_id,
          s.subject_name,
          COALESCE(SUM(CASE WHEN a.status THEN 1 ELSE 0 END), 0) AS present_count,
          COUNT(a.*) AS total_classes,
          ROUND(
            CASE WHEN COUNT(a.*) = 0 
                 THEN 0 
                 ELSE (100.0 * SUM(CASE WHEN a.status THEN 1 ELSE 0 END) / COUNT(a.*)) 
            END, 2
          ) AS attendance_percentage
        FROM subjects s
        LEFT JOIN attendance a ON a.subject_id = s.id
        WHERE s.user_id = $1
        GROUP BY s.id, s.subject_name
        ORDER BY s.created_at DESC
        `,
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
