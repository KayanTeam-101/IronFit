import { useRef, useState, useEffect, useMemo, useCallback } from "react";

type CounterYProps = {
  arr: number[];
  size?: "sm" | "md" | "lg";
  value?: number;
  delValue?: number;
  onChange?: (value: number) => void;
};

const SIZE_CONFIG = {
  sm: { item: 48, visible: 3, font: "text-3xl" },   // reduced visible items
  md: { item: 56, visible: 5, font: "text-4xl" },
  lg: { item: 64, visible: 5, font: "text-5xl" },   // capped at 5 for performance
} as const;

const CounterY = ({ arr, size = "md", value, delValue, onChange }: CounterYProps) => {
  const cfg = SIZE_CONFIG[size];
  const ITEM_HEIGHT = cfg.item;
  const VISIBLE = cfg.visible;
  const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE;

  // Memoize filtered array
  const finalArr = useMemo(
    () => (delValue != null ? arr.filter(n => n !== delValue) : arr),
    [arr, delValue]
  );

  const indexFromValue = useCallback(
    (val?: number) => {
      if (val == null) return 0;
      const idx = finalArr.indexOf(val);
      return idx === -1 ? 0 : idx;
    },
    [finalArr]
  );

  const [offset, setOffset] = useState(indexFromValue(value) * ITEM_HEIGHT);
  const startY = useRef(0);
  const lastOffset = useRef(indexFromValue(value) * ITEM_HEIGHT);
  const isDragging = useRef(false);
  const maxOffset = (finalArr.length - 1) * ITEM_HEIGHT;

  const clamp = (v: number) => Math.max(0, Math.min(v, maxOffset));

  // Sync external value
  useEffect(() => {
    if (value == null) return;
    const newOffset = indexFromValue(value) * ITEM_HEIGHT;
    setOffset(newOffset);
    lastOffset.current = newOffset;
    if (navigator.vibrate) {
        navigator.vibrate(30); 
      }
  }, [value, indexFromValue]);

  // Optimized touch handlers - use useCallback
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current) return;
      const delta = startY.current - e.touches[0].clientY;
      setOffset(clamp(lastOffset.current + delta));
    },
    []
  );

  const onTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const snappedIndex = Math.round(offset / ITEM_HEIGHT);
    const snappedOffset = snappedIndex * ITEM_HEIGHT;
    const selectedValue = finalArr[snappedIndex];
    if (selectedValue !== undefined) {
      onChange?.(selectedValue); 
    }
    lastOffset.current = snappedOffset;
    setOffset(snappedOffset);
    if (navigator.vibrate) {
        navigator.vibrate(30); 
      }
  }, [offset, ITEM_HEIGHT, finalArr, onChange]);

  return (
    <div
      className="relative min-h-56  w-screen rounded-2xl overflow-hidden select-none touch-none"
      style={{ height: CONTAINER_HEIGHT }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >

      {/* Wheel - simplified transform without 3D */}
      <div
        className="will-change-transform"
        style={{
          transform: `translateY(${CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2 - offset}px)`,
        }}
      >
        {finalArr.map((num, i) => {
          const diff = i * ITEM_HEIGHT - offset;
          const distanceFromCenter = Math.abs(diff);
          const maxDistance = ITEM_HEIGHT * 2;
          // Simplified opacity and scale - no 3D rotations
          const opacity = 1 - Math.min(distanceFromCenter / maxDistance, 1);

          return (
            <div
              key={num}
              className={`relative flex items-center justify-center font-black ${cfg.font}`}
              style={{
                height: ITEM_HEIGHT,
                opacity,
                color: opacity > 0.5 ? "#07f" : "#94a3b8", // darker color for center items
              }}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CounterY;