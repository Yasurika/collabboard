import React, { useEffect, useMemo, useState } from 'react';
import { fetchTasks, createNewTask, updateTaskStatus, removeTask } from '../services/apiServices';

const defaultColumns = ['To Do', 'Doing', 'Done'];

const teamMembers = [
  { id: 'yk', name: 'Yasurika', initials: 'YK', color: '#667eea' },
  { id: 'sl', name: 'Sajini', initials: 'SL', color: '#f59e0b' },
  { id: 'tm', name: 'Tharindu', initials: 'TM', color: '#10b981' },
  { id: 'nd', name: 'Nadun', initials: 'ND', color: '#ef4444' },
];

const defaultTasks = [
  {
    id: 'task-1',
    title: 'Finalize sprint goals',
    description: 'Confirm the user stories for the next release and align with engineering.',
    status: 'To Do',
    priority: 'High',
    dueDate: 'Aug 20',
    assignee: 'YK',
    assigneeName: 'Yasurika',
    comments: ['Need design approval'],
  },
  {
    id: 'task-2',
    title: 'Refine onboarding flow',
    description: 'Simplify the first-run experience for new team members.',
    status: 'Doing',
    priority: 'Medium',
    dueDate: 'Aug 18',
    assignee: 'SL',
    assigneeName: 'Sajini',
    comments: ['Mockups are ready'],
  },
  {
    id: 'task-3',
    title: 'QA regression check',
    description: 'Verify core routing and task submission flows before launch.',
    status: 'Done',
    priority: 'Low',
    dueDate: 'Aug 12',
    assignee: 'TM',
    assigneeName: 'Tharindu',
    comments: ['All checks passed'],
  },
];

const normalizeTask = (task) => {
  const assignee = teamMembers.find((member) => member.initials === task.assignee || member.name === task.assigneeName) || teamMembers[0];

  return {
    ...task,
    id: String(task.id ?? Date.now()),
    title: task.title || 'Untitled task',
    description: task.description || 'No description yet.',
    status: defaultColumns.includes(task.status) ? task.status : 'To Do',
    priority: ['High', 'Medium', 'Low'].includes(task.priority) ? task.priority : 'Medium',
    dueDate: task.dueDate || 'Aug 20',
    assignee: task.assignee || assignee.initials,
    assigneeName: task.assigneeName || assignee.name,
    comments: Array.isArray(task.comments) && task.comments.length ? task.comments : ['New task created'],
  };
};

