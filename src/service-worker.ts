// @ts-nocheck
const manifest = self.__WB_MANIFEST || [];
// src/service-worker.ts
// The vite-plugin-pwa will bundle this file correctly for the SW environment.

const DB_NAME = 'remindersDB';
const DB_VERSION = 1;
const STORE_NAME = 'reminders';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'key' });
    };
  });
}

async function readFromDB(key: string): Promise<any> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result?.value);
    req.onerror = () => reject(req.error);
  });
}

async function writeToDB(key: string, value: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, value });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

const ARABIC_DAYS = [
  'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
];

function getTodayArabicDay(): string {
  return ARABIC_DAYS[new Date().getDay()];
}

function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const MOTIVATION_TEMPLATES = [
  '🎯 هدفك يقترب! استمر، ستصل إلى {targetWeight} كجم قريبًا.',
  '🔥 كل وجبة وكل تمرين يقربك من هدفك. ستصل إلى {targetWeight} كجم قريبًا، استمر!',
  '💪 لا تتوقف الآن! {targetWeight} كجم في انتظارك.',
  '🌟 أنت على الطريق الصحيح. {targetWeight} كجم أصبحت أقرب مما تظن.',
];

function getMotivationalMessage(targetWeight: number, lastIndex?: number): { message: string; index: number } {
  const idx = lastIndex !== undefined ? (lastIndex + 1) % MOTIVATION_TEMPLATES.length : 0;
  return {
    message: MOTIVATION_TEMPLATES[idx].replace('{targetWeight}', String(targetWeight)),
    index: idx,
  };
}

async function checkAndNotify(): Promise<void> {
  const now = Date.now();
  const settings = await readFromDB('settings') || { selectedDays: [], dailyCalories: 0, targetWeight: 0, workoutCompletedDate: '' };
  const record = await readFromDB('notification') || { lastNotificationTime: 0, lastMotivationIndex: -1 };

  const MIN_INTERVAL = 1.5 * 60 * 60 * 1000; // 1.5 hours
  if (now - record.lastNotificationTime < MIN_INTERVAL) return;

  let sent = false;
  const todayDay = getTodayArabicDay();
  const todayDate = getTodayDateString();

  if (settings.selectedDays.includes(todayDay) && settings.workoutCompletedDate !== todayDate) {
    self.registration.showNotification('💪 لم تتمرن اليوم بعد!', {
      body: 'حان وقت التمرين، لا تكسر سلسلة التقدم الخاصة بك.',
      icon: '/logo_512.jpg',
      tag: 'workout',
    });
    sent = true;
  }

  if (settings.dailyCalories > 0) {
    self.registration.showNotification('🍽️ لا تنسَ السعرات الحرارية', {
      body: `لا تنسَ تناول ${settings.dailyCalories} سعرة حرارية اليوم.`,
      icon: '/logo_512.jpg',
      tag: 'calories',
    });
    sent = true;
  }

  if (settings.targetWeight > 0) {
    const { message, index } = getMotivationalMessage(settings.targetWeight, record.lastMotivationIndex);
    self.registration.showNotification('🔥 تحفيز يومي', {
      body: message,
      icon: '/logo_512.jpg',
      tag: 'motivation',
    });
    record.lastMotivationIndex = index;
    sent = true;
  }

  if (sent) {
    record.lastNotificationTime = now;
    await writeToDB('notification', record);
  }
}

// Periodic Background Sync
self.addEventListener('periodicsync', (event: any) => {
  if (event.tag === 'reminder-sync') {
    event.waitUntil(checkAndNotify());
  }
});

// Listen for settings updates from the main app
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SYNC_SETTINGS') {
    writeToDB('settings', event.data.settings).catch(console.error);
  }
});
