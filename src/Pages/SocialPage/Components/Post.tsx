import React from "react";
import { BsShareFill, BsBookmark } from "react-icons/bs";
import { FaComments } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";

interface PostProps {
  text: string;
  author: string;
  image?: string;
}

// Map first letter (A-Z) to a color family.
// Each value is a Tailwind class pair: bg-{color}-500/20 text-{color}-500
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
};

// Fallback for non‑alphabetic characters
const defaultColorClasses = "bg-gray-500/20 text-gray-500";

const getAvatarColorClasses = (name: string): string => {
  if (!name || name.length === 0) return defaultColorClasses;
  const firstLetter = name.charAt(0).toUpperCase();
  return letterColorClasses[firstLetter] || defaultColorClasses;
};

const Post: React.FC<PostProps> = ({ text, author, image }) => {
  const colorClasses = getAvatarColorClasses(author);
  const initial = author.charAt(0).toUpperCase();

  return (
   <div className="w-full min-h-6  dark:bg-slate-800/20 backdrop-blur-xl outline-none flex flex-col border-b dark:border-b-gray-600/20 border-gray-b-200/50 transition-all duration-500 hover:shadow-2xl">
      <div className="w-full h-14  flex flex-row items-center gap-4 p-4 justify-between">
        <div className="flex flex-row justify-center items-center  gap-2">
          <div className={`w-12 h-12 p-4 flex items-center justify-center rounded-xl ${colorClasses}`}>
            <span className="font-bold mt-1 ">{initial}</span>
          </div>
          <div className="flex flex-col justify-center items-start ">
            <p className="text-lg text-gray-700 dark:text-white">
              {author}
              <span className="text-blue-600">@</span>
            </p>
            <p className="text-xs text-gray-500 -m-1">2h ago</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="dark:text-white text-slate-700">{text}</p>
        {image && <img src={image} alt="Post image" className="max-w-sm max-h-[600px] rounded-xl" />}
      </div>
      <div className="w-1/2 h-14 flex justify-around items-center p-6">
        <button className="border-b border-b-rose-400 rounded-2xl w-14 h-9 flex flex-col justify-around items-center  text-sm text-rose-500 hover:text-blue-600">
          <GoHeartFill /> <span>514</span>
        </button>
        <button className="border-b border-b-teal-400 rounded-2xl w-14 h-9 flex flex-col justify-around items-center   text-sm text-teal-500 hover:text-blue-600">
          <FaComments /> <span>6</span>
        </button>
      </div>
    </div>

  );
};

export default Post;