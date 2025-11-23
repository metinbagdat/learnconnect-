import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../config/firebase';
import { CertificateService } from '../models/Certificate';
import { ForumService } from '../models/Forum';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showCertificateOption, setShowCertificateOption] = useState(false);

  useEffect(() => {
    loadCourseData();
    checkCertificateEligibility();
  }, [courseId]);

  const loadCourseData = async () => {
    const courseDoc = await firestore.collection('courses').doc(courseId).get();
    setCourse(courseDoc.data());
  };

  const checkCertificateEligibility = async () => {
    // Check if user has completed course requirements
    const progressDoc = await firestore.collection('userProgress')
      .where('userId', '==', currentUser.uid)
      .where('courseId', '==', courseId)
      .get();

    if (!progressDoc.empty) {
      const userProgress = progressDoc.docs[0].data();
      setShowCertificateOption(userProgress.certificateEligible);
      setProgress(userProgress.totalProgress);
    }
  };

  const handleLessonComplete = async (lessonId) => {
    // Update progress in Firestore
    await firestore.collection('userProgress').doc(`${currentUser.uid}_${courseId}`).update({
      completedLessons: firestore.FieldValue.arrayUnion(lessonId),
      totalProgress: calculateNewProgress(),
      lastAccessed: new Date()
    });

    // Check if course is completed
    if (progress >= 100) {
      await firestore.collection('userProgress').doc(`${currentUser.uid}_${courseId}`).update({
        certificateEligible: true
      });
      setShowCertificateOption(true);
    }
  };

  const generateCertificate = async () => {
    try {
      const certificate = await CertificateService.generateCertificate(currentUser.uid, courseId);
      navigate(`/certificates/${certificate.certificateId}`);
    } catch (error) {
      console.error('Certificate generation failed:', error);
    }
  };

  const navigateToForum = () => {
    navigate('/forum', { state: { courseId } });
  };

  return (
    <div className="course-player">
      <div className="player-header">
        <h1>{course?.title}</h1>
        <div className="player-actions">
          <button onClick={navigateToForum} className="btn-forum">
            Course Forum
          </button>
          {showCertificateOption && (
            <button onClick={generateCertificate} className="btn-certificate">
              Get Certificate
            </button>
          )}
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}>
          {progress}%
        </div>
      </div>

      <div className="lesson-content">
        {/* Lesson content rendering */}
      </div>

      <div className="player-footer">
        <button 
          onClick={() => handleLessonComplete(currentLesson)}
          className="btn-complete"
        >
          Mark Complete
        </button>
      </div>
    </div>
  );
};

export default CoursePlayer;