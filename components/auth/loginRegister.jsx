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
        setFormData({ name: '', email: '', password: '' });
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
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 font-['Poppins']">
      <div className="relative w-full max-w-[480px]">
        <div className="absolute inset-0 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] border border-white/50"></div>

        <div className="relative bg-white rounded-[3rem] border border-slate-100 p-10 sm:p-14 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>

          {/* Header */}
          <div className="text-center mb-10">
               <div className="flex items-center justify-center mb-6">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <Image
                      src="/Har-Ghar-Rozgaar.png"
                      alt="Har Ghar Rozgaar Logo"
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>
                </div>
            {/* <h1 className="text-2xl font-bold italic uppercase tracking-[0.1em]">
              Har Ghar Rozgaar
            </h1> */}
            <p className="text-xs font-semibold text-slate-500 tracking-wider mt-2 text-center">
              India's Local Work & Earning Network
            </p>

          </div>

          {/* Form */}
          <div className="space-y-5">
            {!isLogin && (
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-amber-400/5"
                />
              </div>
            )}

            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@gmail.com"
                className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-amber-400/5"
              />
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-amber-400/5"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-4 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all disabled:opacity-60"
            >
              {isLoading
                ? 'Please wait...'
                : isLogin
                ? 'Login'
                : 'Sign Up'}
            </button>
          </div>

          {/* Toggle */}
          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400">
              {isLogin ? 'New here?' : 'Joined already?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-black text-slate-900 uppercase tracking-widest hover:text-amber-500"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
