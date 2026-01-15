'use client';
import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginRegister() {
  const { login } = useAuth(); // 🔑 single source of truth

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileno: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 🔹 REGISTER FLOW
      if (!isLogin) {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Switch to login mode after successful register
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', mobileno: '' });
        return;
      }

      // 🔹 LOGIN FLOW (ONLY THIS)
      await login(formData.email, formData.password);

      // 🚫 NO router.push
      // 🚫 NO role check
      // 🚫 NO API call here

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 md:p-6 font-['Poppins']">
      <div className="relative w-full max-w-[460px] md:max-w-[500px]">
        {/* Background shadow effect */}
        <div className="absolute inset-0 bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_15px_40px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] border border-white/50"></div>

        {/* Main card */}
        <div className="relative bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 p-6 md:p-10 lg:p-12 overflow-hidden">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>

          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center mb-4 md:mb-5">
              <div className="relative w-28 h-28 md:w-36 md:h-36">
                <Image
                  src="/Har-Ghar-Rozgaar.png"
                  alt="Har Ghar Rozgaar Logo"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 112px, 144px"
                />
              </div>
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-600 tracking-wider md:tracking-[0.02em]">
              India's Local Work & Earning Network
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 md:space-y-5">
            {!isLogin && (
              <div className="group space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1.5">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50/70 border border-slate-100 rounded-xl md:rounded-2xl text-sm md:text-[15px] outline-none focus:ring-3 focus:ring-amber-400/10 focus:border-amber-400/30 transition-all"
                />
              </div>
            )}

            <div className="group space-y-1.5 md:space-y-2">
              <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1.5">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50/70 border border-slate-100 rounded-xl md:rounded-2xl text-sm md:text-[15px] outline-none focus:ring-3 focus:ring-amber-400/10 focus:border-amber-400/30 transition-all"
              />
            </div>

            <div className="group space-y-1.5 md:space-y-2">
              <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50/70 border border-slate-100 rounded-xl md:rounded-2xl text-sm md:text-[15px] outline-none focus:ring-3 focus:ring-amber-400/10 focus:border-amber-400/30 transition-all"
              />
            </div>

            {!isLogin && (
              <div className="group space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1.5">
                  Mobile Number
                </label>
                <input
                  name="mobileno"
                  type="tel"
                  value={formData.mobileno}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50/70 border border-slate-100 rounded-xl md:rounded-2xl text-sm md:text-[15px] outline-none focus:ring-3 focus:ring-amber-400/10 focus:border-amber-400/30 transition-all"
                />
              </div>
            )}

            {error && (
              <div className="mt-2 md:mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-xs md:text-[13px] text-red-600 text-center font-medium">
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-4 md:mt-5 py-3.5 md:py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl md:rounded-2xl text-xs md:text-[13px] font-bold uppercase tracking-[0.15em] shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isLoading
                ? 'Please wait...'
                : isLogin
                ? 'Sign In to Account'
                : 'Create Account'}
            </button>
          </div>

          {/* Toggle */}
          <div className="mt-8 md:mt-10 text-center">
            <p className="text-xs md:text-[13px] text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-slate-900 hover:text-amber-600 transition-colors"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Footer note */}
          <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-slate-100">
            <p className="text-[11px] md:text-xs text-slate-400 text-center">
              Secure login powered by Har Ghar Rozgaar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}