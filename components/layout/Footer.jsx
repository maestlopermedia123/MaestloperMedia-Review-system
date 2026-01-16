'use client';
import Link from 'next/link';
import Image from "next/image";
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0B0F1A] border-t border-slate-800/50 pt-20 pb-10 font-['Poppins'] text-slate-400">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                    
                    {/* Brand Section */}
                    <div className="max-w-xs">
                        <div className="flex items-center gap-3 mb-6">
                             <div className="relative w-16 h-16 sm:w-44 sm:h-44">
                                  <Image
                                      src="/Har-Ghar-Rozgaar.png"
                                      alt="Harghar Rozgaar Logo"
                                      fill
                                      priority
                                      className="object-contain transition-transform duration-200 group-hover:scale-105"
                                  />
                              </div>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500 font-medium tracking-wide">
                            Empowering individuals to earn through honest reviews. Creating job opportunities from home.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-16 md:gap-24">
                        <div className="space-y-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/80">Company</h4>
                            <ul className="space-y-3">
                                <li><FooterLink href="/" label="Home" /></li>
                                <li><FooterLink href="#features" label="Features" /></li>
                                <li><FooterLink href="#how-it-works" label="How it Works" /></li>
                            </ul>
                        </div>
                        <div className="space-y-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-200">Support</h4>
                            <ul className="space-y-3">
                                <li><FooterLink href="/contact" label="Contact Us" /></li>
                                <li><FooterLink href="/faq" label="FAQ" /></li>
                                <li><FooterLink href="/privacy" label="Privacy Policy" /></li>
                            </ul>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="hidden lg:block text-right">
                        <p className="text-[10px] font-medium text-slate-600 tracking-widest uppercase">India • Remote</p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                        © {currentYear} Harghar Rozgaar. Empowering Honest Reviews.
                    </p>
                    
                    <div className="flex gap-8">
                        <SocialIcon label="Instagram" />
                        <SocialIcon label="LinkedIn" />
                        <SocialIcon label="Twitter" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, label }) {
    return (
        <Link 
            href={href} 
            className="text-[11px] font-bold text-slate-500 hover:text-white transition-all duration-300 tracking-wide uppercase"
        >
            {label}
        </Link>
    );
}

function SocialIcon({ label }) {
    return (
        <button className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-amber-500 transition-colors">
            {label}
        </button>
    );
}