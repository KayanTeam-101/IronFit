import React from "react";

interface BreakPageProps {
  heading: string;
  text: any;
  SvgComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}



const BreakPage: React.FC<BreakPageProps> = ({ heading, text, SvgComponent }) => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-[60px] show-fast">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-4xl" />
        <SvgComponent className="absolute top-20 w-3/4 h-1/2 text-orange-50/50 dark:text-orange-200 opacity-60  " />
      <div className="relative z-10 flex flex-col justify-center h-full px-6 ">
        <div className="relative -top-10 text-5xl w-3/4 leading-15 text-right text-white mb-4 drop-shadow-2xl text-shadow-xs font-black show-first">
          {heading}
        </div>
        <p className="text-xl w-11/12 text-gray-100 text-shadow-xs  font-black  max-w-md show-second ">
          {text}
        </p>
      </div>
    </div>
  );
};

export default BreakPage;