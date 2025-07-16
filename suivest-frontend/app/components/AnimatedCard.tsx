'use client'

import { motion } from 'framer-motion';
import React from 'react';

type AnimatedCardProps = {
  children: React.ReactNode;
};

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{
        opacity: [0.6, 1, 0.6],
        scale: [0.95, 1, 0.95],
        backgroundColor: ['#ffffff', '#ffe4e6', '#f0fdf4', '#ffffff'], // white → pink → green → white
        boxShadow: [
          '0 0 0px rgba(0,0,0,0)',
          '0 0 30px rgba(255,0,150,0.4)',
          '0 0 30px rgba(0,200,255,0.4)',
          '0 0 0px rgba(0,0,0,0)',
        ],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="rounded-2xl p-6 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center text-black dark:text-white"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
