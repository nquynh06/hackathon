import type { Task } from "../types";
import { getBoardById } from "./boardService";

const STORAGE_KEY = "tasks";

function loadTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function nextOrderForBoard(boardId: string): number {
  const tasks = loadTasks().filter(t => t.boardId === boardId);
  if (tasks.length === 0) return 0;
  const max = tasks.reduce((m, t) => {
    const o = typeof t.order === "number" ? t.order : -1;
    return o > m ? o : m;
  }, -1);
  return max + 1;
}

export function createTask(task: Omit<Task, "id" | "createdDate" | "order"> & Partial<Pick<Task, "order" | "createdDate">>): Task {
  const tasks = loadTasks();
  const boardId = task.boardId;
  const newTask: Task = {
    id: crypto.randomUUID(),
    createdDate: task.createdDate ?? new Date().toISOString(),
    order: typeof task.order === "number" ? task.order : nextOrderForBoard(boardId),
    ...task,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export function getTasks(): Task[] {
  return loadTasks();
}

export function getTaskById(id: string): Task | undefined {
  return loadTasks().find((t) => t.id === id);
}

export function updateTask(id: string, updated: Partial<Task>): Task | null {
  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  if (updated.boardId) {
    const board = getBoardById(updated.boardId);
    if (board) {
      updated.status = board.title; // đồng bộ status với board.title
    }
  }

  tasks[index] = { ...tasks[index], ...updated };
  saveTasks(tasks);
  return tasks[index];
}

export function deleteTask(id: string): boolean {
  const tasks = loadTasks();
  const newTasks = tasks.filter((t) => t.id !== id);
  if (newTasks.length === tasks.length) return false;

  saveTasks(newTasks);
  return true;
}

export function clearAllTasks(): void {
  localStorage.removeItem(STORAGE_KEY);
}