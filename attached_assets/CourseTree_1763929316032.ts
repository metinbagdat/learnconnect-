// src/components/Course/CourseTree.tsx
import React from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import './CourseTree.css';

interface CourseTreeProps {
  courseId: string;
  onLessonSelect: (lessonId: string) => void;
}

const CourseTree: React.FC<CourseTreeProps> = ({ courseId, onLessonSelect }) => {
  const { user } = useAuth();
  const [modules, setModules] = React.useState<any[]>([]);
  const [lessons, setLessons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!courseId) return;

    // Fetch modules for this course
    const modulesQuery = query(
      collection(db, 'Modules'),
      where('course_id', '==', courseId)
    );

    const unsubscribeModules = onSnapshot(modulesQuery, (snapshot) => {
      const modulesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setModules(modulesData.sort((a, b) => a.order - b.order));
    });

    // Fetch lessons for this course
    const lessonsQuery = query(
      collection(db, 'Lessons'),
      where('course_id', '==', courseId)
    );

    const unsubscribeLessons = onSnapshot(lessonsQuery, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLessons(lessonsData);
      setLoading(false);
    });

    return () => {
      unsubscribeModules();
      unsubscribeLessons();
    };
  }, [courseId]);

  const getLessonsForModule = (moduleId: string) => {
    return lessons
      .filter(lesson => lesson.module_id === moduleId)
      .sort((a, b) => a.order - b.order);
  };

  if (loading) {
    return <div className="loading">Dersler yükleniyor...</div>;
  }

  return (
    <div className="course-tree">
      <h3>Kurs İçeriği</h3>
      
      {modules.map(module => (
        <div key={module.id} className="module-section">
          <div className="module-header">
            <h4>{module.title_tr}</h4>
            <span className="module-duration">
              {module.estimated_duration} dakika
            </span>
          </div>
          
          <div className="module-description">
            {module.description_tr}
          </div>

          <div className="lessons-list">
            {getLessonsForModule(module.id).map(lesson => (
              <div 
                key={lesson.id} 
                className={`lesson-item ${lesson.is_free ? 'free' : 'premium'}`}
                onClick={() => onLessonSelect(lesson.id)}
              >
                <div className="lesson-info">
                  <h5>{lesson.title_tr}</h5>
                  <div className="lesson-meta">
                    <span className="lesson-type">{lesson.content_type}</span>
                    <span className="lesson-duration">{lesson.duration}d</span>
                    <span className="reading-time">
                      📖 {lesson.reading_time} dk • {lesson.word_count} kelime
                    </span>
                    {lesson.is_free && <span className="free-badge">Ücretsiz</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseTree;