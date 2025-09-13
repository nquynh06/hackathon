import React, { useState } from "react";
import './App.css'
import KanbanView from "./views/KanbanView";
import TableView from "./views/TableView";
import AnalyticsView from "./views/AnalyticsView";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<"kanban" | "table" | "analytics">("kanban");

  return (
    <div className="min-h-screen bg-[#242424] p-6 font-sans">
      {/* Title chính của project */}
      <h1 className="text-3xl font-bold mb-4 text-center">Student Time Management</h1>

      {/* Switch view giống Notion */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setCurrentView("kanban")}
          className={`px-4 py-2 rounded ${
            currentView === "kanban" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Kanban
        </button>
        <button
          onClick={() => setCurrentView("table")}
          className={`px-4 py-2 rounded ${
            currentView === "table" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Table
        </button>
        <button
          onClick={() => setCurrentView("analytics")}
          className={`px-4 py-2 rounded ${
            currentView === "analytics" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Render view tương ứng */}
      <div className="bg-[#242424] rounded shadow p-4">
        {currentView === "kanban" && <KanbanView />}
        {currentView === "table" && <TableView />}
        {currentView === "analytics" && <AnalyticsView />}
      </div>
    </div>
  );
};

export default App;