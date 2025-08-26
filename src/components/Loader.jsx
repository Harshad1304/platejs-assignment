import React from "react";

const Loader = () => {
  return (
    <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
      <div className="flex items-center space-x-2 text-white">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-300"></div>
        <span>Processing...</span>
      </div>
    </div>
  );
};

export default Loader;
