// src/components/Course/CoursePlayer.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import CourseTree from './CourseTree';
import LessonViewer from './LessonViewer';
import CourseProgress from './CourseProgress';
import './CoursePlayer.css';

const CoursePlayer = ({ courseId }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !courseId) return;

    // Load course data
    const unsubscribeCourse = onSnapshot(
      doc(db, 'Courses', courseId),
      (doc) => {
        if (doc.exists()) {
          setCourse({ id: doc.id, ...doc.data() });
        }
      }
    );

    // Load enrollment data
    const enrollmentQuery = query(
      collection(db, 'Enrollments'),
      where('user_id', '==', user.uid),
      where('course_id', '==', courseId)
    );

    const unsubscribeEnrollment = onSnapshot(enrollmentQuery, (snapshot) => {
      if (!snapshot.empty) {
        const enrollmentData = snapshot.docs[0].data();
        setEnrollment(enrollmentData);
        
        // Set current lesson from enrollment progress
        if (enrollmentData.progress.currentLesson) {
          setCurrentLesson(enrollmentData.progress.currentLesson);
        }
        
        setLoading(false);
      }
    });

    return () => {
      unsubscribeCourse();
      unsubscribeEnrollment();
    };
  }, [user, courseId]);

  const markLessonComplete = async (lessonId) => {
    if (!enrollment) return;

    const enrollmentRef = doc(db, 'Enrollments', enrollment.id);
    const updatedCompletedLessons = [...enrollment.progress.completed_lessons, lessonId];
    
    // Calculate new progress
    const totalLessons = course.modules.reduce((total, module) => 
      total + module.lessons.length, 0
    );
    const newProgress = (updatedCompletedLessons.length / totalLessons) * 100;

    await updateDoc(enrollmentRef, {
      'progress.completed_lessons': updatedCompletedLessons,
      'progress.overall_progress': newProgress,
      'progress.last_accessed': new Date()
    });
  };

  const navigateToLesson = (moduleId, lessonId) => {
    setCurrentModule(moduleId);
    setCurrentLesson(lessonId);

    // Update current progress
    if (enrollment) {
      const enrollmentRef = doc(db, 'Enrollments', enrollment.id);
      updateDoc(enrollmentRef, {
        'progress.current_module': moduleId,
        'progress.current_lesson': lessonId,
        'progress.last_accessed': new Date()
      });
    }
  };

  if (loading) {
    return <div className="loading">Kurs yükleniyor...</div>;
  }

  if (!course) {
    return <div className="error">Kurs bulunamadı</div>;
  }

  return (
    <div className="course-player">
      <div className="player-header">
        <h1>{course.title}</h1>
        <CourseProgress 
          progress={enrollment?.progress.overall_progress || 0}
          totalLessons={course.modules.reduce((total, module) => 
            total + module.lessons.length, 0
          )}
          completedLessons={enrollment?.progress.completed_lessons.length || 0}
        />
      </div>

      <div className="player-content">
        <div className="sidebar">
          <CourseTree
            course={course}
            enrollment={enrollment}
            currentLesson={currentLesson}
            onLessonSelect={navigateToLesson}
          />
        </div>

        <div className="main-content">
          {currentLesson ? (
            <LessonViewer
              course={course}
              lessonId={currentLesson}
              onComplete={markLessonComplete}
              onNextLesson={() => {/* Navigate to next lesson */}}
              onPreviousLesson={() => {/* Navigate to previous lesson */}}
            />
          ) : (
            <div className="welcome-screen">
              <h2>Kursa Hoş Geldiniz!</h2>
              <p>Başlamak için soldaki menüden bir ders seçin.</p>
              <div className="course-overview">
                <h3>Kurs İçeriği</h3>
                <ul>
                  {course.modules.map(module => (
                    <li key={module.module_id}>
                      <strong>{module.title}</strong> - {module.lessons.length} ders
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;