"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
// html2canvas removed from PDF flow to avoid CSS color parsing issues (oklch)
import Link from "next/link";

interface Task {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  completed: boolean;
}

export default function StudyPlanPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const addTask = () => {
    if (!title.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: title.trim(),
        date,
        time,
        completed: false,
      },
    ]);
    setTitle("");
    setDate("");
    setTime("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const downloadPDF = () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 48;
    const centerX = pageWidth / 2;

    // Header
    pdf.setFillColor(99, 102, 241); // indigo
    pdf.rect(0, 0, pageWidth, 80, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(26);
    pdf.text("Study Plan", centerX, 50, { align: "center" });

    // Meta
    pdf.setTextColor(60, 60, 60);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString()}   Time: ${new Date().toLocaleTimeString()}`, centerX, 100, { align: "center" });

    // Table header
    const startY = 130;
    const colX = [margin, margin + 260, margin + 360, margin + 460];
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text("Task", colX[0], startY);
    pdf.text("Date", colX[1], startY);
    pdf.text("Time", colX[2], startY);
    pdf.text("Done", colX[3], startY);
    pdf.setDrawColor(200);
    pdf.line(margin, startY + 6, pageWidth - margin, startY + 6);

    // Rows
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    let y = startY + 24;
    const lineHeight = 18;
    tasks.forEach((t) => {
      const taskText = pdf.splitTextToSize(t.title, pageWidth - margin * 2 - 240);
      pdf.text(taskText, colX[0], y);
      pdf.text(t.date || "-", colX[1], y);
      pdf.text(t.time || "-", colX[2], y);
      pdf.text(t.completed ? "✔" : "", colX[3], y);
      y += Math.max(lineHeight, taskText.length * 14);
      if (y > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
    });

    pdf.save(`study-plan-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="min-h-screen pt-24 pb-6 px-6 sm:px-10 bg-gradient-to-br from-indigo-100 to-pink-100 flex flex-col items-center">
      {/* Title handled within page; no Head tag in client component */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-indigo-700 drop-shadow-lg flex items-center gap-2">
        📚 Study Plan
      </h1>

      {/* Form */}
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Task / Subject"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-2 md:col-span-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <button
          onClick={addTask}
          className="w-full md:w-auto px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-colors shadow-lg"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div
        ref={listRef}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-6 mb-8 divide-y divide-gray-200"
      >
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks added yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center py-4 gap-3"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 accent-pink-500"
              />
              <div className="flex-1">
                <p
                  className={`font-medium text-lg ${
                    task.completed ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-sm text-gray-500">
                  {task.date || "No date"} {task.time && `• ${task.time}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={downloadPDF}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-colors shadow-lg"
        >
          Download as PDF
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-full transition-colors shadow-lg text-center"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
