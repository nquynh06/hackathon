import React from "react";
import KanbanBoard from "../components/kanban/KanbanBoard";
const KanbanView: React.FC = () => {
  return (
    <div className="h-full w-full p-4 bg-[#141821]">
      <KanbanBoard />
    </div>
  );
};

export default KanbanView;
