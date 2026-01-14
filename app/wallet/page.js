'use client';
import React from 'react';

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-['Poppins'] text-slate-900 pb-20">
      
      {/* 1. TOP HEADER SECTION (INR FOCUS) */}
      <div className="bg-slate-900 pt-32 pb-40 px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:30px_30px]"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-2">Available Balance</h3>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter italic">
                ₹8,42,580<span className="text-amber-500 opacity-50 text-3xl">.00</span>
              </h1>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button className="px-10 py-4 bg-amber-500 text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20">
                Add Funds
              </button>
              <button className="px-10 py-4 bg-transparent border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* EARNINGS & INCOME ANALYSIS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Review Earnings</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-slate-900">+₹5.24</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                      Today's Credit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Based on your recent product reviews history</p>
                </div>

                {/* Animated Trend Graph (CSS only) */}
                <div className="flex items-end gap-1.5 h-12">
                   {[30, 50, 40, 70, 45, 90, 65, 80, 55, 100].map((h, i) => (
                     <div key={i} className="w-1.5 bg-slate-900/5 rounded-full relative overflow-hidden h-full">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                          style={{ height: `${h}%` }}
                        ></div>
                     </div>
                   ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <IncomeMetric label="Base Review Reward" amount="₹2.00" date="10:45 AM" />
                <IncomeMetric label="Quality Bonus (5★ Review)" amount="₹3.24" date="02:15 PM" />
                <div className="pt-4 mt-4 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total for January 2026</span>
                  <span className="text-sm font-bold text-slate-900">₹1,450.00</span>
                </div>
              </div>
            </div>

            {/* RECENT TRANSACTION LOGS */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Transaction Log</h2>
              <div className="space-y-1">
                <TransactionRow name="Payment to Aurum Merchant" date="05 Jan" amount="-₹1,200" status="Success" />
                <TransactionRow name="Review Credit: Product #992" date="04 Jan" amount="+₹5.24" status="Credit" />
                <TransactionRow name="Bank Withdrawal (HDFC)" date="02 Jan" amount="-₹15,000" status="Processing" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            {/* SAVINGS CARD */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6">
                 <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center">
                    <span className="text-amber-500 text-xs">₹</span>
                 </div>
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Saving Vaults</h4>
               <p className="text-3xl font-bold mb-1">₹45,000</p>
               <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-8">6.5% Annual Interest</p>
               <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                 View Breakdown
               </button>
            </div>

            {/* QUICK LINK CARD */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Linked Account</h4>
               <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-bold">HDFC</div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">HDFC Savings</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">**** 9012</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function IncomeMetric({ label, amount, date }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-all group">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-700">{label}</span>
        <span className="text-[9px] text-slate-400 uppercase tracking-widest">{date}</span>
      </div>
      <span className="text-sm font-bold text-emerald-600 group-hover:scale-110 transition-transform">
        {amount}
      </span>
    </div>
  );
}

function TransactionRow({ name, date, amount, status }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold">
          {date.split(' ')[0]}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800">{name}</p>
          <p className={`text-[9px] font-bold uppercase tracking-widest ${
            status === 'Success' ? 'text-emerald-500' : status === 'Processing' ? 'text-amber-500' : 'text-slate-400'
          }`}>{status}</p>
        </div>
      </div>
      <p className={`text-sm font-bold ${amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>
        {amount}
      </p>
    </div>
  );
}