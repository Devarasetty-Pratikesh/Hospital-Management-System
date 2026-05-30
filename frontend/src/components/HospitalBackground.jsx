import React from 'react';

const HospitalBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-slate-50/50">
      {/* 1. Dynamic Glowing Mesh Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/10 blur-[120px] animate-mesh-blob-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/10 blur-[140px] animate-mesh-blob-2" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-400/5 blur-[100px] animate-mesh-blob-3" />
      <div className="absolute bottom-[20%] left-[20%] w-[45%] h-[45%] rounded-full bg-teal-400/8 blur-[110px] animate-mesh-blob-4" />

      {/* 2. Abstract Grid Lines for High-Tech Medical Feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* 3. Animated ECG Heartbeat Lines */}
      {/* Top Floating ECG Line */}
      <svg className="absolute top-[15%] left-0 w-full h-32 opacity-25 text-emerald-500" preserveAspectRatio="none" viewBox="0 0 1200 100">
        <path
          d="M 0,50 L 300,50 L 315,50 L 325,15 L 335,85 L 345,35 L 355,55 L 365,50 L 380,50 L 700,50 L 715,50 L 725,15 L 735,85 L 745,35 L 755,55 L 765,50 L 780,50 L 1200,50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="animate-ecg-draw"
          style={{ strokeDasharray: '1200', strokeDashoffset: '1200' }}
        />
      </svg>

      {/* Bottom Floating ECG Line */}
      <svg className="absolute bottom-[10%] left-0 w-full h-32 opacity-20 text-blue-500" preserveAspectRatio="none" viewBox="0 0 1200 100">
        <path
          d="M 0,50 L 150,50 L 165,50 L 175,20 L 185,80 L 195,40 L 205,60 L 215,50 L 230,50 L 600,50 L 615,50 L 625,20 L 635,80 L 645,40 L 655,60 L 665,50 L 680,50 L 1000,50 L 1015,50 L 1025,20 L 1035,80 L 1045,40 L 1055,60 L 1065,50 L 1080,50 L 1200,50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="animate-ecg-draw-reverse"
          style={{ strokeDasharray: '1200', strokeDashoffset: '1200' }}
        />
      </svg>

      {/* 4. Drifting Glassmorphic Medical Icons */}
      <div className="absolute inset-0 select-none overflow-hidden">
        {/* Floating Cross 1 */}
        <div className="absolute top-[20%] left-[10%] opacity-15 text-emerald-600 animate-float-slow">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
          </svg>
        </div>

        {/* Floating Heart with Heartbeat */}
        <div className="absolute top-[45%] right-[8%] opacity-20 text-rose-500 animate-float-medium">
          <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        {/* Floating DNA double helix */}
        <div className="absolute bottom-[25%] left-[5%] opacity-15 text-blue-500 animate-float-slow2">
          <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(45deg)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 10.5C6 7.5 9 6 12 6s6 1.5 7.5 4.5M4.5 13.5C6 16.5 9 18 12 18s6-1.5 7.5-4.5M12 6v12M7.5 8.5v7M16.5 8.5v7" />
          </svg>
        </div>

        {/* Floating Cross 2 */}
        <div className="absolute bottom-[15%] right-[25%] opacity-15 text-emerald-500 animate-float-fast">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Floating Stethoscope outline */}
        <div className="absolute top-[8%] right-[30%] opacity-10 text-teal-600 animate-float-medium">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11V9a4 4 0 00-8 0v2m8 0a4 4 0 11-8 0m8 0V9a4 4 0 00-8 0v2M5 5a2 2 0 100 4h1a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2" />
          </svg>
        </div>

        {/* Floating Capsule/Pill */}
        <div className="absolute top-[65%] left-[25%] opacity-15 text-teal-500 animate-float-slow">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(120deg)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>

        {/* Floating Molecules */}
        <div className="absolute top-[35%] left-[45%] opacity-10 text-emerald-500 animate-float-slow2">
          <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 10a2 2 0 11-4 0 2 2 0 014 0zM7 8a3 3 0 100-6 3 3 0 000 6zM21 21a3 3 0 100-6 3 3 0 000 6zM5 19a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HospitalBackground;
