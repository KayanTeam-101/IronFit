import React, { useEffect, useState, useCallback, useRef } from "react";
import { likeThePost } from "../../../firebase/post";
import { FaDownload, FaFire } from "react-icons/fa6";
import { IoBookmarkOutline } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";
import { BsChatDots } from "react-icons/bs";

interface PostProps {
  id: string;
  text: string;
  UserName: string;
  image?: string;
  amountOfLikes: number;
  Comments: object[];
}

const letterColorClasses: Record<string, string> = {
  A: "bg-rose-500/20 text-rose-500",
  B: "bg-pink-500/20 text-pink-500",
  C: "bg-purple-500/20 text-purple-500",
  D: "bg-violet-500/20 text-violet-500",
  E: "bg-indigo-500/20 text-indigo-500",
  F: "bg-blue-500/20 text-blue-500",
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
  Q: "bg-sky-500/20 text-sky-500",
  R: "bg-rose-500/20 text-rose-500",
  S: "bg-pink-500/20 text-pink-500",
  T: "bg-violet-500/20 text-violet-500",
  U: "bg-indigo-500/20 text-indigo-500",
  V: "bg-blue-500/20 text-blue-500",
  W: "bg-cyan-500/20 text-cyan-500",
  X: "bg-teal-500/20 text-teal-500",
  Y: "bg-emerald-500/20 text-emerald-500",
  Z: "bg-green-500/20 text-green-500",
    ح: "bg-fuchsia-500/20 text-fuchsia-500",
  ع: "bg-sky-500/20 text-sky-500",
    ك: "bg-blue-500/20 text-blue-500",
  ف: "bg-cyan-500/20 text-cyan-500",
  س: "bg-teal-500/20 text-teal-500",
};

const defaultColorClasses = "bg-gray-500/20 text-gray-500";

export const getAvatarColorClasses = (name: string): string => {
  if (!name || name.length === 0) return defaultColorClasses;
  const firstLetter = name.charAt(0).toUpperCase();
  return letterColorClasses[firstLetter] || defaultColorClasses;
};

const Post: React.FC<PostProps> = ({
  id,
  text,
  UserName,
  image,
  amountOfLikes,
  Comments,
}) => {
  const [Liked, setLiked] = useState<boolean>(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [likeAnimationKey, setLikeAnimationKey] = useState(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const colorClasses = getAvatarColorClasses(UserName);
  const initial = UserName.charAt(0).toUpperCase();
  const UserClasses = getAvatarColorClasses(localStorage.getItem("UserName") || "");
  const UserInitial = (localStorage.getItem("UserName") || "").charAt(0).toUpperCase();

  useEffect(() => {
    const raw = localStorage.getItem("LikedPosts");
    const likedPosts = raw ? JSON.parse(raw) : [];
    if (likedPosts.some((postId: string) => postId === id)) {
      setLiked(true);
    }
  }, [id]);

  const handleLike = useCallback(() => {
    if (Liked) return;

    const raw = localStorage.getItem("LikedPosts");
    const likedPosts = raw ? JSON.parse(raw) : [];
    const FxSound = new Audio();
    FxSound.src =''
    likedPosts.push(id);
    localStorage.setItem("LikedPosts", JSON.stringify(likedPosts));

    likeThePost(id);
    setLiked(true);

    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 1000);
  }, [Liked, id]);

  const handleDoubleClick = useCallback(() => {
    // Show the big Instagram-style heart pop only when there's an image
    if (image) {
      setLikeAnimationKey((prev) => prev + 1);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1100);
    }

    // Actual "like" action still only fires once (handled inside handleLike)
    handleLike();
  }, [handleLike, image]);

  return (
    <div 
    className={`w-full min-h-6  dark:bg-gray-900/50 overflow-hidden z-10 bg-white/50 backdrop-blur-xl  ${image ? "" : "mt-7 mb-7"} outline-none  flex flex-col shadow-xl transition-all r duration-500 hover:shadow-2xl show-second overflow-hidden`}>
      <style>{`
        @keyframes heartSpin {
          0% {
            transform: scale(1) rotateY(0deg) rotateX(0deg);
          }
          30% {
            transform: scale(3) rotateY(180deg) rotateX(30deg);
          }
            60%{
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
            opacity: .6;
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

      <div 
      onDoubleClick={handleDoubleClick}
      className="flex flex-col gap-1 p-3 justify-center items-center imgContainer">
        {image && (
          <div className="relative w-fit h-fit">
         
       <div className="w-fit max-h-125  rounded-2xl overflow-hidden">
               <img
            src={image}
            alt="Post image"
            className="sm:max-w-screen md:max-w-xl max-h-[800px]  "
          />

       </div>

            {showLikeAnimation && (
              <div
                key={id}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-24 h-24 sm:w-28 sm:h-28 text-white animate-insta-like drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            )}
          </div>
        )}
        <p className={` dark:text-white text-slate-700 mr-4 mt-4 text-wrap wrap-break-word w-11/12`}>
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
              <span className="text-blue-600">@</span>
            </p>
<div className="flex flex-row gap-2.5">
            <p className="text-xs text-gray-500 -m-1">2h ago</p>
            <div className="w-1 h-1 bg-gray-500 rounded-xl"></div>
            <p className="text-[13px] text-gray-500 -m-1.5 flex flex-row gap-1">4 <span className="text-amber-600 text-[10px] mt-1"><FaFire /></span></p>

</div>
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

          <button className="w-14 h-9 mt-1 flex flex-row gap-1 items-center text-gray-500 hover:text-blue-600">
            <BsChatDots /> <span >{Comments.length}</span>
          </button>
           {image && 
           (
             <button className="w-14 h-9 mt-1 flex flex-row gap-1 items-center text-gray-500 hover:text-blue-600">
            <FaDownload /> <span >{Comments.length}</span>
          </button>
           )}
        </div>
      </div>
      <div className="w-full h-12 bg-white dark:bg-gray-500/20 rounded-b-2xl flex flex-row items-center justify-around">
      <div className="w-10/12 h-fit dark:bg-gray-200/20 bg-gray-100  rounded-xl">
        <p className="p-1 text-gray-400">أترك تعليق..</p>
      </div>
        <div
            className={`w-3 h-3 p-4 flex items-center justify-center rounded-xl ${UserClasses}`}
          >
            <span className="font-bold mt-1">{UserInitial}</span>
          </div>
      </div>
    </div>
  );
};

export default Post;