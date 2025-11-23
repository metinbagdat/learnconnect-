// src/components/Notifications/NotificationSystem.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Chip,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', 'currentUserId'),
      where('read', '==', false)
    );

    return onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.length);
    });
  };

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        readAt: new Date()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const promises = notifications.map(notification => 
      updateDoc(doc(db, 'notifications', notification.id), {
        read: true,
        readAt: new Date()
      })
    );
    
    await Promise.all(promises);
    setAnchorEl(null);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'exam':
        return <EventIcon color="error" />;
      case 'study':
        return <SchoolIcon color="primary" />;
      case 'achievement':
        return <CheckCircleIcon color="success" />;
      default:
        return <AssignmentIcon color="info" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'exam':
        return 'error';
      case 'study':
        return 'primary';
      case 'achievement':
        return 'success';
      default:
        return 'info';
    }
  };

  const NotificationBell = () => (
    <>
      <IconButton
        color="inherit"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Bildirimler
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllAsRead}>
              Tümünü Okundu İşaretle
            </Button>
          )}
        </Box>

        {notifications.length === 0 ? (
          <MenuItem>
            <Typography color="textSecondary">
              Yeni bildirim bulunmuyor
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem key={notification.id} sx={{ py: 1 }}>
              <ListItemIcon>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {notification.message}
                    </Typography>
                    <Chip 
                      label={notification.type} 
                      size="small" 
                      color={getNotificationColor(notification.type)}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                }
              />
              <IconButton
                size="small"
                onClick={() => markAsRead(notification.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );

  return <NotificationBell />;
};

// Notification Service for generating automated notifications
export const NotificationService = {
  createExamReminder: async (userId, exam, daysUntil) => {
    let message = '';
    let priority = 'medium';

    if (daysUntil === 1) {
      message = `Yarın sınavınız var: ${exam.name}`;
      priority = 'high';
    } else if (daysUntil === 7) {
      message = `1 hafta sonra sınavınız var: ${exam.name}`;
      priority = 'medium';
    } else if (daysUntil === 0) {
      message = `Bugün sınavınız var: ${exam.name}`;
      priority = 'urgent';
    }

    if (message) {
      await addDoc(collection(db, 'notifications'), {
        userId,
        type: 'exam',
        title: '📅 Sınav Hatırlatıcısı',
        message,
        priority,
        read: false,
        createdAt: new Date(),
        relatedId: exam.id
      });
    }
  },

  createStudyReminder: async (userId, subject, targetTime) => {
    await addDoc(collection(db, 'notifications'), {
      userId,
      type: 'study',
      title: '📚 Çalışma Zamanı',
      message: `${subject} dersine çalışma zamanı geldi. Hedef: ${targetTime} dakika`,
      priority: 'medium',
      read: false,
      createdAt: new Date()
    });
  },

  createAchievementNotification: async (userId, achievement) => {
    await addDoc(collection(db, 'notifications'), {
      userId,
      type: 'achievement',
      title: '🎉 Tebrikler!',
      message: achievement,
      priority: 'low',
      read: false,
      createdAt: new Date()
    });
  }
};

export default NotificationSystem;