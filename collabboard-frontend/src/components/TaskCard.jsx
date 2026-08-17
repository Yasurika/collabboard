// Task Card Component - Developed by WAPA Wickramasinghe
import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <article className={`task-card ${task.priority.toLowerCase()}`}>
      <div className="task-card-top">
        <h4>{task.title}</h4>
        <span className={`priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>
      <p>{task.description}</p>
      <div className="task-card-footer">
        <span className="task-meta">Collaborative</span>
        <span className="task-meta">Today</span>
      </div>
    </article>
  );
};

export default TaskCard;