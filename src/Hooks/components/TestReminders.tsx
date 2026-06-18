import React from 'react';
import { useReminders } from '../../Hooks/useReminders';
import { NotificationManager } from '../../services/notification/notificationManager';

const DebugReminders: React.FC = () => {
  const { syncSettings } = useReminders();

const testDirectNotification = () => {
  alert('Button works!'); // Step 1: confirm tap

  if (!('Notification' in window)) {
    alert('❌ This device does not support Notification API');
    return;
  }

  if (Notification.permission !== 'granted') {
    alert('❌ Permission denied. Current state: ' + Notification.permission);
    return;
  }

  try {
    const notif = new Notification('✅ إشعار مباشر يعمل', {
      body: 'هذا اختبار لإذن الإشعارات',
      icon: '/logo_512.jpg',
    });
    notif.onshow = () => console.log('Notification shown');
    notif.onerror = (e) => alert('Notification error: ' + e);
  } catch (e: any) {
    alert('❌ Exception: ' + e.message);
    console.error(e);
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
      <button 
      onClick={testDirectNotification}
        style={{ touchAction: 'manipulation', zIndex: 9999, position: 'relative' }}
>🔔 اختبار إشعار بسيط</button>
      <button onClick={showStoredData}>📋 عرض البيانات</button>
      <button onClick={syncSettings}>🔄 مزامنة الإعدادات مع SW</button>
      <button onClick={runFullReminderCheck}>⚡ تشغيل دورة التذكير الكاملة</button>
    </div>
  );
};

export default DebugReminders;