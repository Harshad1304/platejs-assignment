import React from "react";

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 px-6 py-3 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-center text-sm text-gray-400">
        <div className="hidden md:flex items-center space-x-4">
          <span>Press "/" for commands</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
