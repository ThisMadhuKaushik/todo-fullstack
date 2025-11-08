import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 5000;
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect()
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//  Add Task
app.post("/tasks", async (req, res) => {
  try {
    const { title, status } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const result = await db.query(
      `INSERT INTO tasks (title, status)
       VALUES ($1, $2)
       RETURNING *`,
      [title, status || "TODO"]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

//  Get All Tasks
app.get("/tasks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks ORDER BY task_id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

//  Delete Task
app.delete("/tasks/:task_id", async (req, res) => {
  try {
    const { task_id } = req.params;
    const result = await db.query(
      "DELETE FROM tasks WHERE task_id = $1 RETURNING *",
      [task_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

//  Update Title
app.patch("/tasks/:task_id/title", async (req, res) => {
  try {
    const { task_id } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const result = await db.query(
      `UPDATE tasks SET title = $1 WHERE task_id = $2 RETURNING *`,
      [title, task_id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating title:", err);
    res.status(500).json({ error: "Failed to update title" });
  }
});

//  Update Status
app.patch("/tasks/:task_id/status", async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status } = req.body;

    const validStatuses = ["TODO", "INPROGRESS", "DONE"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const result = await db.query(
      `UPDATE tasks SET status = $1 WHERE task_id = $2 RETURNING *`,
      [status, task_id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
