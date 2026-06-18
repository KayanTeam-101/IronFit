import React from 'react';
import { useReminders } from '../../Hooks/useReminders';
import { NotificationManager } from '../../services/notification/notificationManager';

const DebugReminders: React.FC = () => {
  const { syncSettings } = useReminders();

  const testDirectNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('✅ إشعار مباشر يعمل', {
        body: 'هذا اختبار لإذن الإشعارات',
        icon: '/logo_512.jpg',
      });
    } else {
      alert('الإذن غير ممنوح. الرجاء السماح بالإشعارات من إعدادات المتصفح.');
    }
  };

  const showStoredData = () => {
    const data = {
      SelectedDays: JSON.parse(localStorage.getItem('SelectedDays') || '[]'),
      dailyCalories: localStorage.getItem('dailyCalories'),
      targetWeight: localStorage.getItem('targetWeight'),
      workoutCompletedDate: localStorage.getItem('workoutCompletedDate'),
      today: ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][new Date().getDay()],
      permission: Notification.permission,
    };
    console.table(data);
    alert(JSON.stringify(data, null, 2));
  };

  const runFullReminderCheck = async () => {
    if (Notification.permission !== 'granted') {
      alert('الرجاء منح إذن الإشعارات أولاً');
      return;
    }
    // مسح الطابع الزمني لمنع التكرار
    await NotificationManager.updateNotificationRecord({
      lastNotificationTime: 0,
      lastMotivationIndex: -1,
    });
    // تشغيل الفحص
    await NotificationManager.checkAndNotifyInApp();
    alert('تم تشغيل دورة الفحص. تحقق من ظهور الإشعارات.');
  };

  return (
    <div style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <button onClick={testDirectNotification}>🔔 اختبار إشعار بسيط</button>
      <button onClick={showStoredData}>📋 عرض البيانات</button>
      <button onClick={syncSettings}>🔄 مزامنة الإعدادات مع SW</button>
      <button onClick={runFullReminderCheck}>⚡ تشغيل دورة التذكير الكاملة</button>
    </div>
  );
};

export default DebugReminders;