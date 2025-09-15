import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types/index.ts";
import TaskCard from "./TaskCard";

type Props = {
  task: Task;
  onDelete?: () => void;
  onEdit?: () => void;
  onSave?: (data: Partial<Task>) => void;
};

const SortableTaskCard: React.FC<Props> = ({ task, onDelete, onEdit, onSave }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    touchAction: "none",
    opacity: isDragging ? 0 : 1, 
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        editable={false}
        onDelete={onDelete}
        onEdit={onEdit}
        onSave={onSave ? onSave : () => {}}
      />
    </div>
  );
};

export default SortableTaskCard;
