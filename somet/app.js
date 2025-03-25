import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import passport from "./middleware/passport.js";
import authRouter from "./routes/authRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js";
import classroomRouter from "./routes/classroomRouter.js";
import assignmentRouter from "./routes/assignmentRouter.js";

const app = express();
connectDB();

app.use(express.json());
app.use(passport.initialize());

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }),
);

app.use("/auth", authRouter);
app.use("/", dashboardRouter);
app.use("/classroom", classroomRouter);
app.use("/assignment", assignmentRouter);

app.get("/", (req, res) => res.send("assesai backend here"));
app.post("/set-role/teacher", async (req, res) => {
  if (req.body.teacherCode === "#Education") {
    res.status(200).json({ success: true, role: "teacher" });
  } else {
    res.status(403).send("Wrong code");
  }
});

export default app;
