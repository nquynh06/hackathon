import type { Task } from "/workspaces/hackathon/src/types/index.ts";

interface Props {
  card: Task;
  deleteCard: (id: string) => void;
  onEdit: (card: Task) => void;
}

const CardOptionsIcon: React.FC<Props> = ({ card, deleteCard, onEdit }) => {
  return (
    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="text-white px-1" onClick={() => onEdit(card)}>✏️</button>
      <button className="text-white px-1" onClick={() => deleteCard(card.id)}>🗑️</button>
    </div>
  );
};

export default CardOptionsIcon;
