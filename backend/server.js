import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import subjectRoutes from "./routes/subject.js";
import attendanceRoutes from "./routes/attendance.js";
import logRoutes from "./routes/log.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("api/log",logRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
