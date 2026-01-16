'use client';
import Link from 'next/link';
import Image from 'next/image';
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0F1A] border-t border-slate-800/50 pt-20 pb-10 font-['Poppins'] text-slate-400">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
               <div className="relative w-26 h-26 sm:w-40 sm:h-40">
              
                  <Image
                    src="/Har-Ghar-Rozgaar.png"
                    alt="Review System Logo"
                    fill
                    priority
                    className="object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
            </Link>
            <p className="text-[11px] leading-relaxed text-slate-500 font-medium tracking-wide">
              India's Local Work & Earning Network
            </p>
          </div>

          {/* Minimal Links - Dimmed */}
          <div className="grid grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/80">Navigation</h4>
              <ul className="space-y-3">
                <li><FooterLink href="/dashboard" label="Dashboard" /></li>
                <li><FooterLink href="/wallet" label="My Wallet" /></li>
              </ul>
            </div>
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-200">Legal</h4>
              <ul className="space-y-3">
                <li><FooterLink href="/privacy" label="Privacy Policy" /></li>
                <li><FooterLink href="/terms" label="Member Terms" /></li>
              </ul>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="hidden lg:block text-right">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full mb-4"> */}
               {/* <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-70"></span> */}
               {/* <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Encrypted Connection</span> */}
            {/* </div> */}
            <p className="text-[10px] font-medium text-slate-600 tracking-widest uppercase">Boisar • MH • IN</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
            © {currentYear} Review. Crafted for Excellence.
          </p>
          
          <div className="flex gap-8">
            <SocialIcon label="Instagram" />
            <SocialIcon label="LinkedIn" />
            <SocialIcon label="X" />
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