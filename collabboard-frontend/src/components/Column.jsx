import React from 'react';
import TaskCard from './TaskCard';

const Column = ({ title, tasks }) => {
  return (
    <section className="column-card">
      <div className="column-header">
        <h3>{title}</h3>
        <span className="column-count">{tasks.length}</span>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && <div className="empty-state">No tasks yet</div>}
      </div>
    </section>
  );
};

export default Column;