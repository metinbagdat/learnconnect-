// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { db, auth, functions } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [todayPlan, setTodayPlan] = useState(null);
  const [progress, setProgress] = useState([]);
  const [currentStudy, setCurrentStudy] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Kullanıcı oturumunu dinle
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        await loadUserData(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const loadUserData = async (userId) => {
    // Bugünkü planı yükle
    const today = new Date().toISOString().split('T')[0];
    const planQuery = query(
      collection(db, 'studyPlans'),
      where('userId', '==', userId),
      where('date', '==', today)
    );

    const unsubscribePlan = onSnapshot(planQuery, (snapshot) => {
      if (!snapshot.empty) {
        const planDoc = snapshot.docs[0];
        setTodayPlan({ id: planDoc.id, ...planDoc.data() });
      } else {
        setTodayPlan(null);
      }
    });

    // İlerleme verilerini yükle
    const progressQuery = query(
      collection(db, 'studentProgress'),
      where('userId', '==', userId),
      where('date', '>=', getLastWeekDate())
    );

    const unsubscribeProgress = onSnapshot(progressQuery, (snapshot) => {
      const progressData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProgress(progressData);
    });

    // Bildirimleri yükle
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notificationsData);
    });

    return () => {
      unsubscribePlan();
      unsubscribeProgress();
      unsubscribeNotifications();
    };
  };

  const startStudySession = (subject, topic) => {
    setCurrentStudy({
      subject,
      topic,
      startTime: new Date(),
      timer: 0
    });

    // Timer başlat
    const timer = setInterval(() => {
      setCurrentStudy(prev => prev ? {
        ...prev,
        timer: prev.timer + 1
      } : null);
    }, 1000);

    return () => clearInterval(timer);
  };

  const endStudySession = async (efficiency, notes, mood) => {
    if (!currentStudy) return;

    const timeStudied = Math.floor(currentStudy.timer / 60); // dakika cinsinden
    const topicsCompleted = [currentStudy.topic];

    try {
      const trackProgress = httpsCallable(functions, 'trackStudyProgress');
      await trackProgress({
        subject: currentStudy.subject,
        timeStudied: timeStudied,
        topicsCompleted: topicsCompleted,
        efficiency: efficiency,
        notes: notes,
        mood: mood
      });

      setCurrentStudy(null);
      alert('Çalışma oturumu kaydedildi!');
    } catch (error) {
      console.error('İlerleme kaydetme hatası:', error);
      alert('Kayıt sırasında hata oluştu');
    }
  };

  const getLastWeekDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  };

  const getProgressChartData = () => {
    // İlerleme verilerini grafik formatına dönüştür
    return progress.map(day => ({
      date: day.date,
      studyTime: Object.values(day.subjects || {}).reduce((total, subject) => 
        total + (subject.timeStudied || 0), 0),
      efficiency: day.dailyGoals?.achievementRate || 0
    }));
  };

  if (!user) {
    return <div>Lütfen giriş yapın...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Hoş geldin, {user.displayName || 'Öğrenci'}!
            </h1>
            <p className="text-gray-600">Bugünkü hedeflerini tamamla 🚀</p>
          </div>
          <div className="flex space-x-4">
            {notifications.length > 0 && (
              <div className="relative">
                <button className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  📢 {notifications.length} Bildirim
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Günlük Plan */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📅 Bugünkü Çalışma Planı</h2>
            
            {todayPlan ? (
              <div>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">{todayPlan.motivationalMessage}</p>
                </div>

                <div className="space-y-4">
                  {Object.entries(todayPlan.plan).map(([timeSlot, activities]) => (
                    <div key={timeSlot} className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold capitalize text-gray-800 mb-2">
                        {timeSlot === 'morning' ? '🌅 Sabah' : 
                         timeSlot === 'afternoon' ? '☀️ Öğlen' : '🌙 Akşam'}
                      </h3>
                      <div className="space-y-2">
                        {activities.map((activity, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-800">{activity.subject}</h4>
                                <p className="text-sm text-gray-600">{activity.topic}</p>
                                <p className="text-xs text-gray-500">
                                  {activity.duration} dakika • {activity.priority} öncelik
                                </p>
                              </div>
                              <button
                                onClick={() => startStudySession(activity.subject, activity.topic)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                              >
                                Başlat
                              </button>
                            </div>
                            {activity.resources && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">Kaynaklar:</p>
                                <ul className="text-xs text-blue-600">
                                  {activity.resources.map((resource, i) => (
                                    <li key={i}>• {resource}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">💡 Çalışma İpuçları</h4>
                  <ul className="text-purple-700 text-sm">
                    {todayPlan.studyTips.map((tip, index) => (
                      <li key={index} className="mb-1">• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Bugün için plan bulunamadı.</p>
                <p className="text-sm">Plan sabah 6'da otomatik oluşturulur.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sağ Sidebar */}
        <div className="space-y-6">
          {/* İlerleme Grafiği */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">📈 Haftalık İlerleme</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getProgressChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="studyTime" stroke="#8884d8" name="Çalışma Süresi (dk)" />
                  <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" name="Verimlilik (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Aktif Çalışma Oturumu */}
          {currentStudy && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">⏰ Aktif Çalışma</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {currentStudy.subject}
                </div>
                <div className="text-gray-600 mb-4">{currentStudy.topic}</div>
                <div className="text-3xl font-mono text-green-600 mb-4">
                  {Math.floor(currentStudy.timer / 60)}:{(currentStudy.timer % 60).toString().padStart(2, '0')}
                </div>
                <button
                  onClick={() => endStudySession(85, "İyi gidiyor", "motivated")}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Oturumu Bitir
                </button>
              </div>
            </div>
          )}

          {/* Bildirimler */}
          {notifications.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">📢 Bildirimler</h3>
              <div className="space-y-2">
                {notifications.map(notification => (
                  <div key={notification.id} className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <div className="font-medium text-yellow-800">{notification.title}</div>
                    <div className="text-sm text-yellow-700">{notification.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;