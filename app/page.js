'use client';
import React from 'react';
import Link from 'next/link';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* <Header /> */}
            
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-8 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                                Earn While You{' '}
                                <span className="text-amber-500 relative">
                                    Review
                                    <svg className="absolute -bottom-2 left-0 w-full" width="100%" height="8">
                                        <path d="M0,4 Q45,8 90,4 T180,4" stroke="#f59e0b" strokeWidth="3" fill="none" />
                                    </svg>
                                </span>
                            </h1>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Join <span className="font-bold text-slate-900">Harghar Rozgaar</span>, where your honest reviews create opportunities. 
                                Share your insights, build your reputation, and earn rewards from the comfort of your home.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link 
                                    href="/login" 
                                    className="px-8 py-4 bg-slate-900 text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl text-center"
                                >
                                    Start Earning Now
                                </Link>
                                <Link 
                                    href="#how-it-works" 
                                    className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 text-sm font-bold uppercase tracking-widest rounded-full hover:border-slate-300 transition-all text-center"
                                >
                                    Learn More
                                </Link>
                            </div>
                            
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 pt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900">10K+</div>
                                    <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Active Members</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900">₹2M+</div>
                                    <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Paid Out</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900">50K+</div>
                                    <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Reviews</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Image/Illustration */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-3xl p-8 shadow-2xl shadow-amber-100/50">
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">⭐</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500">Today's Earnings</div>
                                                <div className="text-2xl font-bold text-slate-900">₹450</div>
                                            </div>
                                        </div>
                                        <div className="h-32 bg-gradient-to-r from-amber-400 to-amber-300 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-2xl font-bold">Your Review = Your Income</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <div className="text-xs text-slate-500">Reviews This Week</div>
                                                <div className="text-xl font-bold text-slate-900">12</div>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <div className="text-xs text-slate-500">Total Earnings</div>
                                                <div className="text-xl font-bold text-slate-900">₹8,450</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-600 mb-4">Why Choose Us</h2>
                        <h3 className="text-3xl font-bold text-slate-900">Turn Your Opinions Into Income</h3>
                        <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
                            We've created a platform that values your insights and rewards your time
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon="💸"
                            title="Earn Real Money"
                            description="Get paid for every genuine review. Withdraw anytime to your bank account."
                        />
                        <FeatureCard 
                            icon="📱"
                            title="Flexible Work"
                            description="Review products anytime, anywhere. No fixed hours, complete freedom."
                        />
                        <FeatureCard 
                            icon="🏆"
                            title="Build Reputation"
                            description="Gain credibility and unlock higher-paying review opportunities."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-600 mb-4">Simple Process</h2>
                        <h3 className="text-3xl font-bold text-slate-900">Start Earning in 3 Steps</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StepCard 
                            number="01"
                            title="Sign Up & Verify"
                            description="Create your account and complete quick verification process"
                        />
                        <StepCard 
                            number="02"
                            title="Choose Products"
                            description="Browse available products and select ones you'd like to review"
                        />
                        <StepCard 
                            number="03"
                            title="Review & Earn"
                            description="Share honest reviews and watch your earnings grow"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Ready to Start Your Review Journey?
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                        Join thousands who are already earning by sharing their valuable opinions. 
                        No experience needed, just honesty and a few minutes of your time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/signup" 
                            className="px-8 py-4 bg-amber-500 text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-amber-600 transition-all shadow-lg"
                        >
                            Join Free Today
                        </Link>
                        <Link 
                            href="/login" 
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-white/20 transition-all border border-white/20"
                        >
                            Already a Member? Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* <Footer /> */}
        </div>
    );
}

// Reusable Components
function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-6">{icon}</div>
            <h4 className="text-xl font-bold text-slate-900 mb-4">{title}</h4>
            <p className="text-slate-600">{description}</p>
        </div>
    );
}

function StepCard({ number, title, description }) {
    return (
        <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-5xl font-bold text-slate-900/10 mb-6">{number}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{title}</h4>
                <p className="text-slate-600">{description}</p>
            </div>
            {number !== "03" && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-200"></div>
            )}
        </div>
    );
}