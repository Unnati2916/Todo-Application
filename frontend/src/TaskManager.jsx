import React, { useEffect, useState } from "react";
import { FaCheck, FaPencilAlt, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from "./api";
import { notify } from "./utils";

function TaskManager() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [copyTasks, setCopyTasks] = useState([]);
  const [updateTask, setUpdateTask] = useState(null);

  const handleTask = () => {
    if (updateTask && input) {
      const obj = {
        taskName: input,
        isDone: updateTask.isDone,
        _id: updateTask._id,
      };
      handleUpdateItem(obj);
    } else if (!updateTask && input) {
      handleAddTask();
    }
    setInput("");
  };

  useEffect(() => {
    if (updateTask) {
      setInput(updateTask.taskName);
    }
  }, [updateTask]);

  const handleAddTask = async () => {
    const obj = { taskName: input, isDone: false };
    try {
      const { success, message } = await CreateTask(obj);
      notify(message, success ? "success" : "error");
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to create task", "error");
    }
  };

  const fetchAllTasks = async () => {
    try {
      const { data } = await GetAllTasks();
      setTasks(data);
      setCopyTasks(data);
    } catch (err) {
      console.error(err);
      notify("Failed to fetch tasks", "error");
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleDeleteTask = async (id) => {
    try {
      const { success, message } = await DeleteTaskById(id);
      notify(message, success ? "success" : "error");
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to delete task", "error");
    }
  };

  const handleCheckAndUncheck = async (item) => {
    const { _id, isDone, taskName } = item;
    const obj = { taskName, isDone: !isDone };
    try {
      const { success, message } = await UpdateTaskById(_id, obj);
      notify(message, success ? "success" : "error");
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to update task", "error");
    }
  };

  const handleUpdateItem = async (item) => {
    const { _id, isDone, taskName } = item;
    const obj = { taskName, isDone };
    try {
      const { success, message } = await UpdateTaskById(_id, obj);
      notify(message, success ? "success" : "error");
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to update task", "error");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const results = copyTasks.filter((item) =>
      item.taskName.toLowerCase().includes(term)
    );
    setTasks(results);
  };

  return (
    <div className="flex flex-col items-center w-full sm:w-3/4 lg:w-1/2 mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Manager App</h1>

      {/* Input and Search box */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 w-full gap-3">
        {/* Add Task Input */}
        <div className="flex w-full sm:w-1/2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new Task"
          />
          <button
            onClick={handleTask}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-md"
          >
            <FaPlus />
          </button>
        </div>

        {/* Search box */}
        <div className="flex w-full sm:w-1/2 border border-gray-300 rounded-md overflow-hidden">
          <span className="bg-gray-100 px-3 flex items-center text-gray-600">
            <FaSearch />
          </span>
          <input
            onChange={handleSearch}
            className="flex-grow px-3 py-2 focus:outline-none"
            type="text"
            placeholder="Search tasks"
          />
        </div>
      </div>

      {/* List of items */}
      <div className="flex flex-col w-full space-y-3">
        {tasks.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm hover:shadow-md transition"
          >
            <span
              className={`text-lg ${
                item.isDone ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {item.taskName}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCheckAndUncheck(item)}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => setUpdateTask(item)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
              >
                <FaPencilAlt />
              </button>
              <button
                onClick={() => handleDeleteTask(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default TaskManager;
