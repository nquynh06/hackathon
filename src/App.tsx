import React, { useState } from "react";
import './App.css'
import KanbanView from "./views/KanbanView";
import TableView from "./views/TableView";
import AnalyticsView from "./views/AnalyticsView";
import MoodModeBar from "./components/MoodModeBar";
import NotificationButton from "./components/NotificationButton";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<"kanban" | "table" | "analytics">("kanban");

  return (
    <div className="min-h-screen bg-[#141821] font-sans" style={{paddingLeft: 20, paddingRight: 20, marginTop: 30}}>
      {/* Title chính của project */}
      <div className="bg-[#141821] p-4 rounded shadow-xl mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-left">Student Time Management</h1>
          <NotificationButton />
        </div>

        {/* Switch view + MoodModeBar */}
        <div className="flex justify-between items-center">
          {/* Nút switch view */}
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView("kanban")}
              className={`px-4 py-2 text-sm font-medium transition-colors
                ${currentView === "kanban" ? "text-[#03C73C] border-b-2 border-[#03C73C]" : "text-gray-400 hover:text-[#03C73C] hover:border-b-2 hover:border-[#03C73C]"}
              `}
            >
              Kanban
            </button>
            <button
              onClick={() => setCurrentView("table")}
              className={`px-4 py-2 text-sm font-medium transition-colors
                ${currentView === "table" ? "text-[#03C73C] border-b-2 border-[#03C73C]" : "text-gray-400 hover:text-[#03C73C] hover:border-b-2 hover:border-[#03C73C]"}
              `}
            >
              Table
            </button>
            <button
              onClick={() => setCurrentView("analytics")}
              className={`px-4 py-2 text-sm font-medium transition-colors
                ${currentView === "analytics" ? "text-[#03C73C] border-b-2 border-[#03C73C]" : "text-gray-400 hover:text-[#03C73C] hover:border-b-2 hover:border-[#03C73C]"}
              `}
            >
              Analytics
            </button>
          </div>

          {/* MoodModeBar nằm bên phải */}
          <MoodModeBar />
        </div>
      </div>

      {/* Render view tương ứng */}
      <div className="bg-[#141821] rounded shadow p-4">
        {currentView === "kanban" && <KanbanView />}
        {currentView === "table" && <TableView />}
        {currentView === "analytics" && <AnalyticsView />}
      </div>
    </div>
  );
};

export default App;
