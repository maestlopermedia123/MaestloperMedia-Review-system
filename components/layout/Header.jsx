'use client';
import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, logout, loading } = useAuth();
    const [userName, setUserName] = React.useState('');
    React.useEffect(() => {
        if (user && user.name) {
            setUserName(user.name);
        }
    }, [user]);

    const pathname = usePathname();

    return (
        <nav className="bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                
                {/* Brand */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-16 h-16 sm:w-34 sm:h-24">
                        <Image
                            src="/Har-Ghar-Rozgaar.png"
                            alt="Harghar Rozgaar Logo"
                            fill
                            priority
                            className="object-contain transition-transform duration-200 group-hover:scale-105"
                        />
                    </div>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex gap-10 text-[13px] font-semibold tracking-widest uppercase">
                    <NavItem 
                        label="Home" 
                        href="/" 
                        active={pathname === '/'} 
                    />
                    {user ? (
                        <>
                            <NavItem 
                                label="Dashboard" 
                                href="/dashboard" 
                                active={pathname === '/dashboard'} 
                            />
                            <NavItem 
                                label="Profile" 
                                href="/profile" 
                                active={pathname === '/profile'} 
                            />
                            <NavItem 
                                label="Contact" 
                                href="/contact" 
                                active={pathname === '/contact'} 
                            />
                        </>
                    ) : (
                        <>
                            <NavItem 
                                label="Features" 
                                href="#features" 
                                active={false}
                            />
                            <NavItem 
                                label="How it Works" 
                                href="#how-it-works" 
                                active={false}
                            />
                            <NavItem 
                                label="Contact" 
                                href="/contact" 
                                active={false}
                            />

                        </>
                    )}
                </div>

                {/* Action Area */}
                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            {/* Wallet Link for logged-in users */}
                            <Link 
                                href="/wallet" 
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
                                    pathname === '/wallet' 
                                        ? 'bg-slate-900 text-amber-400 shadow-lg' 
                                        : 'hover:bg-slate-200/50 text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <div className="relative">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        className="w-5 h-5 transition-transform group-hover:scale-110"
                                    >
                                        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
                                        <path d="M18 12H22" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-slate-50"></span>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest hidden lg:block">Wallet</span>
                            </Link>

                            {/* User Profile for logged-in users */}
                            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold text-slate-900">{userName}</p>
                                    <p className="text-[10px] text-amber-600 font-bold tracking-tighter uppercase">Member</p>
                                    <button
                                        onClick={logout}
                                        className="text-[10px] text-red-500 hover:text-red-700 font-semibold tracking-wide"
                                    >
                                        Logout
                                    </button>
                                </div>
                                <Link href="/profile">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center font-bold text-slate-400 hover:border-amber-200 hover:shadow-md transition-all">
                                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* Login/Signup buttons for non-logged-in users */
                        <div className="flex items-center gap-4">
                            {/* <Link 
                                href="/login" 
                                className="px-6 py-2.5 text-[12px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Login
                            </Link> */}
                            <Link 
                                href="/login" 
                                className="px-6 py-2.5 bg-slate-900 text-white text-[12px] font-bold uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all shadow-sm"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

function NavItem({ label, href, active }) {
    return (
        <Link 
            href={href}
            className={`transition-all relative py-2 ${
                active 
                    ? 'text-slate-900' 
                    : 'text-slate-400 hover:text-slate-600'
            }`}
        >
            {label}
            {active && (
                <span className="absolute -bottom-[31px] left-0 w-full h-1 bg-amber-400 rounded-t-full shadow-[0_-4px_10px_rgba(251,191,36,0.4)]"></span>
            )}
        </Link>
    );
}