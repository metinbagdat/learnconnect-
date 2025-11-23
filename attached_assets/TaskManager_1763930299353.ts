// src/components/StudyMate/TaskManager.tsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { collection, doc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import './TaskManager.css';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'study' | 'assignment' | 'review' | 'exam';
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number;
  actualDuration?: number;
  dueDate?: Date;
  completed: boolean;
  courseId?: string;
  topicId?: string;
  tags: string[];
  subtasks?: Subtask[];
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

const TaskManager: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [view, setView] = useState<'list' | 'board' | 'calendar'>('board');

  useEffect(() => {
    if (!user) return;

    const tasksQuery = query(
      collection(db, 'Tasks'),
      where('userId', '==', user.uid),
      where('archived', '==', false)
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      setTasks(tasksData);
    });

    return unsubscribe;
  }, [user]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    // Update task order in database
    const updates = reorderedTasks.map((task, index) =>
      updateDoc(doc(db, 'Tasks', task.id), { order: index })
    );

    await Promise.all(updates);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask = {
      ...taskData,
      userId: user.uid,
      createdAt: new Date(),
      completed: false,
      order: tasks.length
    };

    await addDoc(collection(db, 'Tasks'), newTask);
  };

  const toggleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    await updateDoc(doc(db, 'Tasks', taskId), {
      completed: !task.completed,
      completedAt: !task.completed ? new Date() : null
    });
  };

  const getFilteredTasks = () => {
    const now = new Date();
    
    switch (filter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'overdue':
        return tasks.filter(task => 
          !task.completed && task.dueDate && task.dueDate < now
        );
      default:
        return tasks;
    }
  };

  const calculateProductivity = () => {
    const completedTasks = tasks.filter(task => task.completed);
    const totalEstimated = tasks.reduce((sum, task) => sum + task.estimatedDuration, 0);
    const totalActual = completedTasks.reduce((sum, task) => sum + (task.actualDuration || 0), 0);
    
    return {
      completionRate: (completedTasks.length / tasks.length) * 100,
      timeEfficiency: totalEstimated > 0 ? (totalActual / totalEstimated) * 100 : 0,
      streak: calculateStreak(tasks)
    };
  };

  return (
    <div className="task-manager">
      <div className="task-header">
        <h2>Görev Yöneticisi</h2>
        <div className="task-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">Tüm Görevler</option>
            <option value="pending">Bekleyenler</option>
            <option value="completed">Tamamlananlar</option>
            <option value="overdue">Süresi Geçenler</option>
          </select>
          
          <div className="view-toggle">
            <button 
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              📋 Liste
            </button>
            <button 
              className={view === 'board' ? 'active' : ''}
              onClick={() => setView('board')}
            >
              🎯 Board
            </button>
            <button 
              className={view === 'calendar' ? 'active' : ''}
              onClick={() => setView('calendar')}
            >
              📅 Takvim
            </button>
          </div>
        </div>
      </div>

      {/* Productivity Stats */}
      <div className="productivity-stats">
        <div className="stat">
          <span className="value">
            {calculateProductivity().completionRate.toFixed(1)}%
          </span>
          <span className="label">Tamamlama</span>
        </div>
        <div className="stat">
          <span className="value">
            {calculateProductivity().timeEfficiency.toFixed(1)}%
          </span>
          <span className="label">Verimlilik</span>
        </div>
        <div className="stat">
          <span className="value">{calculateProductivity().streak}</span>
          <span className="label">Gün Serisi</span>
        </div>
      </div>

      {/* Task View */}
      {view === 'board' ? (
        <TaskBoard 
          tasks={getFilteredTasks()}
          onTaskUpdate={toggleTaskComplete}
        />
      ) : view === 'list' ? (
        <TaskList 
          tasks={getFilteredTasks()}
          onTaskUpdate={toggleTaskComplete}
        />
      ) : (
        <TaskCalendar tasks={getFilteredTasks()} />
      )}

      {/* Add Task Form */}
      <TaskForm onSave={addTask} />
    </div>
  );
};

const TaskBoard: React.FC<{ tasks: Task[], onTaskUpdate: (taskId: string) => void }> = ({ tasks, onTaskUpdate }) => {
  const columns = {
    todo: tasks.filter(task => !task.completed && !task.dueDate),
    upcoming: tasks.filter(task => !task.completed && task.dueDate),
    inProgress: tasks.filter(task => task.actualDuration && !task.completed),
    completed: tasks.filter(task => task.completed)
  };

  return (
    <div className="task-board">
      {Object.entries(columns).map(([status, columnTasks]) => (
        <div key={status} className="board-column">
          <h3>{getColumnTitle(status)}</h3>
          <Droppable droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-column"
              >
                {columnTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`task-card priority-${task.priority}`}
                      >
                        <div className="task-header">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onTaskUpdate(task.id)}
                          />
                          <h4>{task.title}</h4>
                        </div>
                        <p className="task-description">{task.description}</p>
                        <div className="task-meta">
                          <span className={`task-type type-${task.type}`}>
                            {getTaskTypeIcon(task.type)}
                          </span>
                          <span className="task-duration">
                            {task.estimatedDuration}dak
                          </span>
                          {task.dueDate && (
                            <span className="task-due">
                              {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                            </span>
                          )}
                        </div>
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="subtasks">
                            {task.subtasks.map(subtask => (
                              <div key={subtask.id} className="subtask">
                                <input
                                  type="checkbox"
                                  checked={subtask.completed}
                                  readOnly
                                />
                                <span>{subtask.title}</span>
                              </div>
                            ))}
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
        </div>
      ))}
    </div>
  );
};

// Helper functions
const getColumnTitle = (status: string): string => {
  const titles = {
    todo: 'Yapılacaklar',
    upcoming: 'Yaklaşan',
    inProgress: 'Devam Eden',
    completed: 'Tamamlandı'
  };
  return titles[status] || status;
};

const getTaskTypeIcon = (type: string): string => {
  const icons = {
    study: '📚',
    assignment: '📝',
    review: '🔄',
    exam: '📊'
  };
  return icons[type] || '📌';
};

const calculateStreak = (tasks: Task[]): number => {
  // Calculate consecutive days with completed tasks
  const completedDates = tasks
    .filter(task => task.completed)
    .map(task => new Date(task.completedAt).toDateString());
  
  const uniqueDates = [...new Set(completedDates)].sort();
  let streak = 0;
  let currentDate = new Date();
  
  while (uniqueDates.includes(currentDate.toDateString())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
};

export default TaskManager;