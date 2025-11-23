// src/components/Admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Box, 
  Tab, 
  Tabs, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Grid,
  Paper,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  School as SchoolIcon,
  VideoLibrary as LessonIcon
} from '@mui/icons-material';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);

  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', color: '#3B82F6', icon: '' });
  const [subcategoryForm, setSubcategoryForm] = useState({ categoryId: '', name: '', description: '' });
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', categoryId: '', subcategoryId: '', 
    instructorId: '', price: 0, level: 'beginner', language: 'turkish'
  });

  useEffect(() => {
    // Load all data
    loadCategories();
    loadSubcategories();
    loadCourses();
    loadModules();
    loadLessons();
  }, []);

  const loadCategories = () => {
    const q = query(collection(db, 'categories'), orderBy('order'));
    return onSnapshot(q, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const loadSubcategories = () => {
    const q = query(collection(db, 'subcategories'), orderBy('order'));
    return onSnapshot(q, (snapshot) => {
      setSubcategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const loadCourses = () => {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const loadModules = () => {
    const q = query(collection(db, 'courseModules'), orderBy('order'));
    return onSnapshot(q, (snapshot) => {
      setModules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const loadLessons = () => {
    const q = query(collection(db, 'lessons'), orderBy('order'));
    return onSnapshot(q, (snapshot) => {
      setLessons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const handleAddCategory = async () => {
    try {
      await addDoc(collection(db, 'categories'), {
        ...categoryForm,
        order: categories.length + 1,
        isActive: true,
        createdAt: new Date(),
        createdBy: 'admin' // In real app, use actual user ID
      });
      setCategoryForm({ name: '', description: '', color: '#3B82F6', icon: '' });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddSubcategory = async () => {
    try {
      await addDoc(collection(db, 'subcategories'), {
        ...subcategoryForm,
        order: subcategories.length + 1,
        isActive: true,
        createdAt: new Date()
      });
      setSubcategoryForm({ categoryId: '', name: '', description: '' });
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  const handleAddCourse = async () => {
    try {
      await addDoc(collection(db, 'courses'), {
        ...courseForm,
        thumbnail: '',
        tags: [],
        enrollmentCount: 0,
        rating: 0,
        isPublished: false,
        isFeatured: false,
        requirements: [],
        learningOutcomes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setCourseForm({
        title: '', description: '', categoryId: '', subcategoryId: '', 
        instructorId: '', price: 0, level: 'beginner', language: 'turkish'
      });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handlePublishCourse = async (courseId, isPublished) => {
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        isPublished,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        🛠️ Admin Panel - Kurs Yönetimi
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab icon={<CategoryIcon />} label="Kategoriler" />
        <Tab icon={<SchoolIcon />} label="Kurslar" />
        <Tab icon={<LessonIcon />} label="Modüller & Dersler" />
        <Tab label="İstatistikler" />
      </Tabs>

      {/* Categories Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Yeni Kategori Ekle</Typography>
                <TextField
                  fullWidth
                  label="Kategori Adı"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Açıklama"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  margin="normal"
                  multiline
                  rows={2}
                />
                <TextField
                  fullWidth
                  label="Renk"
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                  margin="normal"
                />
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddCategory}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Kategori Ekle
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Mevcut Kategoriler</Typography>
            <Grid container spacing={2}>
              {categories.map((category) => (
                <Grid item xs={12} sm={6} key={category.id}>
                  <Paper sx={{ p: 2, bgcolor: category.color, color: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">{category.name}</Typography>
                      <Box>
                        <IconButton size="small" sx={{ color: 'white' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'white' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2">{category.description}</Typography>
                    <Typography variant="caption">
                      {subcategories.filter(sc => sc.categoryId === category.id).length} alt kategori
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Courses Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Yeni Kurs Ekle</Typography>
                <TextField
                  fullWidth
                  label="Kurs Başlığı"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Açıklama"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  margin="normal"
                  multiline
                  rows={3}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    value={courseForm.categoryId}
                    onChange={(e) => setCourseForm({ ...courseForm, categoryId: e.target.value })}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddCourse}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Kurs Oluştur
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Tüm Kurslar</Typography>
            <Grid container spacing={2}>
              {courses.map((course) => (
                <Grid item xs={12} key={course.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6">{course.title}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {categories.find(c => c.id === course.categoryId)?.name} - 
                            {subcategories.find(sc => sc.id === course.subcategoryId)?.name}
                          </Typography>
                          <Typography variant="body2">
                            {course.enrollmentCount} öğrenci • {course.rating} ⭐
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={course.isPublished}
                                onChange={(e) => handlePublishCourse(course.id, e.target.checked)}
                              />
                            }
                            label="Yayında"
                          />
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Modules & Lessons Tab */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h6" gutterBottom>Kurs Modülleri ve Dersler</Typography>
        {/* Implementation for modules and lessons management */}
        <Paper sx={{ p: 2 }}>
          <Typography>Modül ve ders yönetimi arayüzü burada yer alacak</Typography>
        </Paper>
      </TabPanel>

      {/* Statistics Tab */}
      <TabPanel value={activeTab} index={3}>
        <Typography variant="h6" gutterBottom>Sistem İstatistikleri</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {courses.length}
                </Typography>
                <Typography variant="body2">Toplam Kurs</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary">
                  {categories.length}
                </Typography>
                <Typography variant="body2">Kategori</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {lessons.length}
                </Typography>
                <Typography variant="body2">Ders</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {courses.reduce((acc, course) => acc + course.enrollmentCount, 0)}
                </Typography>
                <Typography variant="body2">Toplam Kayıt</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default AdminPanel;