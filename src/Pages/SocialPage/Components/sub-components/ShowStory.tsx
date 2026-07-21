import React, { useState, useRef, useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { FaCaretRight } from "react-icons/fa";
import Heart from '../../../../assets/emojies/heart.png'
import fire from '../../../../assets/emojies/fire.png'
import hhh from '../../../../assets/emojies/laugh.png'
import angry from '../../../../assets/emojies/angry.png'
import hew from '../../../../assets/emojies/hew.png'
import love from '../../../../assets/emojies/love.png'
interface StoryType {
  id: string;
  imageUrl: string;
  UserName?: string;
  CreateAt?: string;
}

interface ShowStoryProps {
  stories: StoryType[];
  onClose: () => void;
  initialIndex?: number;
}

const ShowStory: React.FC<ShowStoryProps> = ({
  stories,
  onClose,
}) => {
  // Reaction popup per story (emoji path)
  const [popups, setPopups] = useState<Record<string, string>>({});
  // Reacted stories (persisted in localStorage)
  const [reactedStories, setReactedStories] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("Reacted");
    return new Set(stored ? JSON.parse(stored) : []);
  });
  // Tracks which emoji is currently selected (before popup vanishes)
  const [selectedAction, setSelectedAction] = useState<
    Record<string, string | null>
  >({});

  // Drag‑to‑close states (unchanged)
  const [dragData, setDragData] = useState<
    Record<string, { offset: number; opacity: number }>
  >({});
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isVerticalDrag, setIsVerticalDrag] = useState(false);
  const startYRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const dragThreshold = 150;
  const maxDrag = 300;

  // Drag listeners (unchanged)
  useEffect(() => {
    if (activeDragId === null) return;
    const onPointerMove = (e: PointerEvent) => {
      const dx = e.clientX - startXRef.current;
      const dy = e.clientY - startYRef.current;
      if (!isVerticalDrag) {
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (absDy > absDx && dy > 10) {
          setIsVerticalDrag(true);
          e.preventDefault();
        } else if (absDx > 5) {
          setActiveDragId(null);
          setIsVerticalDrag(false);
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
          return;
        }
        return;
      }
      e.preventDefault();
      const offset = Math.min(Math.max(dy, 0), maxDrag);
      const opacity = 1 - offset / maxDrag;
      setDragData((prev) => ({
        ...prev,
        [activeDragId]: { offset, opacity },
      }));
    };
    const onPointerUp = () => {
      if (isVerticalDrag) {
        const current = dragData[activeDragId];
        if (current && current.offset > dragThreshold) {
          onClose();
          setDragData((prev) => {
            const copy = { ...prev };
            delete copy[activeDragId];
            return copy;
          });
        } else {
          setDragData((prev) => ({
            ...prev,
            [activeDragId]: { offset: 0, opacity: 1 },
          }));
          setTimeout(() => {
            setDragData((prev) => {
              const copy = { ...prev };
              delete copy[activeDragId];
              return copy;
            });
          }, 300);
        }
      }
      setActiveDragId(null);
      setIsVerticalDrag(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [activeDragId, isVerticalDrag, dragData, onClose]);

  // Action buttons (unchanged)
  const Action_buttons = [
    { path: love, text: "ادعمة" },
    { path: Heart, text: "اعجبني" },
    { path: fire, text: "متحمس" },
    { path: hhh, text: "ههه" },
    { path: angry, text: "غاضب" },
    { path: hew, text: "منزهل" },
  ];

  // Handle reaction: visual feedback + save after popup
  const handleReact = (story: StoryType, path: string) => {
    if (reactedStories.has(story.id)) return;

    // Immediately mark the selected action
    setSelectedAction((prev) => ({ ...prev, [story.id]: path }));

    // Show the floating emoji popup
    setPopups((prev) => ({ ...prev, [story.id]: path }));

    // After 1.5s, clear popup, reset selectedAction, and mark as reacted
    setTimeout(() => {
      // Save to reacted set
      const updated = new Set(reactedStories);
      updated.add(story.id);
      localStorage.setItem("Reacted", JSON.stringify(Array.from(updated)));
      setReactedStories(updated);

      // Remove popup
      setPopups((prev) => {
        const copy = { ...prev };
        delete copy[story.id];
        return copy;
      });

      // Clear selected action (makes the whole bar fade)
      setSelectedAction((prev) => {
        const copy = { ...prev };
        delete copy[story.id];
        return copy;
      });
    }, 1500);
  };

  const handlePointerDown = (e: React.PointerEvent, storyId: string) => {
    if (popups[storyId]) return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    setActiveDragId(storyId);
    setIsVerticalDrag(false);
    setDragData((prev) => ({
      ...prev,
      [storyId]: { offset: 0, opacity: 1 },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md show-first">
      {/* Horizontal scroll container */}
      <div className="snap-x snap-mandatory w-screen h-screen overflow-x-scroll scroll-smooth flex flex-row">
        {stories.map((story) => {
          const isReacted = reactedStories.has(story.id);
          const storySelected = selectedAction[story.id]; // currently active emoji path (or undefined)
          const isReactionDone = isReacted && !storySelected; // reaction fully completed
          const disableBar = !!storySelected || isReactionDone; // disable clicks during popup/after

          const drag = dragData[story.id];
          const offset = drag ? drag.offset : 0;
          const opacity = drag ? drag.opacity : 1;
          const isDragging = activeDragId === story.id && isVerticalDrag;

          return (
            <div
              key={story.id}
              className="flex-shrink-0 snap-start w-screen h-screen flex justify-between flex-col items-center bg-gray-100 dark:bg-[#111111]"
              style={{
                transform: `translateY(${offset}px)`,
                opacity: opacity,
                transition: isDragging
                  ? "none"
                  : "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease",
                touchAction: isDragging ? "none" : "auto",
                cursor: "grab",
              }}
              onPointerDown={(e) => handlePointerDown(e, story.id)}
            >
              {/* Header – glass effect */}
              <div className="relative top-2 flex flex-row justify-between items-center z-20 p-4 text-[#222222] w-11/12 rounded-2xl h-20 bg-white/40 dark:bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <div className="flex flex-row gap-2.5 h-fit items-center">
                  <button
                    className="p-3 text-black dark:text-white text-lg hover:bg-white/20 rounded-full transition"
                    onClick={onClose}
                  >
                    <FaCaretRight />
                  </button>
                  <p className="mt-0.5 font-bold dark:text-white">
                    {story.UserName || "مستخدم"}
                  </p>
                  <div className="h-1 w-1 rounded-2xl bg-gray-500"></div>
                  <button className="flex flex-row gap-1 text-sm text-black dark:text-white p-1 shadow rounded-2xl bg-white/30 dark:bg-white/10 backdrop-blur-sm hover:bg-white/50 transition">
                    <BiPlus className="mt-0.5" /> follow
                  </button>
                </div>
                <div className="text-sm font-light text-gray-700 dark:text-gray-300">
                  {story.CreateAt?.split("T")[0] || "اليوم"}
                </div>
              </div>

              {/* Image */}
              <div className="relative w-screen h-fit max-h-3/4 flex justify-center items-center">
                <img
                  src={story.imageUrl}
                  alt="story"
                  className="w-full rounded-lg shadow-2xl"
                />
                {popups[story.id] && (
                  <img
                    src={popups[story.id]}
                    alt="reaction"
                    className="absolute top-1/2 -translate-y-1/2 z-40 w-40 pop animate-pop-in"
                  />
                )}
              </div>

              {/* Action buttons – glass bar */}
              <div
                className={`w-11/12 h-28 rounded-[28px] z-20 bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/30 shadow-xl flex flex-row items-center gap-8 overflow-x-scroll overflow-y-hidden p-5 transition-all duration-500 ${
                  disableBar ? "pointer-events-none" : ""
                }`}
              >
                {Action_buttons.map((item) => {
                  const isSelected = storySelected === item.path;
                  // Opacity: if nothing is selected/disabled, 1. If bar is disabled but this button is the selected one, keep it 1. Otherwise 0.5.
                  const buttonOpacity = disableBar
                    ? isSelected
                      ? 1
                      : 0.5
                    : 1;
                  return (
                    <button
                      key={item.text}
                      onClick={() => handleReact(story, item.path)}
                      className="flex flex-col justify-center items-center gap-1.5 shrink-0 transition-all duration-300"
                      style={{
                        opacity: buttonOpacity,
                        transform: isSelected ? "scale(1.1)" : "scale(1)",
                        filter: isSelected
                          ? "drop-shadow(0 0 8px rgba(255,255,255,0.7))"
                          : "none",
                      }}
                    >
                      <img
                        src={item.path}
                        alt={item.text}
                        className="w-12 h-12"
                      />
                      <p className="text-black dark:text-gray-200 text-xs font-medium">
                        {item.text}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyframe for pop-in effect */}
      <style>{`
        @keyframes popIn {
          0% { transform: translateY(-50%) scale(0.2); opacity: 0; }
          60% { transform: translateY(-50%) scale(1.2); opacity: 1; }
          100% { transform: translateY(-50%) scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default ShowStory;