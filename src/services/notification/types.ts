export interface ReminderSettings {
  selectedDays: string[];        // Arabic day names
  dailyCalories: number;
  targetWeight: number;
  workoutCompletedDate: string;  // ISO date string, e.g. "2026-06-17"
}

export interface NotificationRecord {
  lastNotificationTime: number;  // epoch ms
  lastMotivationIndex: number;   // index of last used motivational message
}

export interface IndexedDBStore {
  settings: ReminderSettings;
  notification: NotificationRecord;
}