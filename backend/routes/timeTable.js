import express from "express";
import pool from "../db/db.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(
      "SELECT day, time_slot, subject_name FROM timetable WHERE user_id = $1",
      [userId]
    );
    
    const timetable = {};
    result.rows.forEach(row => {
      if (!timetable[row.day]) {
        timetable[row.day] = {};
      }
      timetable[row.day][row.time_slot] = row.subject_name || '';
    });
    
    res.json(timetable);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
});

router.post("/:userId", async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { userId } = req.params;
    const { timetable } = req.body;
    
    await client.query('BEGIN');

    await client.query("DELETE FROM timetable WHERE user_id = $1", [userId]);
    
    const insertPromises = [];
    Object.keys(timetable).forEach(day => {
      Object.keys(timetable[day]).forEach(timeSlot => {
        const subjectName = timetable[day][timeSlot];
        if (subjectName && subjectName.trim() !== '') {
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
    await client.query('COMMIT');
    
    res.json({ message: "Timetable saved successfully" });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ error: "Failed to save timetable" });
  } finally {
    client.release();
  }
});


router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    await pool.query("DELETE FROM timetable WHERE user_id = $1", [userId]);
    
    res.json({ message: "Timetable cleared successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to clear timetable" });
  }
});

export default router;
