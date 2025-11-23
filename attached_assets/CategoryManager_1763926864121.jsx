// src/components/Admin/CategoryManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAdmin } from '../../hooks/useAdmin';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './CategoryManager.css';

const CategoryManager = () => {
  const { isAdmin } = useAdmin();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubscribe = onSnapshot(
      collection(db, 'Categories'),
      (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData.sort((a, b) => a.order - b.order));
      }
    );

    return unsubscribe;
  }, [isAdmin]);

  const addCategory = async (categoryData) => {
    try {
      const newCategory = {
        ...categoryData,
        order: categories.length,
        created_at: new Date(),
        updated_at: new Date(),
        subcategories: []
      };
      
      await addDoc(collection(db, 'Categories'), newCategory);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (categoryId, updates) => {
    try {
      const categoryRef = doc(db, 'Categories', categoryId);
      await updateDoc(categoryRef, {
        ...updates,
        updated_at: new Date()
      });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
    
    try {
      // Check if category has courses
      const coursesSnapshot = await getDocs(
        query(collection(db, 'Courses'), where('category_id', '==', categoryId))
      );
      
      if (!coursesSnapshot.empty) {
        alert('Bu kategoride kurslar bulunuyor. Önce kursları silin veya taşıyın.');
        return;
      }

      await deleteDoc(doc(db, 'Categories', categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const addSubcategory = async (categoryId, subcategoryData) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      const newSubcategory = {
        subcategoryId: generateId(),
        ...subcategoryData,
        order: category.subcategories.length
      };

      await updateCategory(categoryId, {
        subcategories: [...category.subcategories, newSubcategory]
      });
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedCategories = Array.from(categories);
    const [movedCategory] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, movedCategory);

    // Update order in database
    const updates = reorderedCategories.map((category, index) => 
      updateDoc(doc(db, 'Categories', category.id), { order: index })
    );
    
    await Promise.all(updates);
  };

  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <h2>Yönetici Erişimi Gerekli</h2>
        <p>Bu sayfayı görüntülemek için yönetici izinlerine ihtiyacınız var.</p>
      </div>
    );
  }

  return (
    <div className="category-manager">
      <div className="manager-header">
        <h1>Kategori Yönetimi</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Yeni Kategori Ekle
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          onSave={addCategory}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Categories List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="categories-list"
            >
              {categories.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={category.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="category-item"
                    >
                      <div className="category-header">
                        <div className="category-info">
                          <span className="category-icon">{category.icon}</span>
                          <h3>{category.name}</h3>
                          <span className="course-count">
                            {getCourseCount(category.id)} kurs
                          </span>
                        </div>
                        <div className="category-actions">
                          <button
                            className="btn-edit"
                            onClick={() => setEditingCategory(category)}
                          >
                            Düzenle
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => deleteCategory(category.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </div>

                      {/* Subcategories */}
                      <div className="subcategories-list">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.subcategoryId} className="subcategory-item">
                            <span>{subcategory.name}</span>
                            <span className="subcategory-actions">
                              <button>Düzenle</button>
                              <button>Sil</button>
                            </span>
                          </div>
                        ))}
                        <button
                          className="btn-add-subcategory"
                          onClick={() => {/* Open subcategory form */}}
                        >
                          + Alt Kategori Ekle
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Modal */}
      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          onSave={(updates) => updateCategory(editingCategory.id, updates)}
          onCancel={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
};

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState(category || {
    name: '',
    description: '',
    color: '#6366f1',
    icon: '📚'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{category ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kategori Adı</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Renk</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>İkon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
              >
                <option value="📚">📚</option>
                <option value="🔢">🔢</option>
                <option value="🔬">🔬</option>
                <option value="🌍">🌍</option>
                <option value="💻">💻</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onCancel}>İptal</button>
            <button type="submit" className="btn-primary">
              {category ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryManager;