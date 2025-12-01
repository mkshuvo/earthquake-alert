'use client';

import { useMouseParallax, useParallax } from '../../hooks/useParallax';

const ParallaxBackground = () => {
  const scrollY = useParallax();
  const mousePosition = useMouseParallax();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      <div
        className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * -40}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate(calc(-50% + ${mousePosition.x * 20}px), calc(-50% + ${mousePosition.y * 20}px))`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
    </div>
  );
};

export default ParallaxBackground;
