export type Mood = { label: string; color: string };

const STORAGE_KEY = "moods";
const LAST_MOOD_KEY = "lastMood";
const MOOD_HISTORY_KEY = "moodHistory";

export type MoodHistoryItem = {
  label: string;
  color: string;
  timestamp: number; 
};

export function getMoods(): Mood[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addMood(mood: Mood) {
  const moods = getMoods();
  if (!moods.find(m => m.label === mood.label)) {
    moods.push(mood);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));
  }
}

export function setLastMood(label: string) {
  localStorage.setItem(LAST_MOOD_KEY, label);
}

export function getLastMood(): string | null {
  return localStorage.getItem(LAST_MOOD_KEY);
}

export function addMoodHistory(label: string, color: string) {
  const history: MoodHistoryItem[] = JSON.parse(localStorage.getItem(MOOD_HISTORY_KEY) || "[]");
  history.push({ label, color, timestamp: Date.now() });
  localStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(history));
}

export function getMoodHistory(): MoodHistoryItem[] {
  return JSON.parse(localStorage.getItem(MOOD_HISTORY_KEY) || "[]");
}