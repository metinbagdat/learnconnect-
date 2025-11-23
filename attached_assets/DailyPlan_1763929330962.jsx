// src/components/DailyPlan/DailyPlan.jsx
import React, { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import TaskItem from '../Tasks/TaskItem';
import PerformanceModal from '../Performance/PerformanceModal';
import './DailyPlan.css';

const DailyPlan = () => {
  const { user } = useAuth();
  const [dailyPlan, setDailyPlan] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  const handleTaskComplete = (task) => {
    setSelectedTask(task);
    setShowPerformanceModal(true);
  };

  const submitPerformance = async (performanceData) => {
    try {
      const updatePerformance = httpsCallable(functions, 'updatePerformance');
      await updatePerformance({
        taskId: selectedTask.id,
        taskType: selectedTask.type,
        subject: selectedTask.subject,
        topic: selectedTask.topic,
        performance: performanceData
      });

      setShowPerformanceModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error submitting performance:', error);
    }
  };

  return (
    <div className="daily-plan-page">
      <div className="page-header">
        <h1>Günlük Çalışma Planı</h1>
        <p>AI tarafından kişiselleştirilmiş planınız</p>
      </div>

      <div className="plan-content">
        {dailyPlan ? (
          <div className="tasks-container">
            <div className="tasks-header">
              <h2>Bugünün Görevleri</h2>
              <span className="completion-stats">
                {dailyPlan.completion?.completedTasks || 0} / {dailyPlan.completion?.totalTasks || 0} tamamlandı
              </span>
            </div>

            <div className="tasks-list">
              {dailyPlan.plan?.tasks.map((task, index) => (
                <TaskItem
                  key={index}
                  task={task}
                  index={index}
                  onComplete={() => handleTaskComplete(task)}
                />
              ))}
            </div>

            <div className="plan-summary">
              <h3>Plan Özeti</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Toplam Süre</span>
                  <span className="value">{dailyPlan.plan?.estimatedDuration} dakika</span>
                </div>
                <div className="summary-item">
                  <span className="label">Zorluk Seviyesi</span>
                  <span className="value">{dailyPlan.plan?.difficulty}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Odak Alanları</span>
                  <span className="value">{dailyPlan.plan?.focusAreas?.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-plan">
            <div className="no-plan-content">
              <h2>Planınız Bulunamadı</h2>
              <p>Yeni bir çalışma planı oluşturmak için aşağıdaki butonu kullanın.</p>
              <button className="btn-primary">
                Plan Oluştur
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Performance Modal */}
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

export default DailyPlan;