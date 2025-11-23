// src/components/Settings/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { updateProfile, updatePassword, updateEmail } from 'firebase/auth';
import { db, auth } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    bio: '',
    phone: '',
    timezone: 'Europe/Istanbul'
  });
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    emailReminders: true,
    pushNotifications: true,
    studyReminders: true,
    examReminders: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setProfile(prev => ({
          ...prev,
          displayName: user.displayName || '',
          email: user.email || ''
        }));
        loadUserPreferences(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserPreferences = (userId) => {
    const userDoc = doc(db, 'users', userId);
    return onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setProfile(prev => ({ ...prev, ...userData.profile }));
        setPreferences(prev => ({ ...prev, ...userData.preferences }));
      }
    });
  };

  const handleProfileUpdate = async () => {
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: profile.displayName
      });

      // Update Firestore user document
      await updateDoc(doc(db, 'users', user.uid), {
        profile: {
          displayName: profile.displayName,
          bio: profile.bio,
          phone: profile.phone,
          timezone: profile.timezone,
          updatedAt: new Date()
        }
      });

      setMessage('Profil başarıyla güncellendi!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Profil güncelleme hatası: ' + error.message);
    }
  };

  const handlePreferenceUpdate = async (key, value) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        preferences: updatedPreferences,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Tercih güncelleme hatası:', error);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        👤 Kullanıcı Profili & Ayarlar
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{ width: 80, height: 80, mr: 2 }}
                  src={user?.photoURL}
                >
                  {user?.displayName?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6">{user?.displayName || 'Kullanıcı'}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

              <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                Profil Resmi Değiştir
              </Button>

              {!isEditing ? (
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => setIsEditing(true)}
                >
                  Profili Düzenle
                </Button>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Ad Soyad"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="E-posta"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    margin="normal"
                    type="email"
                  />
                  <TextField
                    fullWidth
                    label="Telefon"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Hakkımda"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => setIsEditing(false)}
                    >
                      İptal
                    </Button>
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={handleProfileUpdate}
                    >
                      Kaydet
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PaletteIcon sx={{ mr: 1 }} />
                Görünüm Ayarları
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.darkMode}
                    onChange={(e) => handlePreferenceUpdate('darkMode', e.target.checked)}
                  />
                }
                label="Karanlık Mod"
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                Bildirim Ayarları
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.notifications}
                    onChange={(e) => handlePreferenceUpdate('notifications', e.target.checked)}
                  />
                }
                label="Tüm Bildirimler"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.emailReminders}
                    onChange={(e) => handlePreferenceUpdate('emailReminders', e.target.checked)}
                  />
                }
                label="E-posta Hatırlatıcılar"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.studyReminders}
                    onChange={(e) => handlePreferenceUpdate('studyReminders', e.target.checked)}
                  />
                }
                label="Çalışma Hatırlatıcıları"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.examReminders}
                    onChange={(e) => handlePreferenceUpdate('examReminders', e.target.checked)}
                  />
                }
                label="Sınav Hatırlatıcıları"
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1 }} />
                Güvenlik
              </Typography>

              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                Şifre Değiştir
              </Button>
              <Button variant="outlined" fullWidth>
                İki Faktörlü Doğrulama
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;