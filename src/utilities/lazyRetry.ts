import { lazy,type ComponentType } from 'react';

/**
 * تحميل كسول (Lazy) مع إعادة المحاولة عند فشل تحميل الـ chunk
 * @param importFn دالة الاستيراد الديناميكي
 * @param retries عدد محاولات إعادة التحميل قبل إعادة تحميل الصفحة
 * @param delay التأخير بين المحاولات (مللي ثانية)
 */
export function lazyRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
) {
  return lazy<T>(() =>
    new Promise((resolve) => {
      const attempt = (remaining: number) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            console.warn(
              `فشل تحميل المكون، المحاولات المتبقية: ${remaining}`,
              error
            );
            if (remaining === 0) {
              // بعد نفاد المحاولات، أعد تحميل الصفحة بالكامل
              window.location.reload();
              // نعيد Promise معلقاً لتجنب ظهور Unhandled Rejection
              return new Promise(() => {});
            }
            setTimeout(() => attempt(remaining - 1), delay);
          });
      };
      attempt(retries);
    })
  );
}