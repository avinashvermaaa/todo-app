import React, { useState, useEffect } from "react";

function Todo() {
  // State to manage input fields for tasks
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("General");
  const [note, setNote] = useState("");

  // State to manage the list of tasks
  const [tasks, setTasks] = useState([]);

  // State to manage filtering, sorting, and dark mode
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [darkMode, setDarkMode] = useState(true); // Dark mode toggle

  // Load tasks and dark mode state from localStorage on initial render
  useEffect(() => {
    // Retrieve saved tasks from localStorage
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);

    // Retrieve dark mode state from localStorage (default is false if not found)
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    setDarkMode(savedDarkMode !== null ? savedDarkMode : false);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save dark mode state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Function to add a new task to the list
  const handleAddTask = () => {
    if (task.trim()) {
      // Create a unique id for each task
      const newTask = {
        id: Date.now(), // Using timestamp as unique id
        text: task,
        priority,
        dueDate,
        category,
        note,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      // Clear the input fields after adding a task
      setTask("");
      setPriority("Low");
      setDueDate("");
      setCategory("General");
      setNote("");
    }
  };

  // Function to delete a task by id
  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // Function to toggle the completion status of a task
  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  // Function to edit the text of a task
  const handleEditTask = (id, newText) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, text: newText } : t
    );
    setTasks(updatedTasks);
  };

  // Filter tasks based on the selected filter option
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true; // Show all tasks
    if (filter === "Completed") return task.completed; // Show only completed tasks
    if (filter === "Pending") return !task.completed; // Show only pending tasks
    return true;
  });

  // Sort tasks based on the selected sorting option
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === "Priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === "Due Date") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0; // No sorting if "None" is selected
  });

  const groupedTasks = sortedTasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {});

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: darkMode ? "#333" : "#f4f4f9", // Background color changes based on dark mode
        color: darkMode ? "#f4f4f9" : "#333", // Text color changes based on dark mode
        minHeight: "100vh",
        position: "relative",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Dark mode toggle button with emoji */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: darkMode ? "#444" : "#ddd",
          border: "none",
          borderRadius: "50%",
          fontSize: "24px",
          padding: "10px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Todo List with Categories, Notes, and Dark Mode
      </h1>

      {/* Input fields for adding tasks */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          value={task}
          placeholder="Enter a new task"
          onChange={(e) => setTask(e.target.value)}
          style={{
            padding: "8px",
            flex: "1 1 auto",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>

        <button
          onClick={handleAddTask}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Task
        </button>
      </div>

      {/* Note input field for the task */}
      <textarea
        placeholder="Add a note for this task"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          height: "50px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Filtering and sorting options */}
      <div style={{ marginBottom: "20px" }}>
        <label>Filter by: </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>

        <label style={{ marginLeft: "10px" }}>Sort by: </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="None">None</option>
          <option value="Priority">Priority</option>
          <option value="Due Date">Due Date</option>
        </select>
      </div>

      {/* Grouped task list by category */}
      {Object.entries(groupedTasks).map(([category, tasks]) => (
        <div key={category} style={{ marginBottom: "20px" }}>
          <h3 style={{ borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
            {category} Tasks
          </h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {tasks.map((t) => (
              <li
                key={t.id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "10px",
                  backgroundColor: darkMode ? "#444" : "#f9f9f9",
                  borderRadius: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => handleToggleComplete(t.id)}
                    style={{ marginRight: "10px" }}
                  />
                  <input
                    type="text"
                    value={t.text}
                    onChange={(e) => handleEditTask(t.id, e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "none",
                      backgroundColor: "transparent",
                      color: darkMode ? "#f4f4f9" : "#333",
                      textDecoration: t.completed ? "line-through" : "none",
                      textDecorationStyle: t.completed ? "dashed" : "none",
                    }}
                  />
                </div>
                <div style={{ fontSize: "14px", marginTop: "5px" }}>
                  <span>Priority: {t.priority}</span> | Due:{" "}
                  {t.dueDate || "None"}
                </div>
                <p style={{ fontSize: "12px", marginTop: "5px" }}>
                  Note: {t.note}
                </p>
                <button
                  onClick={() => handleDeleteTask(t.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "10px",
                    alignSelf: "flex-start",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Todo;

// current best version