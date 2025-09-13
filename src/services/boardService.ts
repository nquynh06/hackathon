import type { Board } from "../types";

const STORAGE_KEY = "statusLabels";

const DEFAULT_LABELS = ["To do", "In progress", "Done"];

function loadLabels(): string[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LABELS));
    return DEFAULT_LABELS;
  }
}

function saveLabels(labels: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
}

export function getBoards(): Board[] {
  return loadLabels().map((label) => ({
    id: label,
    title: label,
  }));
}

export function getBoardById(id: string): Board | undefined {
  return getBoards().find((b) => b.id === id);
}

export function createBoard(board: Omit<Board, "id">): Board {
  const labels = loadLabels();
  if (!labels.includes(board.title)) {
    labels.push(board.title);
    saveLabels(labels);
  }
  return { id: board.title, title: board.title };
}

export function updateBoard(id: string, updated: Partial<Board>): Board | null {
  let labels = loadLabels();
  const index = labels.findIndex((l) => l === id);
  if (index === -1) return null;

  const newTitle = updated.title || labels[index];
  labels[index] = newTitle;
  saveLabels(labels);

  return { id: newTitle, title: newTitle };
}

export function deleteBoard(id: string): boolean {
  const labels = loadLabels();
  const newLabels = labels.filter((l) => l !== id);

  if (newLabels.length === labels.length) return false;

  saveLabels(newLabels);
  return true;
}

export function clearAllBoards(): void {
  localStorage.removeItem(STORAGE_KEY);
}
