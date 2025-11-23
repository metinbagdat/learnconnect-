// src/components/Calendar/ExamCalendar.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Event as EventIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { format, isToday, isTomorrow, parseISO, isAfter, isBefore } from 'date-fns';
import { tr } from 'date-fns/locale';

const ExamCalendar = () => {
  const [exams, setExams] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedExam, setSelectedExam] = useState(null);
  const [calendarView, setCalendarView] = useState('month'); // month, week, day

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = () => {
    const q = query(
      collection(db, 'exams'),
      where('userId', '==', 'currentUserId')
    );
    
    return onSnapshot(q, (snapshot) => {
      const examsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExams(examsData);
    });
  };

  const getExamsForDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return exams.filter(exam => exam.date === dateString);
  };

  const getUpcomingExams = () => {
    const today = new Date();
    return exams
      .filter(exam => isAfter(parseISO(exam.date), today))
      .sort((a, b) => parseISO(a.date) - parseISO(b.date))
      .slice(0, 5);
  };

  const getUrgentExams = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return exams.filter(exam => {
      const examDate = parseISO(exam.date);
      return isAfter(examDate, today) && isBefore(examDate, nextWeek);
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add next month's days
    const totalCells = 42; // 6 weeks
    while (days.length < totalCells) {
      const nextMonthDay = days.length - firstDayOfWeek + 1;
      days.push(new Date(year, month + 1, nextMonthDay));
    }

    return days;
  };

  const CalendarDay = ({ date }) => {
    const dayExams = getExamsForDate(date);
    const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
    
    return (
      <Paper
        sx={{
          p: 1,
          minHeight: 120,
          bgcolor: isToday(date) ? 'primary.50' : 'background.paper',
          border: isToday(date) ? 2 : 1,
          borderColor: isToday(date) ? 'primary.main' : 'divider',
          opacity: isCurrentMonth ? 1 : 0.5,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
        onClick={() => setSelectedDate(date)}
      >
        <Typography 
          variant="body2" 
          align="center"
          color={isToday(date) ? 'primary.main' : 'text.primary'}
          fontWeight={isToday(date) ? 'bold' : 'normal'}
        >
          {format(date, 'd')}
        </Typography>
        
        <Box sx={{ mt: 1 }}>
          {dayExams.slice(0, 2).map((exam, index) => (
            <Chip
              key={exam.id}
              label={exam.name}
              size="small"
              color={getExamPriorityColor(exam.priority)}
              sx={{ 
                width: '100%', 
                mb: 0.5,
                fontSize: '0.7rem',
                height: 20
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedExam(exam);
              }}
            />
          ))}
          {dayExams.length > 2 && (
            <Typography variant="caption" color="textSecondary">
              +{dayExams.length - 2} more
            </Typography>
          )}
        </Box>
      </Paper>
    );
  };

  const getExamPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const MonthView = () => {
    const days = getDaysInMonth(selectedDate);
    const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    return (
      <Box>
        {/* Week days header */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {weekDays.map(day => (
            <Grid item xs key={day} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight="bold" color="textSecondary">
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar days */}
        <Grid container spacing={1}>
          {days.map((date, index) => (
            <Grid item xs key={index} sx={{ minWidth: '14.28%' }}>
              <CalendarDay date={date} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <CalendarIcon sx={{ mr: 2 }} />
        Sınav Takvimi
      </Typography>

      <Grid container spacing={3}>
        {/* Main Calendar */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  {format(selectedDate, 'MMMM yyyy', { locale: tr })}
                </Typography>
                <Box>
                  <Button 
                    variant="outlined" 
                    sx={{ mr: 1 }}
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                  >
                    Önceki
                  </Button>
                  <Button 
                    variant="outlined" 
                    sx={{ mr: 1 }}
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Bugün
                  </Button>
                  <Button 
                    variant="outlined"
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                  >
                    Sonraki
                  </Button>
                </Box>
              </Box>

              <MonthView />
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Upcoming Exams */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 1 }} />
                Yaklaşan Sınavlar
              </Typography>
              
              {getUpcomingExams().length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                  Yaklaşan sınav bulunmuyor
                </Typography>
              ) : (
                <Box>
                  {getUpcomingExams().map((exam) => (
                    <Paper key={exam.id} sx={{ p: 2, mb: 1, borderLeft: 3, borderColor: 'primary.main' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {exam.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {format(parseISO(exam.date), 'dd MMMM yyyy', { locale: tr })}
                      </Typography>
                      <Chip 
                        label={exam.subject} 
                        size="small" 
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Urgent Exams */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ mr: 1 }} />
                Acil Sınavlar (7 Gün)
              </Typography>
              
              {getUrgentExams().length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                  Acil sınav bulunmuyor
                </Typography>
              ) : (
                <Box>
                  {getUrgentExams().map((exam) => {
                    const examDate = parseISO(exam.date);
                    const today = new Date();
                    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <Paper 
                        key={exam.id} 
                        sx={{ 
                          p: 2, 
                          mb: 1, 
                          borderLeft: 3, 
                          borderColor: daysLeft <= 3 ? 'error.main' : 'warning.main',
                          bgcolor: daysLeft <= 3 ? 'error.50' : 'warning.50'
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {exam.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {format(examDate, 'dd MMMM yyyy', { locale: tr })} 
                          <Box component="span" sx={{ ml: 1, color: 'error.main', fontWeight: 'bold' }}>
                            ({daysLeft} gün kaldı)
                          </Box>
                        </Typography>
                        <Chip 
                          label={exam.subject} 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Exam Detail Dialog */}
      <Dialog 
        open={!!selectedExam} 
        onClose={() => setSelectedExam(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedExam && (
          <>
            <DialogTitle>{selectedExam.name}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                <strong>Ders:</strong> {selectedExam.subject}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Tarih:</strong> {format(parseISO(selectedExam.date), 'dd MMMM yyyy', { locale: tr })}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Öncelik:</strong> 
                <Chip 
                  label={selectedExam.priority} 
                  size="small" 
                  color={getExamPriorityColor(selectedExam.priority)}
                  sx={{ ml: 1 }}
                />
              </Typography>
              {selectedExam.notes && (
                <Typography variant="body1" gutterBottom>
                  <strong>Notlar:</strong> {selectedExam.notes}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedExam(null)}>Kapat</Button>
              <Button variant="contained">Düzenle</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ExamCalendar;