import React, { useEffect, useState, useCallback, useRef } from "react";
import CommentSection from "./CommentSection";
import { likeThePost } from "../../../firebase/post";
import { FaDownload, FaFire } from "react-icons/fa6";
import { BsChatDots } from "react-icons/bs";

interface PostProps {
  id: string;
  text: string;
  UserName: string;
  image?: string;
  amountOfLikes: number;
  Comments: object[];
}

// Color pairs that the heart can randomly use


const letterColorClasses: Record<string, string> = {
  A: "bg-rose-500/20 text-rose-500",
  B: "bg-pink-500/20 text-pink-500",
  C: "bg-purple-500/20 text-purple-500",
  D: "bg-violet-500/20 text-violet-500",
  E: "bg-indigo-500/20 text-indigo-500",
  F: "bg-orange-500/20 text-orange-500",
  G: "bg-cyan-500/20 text-cyan-500",
  H: "bg-teal-500/20 text-teal-500",
  I: "bg-emerald-500/20 text-emerald-500",
  J: "bg-green-500/20 text-green-500",
  K: "bg-lime-500/20 text-lime-500",
  L: "bg-yellow-500/20 text-yellow-500",
  M: "bg-amber-500/20 text-amber-500",
  N: "bg-orange-500/20 text-orange-500",
  O: "bg-red-500/20 text-red-500",
  P: "bg-fuchsia-500/20 text-fuchsia-500",
  Q: "bg-amber-500/20 text-amber-500",
  R: "bg-rose-500/20 text-rose-500",
  S: "bg-pink-500/20 text-pink-500",
  T: "bg-violet-500/20 text-violet-500",
  U: "bg-indigo-500/20 text-indigo-500",
  V: "bg-orange-500/20 text-orange-500",
  W: "bg-cyan-500/20 text-cyan-500",
  X: "bg-teal-500/20 text-teal-500",
  Y: "bg-emerald-500/20 text-emerald-500",
  Z: "bg-green-500/20 text-green-500",
  ح: "bg-fuchsia-500/20 text-fuchsia-500",
  ع: "bg-amber-500/20 text-amber-500",
  ك: "bg-orange-500/20 text-orange-500",
  ف: "bg-cyan-500/20 text-cyan-500",
  س: "bg-teal-500/20 text-teal-500",
};

const defaultColorClasses = "bg-gray-500/20 text-gray-500";

export const getAvatarColorClasses = (name: string): string => {
  if (!name || name.length === 0) return defaultColorClasses;
  const firstLetter = name.charAt(0).toUpperCase();
  return letterColorClasses[firstLetter] || defaultColorClasses;
};
const HEART_COLOR_PAIRS = [
  ["#FF4757", "orange"],   // Rose
  ["#3742FA", "pink"],   // Indigo
  ["#FF6348", "#FF2F50"],   // Coral
  ["#0077ff", "#7Bff9F"],   // Emerald
  ["#FFA502", "#FFB142"],   // Amber
  ["#1159B6", "#D980FA"],   // Purple
];


