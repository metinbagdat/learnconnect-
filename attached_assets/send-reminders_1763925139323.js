// functions/send-reminders.js

exports.sendDailyReminder = functions.pubsub
  .schedule('0 7 * * *') // 7 AM daily
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    try {
      const studentsSnapshot = await admin.firestore().collection('students').get();
      
      const promises = studentsSnapshot.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id;
        const studentData = studentDoc.data();
        
        // Get today's plan
        const today = new Date().toISOString().split('T')[0];
        const planDoc = await admin.firestore()
          .collection('daily_plans')
          .doc(studentId)
          .collection('plans')
          .doc(today)
          .get();
        
        if (!planDoc.exists) {
          console.log(`No plan found for student ${studentId} on ${today}`);
          return;
        }
        
        const plan = planDoc.data();
        
        // Send FCM notification
        const message = {
          notification: {
            title: 'Günlük Çalışma Planın Hazır!',
            body: `Bugün ${plan.tasks.length} görevin var. Hadi başlayalım!`
          },
          data: {
            type: 'daily_plan',
            date: today
          },
          tokens: studentData.deviceTokens // array of device tokens
        };
        
        await admin.messaging().sendMulticast(message);
        
        // Also, create a reminder in the reminders collection
        await admin.firestore().collection('reminders').doc(studentId).collection('reminders').add({
          title: 'Günlük Çalışma Planın Hazır!',
          message: `Bugün ${plan.tasks.length} görevin var. Hadi başlayalım!`,
          scheduledTime: admin.firestore.Timestamp.now(),
          sent: true
        });
        
        console.log(`Reminder sent to student ${studentId}`);
      });
      
      await Promise.all(promises);
      console.log('Daily reminders sent successfully');
    } catch (error) {
      console.error('Error sending reminders:', error);
    }
  });