// src/components/Course/CourseCatalog.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import CourseCard from './CourseCard';
import CourseFilters from './CourseFilters';
import './CourseCatalog.css';

const CourseCatalog = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    level: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load courses
    const coursesQuery = query(
      collection(db, 'Courses'),
      where('is_published', '==', true),
      orderBy('created_at', 'desc')
    );

    const unsubscribeCourses = onSnapshot(coursesQuery, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setLoading(false);
    });

    // Load categories
    const unsubscribeCategories = onSnapshot(
      collection(db, 'Categories'),
      (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      }
    );

    return () => {
      unsubscribeCourses();
      unsubscribeCategories();
    };
  }, []);

  useEffect(() => {
    // Apply filters
    let result = courses;

    if (filters.category) {
      result = result.filter(course => course.category_id === filters.category);
    }

    if (filters.subcategory) {
      result = result.filter(course => course.subcategory_id === filters.subcategory);
    }

    if (filters.level) {
      result = result.filter(course => course.level === filters.level);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCourses(result);
  }, [filters, courses]);

  if (loading) {
    return <div className="loading">Kurslar yükleniyor...</div>;
  }

  return (
    <div className="course-catalog">
      <div className="catalog-header">
        <h1>Kurs Kataloğu</h1>
        <p>İlgi alanlarınıza uygun kursları keşfedin</p>
      </div>

      <CourseFilters
        categories={categories}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            user={user}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="no-courses">
          <h3>Uygun kurs bulunamadı</h3>
          <p>Filtrelerinizi değiştirmeyi deneyin</p>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;