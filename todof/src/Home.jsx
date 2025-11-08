import "./App.css";
import React, { useState } from "react";

function Home() {
  const TODO = "PENDING";
  const INPROGRESS = "INPROGRESS";
  const DONE = "DONE";

  const [val, setVal] = useState("");
  const [tasks, setTask] = useState([]);
  const [dragTask, setDragTask] = useState(null);

  function handleChange(event) {
    setVal(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && val.trim() !== "") {
      const obj = {
        title: val,
        status: TODO,
        id: Date.now(),
      };
      setTask((prevTask) => [...prevTask, obj]);
      setVal("");
    }
  }

  function handleDragStart(e, task) {
    setDragTask(task);
  }

  function handleDragNDrop(status) {
    let copyTask = [...tasks];
    copyTask = copyTask.map((item) => {
      if (dragTask.id === item.id) {
        item.status = status;
      }
      return item;
    });
    setTask(copyTask);
    setDragTask(null);
  }

  function handleOnDrop(e) {
    const newStatus = e.currentTarget.getAttribute("data-status");
    if (!dragTask) return;

    if (newStatus === TODO) {
      handleDragNDrop(TODO);
    } else if (newStatus === INPROGRESS) {
      handleDragNDrop(INPROGRESS);
    } else if (newStatus === DONE) {
      handleDragNDrop(DONE);
    }
  }

  function onDragOver(event) {
    event.preventDefault();
  }
  function handleDelete(id) {
    setTask((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  return (
    <div className="App">
      <h1>Task Manager</h1>

      <input
        onChange={handleChange}
        type="text"
        value={val}
        onKeyDown={handleKeyDown}
        placeholder="Add a task and press Enter"
      />

      <div className="board">
        {/* Todo Column */}
        <div
          className="todo"
          data-status={TODO}
          onDrop={handleOnDrop}
          onDragOver={onDragOver}
        >
          <h2 className="todo-col">Todo</h2>
          {tasks.map(
            (task) =>
              task.status === TODO && (
                <div
                  onDragStart={(e) => handleDragStart(e, task)}
                  draggable
                  key={task.id}
                  className="task-item"
                >
                  {task.title}
                  <div className="btns">
                    <span className="btn">✏️</span>
                    <span className="btn" onClick={() => handleDelete(task.id)}>
                      🗑️
                    </span>
                  </div>
                </div>
              )
          )}
        </div>

        {/* In Progress Column */}
        <div
          className="doing"
          data-status={INPROGRESS}
          onDrop={handleOnDrop}
          onDragOver={onDragOver}
        >
          <h2 className="doing-col">In-progress</h2>
          {tasks.map(
            (task) =>
              task.status === INPROGRESS && (
                <div
                  onDragStart={(e) => handleDragStart(e, task)}
                  draggable
                  key={task.id}
                  className="task-item"
                >
                  {task.title}
                  <div className="btns">
                    <span className="btn">✏️</span>
                    <span className="btn" onClick={() => handleDelete(task.id)}>
                      🗑️
                    </span>
                  </div>
                </div>
              )
          )}
        </div>

        {/* Done Column */}
        <div
          className="done"
          data-status={DONE}
          onDrop={handleOnDrop}
          onDragOver={onDragOver}
        >
          <h2 className="done-col">Done</h2>
          {tasks.map(
            (task) =>
              task.status === DONE && (
                <div
                  onDragStart={(e) => handleDragStart(e, task)}
                  draggable
                  key={task.id}
                  className="task-item"
                >
                  {task.title}
                  <div className="btns">
                    <span className="btn">✏️</span>
                    <span className="btn" onClick={() => handleDelete(task.id)}>
                      🗑️
                    </span>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
