import {type ReminderSettings } from './types';

// Map JS getDay() to Arabic weekday names
const ARABIC_DAYS = [
  'الأحد',   // 0
  'الإثنين', // 1
  'الثلاثاء',// 2
  'الأربعاء',// 3
  'الخميس',  // 4
  'الجمعة',  // 5
  'السبت',   // 6
];

export const getTodayArabicDay = (): string => {
  const today = new Date();
  return ARABIC_DAYS[today.getDay()];
};

export const getTodayDateString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Retrieve settings from localStorage (used by main thread to sync to IndexedDB)
export const getSettingsFromLocalStorage = (): ReminderSettings => {
  const selectedDays: string[] = JSON.parse(localStorage.getItem('SelectedDays') || '[]');
  const dailyCalories = Number(localStorage.getItem('dailyCalories') || 0);
  const targetWeight = Number(localStorage.getItem('targetWeight') || 0);
  const workoutCompletedDate = localStorage.getItem('workoutCompletedDate') || '';
  return { selectedDays, dailyCalories, targetWeight, workoutCompletedDate };
};

// Motivational message templates (rotate)
const MOTIVATION_TEMPLATES = [
  '🎯 هدفك يقترب! استمر، ستصل إلى {targetWeight} كجم قريبًا.',
  '🔥 كل وجبة وكل تمرين يقربك من هدفك. ستصل إلى {targetWeight} كجم قريبًا، استمر!',
  '💪 لا تتوقف الآن! {targetWeight} كجم في انتظارك.',
  '🌟 أنت على الطريق الصحيح. {targetWeight} كجم أصبحت أقرب مما تظن.',
];

export const getMotivationalMessage = (
  targetWeight: number,
  lastIndex?: number
): { message: string; index: number } => {
  let idx = lastIndex !== undefined ? (lastIndex + 1) % MOTIVATION_TEMPLATES.length : 0;
  const template = MOTIVATION_TEMPLATES[idx];
  return {
    message: template.replace('{targetWeight}', String(targetWeight)),
    index: idx,
  };
};