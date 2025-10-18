import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/db.js";

const router = express.Router();

router.put("/change-password/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    console.log("Change password request:", { userId, currentPassword, newPassword });

    const userResult = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Stored hash:", userResult.rows[0].password);
    console.log("Current password from request:", currentPassword);

    const validPassword = await bcrypt.compare(
      currentPassword,
      userResult.rows[0].password
    );

    console.log("Password valid?", validPassword);

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
});

router.delete("/delete-account/:userId", async (req, res) => {
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
});

router.get("/export-attendance/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        s.subject_name,
        a.date,
        CASE WHEN a.status THEN 'Present' ELSE 'Absent' END as status
      FROM attendance a
      JOIN subjects s ON s.id = a.subject_id
      WHERE s.user_id = $1
      ORDER BY a.date DESC
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No attendance data found" });
    }

    const csvHeader = "Subject,Date,Status\n";
    const csvRows = result.rows
      .map((row) => {
        const date = new Date(row.date).toLocaleDateString("en-US");
        return `"${row.subject_name}","${date}","${row.status}"`;
      })
      .join("\n");

    const csvContent = csvHeader + csvRows;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="attendance_${userId}_${Date.now()}.csv"`
    );

    res.send(csvContent);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to export attendance data" });
  }
});

export default router;
