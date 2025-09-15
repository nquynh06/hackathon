import React, { useEffect, useRef, useState } from "react";
import PauseIcon from "../../icons/PauseIcon";
import PlayIcon from "../../icons/PlayIcon";

type Requirement = { id: string; text: string; done: boolean; };

type Props = {
  boardTitle: string;
  taskTitle: string;
  requirements: Requirement[];
  onTickRequirement: (id: string) => void;
  onClose: () => void;
  onAllDone: () => void;
};

const POMODORO_MINUTES = 25;

const getColor = (percent: number) => {
  const green = { r: 3, g: 199, b: 60 };
  const yellow = { r: 251, g: 192, b: 45 };
  const red = { r: 239, g: 68, b: 45 };

  if (percent > 0.5) {
    const t = (percent - 0.5) * 2;
    const r = Math.round(yellow.r + (green.r - yellow.r) * t);
    const g = Math.round(yellow.g + (green.g - yellow.g) * t);
    const b = Math.round(yellow.b + (green.b - yellow.b) * t);
    return `rgb(${r},${g},${b})`;
  } else {
    const t = percent * 2;
    const r = Math.round(red.r + (yellow.r - red.r) * t);
    const g = Math.round(red.g + (yellow.g - red.g) * t);
    const b = Math.round(red.b + (yellow.b - red.b) * t);
    return `rgb(${r},${g},${b})`;
  }
};

const PomodoroPage: React.FC<Props> = ({
  taskTitle,
  requirements,
  onTickRequirement,
  onClose,
  onAllDone,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allDone = requirements.length > 0 && requirements.every(r => r.done);

  useEffect(() => {
    if (allDone) {
      setRunning(false);
      onAllDone();
    }
  }, [allDone, onAllDone]);

  useEffect(() => {
    if (running && secondsLeft > 0 && !allDone) {
      intervalRef.current = setInterval(() => setSecondsLeft(s => s - 1), 1000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [running, secondsLeft, allDone]);

  useEffect(() => {
    if (secondsLeft <= 0) setRunning(false);
  }, [secondsLeft]);

  const percent = secondsLeft / (POMODORO_MINUTES * 60);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const radius = 90;
  const stroke = 14;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - percent);

  return (
    <div className="fixed inset-0 z-50 bg-[#141821] bg-opacity-90 flex flex-col items-center justify-center p-4 overflow-auto">
      {/* Header */}
      <button
        className="absolute top-6 left-8 text-white text-base font-semibold flex items-center gap-2"
        onClick={onClose}
        title="Back"
      >
        <span className="text-2xl" style={{ lineHeight: 1 }}>&lt;</span>
        Promodoro page
      </button>

      <div className="w-full max-w-md flex flex-col items-center space-y-4">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">{taskTitle}</h2>

        {/* Đồng hồ */}
        <div className="relative w-[220px] h-[220px] mx-auto mb-4 flex-shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: "rgba(72, 187, 120, 0.4)",
              filter: "blur(65px)",
              zIndex: 0,
            }}
          />
          <svg width={260} height={260} style={{ position: "absolute" }}>
            <circle
              cx={110}
              cy={110}
              r={radius + 13}
              stroke="#436852ff"
              strokeWidth={stroke}
              fill="none"
              opacity={0.3}
            />
            <circle
              cx={110}
              cy={110}
              r={radius}
              stroke={getColor(percent)}
              strokeWidth={8}
              fill="none"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s, stroke 0.5s" }}
            />
          </svg>
          <div
            className="absolute text-4xl font-mono text-white select-none"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mb-4">
          <button
            className="bg-gray-700 px-2.5 py-0.75 rounded-full text-lg"
            onClick={() => { setSecondsLeft(POMODORO_MINUTES * 60); setRunning(false); }}
          >⟲</button>
          <button
            className={`px-6 py-2 rounded-full text-lg font-bold ${running ? "bg-yellow-400" : "bg-green-500"} text-white`}
            onClick={() => setRunning(r => !r)}
          >
            {running ? <PauseIcon className="w-6 h-6 mx-auto" /> : <PlayIcon className="w-6 h-6 mx-auto" />}
          </button>
          <button
            className="bg-red-500 px-2.5 py-0.75 rounded-full text-base text-white"
            onClick={() => { setRunning(false); setSecondsLeft(POMODORO_MINUTES * 60); }}
          >■</button>
        </div>

        {/* Requirements */}
        <div className="w-full max-h-[300px] overflow-y-auto space-y-2 px-2">
          {requirements.map(r => (
            <div
              key={r.id}
              className="flex items-center justify-between bg-[#1B1E27] text-white rounded-xl p-4 shadow hover:bg-[#03C73C] transition"
            >
              <label className="flex items-center gap-2 cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={r.done}
                  onChange={() => onTickRequirement(r.id)}
                  disabled={allDone}
                  className="w-5 h-5 accent-[#03C73C]"
                />
                <span className={r.done ? "line-through text-gray-400" : ""}>{r.text}</span>
              </label>
            </div>
          ))}
        </div>

        {allDone && (
          <div className="text-green-400 text-lg mt-2 font-bold">🎉 All requirements completed!</div>
        )}
      </div>
    </div>
  );
};

export default PomodoroPage;
