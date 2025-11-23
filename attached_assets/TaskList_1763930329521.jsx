// src/components/Tasks/TaskList.jsx
import React, { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import PerformanceModal from '../Performance/PerformanceModal';
import './TaskList.css';

const TaskList = ({ tasks }) => {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  const handleTaskComplete = (task) => {
    setSelectedTask(task);
    setShowPerformanceModal(true);
  };

  const submitPerformance = async (performanceData) => {
    try {
      const updatePerformance = httpsCallable(functions, 'updatePerformanceV2');
      await updatePerformance({
        task_id: selectedTask.task_id,
        performance: performanceData,
        subject: selectedTask.subject,
        topic_id: selectedTask.topic_id,
        task_type: selectedTask.task_type
      });

      // Optionally, update local state to mark task as completed
      // We might want to refresh the daily plan data from Firestore instead

      setShowPerformanceModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error submitting performance:', error);
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="no-tasks">
        <p>Bugün için planlanmış görev bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div key={task.task_id || index} className={`task-item priority-${task.priority}`}>
          <div className="task-content">
            <div className="task-header">
              <h4 className="task-subject">{task.subject}</h4>
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
              </span>
            </div>
            <p className="task-topic">
              {task.topic_name_tr} ({task.topic_name_en})
            </p>
            <div className="task-meta">
              <span className="task-duration">⏱️ {task.duration} dakika</span>
              <span className="task-type">{getTaskTypeLabel(task.task_type)}</span>
            </div>
            <div className="task-objectives">
              <ul>
                {task.learning_objectives?.map((objective, idx) => (
                  <li key={idx}>{objective}</li>
                ))}
              </ul>
            </div>
            {task.resources && task.resources.length > 0 && (
              <div className="task-resources">
                <strong>Kaynaklar:</strong> {task.resources.join(', ')}
              </div>
            )}
          </div>
          <div className="task-actions">
            <button
              className="btn-complete"
              onClick={() => handleTaskComplete(task)}
            >
              Tamamla
            </button>
          </div>
        </div>
      ))}

      {showPerformanceModal && (
        <PerformanceModal
          task={selectedTask}
          onSubmit={submitPerformance}
          onClose={() => setShowPerformanceModal(false)}
        />
      )}
    </div>
  );
};

const getTaskTypeLabel = (taskType) => {
  const labels = {
    theory: 'Teori',
    practice: 'Pratik',
    review: 'Tekrar',
    test: 'Test'
  };
  return labels[taskType] || taskType;
};

export default TaskList;