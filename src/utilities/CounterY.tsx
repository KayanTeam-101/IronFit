import { useRef, useState, useEffect } from "react";

type CounterYProps = {
  arr: number[];
  size?: "sm" | "md" | "lg";
  value?: number;
  delValue?: number;               // ✅ new prop
  onChange?: (value: number) => void;
};

const SIZE_CONFIG = {
  sm: { item: 48, visible: 1, font: "text-3xl", perspective: 1000 },
  md: { item: 56, visible: 5, font: "text-4xl", perspective: 1000 },
  lg: { item: 64, visible: 7, font: "text-5xl", perspective: 1000 },
} as const;

const CounterY = ({
  arr,
  size = "md",
  value,
  delValue,
  onChange,
}: CounterYProps) => {
  const cfg = SIZE_CONFIG[size];
  const ITEM_HEIGHT = cfg.item;
  const VISIBLE = cfg.visible;
  const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE;
  const finalArr =
    delValue != null
      ? arr.filter(n => n !== delValue)
      : arr;
  const indexFromValue = (val?: number) => {
    if (val == null) return 0;
    const idx = finalArr.indexOf(val);
    return idx === -1 ? 0 : idx;
  };

  const [offset, setOffset] = useState(
    indexFromValue(value) * ITEM_HEIGHT
  );

  const startY = useRef(0);
  const lastOffset = useRef(indexFromValue(value) * ITEM_HEIGHT);
  const isDragging = useRef(false);

  const maxOffset = (finalArr.length - 1) * ITEM_HEIGHT;

  const clamp = (v: number) =>
    Math.max(0, Math.min(v, maxOffset));

  const indexFromOffset = (o: number) =>
    Math.round(o / ITEM_HEIGHT);

  /* 🔁 sync when parent changes value */
  useEffect(() => {
    if (value == null) return;
    const idx = indexFromValue(value);
    const newOffset = idx * ITEM_HEIGHT;
    setOffset(newOffset);
    lastOffset.current = newOffset;
  }, [value, finalArr]);

  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = startY.current - e.touches[0].clientY;
    setOffset(clamp(lastOffset.current + delta));
  };

  const onTouchEnd = () => {
    isDragging.current = false;

    const snapped =
      indexFromOffset(offset) * ITEM_HEIGHT;
      onChange?.(finalArr[indexFromOffset(snapped)]);

    lastOffset.current = clamp(snapped);
    setOffset(clamp(snapped));

  };
  const snapped =
      indexFromOffset(offset) * ITEM_HEIGHT;
      onChange?.(finalArr[indexFromOffset(snapped)]);

  return (
    <div
      className="relative -top-40 w-screen rounded-2xl overflow-hidden
                 select-none touch-none"
      style={{
        height: CONTAINER_HEIGHT,
        perspective: `${cfg.perspective}px`,
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* center focus */}
      <div
        className="absolute left-0 w-full rounded-xl
                   bg-sky-100/40 pointer-events-none"
        style={{
          top: CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2,
          height: ITEM_HEIGHT,
        }}
      />

      {/* wheel */}
      <div
        className="transition-transform  ease-out"
        style={{
          transform: `translateY(${
            CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2 - offset
          }px)`,
        }}
      >
        {finalArr.map((num, i) => {
          const diff = i * ITEM_HEIGHT - offset;
          const rotateX = diff / 3.5;
          const rotateY = (diff / ITEM_HEIGHT) * 1;
          const opacity =
            1 - Math.min(Math.abs(diff) / (ITEM_HEIGHT * 3), 0.9);

          return (
            <div
              key={num}
              className={`relative  flex items-center perspective-distant  justify-center font-black ${cfg.font}`}
              style={{
                height: ITEM_HEIGHT,
                opacity,
                transform: `
                  scale(${.1 + opacity})
                  rotateX(${rotateX * 1.6}deg)
                  rotateY(${rotateY*1.32}deg)
                  translateZ(${opacity * 50}px)
                `,
                color: opacity > .7 ? "#008ae6" : "#4ddbff",
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
