import { useEffect, useCallback } from 'react';
import { NotificationManager } from '../services/notification/notificationManager';
import { getSettingsFromLocalStorage } from '../services/notification/utils';

const SYNC_TAG = 'reminder-sync';

export const useReminders = () => {
  const syncSettings = useCallback(() => {
    const settings = getSettingsFromLocalStorage();
    NotificationManager.syncSettings(settings);

    // Also notify the active service worker to refresh settings
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_SETTINGS',
        settings,
      });
    }
  }, []);

  // Request permission and register periodic background sync
  useEffect(() => {
    const requestPermission = async () => {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      }
    };

    const registerPeriodicSync = async () => {
      // 1. Get the service worker registration for the current page
      const registration : any = await navigator.serviceWorker?.ready;
      if (!registration || !('periodicSync' in registration)) {
        console.log('Periodic Background Sync not supported.');
        return;
      }

      try {
        // 2. Check the periodic-background-sync permission
        const status = await (navigator as any).permissions.query({
          name: 'periodic-background-sync' as PermissionName,
        });
        if (status.state === 'granted') {
          await registration.periodicSync.register(SYNC_TAG, {
            minInterval: 2 * 60 * 60 * 1000, // 2 hours
          });
          console.log('Periodic sync registered.');
        } else {
          console.log('Periodic sync permission not granted.');
        }
      } catch (err) {
        console.error('Periodic sync registration failed:', err);
      }
    };

    requestPermission();
    registerPeriodicSync();
  }, []);

  // Fallback: in-page interval for browsers without PBS
  useEffect(() => {
    const interval = setInterval(() => {
          alert('⏰ تذكير: تنفيذ checkAndNotifyInApp');

      NotificationManager.checkAndNotifyInApp();
    }, 2 * 60 * 60 * 1000); // every 2 hours

    // Also check immediately on mount (useful for testing)
    NotificationManager.checkAndNotifyInApp();

    return () => clearInterval(interval);
  }, []);

  return { syncSettings };
};