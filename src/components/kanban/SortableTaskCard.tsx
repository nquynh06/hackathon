import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import type { Task } from "/workspaces/hackathon/src/types/index.ts";

const SortableTaskCard: React.FC<{
  card: Task;
  deleteCard: (id: string) => void;
  onEdit: (c: Task) => void;
}> = ({ card, deleteCard, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 9999 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard card={card} deleteCard={deleteCard} onEdit={onEdit} />
    </div>
  );
};

export default SortableTaskCard;
