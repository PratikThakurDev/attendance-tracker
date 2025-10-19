import express from "express";
import pool from "../db/db.js";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

// GET timetable for user
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
        "SELECT day, time_slot, subject_name FROM timetable WHERE user_id = $1",
        [userId]
      );
      const timetable = {};
      result.rows.forEach((row) => {
        if (!timetable[row.day]) {
          timetable[row.day] = {};
        }
        timetable[row.day][row.time_slot] = row.subject_name || "";
      });
      res.json(timetable);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch timetable" });
    }
  }
);

// POST new/updated timetable for user
router.post(
  "/:userId",
  [
    param("userId").isInt().withMessage("User ID must be an integer"),
    body("timetable").isObject().withMessage("Timetable data required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const client = await pool.connect();
    try {
      const { userId } = req.params;
      const { timetable } = req.body;

      await client.query("BEGIN");
      await client.query("DELETE FROM timetable WHERE user_id = $1", [userId]);

      const insertPromises = [];
      Object.keys(timetable).forEach((day) => {
        Object.keys(timetable[day]).forEach((timeSlot) => {
          const subjectName = timetable[day][timeSlot];
          if (subjectName && subjectName.trim() !== "") {
            // Safe: only save if subjectName is not empty
            insertPromises.push(
              client.query(
                "INSERT INTO timetable (user_id, day, time_slot, subject_name) VALUES ($1, $2, $3, $4)",
                [userId, day, timeSlot, subjectName]
              )
            );
          }
        });
      });

      await Promise.all(insertPromises);
      await client.query("COMMIT");

      res.json({ message: "Timetable saved successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      res.status(500).json({ error: "Failed to save timetable" });
    } finally {
      client.release();
    }
  }
);

// DELETE timetable for user
router.delete(
  "/:userId",
  param("userId").isInt().withMessage("User ID must be an integer"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const { userId } = req.params;
      await pool.query("DELETE FROM timetable WHERE user_id = $1", [userId]);
      res.json({ message: "Timetable cleared successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to clear timetable" });
    }
  }
);

export default router;
