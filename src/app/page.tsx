'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      if (isPlaying) {
        el.pause();
        setIsPlaying(false);
      } else {
        await el.play();
        setIsPlaying(true);
      }
    } catch (_) {
      // no-op; user gesture or autoplay restriction
    }
  };
  const activities = [
    {
      title: 'Friendship Quiz',
      description: 'Test how well you know Chaitra!',
      emoji: '💖',
      href: '/quiz',
      color: 'from-pink-400 to-rose-500',
      hoverColor: 'hover:from-pink-500 hover:to-rose-600',
    },
    {
      title: 'Wish Board',
      description: 'Write birthday greetings for Chaitra!',
      emoji: '💝',
      href: '/wishes',
      color: 'from-purple-400 to-pink-500',
      hoverColor: 'hover:from-purple-500 hover:to-pink-600',
    },
    {
      title: 'Study Plan',
      description: 'Plan your daily studies!',
      emoji: '📖',
      href: '/diary',
      color: 'from-blue-400 to-indigo-500',
      hoverColor: 'hover:from-blue-500 hover:to-indigo-600',
    },
    {
      title: 'IQ Test',
      description: 'Challenge your brain power!',
      emoji: '🧠',
      href: '/iq',
      color: 'from-cyan-400 to-blue-500',
      hoverColor: 'hover:from-cyan-500 hover:to-blue-600',
    },
    {
      title: 'Virtual Pet',
      description: 'Take care of a cute puppy!',
      emoji: '🐶',
      href: '/pet',
      color: 'from-green-400 to-emerald-500',
      hoverColor: 'hover:from-green-500 hover:to-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30 bg-gradient-to-br from-pink-100 to-purple-100 min-h-[600px] flex flex-col lg:flex-row-reverse relative">
          {/* Floating emojis */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-6 left-6 text-3xl animate-bounce">🎈</div>
            <div className="absolute bottom-8 right-12 text-2xl animate-pulse">🎊</div>
            <div className="absolute top-10 right-24 text-2xl animate-bounce">✨</div>
          </div>

          {/* Image Section - Right Side */}
          <div className="lg:w-1/2 flex items-center justify-center p-8">
            <img 
              src="/landingpage-bg.png" 
              alt="Birthday background" 
              className="max-w-full max-h-[500px] object-contain rounded-2xl shadow-lg" 
            />
          </div>
          
          {/* Text Section - Left Side */}
          <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
            <div className="text-center lg:text-left max-w-2xl">
              {/* Curved Happy Birthday */}
              <h1 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-baloo2)', fontSize: 'clamp(28px,6vw,64px)', letterSpacing: '2px' }}>
                <span style={{ display: 'inline-block', transform: 'rotate(-6deg)' }}>H</span>
                <span style={{ display: 'inline-block', transform: 'rotate(-4deg)' }}>a</span>
                <span style={{ display: 'inline-block', transform: 'rotate(-2deg)' }}>p</span>
                <span style={{ display: 'inline-block', transform: 'rotate(0deg)' }}>p</span>
                <span style={{ display: 'inline-block', transform: 'rotate(2deg)' }}>y</span>
                <span> </span>
                <span style={{ display: 'inline-block', transform: 'rotate(4deg)' }}>B</span>
                <span style={{ display: 'inline-block', transform: 'rotate(6deg)' }}>i</span>
                <span style={{ display: 'inline-block', transform: 'rotate(8deg)' }}>r</span>
                <span style={{ display: 'inline-block', transform: 'rotate(10deg)' }}>t</span>
                <span style={{ display: 'inline-block', transform: 'rotate(8deg)' }}>h</span>
                <span style={{ display: 'inline-block', transform: 'rotate(6deg)' }}>d</span>
                <span style={{ display: 'inline-block', transform: 'rotate(4deg)' }}>a</span>
                <span style={{ display: 'inline-block', transform: 'rotate(2deg)' }}>y</span>
              </h1>

              {/* Gradient Name with instruction text */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-baloo2)' }}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-500 to-sky-400">Chaitra Varshini</span>
                <span className="ml-2 align-middle">🎉</span>
              </h2>

              {/* Glassmorphic description card */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/40">
                <p className="text-base sm:text-lg text-gray-700" style={{ fontFamily: 'var(--font-fredoka)' }}>
                  Wishing you a birthday as bright as your smile and as joyful as your heart! May your dreams shine bigger, your studies be easy and joyful, and your days be filled with love, laughter, and little moments worth celebrating. Happy Birthday, Chaitra Varshini! 🎂✨
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap gap-4">
                <a href="#activities" className="px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-transform hover:-translate-y-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500">
                  Explore Activities ✨
                </a>
                <a href="/wishes" className="px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-transform hover:-translate-y-0.5 bg-gradient-to-r from-sky-500 to-violet-500">
                  Send Wishes 💌
                </a>
                <button onClick={toggleAudio} className="px-6 py-3 rounded-full bg-white text-pink-600 border-2 border-pink-300 hover:bg-pink-50 font-semibold shadow-md">
                  {isPlaying ? 'Pause Song 🔇' : 'Play Birthday Song 🎵'}
                </button>
                <audio ref={audioRef} src="/chaitra%20song.mp3" preload="none" onEnded={() => setIsPlaying(false)} />
              </div>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <motion.div
          id="activities"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-white/20"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={activity.href}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={activity.href}>
                <div className={`bg-gradient-to-br ${activity.color} ${activity.hoverColor} rounded-3xl p-8 text-white shadow-2xl card-hover cursor-pointer h-full`}>
                  <div className="text-center">
                    <motion.div
                      className="text-6xl mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {activity.emoji}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3">
                      {activity.title}
                    </h3>
                    <p className="text-lg opacity-90">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Birthday Message */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-16"
        >
          <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-white/40 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🎂 May your special day be filled with joy! 🎂
            </h3>
            <p className="text-gray-600 text-lg">
              Wishing you a year ahead filled with happiness, success, and all your dreams coming true! 
              <br />
              <span className="font-semibold text-pink-600">Happy Birthday, Chaitra! 🎉🎈</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
