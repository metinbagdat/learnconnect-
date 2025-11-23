// src/components/Planner/StudyPlanner.jsx
import React, { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useEnrollment } from '../../hooks/useEnrollment';
import EnhancedTaskList from './EnhancedTaskList';
import ProgressOverview from './ProgressOverview';
import './StudyPlanner.css';

const StudyPlanner = () => {
  const { user } = useAuth();
  const { enrolledCourses, courseProgress } = useEnrollment(user?.uid);
  const [dailyPlan, setDailyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const generateStudyPlan = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const generatePlan = httpsCallable(functions, 'generateEnhancedStudyPlan');
      const result = await generatePlan({
        date: selectedDate,
        includeCourses: true
      });

      setDailyPlan(result.data.plan);
    } catch (error) {
      console.error('Error generating study plan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && enrolledCourses.length > 0) {
      generateStudyPlan();
    }
  }, [user, selectedDate, enrolledCourses.length]);

  const calculateCoursePriorities = () => {
    return enrolledCourses.map(course => {
      const progress = courseProgress[course.id] || 0;
      const upcomingExams = getUpcomingExams(course);
      const timeUntilDeadline = calculateTimeUntilDeadline(course);
      
      return {
        courseId: course.id,
        priority: calculatePriority(progress, upcomingExams, timeUntilDeadline),
        progress: progress,
        upcomingExams: upcomingExams.length
      };
    }).sort((a, b) => b.priority - a.priority);
  };

  if (!user) {
    return <div>Lütfen giriş yapın</div>;
  }

  return (
    <div className="study-planner">
      <div className="planner-header">
        <h1>Çalışma Planlayıcı</h1>
        <div className="planner-controls">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button 
            className="btn-primary"
            onClick={generateStudyPlan}
            disabled={loading}
          >
            {loading ? 'Oluşturuluyor...' : 'Yeni Plan Oluştur'}
          </button>
        </div>
      </div>

      <div className="planner-content">
        <div className="left-panel">
          {dailyPlan ? (
            <>
              <div className="plan-overview">
                <h2>{new Date(selectedDate).toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</h2>
                <div className="plan-stats">
                  <span>{dailyPlan.tasks.length} görev</span>
                  <span>{dailyPlan.estimated_duration} dakika</span>
                  <span className={`difficulty-${dailyPlan.difficulty_level}`}>
                    {dailyPlan.difficulty_level}
                  </span>
                </div>
              </div>

              <EnhancedTaskList
                tasks={dailyPlan.tasks}
                onTaskUpdate={(updatedTasks) => {
                  setDailyPlan(prev => ({...prev, tasks: updatedTasks}));
                }}
              />
            </>
          ) : (
            <div className="no-plan">
              <h3>Planınız Bulunamadı</h3>
              <p>AI tarafından kişiselleştirilmiş bir çalışma planı oluşturun.</p>
              <button 
                className="btn-primary"
                onClick={generateStudyPlan}
                disabled={loading}
              >
                Plan Oluştur
              </button>
            </div>
          )}
        </div>

        <div className="right-panel">
          <ProgressOverview
            enrolledCourses={enrolledCourses}
            courseProgress={courseProgress}
            priorities={calculateCoursePriorities()}
          />
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;