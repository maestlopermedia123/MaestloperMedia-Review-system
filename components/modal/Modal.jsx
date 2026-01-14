'use client';
import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 italic tracking-tight uppercase">{title}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Review Entry System</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  );
}