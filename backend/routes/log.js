import express from "express";
import pool from "../db/db.js";
const router = express.Router();

router.get("/recent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT 
        a.attendance_date AS date,
        s.subject_name AS classes,
        a.status
      FROM attendance a
      JOIN subjects s ON s.id = a.subject_id
      WHERE s.user_id = $1
      ORDER BY a.attendance_date DESC
      LIMIT 10
    `, [userId]);

    // Group by date
    const logsMap = {};
    result.rows.forEach(row => {
      const date = row.date.toISOString().split('T')[0];
      if (!logsMap[date]) logsMap[date] = { date, classes: [], status: "Present" };
      if (!row.status) logsMap[date].status = "Absent";
      logsMap[date].classes.push(row.classes);
    });

    res.json(Object.values(logsMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent logs" });
  }
});

export default router ;