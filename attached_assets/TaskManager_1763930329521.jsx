// src/components/Tasks/TaskManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [addTaskDialog, setAddTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    topic: '',
    type: 'practice',
    priority: 'medium',
    estimatedDuration: 30,
    dueDate: new Date().toISOString().split('T')[0],
    resources: '',
    notes: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const q = query(
      collection(db, 'studyTasks'),
      where('userId', '==', 'currentUserId'),
      orderBy('dueDate', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const handleAddTask = async () => {
    try {
      await addDoc(collection(db, 'studyTasks'), {
        userId: 'currentUserId',
        ...newTask,
        completed: false,
        createdAt: new Date()
      });
      setAddTaskDialog(false);
      setNewTask({
        title: '',
        subject: '',
        topic: '',
        type: 'practice',
        priority: 'medium',
        estimatedDuration: 30,
        dueDate: new Date().toISOString().split('T')[0],
        resources: '',
        notes: ''
      });
    } catch (error) {
      console.error('Görev ekleme hatası:', error);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await updateDoc(doc(db, 'studyTasks', taskId), {
        completed: !completed,
        completedAt: !completed ? new Date() : null
      });
    } catch (error) {
      console.error('Görev güncelleme hatası:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'studyTasks', taskId));
    } catch (error) {
      console.error('Görev silme hatası:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'practice': return '📝';
      case 'review': return '📚';
      case 'video': return '🎥';
      case 'reading': return '📖';
      default: return '📋';
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          📋 Çalışma Görevleri
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setAddTaskDialog(true)}
        >
          Yeni Görev
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Pending Tasks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                ⏳ Bekleyen Görevler
                <Chip label={pendingTasks.length} size="small" sx={{ ml: 1 }} />
              </Typography>

              {pendingTasks.length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Bekleyen görev bulunmuyor
                </Typography>
              ) : (
                <List>
                  {pendingTasks.map((task) => (
                    <ListItem key={task.id} divider>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id, task.completed)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="subtitle1">
                              {getTypeIcon(task.type)} {task.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Chip 
                                label={task.subject} 
                                size="small" 
                                variant="outlined"
                              />
                              <Chip 
                                label={task.priority} 
                                size="small" 
                                color={getPriorityColor(task.priority)}
                              />
                              <Chip 
                                label={`${task.estimatedDuration}d`} 
                                size="small" 
                                icon={<ScheduleIcon />}
                              />
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {task.topic}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
              Son tarih: {task.dueDate}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDeleteTask(task.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Completed Tasks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                ✅ Tamamlanan Görevler
                <Chip label={completedTasks.length} size="small" sx={{ ml: 1 }} />
              </Typography>

              {completedTasks.length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Tamamlanan görev bulunmuyor
                </Typography>
              ) : (
                <List>
                  {completedTasks.slice(0, 5).map((task) => (
                    <ListItem key={task.id} divider>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id, task.completed)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                            {task.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption">
                            {task.completedAt && new Date(task.completedAt.seconds * 1000).toLocaleDateString('tr-TR')}
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
      </Grid>

      {/* Add Task Dialog */}
      <Dialog open={addTaskDialog} onClose={() => setAddTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Çalışma Görevi</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Görev Başlığı"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Ders</InputLabel>
            <Select
              value={newTask.subject}
              onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
              label="Ders"
            >
              <MenuItem value="Türkçe">Türkçe</MenuItem>
              <MenuItem value="Matematik">Matematik</MenuItem>
              <MenuItem value="Sosyal Bilimler">Sosyal Bilimler</MenuItem>
              <MenuItem value="Fen Bilimleri">Fen Bilimleri</MenuItem>
              <MenuItem value="Geometri">Geometri</MenuItem>
              <MenuItem value="Fizik">Fizik</MenuItem>
              <MenuItem value="Kimya">Kimya</MenuItem>
              <MenuItem value="Biyoloji">Biyoloji</MenuItem>
              <MenuItem value="Tarih">Tarih</MenuItem>
              <MenuItem value="Coğrafya">Coğrafya</MenuItem>
              <MenuItem value="Felsefe">Felsefe</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Konu"
            value={newTask.topic}
            onChange={(e) => setNewTask({ ...newTask, topic: e.target.value })}
            margin="normal"
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Görev Türü</InputLabel>
                <Select
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                  label="Görev Türü"
                >
                  <MenuItem value="practice">Sor Çözümü</MenuItem>
                  <MenuItem value="review">Konu Tekrarı</MenuItem>
                  <MenuItem value="video">Video İzleme</MenuItem>
                  <MenuItem value="reading">Okuma</MenuItem>
                  <MenuItem value="test">Deneme Sınavı</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Öncelik</InputLabel>
                <Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  label="Öncelik"
                >
                  <MenuItem value="high">Yüksek</MenuItem>
                  <MenuItem value="medium">Orta</MenuItem>
                  <MenuItem value="low">Düşük</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tahmini Süre (dk)"
                type="number"
                value={newTask.estimatedDuration}
                onChange={(e) => setNewTask({ ...newTask, estimatedDuration: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Son Tarih"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Kaynaklar"
            value={newTask.resources}
            onChange={(e) => setNewTask({ ...newTask, resources: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            label="Notlar"
            value={newTask.notes}
            onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTaskDialog(false)}>İptal</Button>
          <Button 
            variant="contained" 
            onClick={handleAddTask}
            disabled={!newTask.title || !newTask.subject}
          >
            Görev Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManager;