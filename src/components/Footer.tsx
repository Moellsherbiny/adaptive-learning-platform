"use client";

export default function Footer() {
  return (
    <footer className="relative bg-black text-white py-4 overflow-hidden">
      {/* Animated gradient orb */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="container mx-auto px-2 relative z-10">
        {/* Main content in a centered card */}
        <div className="max-w-2xl mx-auto text-center space-y-8">

  {/* Email with creative styling */}
          <a 
            href="mailto:mai_badran@du.edu.eg"
            className="group inline-block"
          >
            <div className="flex items-center justify-center gap-3 px-8 py-2  transition-all duration-300">
              <span className="text-lg font-light tracking-wider group-hover:text-purple-300 transition-colors">
                mai_badran@du.edu.eg
              </span>
              <div className="w-2 h-2 bg-purple-400 rounded-full group-hover:animate-ping"></div>
            </div>
          </a>


          {/* Academic badge */}
          <div className="inline-block">
            <div className="px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300">
              <p className="text-sm font-light tracking-wide">Master Degree Research Project</p>
            </div>
          </div>

          {/* Minimal divider */}
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>

          {/* Copyright with creative typography */}
          <div>
            <p className="text-xs font-light tracking-widest text-white/60">
              {new Date().getFullYear()}
            </p>
            <p className="text-sm text-white/80">
              جميع الحقوق محفوظة
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}