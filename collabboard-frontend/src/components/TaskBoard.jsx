import React, { useEffect, useState } from 'react';
import { fetchTasks, createNewTask, updateTaskStatus, removeTask } from '../services/apiServices';

const TaskBoard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await fetchTasks();
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await createNewTask({ title, status: 'To Do', priority: 'Medium' });
      setTasks([...tasks, res.data]);
      setTitle('');
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleMoveStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'To Do' ? 'Doing' : 'Done';
    try {
      const res = await updateTaskStatus(id, { status: nextStatus });
      setTasks(tasks.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Collaborative Task Board</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="New task name..." 
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Task Columns */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {['To Do', 'Doing', 'Done'].map(col => (
          <div key={col} style={{ flex: 1, border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <h4>{col}</h4>
            {tasks.filter(t => t.status === col).map(t => (
              <div key={t.id} style={{ background: '#f4f4f4', padding: '10px', margin: '8px 0', borderRadius: '4px' }}>
                <p><strong>{t.title}</strong></p>
                {col !== 'Done' && (
                  <button onClick={() => handleMoveStatus(t.id, t.status)}>Move ➔</button>
                )}
                <button onClick={() => handleDelete(t.id)} style={{ marginLeft: '5px' }}>Delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;