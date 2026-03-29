import React, { useState, useEffect } from "react";
import "./Todo.css";

const PRIORITY_COLORS = {
  High: { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
  Medium: { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
  Low: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
};

const PRIORITY_COLORS_DARK = {
  High: { bg: "#450a0a", text: "#fca5a5", border: "#7f1d1d" },
  Medium: { bg: "#422006", text: "#fde047", border: "#713f12" },
  Low: { bg: "#052e16", text: "#86efac", border: "#14532d" },
};

const CATEGORY_ICONS = {
  General: "📋",
  Work: "💼",
  Personal: "🙋",
  Urgent: "🚨",
};

function PriorityBadge({ priority, darkMode }) {
  const colors = darkMode ? PRIORITY_COLORS_DARK[priority] : PRIORITY_COLORS[priority];
  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: "9999px",
        padding: "2px 10px",
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {priority}
    </span>
  );
}

function Todo() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("General");
  const [note, setNote] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    setDarkMode(savedDarkMode !== null ? savedDarkMode : false);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleAddTask = () => {
    if (task.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now(), text: task, priority, dueDate, category, note, completed: false },
      ]);
      setTask("");
      setPriority("Low");
      setDueDate("");
      setCategory("General");
      setNote("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  const handleDeleteTask = (id) =>
    setTasks(tasks.filter((t) => t.id !== id));

  const handleToggleComplete = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const handleEditTask = (id, newText) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: newText } : t)));

  const filteredTasks = tasks.filter((t) => {
    if (filter === "Completed") return t.completed;
    if (filter === "Pending") return !t.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "Priority") {
      return { High: 1, Medium: 2, Low: 3 }[a.priority] - { High: 1, Medium: 2, Low: 3 }[b.priority];
    }
    if (sortBy === "Due Date") return new Date(a.dueDate) - new Date(b.dueDate);
    return 0;
  });

  const groupedTasks = sortedTasks.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const dm = darkMode;

  return (
    <div className={`todo-root ${dm ? "dark" : "light"}`}>
      {/* Header */}
      <header className="todo-header">
        <div>
          <h1 className="todo-title">My Tasks</h1>
          <p className="todo-subtitle">
            {completedCount} of {totalTasks} tasks completed
          </p>
          {/* Progress bar */}
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button
          className="dark-toggle"
          onClick={() => setDarkMode(!dm)}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {dm ? "☀️" : "🌙"}
        </button>
      </header>

      {/* Add Task Card */}
      <section className="card add-card">
        <h2 className="section-title">Add New Task</h2>
        <div className="input-row">
          <input
            className="text-input grow"
            type="text"
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <select className="select-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            className="text-input date-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select className="select-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <textarea
          className="text-input note-input"
          placeholder="Add an optional note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
        <button className="btn-primary" onClick={handleAddTask}>
          + Add Task
        </button>
      </section>

      {/* Filters */}
      <section className="card filter-card">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Filter</label>
            <div className="btn-group">
              {["All", "Pending", "Completed"].map((f) => (
                <button
                  key={f}
                  className={`btn-filter ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">Sort by</label>
            <select className="select-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="None">None</option>
              <option value="Priority">Priority</option>
              <option value="Due Date">Due Date</option>
            </select>
          </div>
        </div>
      </section>

      {/* Task Groups */}
      {Object.keys(groupedTasks).length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: "48px" }}>No Task here, add one to view</span>
          {/* <p>No tasks here. Add one above!</p> */}
        </div>
      ) : (
        Object.entries(groupedTasks).map(([cat, catTasks]) => (
          <section key={cat} className="card category-card">
            <h3 className="category-title">
              <span className="category-icon">{CATEGORY_ICONS[cat] || "📁"}</span>
              {cat}
              <span className="category-count">{catTasks.length}</span>
            </h3>
            <ul className="task-list">
              {catTasks.map((t) => (
                <li key={t.id} className={`task-item ${t.completed ? "completed" : ""}`}>
                  <div className="task-main">
                    <button
                      className={`checkbox ${t.completed ? "checked" : ""}`}
                      onClick={() => handleToggleComplete(t.id)}
                      aria-label="Toggle complete"
                    >
                      {t.completed && "✓"}
                    </button>
                    <input
                      className={`task-text-input ${t.completed ? "strikethrough" : ""}`}
                      type="text"
                      value={t.text}
                      onChange={(e) => handleEditTask(t.id, e.target.value)}
                    />
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteTask(t.id)}
                      aria-label="Delete task"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="task-meta">
                    <PriorityBadge priority={t.priority} darkMode={dm} />
                    {t.dueDate && (
                      <span className="due-date">
                        📅 {new Date(t.dueDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                    {t.note && <span className="task-note">"{t.note}"</span>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

export default Todo;