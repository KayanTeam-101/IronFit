import React from "react";

interface BreakPageProps {
  heading: string;
  text: string;
  SvgComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}



const BreakPage: React.FC<BreakPageProps> = ({ heading, text, SvgComponent }) => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-[60px] shadow-2xl show-fast">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-cyan-500 rounded-4xl" />
        <SvgComponent className="absolute top-20 w-3/4 h-1/2 text-emerald-300 dark:text-teal-400/50  show-third" />
      <div className="relative z-10 flex flex-col justify-center h-full px-6 ">
        <h1 className="relative -top-10 text-5xl w-3/4 leading-15 text-right text-white mb-4 drop-shadow-2xl text-shadow-xs font-black show-first">
          {heading}
        </h1>
        <p className="text-xl w-11/12 text-gray-100 text-shadow-xs font-black leading-relaxed max-w-md show-second ">
          {text}
        </p>
      </div>
    </div>
  );
};

export default BreakPage;