// Board Container Component - Refined by Yasanga wijethunga 


// Kanban Board Page Component with Dynamic API Fetching

import React, { useState } from 'react';
import Column from './Column';
import { initialTasks } from '../mockData';

const Board = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'To Do',
      priority: priority
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setPriority('Medium');
  };

  const todoTasks = tasks.filter((t) => t.status === 'To Do');
  const doingTasks = tasks.filter((t) => t.status === 'Doing');
  const doneTasks = tasks.filter((t) => t.status === 'Done');

  return (
    <div className="board-wrapper">
      <div className="board-header">
        <div>
          <p className="eyebrow">Project Workspace</p>
          <h2>Team tasks at a glance</h2>
        </div>
        <div className="header-badge">3 active lanes</div>
      </div>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Short description"
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <button type="submit">+ Add Task</button>
      </form>

      <div className="board-columns">
        <Column title="📋 To Do" tasks={todoTasks} />
        <Column title="⚙️ Doing" tasks={doingTasks} />
        <Column title="✅ Done" tasks={doneTasks} />
      </div>
    </div>
  );
};

export default Board;