import React from 'react';

const CourseTree = ({ course, enrollment, onSelectLesson }) => {
  const { modules } = course;
  const { completedLessons } = enrollment.progress;

  return (
    <div className="course-tree">
      {modules.map(module => (
        <div key={module.moduleId} className="module">
          <h4>{module.title}</h4>
          <ul>
            {module.lessons.map(lesson => (
              <li key={lesson.lessonId} className={completedLessons.includes(lesson.lessonId) ? 'completed' : ''}>
                <button onClick={() => onSelectLesson(lesson)}>
                  {lesson.title} {completedLessons.includes(lesson.lessonId) ? '✓' : ''}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CourseTree;