const TaskBoard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState('YK');
  const [dueDate, setDueDate] = useState('Aug 20');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [columns, setColumns] = useState(defaultColumns);
  const [newColumnName, setNewColumnName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await fetchTasks();
      const normalizedTasks = (res.data || []).map(normalizeTask);
      setTasks(normalizedTasks.length ? normalizedTasks : defaultTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasks(defaultTasks);
    }
  };

  const filteredTasks = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    const result = tasks.filter((task) => {
      const matchesSearch = !value || task.title.toLowerCase().includes(value);
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });

    return result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(`2026 ${a.dueDate}`) - new Date(`2026 ${b.dueDate}`);
      }

      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }

      const order = { High: 3, Medium: 2, Low: 1 };
      return order[b.priority] - order[a.priority];
    });
  }, [tasks, searchTerm, priorityFilter, sortBy]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedTask = normalizeTask({
      id: Date.now().toString(),
      title,
      description: description || 'No description added yet.',
      status: 'To Do',
      priority,
      dueDate,
      assignee,
      assigneeName: teamMembers.find((member) => member.initials === assignee)?.name || 'Yasurika',
      comments: ['Task created'],
    });

    try {
      const res = await createNewTask({
        title: formattedTask.title,
        description: formattedTask.description,
        status: formattedTask.status,
        priority: formattedTask.priority,
        dueDate: formattedTask.dueDate,
        assignee: formattedTask.assignee,
        assigneeName: formattedTask.assigneeName,
        comments: formattedTask.comments,
      });
      setTasks((currentTasks) => [normalizeTask(res.data), ...currentTasks]);
    } catch (error) {
      console.error('Failed to add task:', error);
      setTasks((currentTasks) => [formattedTask, ...currentTasks]);
    }

    setTitle('');
    setDescription('');
    setPriority('Medium');
    setAssignee('YK');
    setDueDate('Aug 20');
  };

  const handleMoveStatus = async (id, currentStatus) => {
    const currentIndex = columns.indexOf(currentStatus);
    const nextStatus = currentIndex < columns.length - 1 ? columns[currentIndex + 1] : columns[0];

    try {
      const res = await updateTaskStatus(id, { status: nextStatus });
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? normalizeTask({ ...task, ...res.data, status: nextStatus }) : task)),
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? { ...task, status: nextStatus } : task)),
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeTask(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    }
  };

  const moveTaskToColumn = (taskId, targetStatus) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, status: targetStatus } : task)),
    );
  };

  const handleDropOnColumn = async (event, targetStatus) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    moveTaskToColumn(taskId, targetStatus);

    try {
      await updateTaskStatus(taskId, { status: targetStatus });
    } catch (error) {
      console.error('Failed to persist new task position:', error);
    }
  };

  const handleAddColumn = () => {
    const columnName = newColumnName.trim();
    if (!columnName) return;

    if (!columns.includes(columnName)) {
      setColumns((currentColumns) => [...currentColumns, columnName]);
    }

    setNewColumnName('');
  };

  const reorderColumns = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= columns.length) return;

    setColumns((currentColumns) => {
      const updated = [...currentColumns];
      [updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]];
      return updated;
    });
  };

  const handleOpenModal = (task) => {
    setEditingTask({
      ...task,
      commentsText: (task.comments || []).join('\n'),
    });
    setIsModalOpen(true);
  };

  const saveTaskChanges = () => {
    if (!editingTask) return;

    const updatedTask = normalizeTask({
      ...editingTask,
      comments: editingTask.commentsText
        .split('\n')
        .map((comment) => comment.trim())
        .filter(Boolean),
    });

    setTasks((currentTasks) => currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="board-wrapper">
      <div className="board-header">
        <div>
          <p className="eyebrow">Project Workspace</p>
          <h2 className="board-title">Collaborative Task Board</h2>
        </div>

        <button type="button" className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="toolbar-panel">
        <div className="toolbar-group toolbar-grow">
          <label className="toolbar-field search-field">
            <span>Search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search tasks..."
            />
          </label>

          <label className="toolbar-field">
            <span>Filter</span>
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              <option value="all">All priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>

          <label className="toolbar-field">
            <span>Sort</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="priority">Priority</option>
              <option value="dueDate">Due date</option>
              <option value="title">Title</option>
            </select>
          </label>
        </div>

        <div className="toolbar-group">
          <input
            className="column-input"
            type="text"
            value={newColumnName}
            onChange={(event) => setNewColumnName(event.target.value)}
            placeholder="Column name"
          />
          <button type="button" className="task-submit" onClick={handleAddColumn}>
            + Add Column
          </button>
        </div>
      </div>

      <div className="team-presence-panel">
        <div className="presence-header">
          <span>Team online</span>
          <span className="presence-count">{teamMembers.length} members</span>
        </div>

        <div className="presence-list">
          {teamMembers.map((member) => (
            <div key={member.id} className="presence-item" title={member.name}>
              <span className="presence-avatar" style={{ background: member.color }}>
                {member.initials}
              </span>
              <span className="presence-dot" aria-label="online" />
            </div>
          ))}
        </div>
      </div>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          className="task-input task-input-wide"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task name"
        />

        <input
          className="task-input"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Short description"
        />

        <select className="task-input" value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select className="task-input" value={assignee} onChange={(event) => setAssignee(event.target.value)}>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.initials}>
              {member.name}
            </option>
          ))}
        </select>

        <input
          className="task-input"
          type="text"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          placeholder="Due: Aug 20"
        />

        <button type="submit" className="task-submit">
          + Add Task
        </button>
      </form>

      <div className="board-grid">
        {columns.map((column, index) => {
          const columnTasks = filteredTasks.filter((task) => task.status === column);

          return (
            <div
              key={column}
              className="board-column"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDropOnColumn(event, column)}
            >
              <div className="board-column-header">
                <div className="column-title-wrap">
                  <h3>{column}</h3>
                  <span className="column-counter">{columnTasks.length}</span>
                </div>

                <div className="column-tools">
                  <button type="button" onClick={() => reorderColumns(index, -1)} aria-label="Move column left">
                    ←
                  </button>
                  <button type="button" onClick={() => reorderColumns(index, 1)} aria-label="Move column right">
                    →
                  </button>
                </div>
              </div>

              {columnTasks.length === 0 ? (
                <div className="empty-column">Drop task here</div>
              ) : (
                columnTasks.map((task) => (
                  <article
                    key={task.id}
                    className="task-card"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', task.id);
                      setDraggedTaskId(task.id);
                    }}
                    onDragEnd={() => setDraggedTaskId(null)}
                    onClick={() => handleOpenModal(task)}
                  >
                    <div className="task-card-header">
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
                      <span className="due-date">Due: {task.dueDate}</span>
                    </div>

                    <h4 className="task-card-title">{task.title}</h4>
                    <p className="task-card-description">{task.description}</p>

                    <div className="task-card-meta">
                      <div className="assignee-wrap">
                        <span
                          className="assignee-avatar"
                          style={{
                            background: teamMembers.find((member) => member.initials === task.assignee)?.color || '#667eea',
                          }}
                        >
                          {task.assignee || 'YK'}
                        </span>
                        <span>{task.assigneeName || task.assignee || 'Yasurika'}</span>
                      </div>

                      <span className="comment-count">{task.comments.length} comments</span>
                    </div>

                    <div className="task-card-actions">
                      {column !== columns[columns.length - 1] && (
                        <button
                          type="button"
                          className="task-action-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleMoveStatus(task.id, task.status);
                          }}
                        >
                          Move <span>→</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="task-delete-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(task.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && editingTask && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="task-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit task</h3>
              <button type="button" className="close-modal" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>

            <label className="modal-field">
              <span>Title</span>
              <input
                type="text"
                value={editingTask.title}
                onChange={(event) => setEditingTask({ ...editingTask, title: event.target.value })}
              />
            </label>

            <label className="modal-field">
              <span>Description</span>
              <textarea
                value={editingTask.description}
                onChange={(event) => setEditingTask({ ...editingTask, description: event.target.value })}
              />
            </label>

            <div className="modal-grid">
              <label className="modal-field">
                <span>Priority</span>
                <select
                  value={editingTask.priority}
                  onChange={(event) => setEditingTask({ ...editingTask, priority: event.target.value })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>

              <label className="modal-field">
                <span>Due date</span>
                <input
                  type="text"
                  value={editingTask.dueDate}
                  onChange={(event) => setEditingTask({ ...editingTask, dueDate: event.target.value })}
                />
              </label>
            </div>

            <label className="modal-field">
              <span>Comments</span>
              <textarea
                value={editingTask.commentsText}
                onChange={(event) => setEditingTask({ ...editingTask, commentsText: event.target.value })}
              />
            </label>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="task-submit" onClick={saveTaskChanges}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;