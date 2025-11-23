// src/components/Layout/EnhancedNavigation.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as CoursesIcon,
  Quiz as ExamsIcon,
  Schedule as PlannerIcon,
  Timer as TimeTrackingIcon,
  Analytics as AnalyticsIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import NotificationSystem from '../Notifications/NotificationSystem';

const EnhancedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: <DashboardIcon />,
      description: 'Ana kontrol paneli'
    },
    {
      title: 'Kurslar',
      path: '/courses',
      icon: <CoursesIcon />,
      description: 'Dersler ve içerikler'
    },
    {
      title: 'Sınavlar',
      path: '/exams',
      icon: <ExamsIcon />,
      description: 'Sınav takibi'
    },
    {
      title: 'Takvim',
      path: '/calendar',
      icon: <CalendarIcon />,
      description: 'Sınav takvimi'
    },
    {
      title: 'Çalışma Planı',
      path: '/planner',
      icon: <PlannerIcon />,
      description: 'AI destekli planlama'
    },
    {
      title: 'Zaman Takip',
      path: '/time-tracking',
      icon: <TimeTrackingIcon />,
      description: 'Çalışma oturumları'
    },
    {
      title: 'Analitikler',
      path: '/analytics',
      icon: <AnalyticsIcon />,
      description: 'İlerleme istatistikleri'
    },
    {
      title: 'Profil',
      path: '/profile',
      icon: <ProfileIcon />,
      description: 'Hesap ayarları'
    },
    {
      title: 'Admin',
      path: '/admin',
      icon: <AdminIcon />,
      description: 'Yönetim paneli',
      adminOnly: true
    }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          🎯 Exam Tracker
          <Chip label="v2.0" size="small" color="primary" variant="outlined" />
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Akıllı Çalışma Asistanı
        </Typography>
      </Box>

      <Box sx={{ p: 1 }}>
        <NotificationSystem />
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            button
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              secondary={item.description}
            />
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="textSecondary">
          🚀 AI Destekli Öğrenme
        </Typography>
      </Box>
    </Drawer>
  );
};

export default EnhancedNavigation;