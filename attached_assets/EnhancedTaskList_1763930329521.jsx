// src/components/Tasks/EnhancedTaskList.jsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, functions } from '../../firebase';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '../../contexts/AuthContext';
import './EnhancedTaskList.css';

const EnhancedTaskList = ({ tasks, planId, onTaskUpdate }) => {
  const { user } = useAuth();
  const [editingTask, setEditingTask] = useState(null);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [reorderedItem] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, reorderedItem);

    // Update task order in Firestore
    try {
      const planRef = doc(db, 'AIEngine/DailyPlans', planId);
      await updateDoc(planRef, {
        'plan.tasks': reorderedTasks
      });
      onTaskUpdate(reorderedTasks);
    } catch (error) {
      console.error('Error reordering tasks:', error);
    }
  };

  const markTaskComplete = async (taskId, taskData) => {
    try {
      const updatePerformance = httpsCallable(functions, 'updatePerformanceV2');
      
      // Open performance modal instead of immediately marking complete
      onTaskUpdate(tasks.map(task => 
        task.task_id === taskId 
          ? { ...task, status: 'in_progress' }
          : task
      ));
      
    } catch (error) {
      console.error('Error marking task complete:', error);
    }
  };

  const updateTaskTime = async (taskId, newDuration) => {
    try {
      const planRef = doc(db, 'AIEngine/DailyPlans', planId);
      const updatedTasks = tasks.map(task =>
        task.task_id === taskId
          ? { ...task, duration: newDuration }
          : task
      );
      
      await updateDoc(planRef, {
        'plan.tasks': updatedTasks
      });
      onTaskUpdate(updatedTasks);
    } catch (error) {
      console.error('Error updating task time:', error);
    }
  };

  return (
    <div className="enhanced-task-list">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="tasks-container"
            >
              {tasks.map((task, index) => (
                <Draggable
                  key={task.task_id}
                  draggableId={task.task_id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`task-item ${snapshot.isDragging ? 'dragging' : ''} priority-${task.priority}`}
                    >
                      <div className="task-content">
                        <div className="task-header">
                          <div className="subject-badge">
                            {getSubjectIcon(task.subject)}
                            <span>{task.subject}</span>
                          </div>
                          <div className="task-meta">
                            <span className={`priority-tag priority-${task.priority}`}>
                              {getPriorityLabel(task.priority)}
                            </span>
                            <span className="task-type">{getTaskTypeLabel(task.task_type)}</span>
                          </div>
                        </div>

                        <div className="task-body">
                          <h4 className="task-title">
                            {task.topic_name_tr}
                            {task.topic_name_en && (
                              <small>({task.topic_name_en})</small>
                            )}
                          </h4>
                          
                          <p className="task-objectives">
                            {task.learning_objectives?.[0]}
                          </p>

                          <div className="task-resources">
                            {task.resources?.map((resource, idx) => (
                              <span key={idx} className="resource-tag">
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="task-footer">
                          <div className="time-controls">
                            <span className="duration-label">Süre:</span>
                            <select
                              value={task.duration}
                              onChange={(e) => updateTaskTime(task.task_id, parseInt(e.target.value))}
                              className="duration-select"
                            >
                              {[15, 30, 45, 60, 75, 90].map(mins => (
                                <option key={mins} value={mins}>
                                  {mins} dakika
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="task-actions">
                            <button
                              className={`action-btn complete-btn ${task.status === 'completed' ? 'completed' : ''}`}
                              onClick={() => markTaskComplete(task.task_id, task)}
                            >
                              {task.status === 'completed' ? '✅ Tamamlandı' : 'Tamamla'}
                            </button>
                            
                            <button
                              className="action-btn edit-btn"
                              onClick={() => setEditingTask(task)}
                            >
                              ✏️
                            </button>
                          </div>
                        </div>
                      </div>

                      {task.status === 'completed' && (
                        <div className="completion-overlay">
                          <span>Tamamlandı</span>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Task Statistics */}
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-label">Toplam Görev</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {tasks.filter(t => t.status === 'completed').length}
          </span>
          <span className="stat-label">Tamamlandı</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {tasks.reduce((sum, task) => sum + task.duration, 0)} dk
          </span>
          <span className="stat-label">Toplam Süre</span>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getSubjectIcon = (subject) => {
  const icons = {
    'Turkish': '📚',
    'Mathematics': '🔢',
    'Science': '🔬',
    'SocialStudies': '🌍'
  };
  return icons[subject] || '📝';
};

const getPriorityLabel = (priority) => {
  const labels = {
    'high': 'Yüksek',
    'medium': 'Orta',
    'low': 'Düşük'
  };
  return labels[priority] || priority;
};

const getTaskTypeLabel = (taskType) => {
  const labels = {
    'theory': 'Teori',
    'practice': 'Pratik',
    'review': 'Tekrar',
    'test': 'Test'
  };
  return labels[taskType] || taskType;
};

export default EnhancedTaskList;