const Post: React.FC<PostProps> = ({
  id,
  text,
  UserName,
  image,
  amountOfLikes,
}) => {
  const [Liked, setLiked] = useState<boolean>(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [likeAnimationKey, setLikeAnimationKey] = useState(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [showComments, setShowComments] = useState(false);
  const colorClasses = getAvatarColorClasses(UserName);
  const initial = UserName.charAt(0).toUpperCase();
  const [heartColors, setHeartColors] = useState(HEART_COLOR_PAIRS[0]);

  // Ref for double‑tap detection
  const lastTapRef = useRef(0);

  useEffect(() => {
    const raw = localStorage.getItem("LikedPosts");
    const likedPosts = raw ? JSON.parse(raw) : [];
    if (likedPosts.some((postId: string) => postId === id)) {
      setLiked(true);
    }
  }, [id]);

 const handleLike = useCallback(() => {
  if (Liked) return; // already liked this specific post

  // 1. Perform the like action (Firebase + UI)
  likeThePost(id);
  setLiked(true);
  setAnimateHeart(true);
  setTimeout(() => setAnimateHeart(false), 1000);

  // 2. Save the liked post ID to localStorage
  const raw = localStorage.getItem("LikedPosts");
  const likedPosts = raw ? JSON.parse(raw) : [];
  likedPosts.push(id);
  localStorage.setItem("LikedPosts", JSON.stringify(likedPosts));

  // 3. Daily XP tracking (only once per day)
  const today = new Date().toISOString().split("T")[0];
  const GetLikedDays = localStorage.getItem("LikedDays") || "[]";
  const LikedDays = JSON.parse(GetLikedDays);
  if (!LikedDays.includes(today)) {
    LikedDays.push(today);
    localStorage.setItem("LikedDays", JSON.stringify(LikedDays));
  }
}, [Liked, id]);

  // Double‑tap handler for images (mobile compatible)
const handleImageTap = useCallback(() => {
  const now = Date.now();
  if (now - lastTapRef.current < 300) {
    // Pick a random colour pair
    const randomPair = HEART_COLOR_PAIRS[Math.floor(Math.random() * HEART_COLOR_PAIRS.length)];
    setHeartColors(randomPair);

    // Show the big heart pop
    if (image) {
      setLikeAnimationKey((prev) => prev + 1);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1100);
    }
    handleLike();
  }
  lastTapRef.current = now;
}, [handleLike, image]);

  return (
    <>
      <div
        className={`w-full min-h-6 z-0 rounded-3xl dark:bg-[#11111170] overflow-hidden bg-white/50 backdrop-blur-xl ${
          image ? "" : "mt-7 mb-7"
        } outline-none flex flex-col shadow-xl transition-all duration-500 hover:shadow-2xl show-first overflow-hidden`}
      >
        <style>{`
          @keyframes heartSpin {
            0% {
              transform: scale(1) rotateY(0deg) rotateX(0deg);
            }
            30% {
              transform: scale(3) rotateY(180deg) rotateX(30deg);
            }
            60% {
              transform: scale(3) rotateY(200deg) rotateX(28deg);
            }
            100% {
              transform: scale(1) rotateY(360deg) rotateX(0deg);
            }
          }
          .animate-heart-spin {
            animation: heartSpin 1s ease-in-out;
            transform-style: preserve-3d;
            transition: filter 0.3s;
          }

          @keyframes instaLikePop {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            15% {
              transform: scale(1.3);
              opacity: 1;
            }
            30% {
              transform: scale(0.9);
              opacity: 0.6;
            }
            45% {
              transform: scale(1.1);
              opacity: 1;
            }
            60%, 80% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
          .animate-insta-like {
            animation: instaLikePop 1.1s ease-out forwards;
          }
        `}</style>

        <div className="flex flex-col gap-1 p-3 justify-center items-center imgContainer">
          {image && (
            <div
              onClick={handleImageTap}
              style={{ touchAction: "manipulation" }} // prevents zoom on double‑tap
              className="relative w-fit h-fit cursor-pointer"
            >
              <div className="w-fit max-h-125 rounded-2xl overflow-hidden">
                <img
                  src={image}
                  alt="Post image"
                  className="sm:max-w-screen md:max-w-xl max-h-[800px]"
                />
              </div>

            {showLikeAnimation && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
    <svg
      viewBox="0 0 24 24"
      className="w-24 h-24 sm:w-28 sm:h-28 animate-insta-like drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
    >
      <defs>
        <linearGradient
          id={`heartGradient-${likeAnimationKey}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={heartColors[0]}>
            <animate
              attributeName="offset"
              values="0%;0%;0%"
              dur="1.5s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </stop>
          <stop offset="100%" stopColor={heartColors[1]}>
            <animate
              attributeName="offset"
              values="100%;100%;100%"
              dur="1.5s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </stop>
          {/* Animate the gradient position to "drip" */}
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 0; 0 0; 0 0"
            keyTimes="0;0.5;1"
            dur="2s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
          />
        </linearGradient>
      </defs>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={`url(#heartGradient-${likeAnimationKey})`}
      />
    </svg>
  </div>
)}
            </div>
          )}
          <p className="dark:text-white text-slate-700 mr-4 mt-4 text-wrap break-words w-11/12">
            {text}
          </p>
        </div>

        <div className="w-full h-14 flex flex-row items-center gap-4 p-4 justify-between border-t border-gray-800/30">
          <div className="flex flex-row justify-center items-center gap-2">
            <div
              className={`w-10 h-10 p-4 flex items-center justify-center rounded-xl ${colorClasses}`}
            >
              <span className="font-bold mt-1">{initial}</span>
            </div>
            <div className="flex flex-col justify-center items-start">
              <p className="text-lg text-gray-700 dark:text-white">
                {UserName}
                <span className="text-orange-600">@</span>
              </p>
            </div>
          </div>

          <div className="w-1/2 h-14 flex justify-around items-center gap-2 p-6">
            {/* Like button with 3D spin and rose glow */}
            <button
              onClick={handleLike}
              disabled={Liked}
              className="relative w-14 h-9 flex flex-row gap-1 items-center transition-all group"
              style={{ perspective: "600px" }}
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-5 h-5 transition-colors duration-300 ${
                  animateHeart ? "animate-heart-spin" : ""
                } ${Liked ? "text-rose-500" : "text-gray-500"}`}
                fill="currentColor"
                style={{
                  filter: animateHeart
                    ? "drop-shadow(0 0 8px rgba(244, 63, 94, 0.9))"
                    : "drop-shadow(0 0 0px transparent)",
                  transition: "filter 0.4s ease-out",
                }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="ml-1 mt-1 text-black dark:text-white">
                {Liked ? amountOfLikes + 1 : amountOfLikes}
              </span>
            </button>

            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="w-14 h-9 mt-4 m-2 flex flex-col gap-1 items-center text-gray-500 hover:text-orange-600"
            >
              <BsChatDots /> 
              <span className="text-[11px]">تعليقات</span>
            </button>

            {image && (
              <a
                href={image}
                download
                className="w-14 h-9 mt-1 flex flex-row gap-1 items-center text-gray-500 hover:text-orange-600"
                onClick={(e) => e.stopPropagation()} // prevent image tap interference
              >
                <FaDownload /> 
              </a>
            )}
          </div>
        </div>

        {showComments && (
          <CommentSection
            postId={id}
            currentUserName={localStorage.getItem("UserName") || ""}
          />
        )}
      </div>
    </>
  );
};

export default Post;