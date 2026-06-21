const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// CONNECT MONGODB
mongoose
  .connect("mongodb://localhost:27017/todoDb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// ROUTE UTAMA
app.get("/", (req, res) => {
  res.send("Server Express + MongoDB running!");
});

// CREATE task
app.post("/tasks", async (req, res) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json({
      message: "Task berhasil ditambahkan",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ semua task
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE task
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task tidak ditemukan" });
    }

    res.json({
      message: "Task berhasil diupdate",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task tidak ditemukan" });
    }

    res.json({
      message: "Task berhasil dihapus",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});