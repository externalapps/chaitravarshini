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
    question: "If 5 pencils cost 10 rupees, how much for 10 pencils?",
    options: ["15 rupees", "20 rupees", "25 rupees", "30 rupees"],
    correct: 1
  },
  {
    id: 2,
    question: "What comes next in the sequence: 2, 4, 8, 16, ?",
    options: ["20", "24", "32", "28"],
    correct: 2
  },
  {
    id: 3,
    question: "Which is the largest planet in our solar system?",
    options: ["Earth", "Saturn", "Jupiter", "Neptune"],
    correct: 2
  },
  {
    id: 4,
    question: "What is the opposite of &apos;Ancient&apos;?",
    options: ["Old", "Modern", "Classic", "Traditional"],
    correct: 1
  },
  {
    id: 5,
    question: "Who invented the light bulb?",
    options: ["Newton", "Einstein", "Edison", "Tesla"],
    correct: 2
  },
  {
    id: 6,
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correct: 1
  },
  {
    id: 7,
    question: "Which country has the most population?",
    options: ["India", "China", "USA", "Brazil"],
    correct: 1
  },
  {
    id: 8,
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correct: 2
  },
  {
    id: 9,
    question: "If a train travels 60 km in 1 hour, how far will it travel in 3 hours?",
    options: ["120 km", "150 km", "180 km", "200 km"],
    correct: 2
  },
  {
    id: 10,
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2
  }
];

const getRank = (score: number) => {
  if (score >= 9) return { text: "Genius Unicorn 🦄", color: "from-purple-400 to-indigo-500" };
  if (score >= 7) return { text: "Brain Ninja 🥷", color: "from-blue-400 to-cyan-500" };
  if (score >= 5) return { text: "Smart Cookie 🍪", color: "from-yellow-400 to-orange-500" };
  if (score >= 3) return { text: "Getting There 🧠", color: "from-green-400 to-emerald-500" };
  return { text: "Keep Learning 📚", color: "from-gray-400 to-gray-500" };
};

export default function IQTestPage() {
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

  const resetTest = () => {
    setCurrentStep('name');
    setUserName('');
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
  };

  const downloadCertificate = () => {
    // Use pt and A4 to match margins precisely
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;
    const margin = 48;
    const rank = getRank(score);

    // Helper: strip emojis/non-ascii for PDF text safety
    const sanitize = (t: string) => t.replace(/[^\x20-\x7E]/g, '');

    doc.setFont('helvetica', 'normal');

    // Border
    doc.setDrawColor(255, 107, 157);
    doc.setLineWidth(4);
    doc.roundedRect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, 12, 12);

    // Title
    doc.setFontSize(30);
    doc.setTextColor(255, 107, 157);
    doc.text('CERTIFICATE OF IQ TEST', centerX, margin + 54, { align: 'center' });

    // Subtitle
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('This certifies that', centerX, margin + 100, { align: 'center' });

    // Name
    doc.setFontSize(26);
    doc.setTextColor(255, 107, 157);
    doc.text(sanitize(userName), centerX, margin + 136, { align: 'center' });

    // Body
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('has successfully completed the IQ Test with a score of', centerX, margin + 168, { align: 'center' });

    // Score
    doc.setFontSize(48);
    doc.setTextColor(255, 107, 157);
    doc.text(`${score}/${questions.length}`, centerX, margin + 220, { align: 'center' });

    // Rank
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(`Achievement Level: ${sanitize(rank.text)}`, centerX, margin + 260, { align: 'center' });

    // Footer date/time
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}    Time: ${new Date().toLocaleTimeString()}`, centerX, pageHeight - margin - 24, { align: 'center' });

    doc.save(`iq-certificate-${sanitize(userName)}-${Date.now()}.pdf`);
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">IQ Test</span>
            <span className="ml-2 align-middle">🧠</span>
          </h1>
          <p className="text-lg text-gray-700">
            Challenge your brain power and get a certificate!
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
                  What&apos;s your name? 👋
                </h2>
                <form onSubmit={handleNameSubmit}>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-lg"
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-2xl font-bold text-lg btn-bounce"
                  >
                    Start IQ Test! 🚀
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
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
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
                      className="w-full p-4 text-left bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 rounded-2xl border-2 border-transparent hover:border-blue-300 transition-all duration-300"
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
                  🏆
                </motion.div>

                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  Congratulations, {userName}! 🎊
                </h2>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {score}/{questions.length}
                  </div>
                  <div className="text-lg text-gray-600">
                    You scored {score} out of {questions.length} questions!
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`inline-block bg-gradient-to-r ${getRank(score).color} text-white px-6 py-3 rounded-2xl font-bold text-xl mb-6`}
                >
                  {getRank(score).text}
                </motion.div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadCertificate}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-2xl font-bold text-lg btn-bounce"
                  >
                    🏆 Download Certificate
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetTest}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-bold text-lg btn-bounce"
                  >
                    🔄 Take Test Again
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
