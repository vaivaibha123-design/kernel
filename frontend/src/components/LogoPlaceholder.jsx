import React from 'react';

/**
 * LogoPlaceholder Component
 * - Configured with a dedicated slot for the custom logo.
 * - To change the logo in the future, simply replace the placeholder container below with your <img> or <svg>.
 */
export default function LogoPlaceholder({ className = "h-9", onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2.5 cursor-pointer group select-none ${className}`}
    >
      {/* --- CUSTOM LOGO SLOT START --- */}
      {/* Replace this div with: <img src="/assets/my-logo.png" alt="Kernel" className="h-8 w-auto" /> */}
      <div className="w-8 h-8 rounded-lg border-2 border-dashed border-blue-500/70 bg-blue-50 flex items-center justify-center text-blue-600 transition-all group-hover:border-blue-600 group-hover:bg-blue-100 group-hover:scale-105">
        <span className="font-mono text-xs font-bold uppercase tracking-tighter">K</span>
      </div>
      {/* --- CUSTOM LOGO SLOT END --- */}

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
          Kernel
        </span>
        <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 -mt-1">
          Hardware Hub
        </span>
      </div>
    </div>
  );
}
