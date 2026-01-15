'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function WalletPage() {
  const { user, refreshUser, loading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);

  // Fetch transactions when user is available
  useEffect(() => {
    if (!user?._id) return;

    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/transaction/${user._id}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch transactions: ${res.status}`);
        }

        const result = await res.json();
        const transactions = result.data || [];

        setTransactions(transactions);

        // Calculate total money received (all positive amounts)
        const totalReceived = transactions.reduce((total, tx) => {
          const amount = Number(tx.amount) || 0;
          // Since all transactions are money received, just add them all
          return total + Math.abs(amount); // Use absolute value to ensure positive
        }, 0);

        setTotalEarnings(totalReceived);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user?._id]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter transactions - all are money received
  const allTransactions = transactions; // All transactions show money received
  
  // Calculate today's earnings
  const todayEarnings = allTransactions
    .filter(t => {
      const transactionDate = new Date(t.createdAt);
      const today = new Date();
      return transactionDate.toDateString() === today.toDateString();
    })
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);

  // Calculate monthly earnings
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyEarnings = allTransactions
    .filter(t => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);

  // Get recent transactions (last 10)
  const recentTransactions = allTransactions.slice(0, 10);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-sm text-slate-500">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100 max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Error Loading Data</h3>
          <p className="text-sm text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white font-['Poppins'] text-slate-900 pb-20">
      
      {/* 1. TOP HEADER SECTION - TOTAL MONEY RECEIVED */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-cyan-900 pt-28 pb-36 px-6 sm:px-10">
        {/* subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">

            {/* LEFT */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200 mb-3">
                Total Earnings
              </p>

              <h1 className="flex items-end gap-2 text-white font-extrabold tracking-tight">
                <span className="text-5xl sm:text-6xl lg:text-7xl">
                  {formatCurrency(totalEarnings).replace('₹', '').split('.')[0]}
                </span>
                <span className="text-2xl sm:text-3xl text-cyan-300 mb-2">
                  {formatCurrency(totalEarnings).includes('.')
                    ? '.' + formatCurrency(totalEarnings).split('.')[1]
                    : '.00'}
                </span>
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
                  💳 Direct Bank Transfer
                </span>
                <p className="text-sm text-cyan-100/90">
                  Payments are credited securely to your bank account
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-start lg:justify-end">
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-10 py-5">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-lg">✅</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-cyan-200">
                      Status
                    </p>
                    <p className="text-sm font-semibold">
                      Money Received
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* EARNINGS & INCOME ANALYSIS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-emerald-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(6,95,70,0.08)]">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-emerald-600">Today's Receipts</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-slate-900">+{formatCurrency(todayEarnings)}</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                      Received Today
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Money received in your bank account today
                  </p>
                </div>

                {/* Animated Trend Graph (CSS only) */}
                <div className="flex items-end gap-1.5 h-12">
                  {allTransactions.slice(0, 10).map((transaction, i) => {
                    const amount = Math.abs(parseFloat(transaction.amount) || 0);
                    const maxAmount = Math.max(...allTransactions.slice(0, 10).map(t => Math.abs(parseFloat(t.amount) || 0)));
                    const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                    
                    return (
                      <div key={i} className="w-1.5 bg-emerald-900/5 rounded-full relative overflow-hidden h-full">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-4">
                {allTransactions.slice(0, 3).map((transaction, index) => (
                  <IncomeMetric 
                    key={transaction._id}
                    label={transaction.description || `Money Received`}
                    amount={`+${formatCurrency(Math.abs(transaction.amount))}`}
                    date={formatDate(transaction.createdAt)}
                    icon="💰"
                  />
                ))}
                
                <div className="pt-4 mt-4 border-t border-emerald-50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    Total Received in {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </span>
                  <span className="text-sm font-bold text-emerald-700">+{formatCurrency(monthlyEarnings)}</span>
                </div>
              </div>
            </div>

            {/* MONEY RECEIVED HISTORY */}
            <div className="bg-white border border-emerald-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(6,95,70,0.05)]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-emerald-600">Money Received History</h2>
                  <p className="text-[11px] text-slate-500 mt-1">All amounts transferred to your bank account</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  {allTransactions.length} receipts
                </span>
              </div>
              
              <div className="space-y-1">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <TransactionRow
                      key={transaction._id}
                      name={transaction.description || 'Money Received'}
                      date={formatDate(transaction.createdAt)}
                      amount={`+${formatCurrency(Math.abs(transaction.amount))}`}
                      status={
                        transaction.status === 'completed' ? 'Success' :
                        transaction.status === 'pending' ? 'Processing' :
                        transaction.status === 'failed' ? 'Failed' : 'Received'
                      }
                      icon="💰"
                    />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-4 opacity-20">💳</div>
                    <p className="text-sm text-slate-500">No money receipts yet</p>
                    <p className="text-xs text-slate-400 mt-1">Start earning to receive money in your bank</p>
                  </div>
                )}
              </div>
              
              {allTransactions.length > 10 && (
                <div className="mt-8 text-center">
                  <button className="px-6 py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium border border-emerald-200 rounded-xl hover:border-emerald-300 transition-colors">
                    View All Receipts ({allTransactions.length})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR - STATISTICS */}
          <div className="space-y-8">
            {/* EARNINGS SUMMARY */}
            <div className="bg-white border border-emerald-100 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(6,95,70,0.05)]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6">Receipts Summary</h4>
              
              <div className="space-y-4">
                <StatItem 
                  label="Total Money Received" 
                  value={`+${formatCurrency(totalEarnings)}`}
                  color="text-emerald-700"
                  count={allTransactions.length}
                  icon="💰"
                />
                <StatItem 
                  label="This Month" 
                  value={`+${formatCurrency(monthlyEarnings)}`}
                  color="text-emerald-600"
                  count={allTransactions.filter(t => {
                    const date = new Date(t.createdAt);
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                  }).length}
                  icon="📅"
                />
                <StatItem 
                  label="Today" 
                  value={`+${formatCurrency(todayEarnings)}`}
                  color="text-emerald-500"
                  count={allTransactions.filter(t => {
                    const date = new Date(t.createdAt);
                    const today = new Date();
                    return date.toDateString() === today.toDateString();
                  }).length}
                  icon="🌞"
                />
              </div>
            </div>

            {/* BANK TRANSFER INFO */}
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-[2.5rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-6">💳 Bank Transfer</h4>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/50 rounded-xl border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Direct Bank Transfer</p>
                      <p className="text-[10px] text-emerald-600">All earnings go directly to your bank</p>
                    </div>
                    <div className="text-emerald-600 text-xl">🏦</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <span className="text-emerald-600 text-sm">✓</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Instant Processing</p>
                      <p className="text-[10px] text-slate-600">Money transferred within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <span className="text-emerald-600 text-sm">✓</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Zero Fees</p>
                      <p className="text-[10px] text-slate-600">No charges for bank transfers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <span className="text-emerald-600 text-sm">✓</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Secure & Safe</p>
                      <p className="text-[10px] text-slate-600">Bank-level security for all transfers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT RECEIPTS */}
            <div className="bg-white border border-emerald-100 rounded-[2.5rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6">Recent Receipts</h4>
              
              <div className="space-y-3">
                {recentTransactions.slice(0, 4).map((transaction) => (
                  <div key={transaction._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50/50 transition-colors">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                      💰
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">Money Received</p>
                      <p className="text-[10px] text-slate-400">{formatDate(transaction.createdAt)}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">
                      +{formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function IncomeMetric({ label, amount, date, icon }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-50 hover:bg-emerald-50/30 transition-all group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
          {icon || '💰'}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">{label}</span>
          <span className="text-[9px] text-emerald-500 uppercase tracking-widest">{date}</span>
        </div>
      </div>
      <span className="text-sm font-bold text-emerald-600 group-hover:scale-110 transition-transform">
        {amount}
      </span>
    </div>
  );
}

function TransactionRow({ name, date, amount, status, icon }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-emerald-50 last:border-0 hover:bg-emerald-50/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
          {icon || '💰'}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{name}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[9px] text-emerald-500">{date}</p>
            <p className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
              status === 'Success' || status === 'Received' ? 'bg-emerald-50 text-emerald-500' : 
              status === 'Processing' ? 'bg-amber-50 text-amber-500' : 
              status === 'Failed' ? 'bg-rose-50 text-rose-500' : 
              'bg-slate-50 text-slate-400'
            }`}>
              {status}
            </p>
          </div>
        </div>
      </div>
      <p className="text-sm font-bold text-emerald-600">
        {amount}
      </p>
    </div>
  );
}

function StatItem({ label, value, color, count, icon }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-100 hover:bg-emerald-50/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-lg">{icon || '💰'}</div>
        <div>
          <p className="text-xs font-medium text-slate-700">{label}</p>
          <p className="text-[10px] text-emerald-500">{count} receipt{count !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}