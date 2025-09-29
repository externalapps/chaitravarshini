'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

const ConfettiBackground = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = ['#ff6b9d', '#ffc1cc', '#ffd93d', '#4ade80', '#fbbf24', '#a78bfa'];
    const newConfetti: ConfettiPiece[] = [];

    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 3,
      });
    }

    setConfetti(newConfetti);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
          }}
          initial={{ y: -100, opacity: 0, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: [0, 1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: 3,
            delay: piece.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Floating Balloons */}
      <motion.div
        className="absolute top-20 left-10 text-4xl balloon"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        🎈
      </motion.div>
      
      <motion.div
        className="absolute top-32 right-16 text-3xl balloon"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        🎈
      </motion.div>
      
      <motion.div
        className="absolute top-40 left-1/4 text-2xl balloon"
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        🎈
      </motion.div>
      
      <motion.div
        className="absolute top-60 right-1/3 text-3xl balloon"
        animate={{ y: [15, -5, 15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        🎈
      </motion.div>
    </div>
  );
};

export default ConfettiBackground;



