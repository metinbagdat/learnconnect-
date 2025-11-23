// src/components/Course/LessonViewer.tsx
import React from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useLanguage } from '../../hooks/useLanguage';
import './LessonViewer.css';

interface LessonViewerProps {
  lessonId: string;
  onComplete: (lessonId: string) => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lessonId, onComplete }) => {
  const { language } = useLanguage(); // 'tr' or 'en'
  const [lesson, setLesson] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!lessonId) return;

    const unsubscribe = onSnapshot(doc(db, 'Lessons', lessonId), (doc) => {
      if (doc.exists()) {
        setLesson(doc.data());
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [lessonId]);

  if (loading) {
    return <div className="loading">Ders yükleniyor...</div>;
  }

  if (!lesson) {
    return <div className="error">Ders bulunamadı</div>;
  }

  const title = language === 'tr' ? lesson.title_tr : lesson.title_en;
  const content = language === 'tr' ? lesson.content_tr : lesson.content_en;

  return (
    <div className="lesson-viewer">
      <div className="lesson-header">
        <h1>{title}</h1>
        <div className="lesson-stats">
          <span className="reading-time">
            📖 {lesson.reading_time} {language === 'tr' ? 'dakika' : 'minutes'}
          </span>
          <span className="word-count">
            📝 {lesson.word_count} {language === 'tr' ? 'kelime' : 'words'}
          </span>
          <span className="lesson-duration">
            ⏱️ {lesson.duration} {language === 'tr' ? 'dakika' : 'minutes'}
          </span>
        </div>
      </div>

      <div className="lesson-content">
        <div 
          className="content-render"
          dangerouslySetInnerHTML={{ 
            __html: content.replace(/\n/g, '<br>').replace(/#{1,6}\s?(.*?)(?:\n|$)/g, '<h1>$1</h1>')
          }} 
        />
      </div>

      {lesson.resources && lesson.resources.length > 0 && (
        <div className="lesson-resources">
          <h3>{language === 'tr' ? 'Kaynaklar' : 'Resources'}</h3>
          <ul>
            {lesson.resources.map((resource: string, index: number) => (
              <li key={index}>{resource}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="lesson-actions">
        <button 
          className="btn-primary"
          onClick={() => onComplete(lessonId)}
        >
          {language === 'tr' ? 'Dersi Tamamla' : 'Complete Lesson'}
        </button>
      </div>
    </div>
  );
};

export default LessonViewer;