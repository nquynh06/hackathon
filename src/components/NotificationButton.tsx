import React, { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import type { Task } from "../types";

function isDueOrOverdue(dueDate?: string) {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due <= today;
}

function isNearDeadline(dueDate?: string) {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  return diff > 0 && diff <= 24 * 60 * 60 * 1000;
}

const NotificationButton: React.FC = () => {
  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [seen, setSeen] = useState(false); 

  useEffect(() => {
    setTasks(getTasks());
    const interval = setInterval(() => setTasks(getTasks()), 60 * 1000); 
    return () => clearInterval(interval);
  }, []);

  const notifyTasks = tasks.filter(
    t =>
      (isNearDeadline(t.dueDate) || isDueOrOverdue(t.dueDate)) &&
      t.status !== "Done"
  );

  const handleClick = () => {
    setShow(s => !s);
    if (!show) {
      setSeen(true); 
    }
  };

  return (
    <div className="relative">
      <button
        className="relative bg-yellow-400 text-black px-3 py-1 rounded-full font-bold shadow"
        onClick={handleClick}
        title="Notifications"
      >
        🔔
        {!seen && notifyTasks.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
            {notifyTasks.length}
          </span>
        )}
      </button>
      {show && (
        <div className="absolute right-0 mt-2 w-80 bg-[#242832] rounded-xl shadow-xl z-50 p-4">
          <h4 className="font-bold mb-2">Tasks near or past deadline:</h4>
          {notifyTasks.length === 0 && (
            <div className="text-gray-500">No tasks near deadline.</div>
          )}
          <ul className="space-y-2">
            {notifyTasks.map(t => (
              <li key={t.id} className="flex flex-col border-b pb-2">
                <span className="font-semibold">{t.title}</span>
                <span
                  className={`text-xs ${
                    isDueOrOverdue(t.dueDate)
                      ? "text-red-600 font-bold"
                      : "text-yellow-600"
                  }`}
                >
                  Due: {t.dueDate}
                  {isDueOrOverdue(t.dueDate) ? " (Overdue or Today)" : ""}
                </span>
                <span className="text-xs text-gray-500">{t.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
