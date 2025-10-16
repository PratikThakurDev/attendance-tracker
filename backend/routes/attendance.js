import express from "express";
import pool from "../db/db.js";

const router = express.Router();

router.post('/', async (req, res) => {
  const { student_id, subject_id, status, date } = req.body;
  if (new Date(date) > new Date()) {
    return res.status(400).json({ error: 'Cannot mark attendance for future dates.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO attendance (student_id, subject_id, status, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [student_id, subject_id, status, date || new Date()]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:subjectId", async (req, res) => {
  try {
    const { subjectId } = req.params;
    const result = await pool.query(
      "SELECT * FROM attendance WHERE subject_id = $1 ORDER BY date DESC",
      [subjectId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

router.get("/summary/:userId", async (req, res) => {
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
    console.error(err.message);
    res.status(500).json({ error: "Failed to get summary" });
  }
});

router.get("/dashboard-summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT 
        COALESCE(SUM(a.status::int),0) AS total_present,
        COUNT(a.*) AS total_classes,
        COALESCE(SUM(CASE WHEN a.status=false THEN 1 ELSE 0 END),0) AS canceled_classes,
        ROUND(
          CASE WHEN COUNT(a.*) = 0 THEN 0
          ELSE (100.0 * SUM(a.status::int)/COUNT(a.*)) END, 2
        ) AS attendance_percentage
      FROM attendance a
      JOIN subjects s ON s.id = a.subject_id
      WHERE s.user_id = $1
    `, [userId]);

    const summary = result.rows[0];
  
    const streakResult = await pool.query(`
      SELECT date_trunc('day', attendance_date) AS day
      FROM attendance a
      JOIN subjects s ON s.id = a.subject_id
      WHERE s.user_id = $1 AND status = true
      ORDER BY attendance_date DESC
    `, [userId]);

    let streak = 0, prevDate = null;
    streakResult.rows.forEach(row => {
      const d = new Date(row.day);
      if (!prevDate) streak++;
      else {
        const diff = (prevDate - d)/(1000*3600*24);
        if(diff === 1) streak++;
        else return;
      }
      prevDate = d;
    });

    res.json({
      attendancePercent: summary.attendance_percentage || 0,
      presentDays: parseInt(summary.total_present || 0),
      canceledClasses: parseInt(summary.canceled_classes || 0),
      streak
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
});


router.get("/daily/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT 
        EXTRACT(DAY FROM attendance_date) AS day,
        SUM(status::int) AS classesAttended
      FROM attendance a
      JOIN subjects s ON s.id = a.subject_id
      WHERE s.user_id = $1
      GROUP BY day
      ORDER BY day
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily attendance" });
  }
});

export default router;
