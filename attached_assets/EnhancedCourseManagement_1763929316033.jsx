// src/components/Courses/EnhancedCourseManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar
} from '@mui/material';
import {
  PlayCircle as PlayIcon,
  CheckCircle as CheckIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const EnhancedCourseManagement = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = () => {
    // Load enrollments
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('userId', '==', 'currentUserId')
    );
    const unsubscribeEnrollments = onSnapshot(enrollmentsQuery, (snapshot) => {
      setEnrollments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Load courses
    const coursesQuery = query(
      collection(db, 'courses'),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeCourses = onSnapshot(coursesQuery, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Load student progress
    const progressQuery = query(
      collection(db, 'studentProgress'),
      where('userId', '==', 'currentUserId'),
      orderBy('date', 'desc')
    );
    const unsubscribeProgress = onSnapshot(progressQuery, (snapshot) => {
      setStudentProgress(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeEnrollments();
      unsubscribeCourses();
      unsubscribeProgress();
    };
  };

  const getEnrolledCourses = () => {
    return courses.filter(course => 
      enrollments.some(enrollment => enrollment.courseId === course.id)
    );
  };

  const getRecommendedCourses = () => {
    const enrolledCourseIds = getEnrolledCourses().map(course => course.id);
    return courses
      .filter(course => !enrolledCourseIds.includes(course.id))
      .slice(0, 3);
  };

  const getCourseProgress = (courseId) => {
    const enrollment = enrollments.find(e => e.courseId === courseId);
    return enrollment ? enrollment.progress.overallProgress : 0;
  };

  const getRecentActivity = () => {
    return studentProgress.slice(0, 5);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        🎓 Öğrenci Dashboard'u
      </Typography>

      <Grid container spacing={3}>
        {/* Enrolled Courses */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📚 Kayıtlı Kurslarım
              </Typography>

              {getEnrolledCourses().length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Henüz hiç kursa kayıtlı değilsiniz
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {getEnrolledCourses().map((course) => (
                    <Grid item xs={12} key={course.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar
                              sx={{ width: 60, height: 60 }}
                              src={course.thumbnail}
                            >
                              <BookIcon />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" gutterBottom>
                                {course.title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                {course.description}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Chip 
                                  label={course.level} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                />
                                <Chip 
                                  label={`${course.duration} dk`} 
                                  size="small"
                                />
                                <Chip 
                                  label={`%${getCourseProgress(course.id)}`} 
                                  size="small"
                                  color="success"
                                />
                              </Box>

                              <LinearProgress 
                                variant="determinate" 
                                value={getCourseProgress(course.id)} 
                                sx={{ mb: 1 }}
                              />

                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button 
                                  variant="contained" 
                                  size="small"
                                  startIcon={<PlayIcon />}
                                >
                                  Devam Et
                                </Button>
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                >
                                  Detaylar
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Son Aktivite
              </Typography>
              
              {getRecentActivity().length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Henüz aktivite bulunmuyor
                </Typography>
              ) : (
                <List>
                  {getRecentActivity().map((activity, index) => (
                    <ListItem key={activity.id} divider={index !== getRecentActivity().length - 1}>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {Object.keys(activity.subjects || {}).join(', ')} derslerinde çalışma yaptınız
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption">
                            {new Date(activity.date).toLocaleDateString('tr-TR')} • 
                            {Object.values(activity.subjects || {}).reduce((total, subject) => total + subject.timeStudied, 0)} dakika
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Recommended Courses */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Önerilen Kurslar
              </Typography>
              
              {getRecommendedCourses().length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                  Tüm kurslara kayıtlısınız
                </Typography>
              ) : (
                <Box>
                  {getRecommendedCourses().map((course) => (
                    <Box key={course.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={course.level} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Button variant="outlined" size="small">
                          Kaydol
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Hızlı İstatistikler
              </Typography>
              
              <Box sx={{ spaceY: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Toplam Kurs
                  </Typography>
                  <Typography variant="h4">
                    {getEnrolledCourses().length}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Ortalama İlerleme
                  </Typography>
                  <Typography variant="h4">
                    {getEnrolledCourses().length > 0 
                      ? Math.round(getEnrolledCourses().reduce((total, course) => total + getCourseProgress(course.id), 0) / getEnrolledCourses().length)
                      : 0}%
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Bu Hafta Çalışılan
                  </Typography>
                  <Typography variant="h4">
                    {studentProgress
                      .filter(activity => {
                        const activityDate = new Date(activity.date);
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        return activityDate >= oneWeekAgo;
                      })
                      .reduce((total, activity) => total + 
                        Object.values(activity.subjects || {}).reduce((sum, subject) => sum + subject.timeStudied, 0), 0)} dk
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedCourseManagement;