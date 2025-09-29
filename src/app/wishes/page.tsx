"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

export default function WishesPage() {
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");

  const downloadPDF = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;

    const sanitize = (t: string) => t.replace(/[^\x20-\x7E]/g, "");
    const from = sanitize(name.trim() || "Anonymous");
    const message = sanitize(wish || "Wishing you a day as lovely as you are!");

    // Try to load background image from public (filename has a space)
    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    try {
      const bg = await loadImage("/WISHES%20.png");
      // 50% opacity background
      // @ts-ignore - jsPDF GState type
      const gsHalf = new (doc as any).GState({ opacity: 0.5 });
      // @ts-ignore
      (doc as any).setGState(gsHalf);
      doc.addImage(bg, "PNG", 0, 0, pageWidth, pageHeight);
      // reset opacity
      // @ts-ignore
      (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
    } catch (_) {
      // If image load fails, continue without background
    }

    // Card dimensions (smaller to reveal more background)
    const cardW = Math.min(480, pageWidth - 120);
    const cardH = pageHeight - 180;
    const cardX = (pageWidth - cardW) / 2;
    const cardY = 60;

    // Outer border (card)
    doc.setDrawColor(255, 107, 157);
    doc.setLineWidth(6);
    doc.roundedRect(cardX, cardY, cardW, cardH, 18, 18);

    // Inner background (soft translucent look)
    doc.setFillColor(255, 244, 247);
    doc.setDrawColor(255, 244, 247);
    doc.roundedRect(cardX + 8, cardY + 8, cardW - 16, cardH - 16, 14, 14, "FD");

    // Confetti dots (corner accents)
    const dots = [
      { x: cardX + 30, y: cardY + 40, c: [246, 99, 99] },
      { x: cardX + cardW - 40, y: cardY + 60, c: [255, 191, 0] },
      { x: cardX + 70, y: cardY + cardH - 50, c: [99, 102, 241] },
      { x: cardX + cardW - 70, y: cardY + cardH - 80, c: [16, 185, 129] },
      { x: centerX, y: cardY + 100, c: [236, 72, 153] },
    ];
    dots.forEach((d) => {
      doc.setFillColor(d.c[0], d.c[1], d.c[2]);
      doc.circle(d.x, d.y, 4, "F");
    });

    // Title
    doc.setFont("times", "bold");
    doc.setTextColor(255, 107, 157);
    doc.setFontSize(34);
    doc.text("Happy Birthday,", centerX, cardY + 120, { align: "center" });
    doc.setFontSize(38);
    doc.text("Chaitra Varshini!", centerX, cardY + 160, { align: "center" });

    // Divider
    doc.setDrawColor(255, 107, 157);
    doc.setLineWidth(1.5);
    doc.line(cardX + 48, cardY + 180, cardX + cardW - 48, cardY + 180);

    // Wish text block (more vibrant styling, smaller area)
    const textX = cardX + 56;
    const textY = cardY + 220;
    const maxW = cardW - 112;
    doc.setFont("times", "italic");
    doc.setTextColor(139, 92, 246); // violet
    doc.setFontSize(20);
    const wrapped = doc.splitTextToSize(`“${message}”`, maxW);
    doc.text(wrapped, textX, textY);

    // Signature
    doc.setFont("times", "italic");
    doc.setTextColor(236, 72, 153);
    doc.setFontSize(20);
    doc.text(`— ${from}`, centerX, cardY + cardH - 90, { align: "center" });

    // Footer (date)
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(11);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      centerX,
      pageHeight - 28,
      { align: "center" }
    );

    doc.save(`wish-card-${from || "anonymous"}-${Date.now()}.pdf`);
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Wish Board</span>
            <span className="ml-2 align-middle">💝</span>
          </h1>
          <p className="text-gray-700 mt-2">Enter your name and wish, then download a greeting card PDF.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="md:col-span-2 px-4 py-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              placeholder="Write your wish..."
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              className="md:col-span-4 px-4 py-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadPDF}
              className="md:col-span-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg"
            >
              📄 Download Greeting Card
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
