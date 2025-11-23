// components/AdaptiveLearning/AdaptiveTaskInterface.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, functions } from '../../firebase';
import { httpsCallable } from 'firebase/functions';

const AdaptiveTaskInterface = ({ studentId, task }) => {
  const [performanceData, setPerformanceData] = useState({
    startTime: new Date(),
    responses: [],
    timeSpent: 0,
    confidenceLevel: 0,
    difficultyPerception: 'appropriate'
  });
  
  const [evaluation, setEvaluation] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleTaskResponse = (responseType, data) => {
    setPerformanceData(prev => ({
      ...prev,
      responses: [...prev.responses, {
        type: responseType,
        data: data,
        timestamp: new Date()
      }],
      timeSpent: Math.floor((new Date() - prev.startTime) / 1000 / 60) // minutes
    }));
  };

  const completeTask = async () => {
    setIsCompleted(true);
    
    try {
      const evaluateTask = httpsCallable(functions, 'evaluateTaskPerformance');
      const result = await evaluateTask({
        taskId: task.taskId,
        performanceData: performanceData
      });
      
      setEvaluation(result.data.evaluation);
      
      // Update student progress
      await updateDoc(doc(db, 'students', studentId), {
        completedTasks: arrayUnion({
          taskId: task.taskId,
          completedAt: new Date(),
          performance: result.data.evaluation.performanceScore
        })
      });
      
    } catch (error) {
      console.error('Error evaluating task:', error);
    }
  };

  const renderTaskContent = () => {
    switch (task.taskType) {
      case 'interactive_quiz':
        return (
          <InteractiveQuiz 
            questions={task.content.questions}
            onResponse={handleTaskResponse}
          />
        );
      case 'practice_problems':
        return (
          <PracticeProblems 
            problems={task.content.problems}
            onResponse={handleTaskResponse}
          />
        );
      case 'concept_exploration':
        return (
          <ConceptExploration 
            concept={task.content.concept}
            resources={task.resources}
            onResponse={handleTaskResponse}
          />
        );
      default:
        return <div>Task type not supported</div>;
    }
  };

  return (
    <div className="adaptive-task-interface">
      <div className="task-header">
        <h3>{task.title_tr}</h3>
        <span className="task-difficulty">{task.adaptiveSettings.initialDifficulty}</span>
        <span className="task-time">{task.estimatedTime} dakika</span>
      </div>
      
      <div className="task-objectives">
        <h4>Öğrenme Hedefleri</h4>
        <ul>
          {task.learningObjectives.map((obj, index) => (
            <li key={index}>{obj}</li>
          ))}
        </ul>
      </div>
      
      <div className="task-content">
        {renderTaskContent()}
      </div>
      
      {!isCompleted ? (
        <div className="task-controls">
          <button 
            className="complete-btn"
            onClick={completeTask}
            disabled={performanceData.responses.length === 0}
          >
            Görevi Tamamla
          </button>
          
          <div className="performance-feedback">
            <label>
              Bu görev ne kadar zordu?
              <select 
                value={performanceData.difficultyPerception}
                onChange={(e) => setPerformanceData(prev => ({
                  ...prev,
                  difficultyPerception: e.target.value
                }))}
              >
                <option value="too_easy">Çok Kolay</option>
                <option value="appropriate">Uygun</option>
                <option value="challenging">Zorlayıcı</option>
                <option value="too_hard">Çok Zor</option>
              </select>
            </label>
          </div>
        </div>
      ) : (
        <div className="task-evaluation">
          <h4>Performans Değerlendirmesi</h4>
          {evaluation && (
            <div className="evaluation-results">
              <div className="performance-score">
                <span className="score">{evaluation.performanceScore}%</span>
                <span className="label">Başarı Puanı</span>
              </div>
              
              <div className="strengths">
                <h5>Güçlü Yönlerin</h5>
                <ul>
                  {evaluation.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div className="improvements">
                <h5>Geliştirilecek Alanlar</h5>
                <ul>
                  {evaluation.improvementAreas.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
              
              {evaluation.followUpTasks && evaluation.followUpTasks.length > 0 && (
                <div className="follow-up-tasks">
                  <h5>Önerilen Takip Çalışmaları</h5>
                  {evaluation.followUpTasks.map((followUp, index) => (
                    <div key={index} className="follow-up-task">
                      <span>{followUp.title}</span>
                      <span>{followUp.estimatedTime}dak</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdaptiveTaskInterface;