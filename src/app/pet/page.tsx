'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

type PetState = 'neutral' | 'eating' | 'playing' | 'sleeping';

interface PetAction {
  action: string;
  timestamp: string;
  emoji: string;
}

export default function VirtualPetPage() {
  const [petState, setPetState] = useState<PetState>('neutral');
  const [actions, setActions] = useState<PetAction[]>([]);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const petRef = useRef<HTMLDivElement>(null);

  const getPetGif = (state: PetState) => {
    const gifs = {
      neutral: '/pet/neutral.gif',
      eating: '/pet/eating.gif',
      playing: '/pet/playing.gif',
      sleeping: '/pet/sleeping.gif'
    };
    return gifs[state];
  };

  const getPetMessage = (state: PetState) => {
    const messages = {
      neutral: 'Hi! I\'m your virtual puppy! 🐶',
      eating: 'Yummy! This apple is delicious! 🍎',
      playing: 'This is so much fun! 🎾',
      sleeping: 'Zzz... sleeping peacefully... 😴'
    };
    return messages[state];
  };

  const sanitize = (txt: string) => txt.replace(/[^\x20-\x7E]/g, '');

  const handleDragStart = (e: React.DragEvent, item: string) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem === 'apple') {
      feedPet();
    } else if (draggedItem === 'ball') {
      playWithPet();
    } else if (draggedItem === 'pillow') {
      putPetToSleep();
    }
    setDraggedItem(null);
  };

  const performAction = (action: string, emoji: string, newState: PetState) => {
    if (isActionInProgress) return;

    setIsActionInProgress(true);
    setPetState(newState);

    // Add action to history
    const newAction: PetAction = {
      action,
      timestamp: new Date().toLocaleTimeString(),
      emoji
    };
    setActions([...actions, newAction]);

    // Keep the current state, don't return to neutral
    setTimeout(() => {
      setIsActionInProgress(false);
    }, 1000);
  };

  const feedPet = () => {
    performAction('Fed the puppy', '🍎', 'eating');
  };

  const playWithPet = () => {
    performAction('Played with the puppy', '🎾', 'playing');
  };

  const putPetToSleep = () => {
    performAction('Put the puppy to sleep', '😴', 'sleeping');
  };

  const resetPet = () => {
    setPetState('neutral');
    setActions([]);
    setIsActionInProgress(false);
  };

  const downloadReport = () => {
    if (actions.length === 0) {
      alert('Please interact with the puppy first! 🐶');
      return;
    }

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(255, 107, 157);
    doc.text('Virtual Pet Care Report', 20, 30);
    
    // Birthday message
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(sanitize('Happy Birthday Chaitra Varshini!'), 20, 50);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 80);
    
    // Pet status
    doc.setFontSize(14);
    doc.text('Current Pet Status:', 20, 100);
    doc.text(sanitize(`State: ${petState}`), 20, 115);
    doc.text(sanitize(`Message: ${getPetMessage(petState)}`), 20, 130);
    
    // Actions taken
    doc.text('Actions Taken Today:', 20, 150);
    let yPos = 165;
    actions.forEach((action, index) => {
      doc.text(sanitize(`${index + 1}. ${action.action} ${action.emoji} at ${action.timestamp}`), 20, yPos);
      yPos += 15;
    });
    
    // Summary
    doc.setFontSize(12);
    doc.text(`Total actions: ${actions.length}`, 20, yPos + 10);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(sanitize("Made with love for Chaitra's Birthday"), 20, 280);
    
    doc.save(`pet-care-report-${Date.now()}.pdf`);
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">Virtual Pet</span>
            <span className="ml-2 align-middle">🐶</span>
          </h1>
          <p className="text-lg text-gray-700">
            Take care of your cute virtual puppy! Drag items onto the pet to interact!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Display - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center"
            ref={petRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <motion.div
              key={petState}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="mb-4 flex justify-center">
                <img 
                  src={getPetGif(petState)} 
                  alt="Virtual Pet" 
                  className="w-48 h-48 object-contain"
                  onError={(e) => {
                    // Fallback to emoji if GIF fails to load
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'block';
                    }
                  }}
                />
                <div className="text-8xl hidden">
                  {petState === 'neutral' && '🐶'}
                  {petState === 'eating' && '🍎'}
                  {petState === 'playing' && '🎾'}
                  {petState === 'sleeping' && '😴'}
                </div>
              </div>
              <p className="text-lg text-gray-700 font-medium">
                {getPetMessage(petState)}
              </p>
            </motion.div>
          </motion.div>

          {/* Drag Items - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Interactive Items 🎮</h3>
            <div className="space-y-4">
              <motion.div
                draggable
                onDragStart={(e) => handleDragStart(e, 'apple')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-2xl text-center cursor-move border-2 border-dashed border-red-300 hover:border-red-500 transition-colors"
              >
                <div className="text-4xl mb-2">🍎</div>
                <p className="text-sm font-medium text-gray-700">Drag to feed!</p>
              </motion.div>

              <motion.div
                draggable
                onDragStart={(e) => handleDragStart(e, 'ball')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-2xl text-center cursor-move border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors"
              >
                <div className="text-4xl mb-2">🔴</div>
                <p className="text-sm font-medium text-gray-700">Drag the red ball to play!</p>
              </motion.div>

              <motion.div
                draggable
                onDragStart={(e) => handleDragStart(e, 'pillow')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-2xl text-center cursor-move border-2 border-dashed border-purple-300 hover:border-purple-500 transition-colors"
              >
                <div className="text-4xl mb-2">🛏️</div>
                <p className="text-sm font-medium text-gray-700">Drag the pillow to sleep!</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Activities History - Below */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Today&apos;s Activities 📝
          </h3>

          {actions.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <div className="text-3xl mb-3">📝</div>
              <p className="text-sm">No activities yet. Start taking care of your puppy!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <AnimatePresence>
                {actions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-gradient-to-r from-pink-100 to-purple-100 p-2 rounded-lg border-l-4 border-pink-500"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 text-sm">
                        {action.action} {action.emoji}
                      </span>
                      <span className="text-xs text-gray-600">
                        {action.timestamp}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadReport}
              disabled={actions.length === 0}
              className={`w-full py-2 rounded-xl font-bold text-sm btn-bounce ${
                actions.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
              }`}
            >
              📄 Download Report
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetPet}
              className="w-full py-2 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 btn-bounce"
            >
              🔄 Reset Pet
            </motion.button>
          </div>
        </motion.div>

        {/* Pet Care Tips */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            💡 Pet Care Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">🍎</div>
              <p className="text-gray-700 font-medium">Drag the apple to feed your puppy!</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">⚽</div>
              <p className="text-gray-700 font-medium">Drag the ball to play with your puppy!</p>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">🛏️</div>
              <p className="text-gray-700 font-medium">Drag the pillow to let your puppy sleep!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
