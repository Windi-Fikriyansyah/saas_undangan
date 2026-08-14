import React from "react";

interface TabletMockupProps {
  children: React.ReactNode;
  className?: string;
}

export default function TabletMockup({ children, className = "" }: TabletMockupProps) {
  return (
    <div className={`relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[16px] rounded-[2.5rem] h-[650px] w-full max-w-[480px] shadow-2xl ${className}`}>
      
      {/* Front Camera */}
      <div className="w-[10px] h-[10px] bg-gray-950 rounded-full top-[3px] left-1/2 -translate-x-1/2 absolute z-10 shadow-inner border border-gray-800"></div>
      
      {/* Power Button */}
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -right-[19px] top-[100px] rounded-r-lg"></div>
      
      {/* Volume Buttons */}
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -right-[19px] top-[160px] rounded-r-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -right-[19px] top-[214px] rounded-r-lg"></div>
      
      {/* Screen Area */}
      <div className="rounded-[1.5rem] overflow-hidden w-full h-full bg-white dark:bg-gray-900 relative border border-gray-900">
        {/* Children will usually be full height and scrollable */}
        {children}
      </div>
    </div>
  );
}
