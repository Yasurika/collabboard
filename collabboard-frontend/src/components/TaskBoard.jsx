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
    <div className="board-wrapper">
      <div className="board-header">
        <h2 className="board-title">Collaborative Task Board</h2>
        <button type="button" className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          className="task-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task name..."
        />
        <button type="submit" className="task-submit">Add Task</button>
      </form>

      <div className="board-grid">
        {['To Do', 'Doing', 'Done'].map(col => (
          <div key={col} className="board-column">
            <h3 className="board-column-header">{col}</h3>

            {tasks.filter(t => t.status === col).length === 0 ? (
              <div className="empty-column"> </div>
            ) : (
              tasks
                .filter(t => t.status === col)
                .map(t => (
                  <div key={t.id} className="task-card">
                    <p className="task-card-title">{t.title}</p>

                    <div className="task-card-actions">
                      {col !== 'Done' && (
                        <button
                          type="button"
                          className="task-action-button"
                          onClick={() => handleMoveStatus(t.id, t.status)}
                        >
                          Move <span>→</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="task-delete-button"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;