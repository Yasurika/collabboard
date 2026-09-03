import React, { useMemo, useState, useEffect } from 'react';
import { fetchTasks, createNewTask, updateTaskStatus, removeTask, fetchUsers } from '../services/apiServices';

const teamColors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316'];

const statusOrder = ['To Do', 'Doing', 'Done'];

const TaskBoard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const currentUserName = user?.name || 'Unknown user';

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState(currentUserName);
  const [assignedUserId, setAssignedUserId] = useState(user?._id || '');

  useEffect(() => {
    if (user?.name) {
      setAssignedTo(user.name);
      setAssignedUserId(user._id || '');
    }
  }, [user]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      const userList = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setUsers(userList);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const memberOptions = useMemo(() => {
    const source = users.length ? users : [{ _id: 'current', name: currentUserName }];
    const list = source.map((member, index) => ({
      id: member._id || member.id || `member-${index}`,
      name: member.name || 'Unknown user',
      color: teamColors[index % teamColors.length],
    }));

    return [{ id: 'current', name: currentUserName, color: '#3b82f6' }, ...list].filter(
      (member, index, arr) => arr.findIndex((item) => item.name === member.name) === index
    );
  }, [users, currentUserName]);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All priorities');
  const [sortBy, setSortBy] = useState('Column name');

  // 1. Fetch Real Tasks from Database
  useEffect(() => {
    loadDatabaseTasks();
  }, []);

  const loadDatabaseTasks = async () => {
    try {
      setLoading(true);
      const res = await fetchTasks();
      const fetchedTasks = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.tasks || [];

      const visibleTasks = fetchedTasks.filter((task) => {
        const assignedToName = (task.assignedToName || task.assignedTo?.name || '').trim();
        const createdByName = (task.createdByName || task.createdBy?.name || '').trim();
        const assignedToId = task.assignedTo?._id || task.assignedTo || '';
        const createdById = task.createdBy?._id || task.createdBy || '';
        const currentUserId = user?._id || '';

        return (
          assignedToName === currentUserName ||
          createdByName === currentUserName ||
          assignedToId === currentUserId ||
          createdById === currentUserId
        );
      });

      setTasks(visibleTasks);
    } catch (err) {
      console.error('Error fetching tasks from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredTasks = useMemo(() => {
    let items = [...tasks];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      items = items.filter(
        (task) =>
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    if (filterPriority !== 'All priorities') {
      items = items.filter((task) => task.priority === filterPriority);
    }

    if (sortBy === 'Priority') {
      const order = { High: 3, Medium: 2, Low: 1 };
      items.sort((a, b) => (order[b.priority] || 0) - (order[a.priority] || 0));
    }

    return items;
  }, [tasks, searchTerm, filterPriority, sortBy]);

  const columns = statusOrder.map((status) => ({
    status,
    tasks: filteredTasks.filter((task) => task.status === status),
  }));

  // 2. Add New Task to Database (Detailed Debugging Alert සහිතයි)
  const handleAddTask = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      const selectedAssignee = memberOptions.find((member) => member.id === assignedUserId) || {
        id: user?._id || '',
        name: assignedTo || currentUserName,
      };

      const payload = {
        title: title.trim(),
        description: description.trim() || 'No description yet.',
        priority,
        status: 'To Do',
        createdByName: currentUserName,
        assignedToId: selectedAssignee.id || user?._id || '',
        assignedToName: selectedAssignee.name || assignedTo || currentUserName,
      };

      const res = await createNewTask(payload);
      const createdTask = res.data?.task || res.data?.data || res.data;

      setTasks((current) => [createdTask, ...current]);

      setTitle('');
      setDescription('');
      setPriority('Medium');
    } catch (err) {
      console.error('Create Task Full Error:', err.response);

      // Backend එකෙන් එන Exact Validation/Auth Error එක Alert කිරීම
      const backendMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        err.message;

      alert(`Error (${err.response?.status || 'Client'}): ${backendMessage}`);
    }
  };

  // 3. Move Task Status in Database
  const handleMoveTask = async (taskId, direction) => {
    const task = tasks.find((t) => (t._id || t.id) === taskId);
    if (!task) return;

    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    const nextStatus = statusOrder[nextIndex];

    if (!nextStatus) return;

    try {
      const res = await updateTaskStatus(taskId, { status: nextStatus });
      const updatedTask = res.data?.task || res.data?.data || res.data;

      setTasks((current) =>
        current.map((t) => ((t._id || t.id) === taskId ? updatedTask : t))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status');
    }
  };

  // 4. Delete Task from Database
  const handleDelete = async (taskId) => {
    try {
      await removeTask(taskId);
      setTasks((current) => current.filter((task) => (task._id || task.id) !== taskId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <div className="dashboard-shell">
      <main className="workspace-panel">
        <div className="workspace-header">
          <div>
            <p className="heading-kicker">Project Workspace</p>
            <h1>Collaborative Task Board</h1>
          </div>

          <button type="button" className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>

        {/* Toolbar */}
        <div className="toolbar-row">
          <div className="toolbar-field search-field">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <div className="toolbar-field inline-field">
              <label>Filter</label>
              <select value={filterPriority} onChange={(event) => setFilterPriority(event.target.value)}>
                <option>All priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="toolbar-field inline-field">
              <label>Sort</label>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option>Column name</option>
                <option>Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Team Panel */}
        <div className="team-panel">
          <div className="team-panel-row">
            <span className="team-label">Team online</span>
            <span className="member-count">{memberOptions.length} members</span>
          </div>

          <div className="team-members-row">
            {memberOptions.map((member) => (
              <div key={member.id} className="member-bubble" style={{ background: member.color }}>
                {member.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Create Task Form */}
        <form className="task-form" onSubmit={handleAddTask}>
          <div className="field-block task-name-field">
            <label>Task name</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="field-block description-field">
            <label>Short description</label>
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short description"
            />
          </div>

          <div className="field-block select-field">
            <label>Priority</label>
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="field-block select-field">
            <label>Assign to</label>
            <select
              value={assignedUserId || assignedTo}
              onChange={(event) => {
                const selectedMember = memberOptions.find((member) => member.id === event.target.value || member.name === event.target.value);
                setAssignedUserId(selectedMember?.id || '');
                setAssignedTo(selectedMember?.name || event.target.value || currentUserName);
              }}
            >
              {memberOptions.map((member) => (
                <option key={member.id || member.name} value={member.id || member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="add-task-button">
            + Add Task
          </button>
        </form>

        {/* Task Columns Grid */}
        <section className="board-grid">
          {loading ? (
            <div style={{ padding: '20px' }}>Loading Database Tasks...</div>
          ) : (
            columns.map((column) => (
              <div className="board-column" key={column.status}>
                <div className="column-header-row">
                  <div className="column-title-wrap">
                    <span className="column-title-prefix">
                      {column.status === 'To Do' ? '☑' : column.status === 'Doing' ? '◔' : '✓'}
                    </span>
                    <h3>{column.status}</h3>
                  </div>
                </div>

                <div className="card-stack">
                  {column.tasks.length === 0 ? (
                    <div className="empty-column">No tasks yet</div>
                  ) : (
                    column.tasks.map((task) => {
                      const taskId = task._id || task.id;
                      return (
                        <article className="task-card" key={taskId}>
                          <div className="task-card-top">
                            <span className={`priority-tag ${(task.priority || 'Medium').toLowerCase()}`}>
                              {task.priority || 'Medium'}
                            </span>
                          </div>

                          <div className="task-card-meta" style={{ marginBottom: '8px', fontSize: '12px', color: '#64748b' }}>
                            Created by: {task.createdByName || task.createdBy?.name || 'Unknown user'}
                          </div>
                          <div className="task-card-meta" style={{ marginBottom: '8px', fontSize: '12px', color: '#334155' }}>
                            Assigned to: {task.assignedToName || task.assignedTo?.name || task.createdByName || currentUserName}
                          </div>

                          <h4>{task.title}</h4>
                          <p>{task.description}</p>

                          <div className="task-card-actions">
                            <button
                              type="button"
                              className="move-button"
                              disabled={task.status === 'Done'}
                              onClick={() => handleMoveTask(taskId, 'forward')}
                            >
                              Move →
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => handleDelete(taskId)}
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default TaskBoard;