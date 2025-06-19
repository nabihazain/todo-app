import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };

function Header({ darkMode, setDarkMode, filter, setFilter }) {
  return (
    <div className="header">
      <div className="theme-toggle">
        <button onClick={() => setDarkMode(!darkMode)}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} /> {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
      <h1>Todo List</h1>
      <div className="filter-group">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>
    </div>
  );
}

function App() {
  let [todolist, setTodoList] = useState([]);
  let [editingIndex, setEditingIndex] = useState(null);
  let [editValue, setEditValue] = useState("");
  let [darkMode, setDarkMode] = useState("");
  let [priority, setPriority] = useState("Medium");
  let [filter, setFilter] = useState("all");

  let saveTodoList = (event) => {
    event.preventDefault();
    let todotask = event.target.todotask.value.trim();
    let taskPriority = event.target.priority.value;
    if (!todotask) return;
    if (!todolist.some(todo => todo.text === todotask)) {
      let finalTodoList = [
        ...todolist,
        { text: todotask, checked: false, priority: taskPriority }
      ];
      setTodoList(finalTodoList);
      event.target.reset();
      setPriority("Medium");
    } else {
      alert("Task already exists");
    }
  };

  // Filter tasks
  let filteredList = todolist.filter(todo => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.checked;
    if (filter === "completed") return todo.checked;
    return true;
  });

  // Sort by priority: High → Medium → Low
  let sortedList = [...filteredList].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );

  let list = sortedList.map((todo, index) => {
    return todoListItems(
      todo,
      index,
      sortedList,
      setTodoList,
      editingIndex,
      setEditingIndex,
      editValue,
      setEditValue
    );
  });

  return (
    <div className={`App${darkMode ? " dark" : ""}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} filter={filter} setFilter={setFilter} />
      <form onSubmit={saveTodoList}>
        <input type="text" name='todotask' placeholder="Add a new task..." />
        <select
          name="priority"
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <button>Add Task</button>
      </form>
      <div className="outerdiv">
        <ul>
          {list}
        </ul>
      </div>
    </div>
  );
}

export default App;

function todoListItems(
  todo,
  indexNumber,
  todolist,
  setTodoList,
  editingIndex,
  setEditingIndex,
  editValue,
  setEditValue
) {
  let deleteTask = (e) => {
    e.stopPropagation();
    let finalList = todolist.filter((_, i) => i !== indexNumber);
    setTodoList(finalList);
    if (editingIndex === indexNumber) setEditingIndex(null);
  };

  let toggleChecked = () => {
    let updatedList = todolist.map((item, i) =>
      i === indexNumber ? { ...item, checked: !item.checked } : item
    );
    setTodoList(updatedList);
  };

  let startEdit = () => {
    setEditingIndex(indexNumber);
    setEditValue(todo.text);
  };

  let saveEdit = () => {
    if (!editValue.trim()) return;
    let updatedList = todolist.map((item, i) =>
      i === indexNumber ? { ...item, text: editValue } : item
    );
    setTodoList(updatedList);
    setEditingIndex(null);
  };

  let cancelEdit = () => {
    setEditingIndex(null);
  };

  // Show priority badge
  const priorityColors = {
    High: "#ff4d4f",
    Medium: "#faad14",
    Low: "#52c41a"
  };

  return (
    <li key={indexNumber} className={todo.checked ? "checked" : ""}>
      <span className="task-main">
        <input
          type="checkbox"
          checked={todo.checked}
          onChange={toggleChecked}
          disabled={editingIndex === indexNumber}
          style={{ marginRight: "8px" }}
        />
        {editingIndex === indexNumber ? (
          <>
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              style={{ marginRight: "8px" }}
            />
            <button onClick={saveEdit} style={{ marginRight: "4px" }}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <span className="task-content">{todo.text}</span>
            <span
              className="priority-badge"
              style={{
                background: priorityColors[todo.priority],
                marginLeft: 10
              }}
            >
              {todo.priority}
            </span>
          </>
        )}
      </span>
      <span className="task-icons">
        {editingIndex !== indexNumber && (
          <span onClick={startEdit} style={{ cursor: "pointer" }}>
            <FontAwesomeIcon icon={faEdit} />
          </span>
        )}
        <span onClick={deleteTask} style={{ cursor: "pointer" }}>
          <FontAwesomeIcon icon={faTrash} />
        </span>
      </span>
    </li>
  );
}