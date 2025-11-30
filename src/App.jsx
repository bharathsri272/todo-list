import { useState, useEffect } from "react";
import "./App.css";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  return (
    <div className="wrapper">
      <div className="app">
        <div className="title-row">
          <h1>To-Do List</h1>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <div className="input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a new task..."
          />
          <button onClick={addTask}>Add</button>
        </div>

        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        className={task.completed ? "completed" : ""}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        {/* DRAG HANDLE */}
                        <span
                          className="drag-handle"
                          {...provided.dragHandleProps}
                        >
                          ⋮⋮
                        </span>

                        {/* TASK TEXT */}
                        <span className="task-text" onClick={() => toggleTask(task.id)}>
                          {task.text}
                        </span>

                        {/* DELETE BUTTON */}
                        <button
                          className="delete-btn"
                          onClick={() => deleteTask(task.id)}
                        >
                          ✕
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
