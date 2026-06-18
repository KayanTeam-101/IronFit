import {type ReminderSettings, type NotificationRecord } from './types';
import { getTodayArabicDay, getTodayDateString, getMotivationalMessage } from './utils';

const DB_NAME = 'remindersDB';
const DB_VERSION = 1;
const STORE_NAME = 'reminders';

// Helper to open IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'key' });
    };
  });
};

// Read a value by key
const readFromDB = async (key: string): Promise<any> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result?.value);
    req.onerror = () => reject(req.error);
  });
};

// Write a value by key
const writeToDB = async (key: string, value: any): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, value });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export class NotificationManager {
  // Sync settings from the main app to IndexedDB (called whenever settings change)
  static async syncSettings(settings: ReminderSettings): Promise<void> {
    await writeToDB('settings', settings);
  }

  // Get settings from IndexedDB (used by service worker)
  static async getSettings(): Promise<ReminderSettings> {
    const settings = await readFromDB('settings');
    return settings || { selectedDays: [], dailyCalories: 0, targetWeight: 0, workoutCompletedDate: '' };
  }

  // Get last notification record
  static async getNotificationRecord(): Promise<NotificationRecord> {
    const record = await readFromDB('notification');
    return record || { lastNotificationTime: 0, lastMotivationIndex: -1 };
  }

  // Update notification record
  static async updateNotificationRecord(record: NotificationRecord): Promise<void> {
    await writeToDB('notification', record);
  }

  // Main routine called by the service worker (or by the in-page interval)
  static async checkAndNotify(
    showFn: (title: string, options?: NotificationOptions) => void
  ): Promise<void> {
    const now = Date.now();
    const settings = await NotificationManager.getSettings();
    const record = await NotificationManager.getNotificationRecord();

    // Prevent spam: only proceed if at least 1.5 hours have passed since last notification
    const MIN_INTERVAL = 1 * 60 * 60 * 1000; // 1.5 hours
    if (now - record.lastNotificationTime < MIN_INTERVAL) {
      return; // too soon
    }

    let notificationSent = false;
    const todayDay = getTodayArabicDay();
    const todayDate = getTodayDateString();

    // Condition 1: Workout reminder
    if (
      settings.selectedDays.includes(todayDay) &&
      settings.workoutCompletedDate !== todayDate
    ) {
      showFn('💪 لم تتمرن اليوم بعد!', {
        body: 'حان وقت التمرين، لا تكسر سلسلة التقدم الخاصة بك.',
        icon: '/icons/icon-192x192.png',
        tag: 'workout-reminder',
      });
      notificationSent = true;
    }

    // Condition 2: Calories reminder
    if (settings.dailyCalories > 0) {
      showFn('🍽️ لا تنسَ السعرات الحرارية', {
        body: `لا تنسَ تناول ${settings.dailyCalories} سعرة حرارية اليوم.`,
        icon: '/icons/icon-192x192.png',
        tag: 'calories-reminder',
      });
      notificationSent = true;
    }

    // Condition 3: Target weight motivation (rotate, avoid repetition)
    if (settings.targetWeight > 0) {
      const { message, index } = getMotivationalMessage(
        settings.targetWeight,
        record.lastMotivationIndex
      );
      showFn('🔥 تحفيز يومي', {
        body: message,
        icon: '/icons/icon-192x192.png',
        tag: 'target-weight-motivation',
      });
      notificationSent = true;

      // Update rotation index
      record.lastMotivationIndex = index;
    }

    if (notificationSent) {
      record.lastNotificationTime = now;
      await NotificationManager.updateNotificationRecord(record);
    }
  }

  // In-app fallback: check and show using the Notification API (works when page is open)
  static async checkAndNotifyInApp(): Promise<void> {
    if (Notification.permission !== 'granted') return;

    // Get the service worker registration, if available
    const registration = await navigator.serviceWorker?.ready;
    const showFn = (title: string, options?: NotificationOptions) => {
      if (registration) {
        registration.showNotification(title, options);
      } else {
        // Fallback: only works in browsers that don't enforce the restriction
        new Notification(title, options);
      }
    };

    await NotificationManager.checkAndNotify(showFn);
  }}