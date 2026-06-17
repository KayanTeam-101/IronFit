import React from 'react';

export const NotificationPermission: React.FC = () => {
  const handleRequest = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        alert('تم تفعيل الإشعارات بنجاح!');
      } else {
        alert('يمكنك تفعيل الإشعارات من إعدادات المتصفح لاحقًا.');
      }
    } else if (Notification.permission === 'denied') {
      alert('الإشعارات محظورة. يرجى تعديل الإعدادات في المتصفح.');
    } else {
      alert('الإشعارات مفعلة بالفعل.');
    }
  };

  if (Notification.permission !== 'granted') {
    return (
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <p>للحصول على تذكيرات التمرين، يرجى السماح بالإشعارات.</p>
        <button onClick={handleRequest} style={{ padding: '0.5rem 1rem' }}>
          تفعيل الإشعارات
        </button>
      </div>
    );
  }
  return null;
};