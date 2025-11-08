import "./App.css";
import React, { useEffect, useState } from "react";

function Home() {
  const TODO = "TODO";
  const INPROGRESS = "INPROGRESS";
  const DONE = "DONE";

  const [val, setVal] = useState("");
  const [tasks, setTasks] = useState([]);
  const [dragTask, setDragTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BASE_URL = "http://localhost:5000"; // ✅ Correct backend port

  // ✅ Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`);
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to fetch tasks");
        return;
      }
      setTasks(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching tasks!");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add new task
  async function handleKeyDown(event) {
    if (event.key === "Enter" && val.trim() !== "") {
      try {
        const response = await fetch(`${BASE_URL}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: val.trim(),
            status: TODO,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Failed to add task");
          return;
        }
        setSuccess("Task added successfully!");
        setVal("");
        fetchTasks();
      } catch (err) {
        console.error(err);
        setError("Something went wrong while adding task!");
      }
    }
  }

  // ✅ Edit task
  function handleEditClick(task) {
    setCurrentTask(task);
    setNewTitle(task.title);
    setIsModalOpen(true);
  }

  async function handleUpdate() {
    if (!currentTask) return;
    try {
      const response = await fetch(
        `${BASE_URL}/tasks/${currentTask.task_id}/title`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to update");
        return;
      }
      setTasks((prev) =>
        prev.map((task) =>
          task.task_id === currentTask.task_id ? { ...task, title: newTitle } : task
        )
      );
      setIsModalOpen(false);
      alert("Task updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating task!");
    }
  }

  // ✅ Delete task
  async function handleDelete(task_id) {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to delete task");
        return;
      }
      setTasks((prev) => prev.filter((task) => task.task_id !== task_id));
      alert("Task deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting task!");
    }
  }

  // ✅ Drag-and-drop
  function handleDragStart(e, task) {
    setDragTask(task);
  }

  async function handleDragNDrop(status) {
    try {
      const response = await fetch(
        `${BASE_URL}/tasks/${dragTask.task_id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to update status");
        return;
      }

      setTasks((prev) =>
        prev.map((t) =>
          t.task_id === dragTask.task_id ? { ...t, status } : t
        )
      );
      setDragTask(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating status!");
    }
  }

  function handleOnDrop(e) {
    const newStatus = e.currentTarget.getAttribute("data-status");
    if (!dragTask) return;
    handleDragNDrop(newStatus);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="App">
      <h1>Task Manager</h1>

      <input
        onChange={(e) => setVal(e.target.value)}
        type="text"
        value={val}
        onKeyDown={handleKeyDown}
        placeholder="Add a task and press Enter"
      />

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit Task</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="board">
        {/* TODO */}
        <div
          className="todo"
          data-status={TODO}
          onDrop={handleOnDrop}
          onDragOver={onDragOver}
        >
          <h2>Todo</h2>
          {tasks
            .filter((task) => task.status === TODO)
            .map((task) => (
              <div
                key={task.task_id}
                className="task-item"
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
              >
                {task.title}
                <div className="btns">
                  <span className="btn" onClick={() => handleEditClick(task)}>✏️</span>
                  <span className="btn" onClick={() => handleDelete(task.task_id)}>🗑️</span>
                </div>
              </div>
            ))}
        </div>

        {/* IN PROGRESS */}
        <div
          className="doing"
          data-status={INPROGRESS}
          onDrop={handleOnDrop}
          onDragOver={onDragOver}
        >
          <h2>In Progress</h2>
          {tasks
            .filter((task) => task.status === INPROGRESS)
            .map((task) => (
              <div
                key={task.task_id}
                className="task-item"
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
              >
                {task.title}
                <div className="btns">
                  <span className="btn" onClick={() => handleEditClick(task)}>✏️</span>
                  <span className="btn" onClick={() => handleDelete(task.task_id)}>🗑️</span>
                </div>
              </div>
            ))}
        </div>

        {/* DONE */}
        <div
          className="done"
          data-status={DONE}
          onDrop={handleOnDrop}
          onDragOver={onDragOver}
        >
          <h2>Done</h2>
          {tasks
            .filter((task) => task.status === DONE)
            .map((task) => (
              <div
                key={task.task_id}
                className="task-item"
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
              >
                {task.title}
                <div className="btns">
                  <span className="btn" onClick={() => handleEditClick(task)}>✏️</span>
                  <span className="btn" onClick={() => handleDelete(task.task_id)}>🗑️</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
