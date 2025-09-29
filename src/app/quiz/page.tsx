'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is Chaitra's favorite color?",
    options: ["Pink 🌸", "Blue 💙", "Black 🖤", "Green 🌿", "Rainbow 🌈"],
    correct: 4
  },
  {
    id: 2,
    question: "What is Chaitra's favorite subject?",
    options: ["Math ➕", "English 📖", "Science 🔬", "History 📜"],
    correct: 2
  },
  {
    id: 3,
    question: "Where would Chaitra love to go for vacation?",
    options: ["Paris 🗼", "Switzerland 🏔️", "Goa 🏖️", "Dubai 🏙️"],
    correct: 0
  },
  {
    id: 4,
    question: "What is Chaitra's favorite food?",
    options: ["Pizza 🍕", "Ice Cream 🍦", "Pani Puri 🌮", "Noodles 🍜"],
    correct: 0
  },
  {
    id: 5,
    question: "What is Chaitra's favorite pet?",
    options: ["Cat 🐱", "Dog 🐶", "Rabbit 🐇", "Fish 🐠"],
    correct: 1
  }
];

const getBadge = (score: number) => {
  if (score >= 5) return { text: "Super Bestie 💖", color: "from-pink-400 to-rose-500" };
  if (score >= 3) return { text: "Good Friend 😊", color: "from-blue-400 to-indigo-500" };
  if (score >= 1) return { text: "Almost There 😅", color: "from-yellow-400 to-orange-500" };
  return { text: "Need to Know Her Better 🤔", color: "from-gray-400 to-gray-500" };
};

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState<'name' | 'quiz' | 'result'>('name');
  const [userName, setUserName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setCurrentStep('quiz');
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const finalScore = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correct ? 1 : 0);
      }, 0);
      setScore(finalScore);
      setCurrentStep('result');
    }
  };

  const resetQuiz = () => {
    setCurrentStep('name');
    setUserName('');
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const badge = getBadge(score);

    doc.setFont('helvetica');

    // Decorative header bar
    doc.setFillColor(255, 107, 157);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 80, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text('Friendship Quiz', 40, 55);

    // Card for score
    doc.setDrawColor(255, 107, 157);
    doc.setLineWidth(3);
    doc.roundedRect(60, 140, 475, 220, 16, 16, 'S');

    // Name and date
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.text(`Participant: ${userName}`, 70, 120);
    doc.text(`Date: ${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`, 360, 120, { align: 'right' });

    // Score big
    doc.setTextColor(255, 107, 157);
    doc.setFontSize(96);
    doc.text(`${score}/${questions.length}`, 180, 260);

    // Badge (ASCII only to avoid odd glyphs)
    const asciiBadge = badge.text.replace(/[^\x20-\x7E]/g, '');
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(20);
    doc.text(`Badge: ${asciiBadge}`, 200, 320);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Made with love for Chaitra Varshini\'s Birthday', 60, 500);

    doc.save(`friendship-quiz-${userName}-${Date.now()}.pdf`);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Friendship Quiz</span>
            <span className="ml-2 align-middle">💖</span>
          </h1>
          <p className="text-lg text-gray-700">
            Test how well you know Chaitra!
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentStep === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                  What's your name? 👋
                </h2>
                <form onSubmit={handleNameSubmit}>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none text-lg"
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl font-bold text-lg btn-bounce"
                  >
                    Start Quiz! 🚀
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {currentStep === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-600 mb-2">
                    Question {currentQuestion + 1} of {questions.length}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                  {questions[currentQuestion].question}
                </h2>

                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(index)}
                      className="w-full p-4 text-left bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 rounded-2xl border-2 border-transparent hover:border-pink-300 transition-all duration-300"
                    >
                      <span className="text-lg font-medium">{option}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>

                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  Congratulations, {userName}! 🎊
                </h2>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-pink-600 mb-2">
                    {score}/{questions.length}
                  </div>
                  <div className="text-lg text-gray-600">
                    You got {score} out of {questions.length} questions correct!
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`inline-block bg-gradient-to-r ${getBadge(score).color} text-white px-6 py-3 rounded-2xl font-bold text-xl mb-6`}
                >
                  {getBadge(score).text}
                </motion.div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadPDF}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-2xl font-bold text-lg btn-bounce"
                  >
                    📄 Download Results as PDF
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetQuiz}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-2xl font-bold text-lg btn-bounce"
                  >
                    🔄 Take Quiz Again
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
