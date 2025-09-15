import React, { useEffect, useState } from "react";
import { getMoods, setLastMood, getLastMood, addMood, addMoodHistory } from "../services/moodService";

const DEFAULT_MOODS = [
  { label: "Happy", color: "#facc15" },
  { label: "Calm", color: "#38bdf8" },
  { label: "Stressed", color: "#ef4444" },
  { label: "Motivated", color: "#22c55e" },
];

const hexToRgba = (hex: string, alpha = 0.3) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const MoodModeBar: React.FC = () => {
  const [moods, setMoods] = useState(() => getMoods().length ? getMoods() : DEFAULT_MOODS);
  const [selected, setSelected] = useState<string | null>(getLastMood());
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (getMoods().length === 0) {
      DEFAULT_MOODS.forEach(addMood);
      setMoods(DEFAULT_MOODS);
    }
  }, []);

  useEffect(() => {
    if (
      moods.length > 0 &&
      !getLastMood() &&
      !localStorage.getItem("moodPopupShown")
    ) {
      setShowPopup(true);
      localStorage.setItem("moodPopupShown", "1");
    }
  }, [moods]);

  const handleSelect = (label: string) => {
    setSelected(label);
    setLastMood(label);
    setShowPopup(false);
    localStorage.removeItem("moodPopupShown");
    const mood = moods.find(m => m.label === label);
    if (mood) addMoodHistory(mood.label, mood.color);
  };

  const handleShowPopup = () => setShowPopup(true);

  const currentMood = moods.find(m => m.label === selected);

  if (showPopup) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
        <div
          className="relative bg-[#242832] rounded-3xl shadow-2xl p-10 flex flex-col items-center"
          style={{
            width: "700px",  
            maxWidth: "95vw",
            padding: "32px",
          }}
        >
          <h2 className="text-xl font-bold mb-8 text-white text-center">How are you feeling right now?</h2>

          {/* decorative mood blur circles */}
          <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full" style={{ background: hexToRgba("#facc15", 0.2), filter: "blur(50px)" }} />
          <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full" style={{ background: hexToRgba("#38bdf8", 0.2), filter: "blur(50px)" }} />
          <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full" style={{ background: hexToRgba("#ef4444", 0.2), filter: "blur(50px)" }} />
          <div className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full" style={{ background: hexToRgba("#22c55e", 0.2), filter: "blur(50px)" }} />

          <div className="flex gap-5 flex-wrap justify-center z-10">
            {moods.map(m => (
              <button
                key={m.label}
                className="label-chip text-lg font-semibold shadow-lg"
                style={{
                  background: hexToRgba(m.color, 0.3),
                  border: `2px solid ${m.color}`,
                  color: "#fff",
                  padding: "12px 22px",
                  borderRadius: "14px",
                }}
                onClick={() => handleSelect(m.label)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          className="label-chip text-sm font-semibold"
          style={{
            background: currentMood ? hexToRgba(currentMood.color, 0.3) : "#222",
            border: currentMood ? `2px solid ${currentMood.color}` : "none",
            color: "#fff",
            padding: "4px 12px",
            borderRadius: "8px",
          }}
          onClick={handleShowPopup}
        >
          {currentMood ? currentMood.label : "Select mood"}
        </button>
      </div>
    </div>
  );
};

export default MoodModeBar;
