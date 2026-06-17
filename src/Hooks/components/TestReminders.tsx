// src/components/TestReminders.tsx
import React from 'react';
import { NotificationManager } from '../../services/notification/notificationManager';

const TestReminders: React.FC = () => {
  const handleTest = async () => {
    if (Notification.permission !== 'granted') {
      alert('Please enable notifications first.');
      return;
    }
    // Clear the last-notification timestamp to allow immediate trigger
    await NotificationManager.updateNotificationRecord({
      lastNotificationTime: 0,
      lastMotivationIndex: -1,
    });
    await NotificationManager.checkAndNotifyInApp();
    alert('Check complete – notifications shown if conditions met.');
  };

  return (
    <button
      onClick={handleTest}
      style={{ padding: '10px 20px', margin: '10px' }}
    >
      ⚡ Test Reminders Now
    </button>
  );
};

export default TestReminders;