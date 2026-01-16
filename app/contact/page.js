'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const contactInfo = [
        {
            id: 1,
            type: "Email",
            value: "support@hargharrozgaar.com",
            icon: "✉️",
            description: "For support inquiries and general questions",
            color: "from-amber-500 to-orange-500",
            bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
            action: "mailto:support@hargharrozgaar.com"
        },
        {
            id: 2,
            type: "Business Email",
            value: "business@hargharrozgaar.com",
            icon: "💼",
            description: "For partnership and business opportunities",
            color: "from-orange-500 to-amber-400",
            bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
            action: "mailto:business@hargharrozgaar.com"
        },
        {
            id: 3,
            type: "Instagram",
            value: "@harghar_rozgaar",
            icon: "📱",
            description: "Follow us for updates and community",
            color: "from-pink-500 to-orange-400",
            bgColor: "bg-gradient-to-br from-pink-50 to-orange-50",
            action: "https://instagram.com/harghar_rozgaar"
        },
        {
            id: 4,
            type: "Phone",
            value: "+91 98765 43210",
            icon: "📞",
            description: "Available Mon-Fri, 10AM-6PM IST",
            color: "from-green-500 to-amber-400",
            bgColor: "bg-gradient-to-br from-green-50 to-amber-50",
            action: "tel:+919876543210"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
            {/* Back Button - Minimal */}
            <button
                onClick={handleBack}
                className="fixed top-8 left-8 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-full hover:bg-white hover:border-amber-300 transition-all group"
            >
                <div className="flex items-center gap-2">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-amber-600 group-hover:-translate-x-1 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-medium text-amber-700">Back</span>
                </div>
            </button>

            {/* Main Content */}
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                {/* Brand Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                            <span className="text-3xl text-white">✉️</span>
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold text-slate-900">Contact Us</h1>
                            {/* <p className="text-amber-600 font-semibold tracking-wide uppercase text-sm mt-2">Contact Us</p> */}
                        </div>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-slate-900 mb-6 max-w-2xl">
                        Get in Touch With <span className="text-amber-500">Our Team</span>
                    </h2>
                    <p className="text-slate-600 text-lg max-w-xl mx-auto">
                        We're here to help you start your earning journey. Reach out through any channel below.
                    </p>
                </div>

                {/* Contact Cards Grid */}
                <div className="max-w-6xl w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {contactInfo.map((contact) => (
                            <div 
                                key={contact.id}
                                className={`${contact.bgColor} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-white/50`}
                            >
                                {/* Icon with Gradient */}
                                <div className={`w-20 h-20 bg-gradient-to-br ${contact.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                    <span className="text-3xl">{contact.icon}</span>
                                </div>
                                
                                {/* Contact Type */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                    {contact.type}
                                </h3>
                                
                                {/* Contact Value - Highlighted */}
                                <a 
                                    href={contact.action}
                                    target={contact.type === "Instagram" ? "_blank" : "_self"}
                                    rel={contact.type === "Instagram" ? "noopener noreferrer" : ""}
                                    className="inline-block"
                                >
                                    <div className={`text-2xl font-bold bg-gradient-to-r ${contact.color} bg-clip-text text-transparent py-2 hover:scale-105 transition-transform`}>
                                        {contact.value}
                                    </div>
                                </a>
                                
                                {/* Description */}
                                <p className="text-slate-600 mt-4 text-sm">
                                    {contact.description}
                                </p>
                                
                                {/* Action Button */}
                                <a 
                                    href={contact.action}
                                    target={contact.type === "Instagram" ? "_blank" : "_self"}
                                    rel={contact.type === "Instagram" ? "noopener noreferrer" : ""}
                                    className={`inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r ${contact.color} text-white rounded-full hover:shadow-xl transition-all hover:scale-105`}
                                >
                                    <span className="font-bold">
                                        {contact.type === "Email" || contact.type === "Business Email" 
                                            ? "Send Email" 
                                            : contact.type === "Instagram" 
                                            ? "Follow Now"
                                            : "Call Now"}
                                    </span>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-4 w-4" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Additional Info Section */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl p-8 border border-amber-200/50">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                    ✨ Quick Support Response
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        <span className="text-slate-700">Email Response: Within 24 hours</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        <span className="text-slate-700">Business Days: Monday - Friday</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        <span className="text-slate-700">Time Zone: IST (UTC+5:30)</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🏢</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900">Office Address</h4>
                                    <p className="text-slate-600 text-sm mt-2">
                                        Harghar Rozgaar HQ<br />
                                        Mumbai, Maharashtra<br />
                                        India 400001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="relative mt-16">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 bg-gradient-to-r from-amber-300 to-orange-400 rounded-full blur-3xl opacity-20"></div>
                        </div>
                        
                        <div className="relative text-center">
                            <h3 className="text-3xl font-bold text-slate-900 mb-6">
                                Join Our <span className="text-amber-500">Community</span>
                            </h3>
                            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                                Follow us on social media to stay updated with the latest opportunities, 
                                success stories, and community events.
                            </p>
                            
                            <div className="flex flex-wrap justify-center gap-4">
                                <SocialButton 
                                    platform="Instagram" 
                                    color="from-pink-500 to-orange-400"
                                    icon="📸"
                                    handle="@harghar_rozgaar"
                                />
                                <SocialButton 
                                    platform="Facebook" 
                                    color="from-blue-600 to-blue-400"
                                    icon="👥"
                                    handle="/hargharrozgaar"
                                />
                                <SocialButton 
                                    platform="LinkedIn" 
                                    color="from-blue-700 to-blue-500"
                                    icon="💼"
                                    handle="Harghar Rozgaar"
                                />
                                <SocialButton 
                                    platform="Twitter" 
                                    color="from-blue-400 to-cyan-400"
                                    icon="🐦"
                                    handle="@harghar_rozgaar"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-16 pt-8 border-t border-amber-200/30 text-center">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Harghar Rozgaar. All rights reserved.<br />
                        <span className="text-amber-600 font-medium">
                            Empowering honest reviews, creating job opportunities.
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function SocialButton({ platform, color, icon, handle }) {
    return (
        <a 
            href="#"
            className={`group flex items-center gap-3 px-6 py-4 bg-gradient-to-r ${color} text-white rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
        >
            <span className="text-2xl">{icon}</span>
            <div className="text-left">
                <div className="font-bold">{platform}</div>
                <div className="text-sm opacity-90">{handle}</div>
            </div>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </a>
    );
}