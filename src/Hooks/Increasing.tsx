import { useEffect, useState } from "react";

export const useCountUp = (
  endValue: number,
  duration: number = 2500
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;

      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      setCount(Math.floor(progress * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration]);

  return count;
};