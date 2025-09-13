import React, { useState } from "react";
import type { Board, Task } from "/workspaces/hackathon/src/types/index.ts";
import TaskCard from "./TaskCard";
import AddCardButton from "./AddCardButton";
import BoardOptionsIcon from "./BoardOptionsIcon";
import CardFormModal from "./CardFormModal";
import * as taskService from "/workspaces/hackathon/src/services/taskService.ts";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface Props {
  board: Board;
  cards: Task[];
  deleteBoard: (id: string) => void;
  updateBoard: (id: string, data: Partial<Board>) => void;
  createCard: (boardId: string, card: Partial<Task>) => void;
  deleteCard: (id: string) => void;
  updateCard: (id: string, card: Partial<Task>) => void;
  fetchCards: () => void;
  maxCards: number;
}

const BoardContainer: React.FC<Props> = ({
  board,
  cards,
  deleteBoard,
  updateBoard,
  createCard,
  deleteCard,
  updateCard,
  fetchCards,
  maxCards,
}) => {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Task | null>(null);

  const handleAddCard = () => {
    setEditingCard(null);
    setIsCardModalOpen(true);
  };

  const handleSaveCard = (data: Partial<Task>) => {
  const title = data.title || "New Task";

  if (editingCard) {
    taskService.updateTask(editingCard.id, {
      title,
      ...data,
    });
  } else {
    taskService.createTask({
      title, // đảm bảo string
      boardId: board.id,
      taskType: "General",
      status: board.title,
      priority: "Normal",
      description: data.description || "",
    });
  }
  fetchCards();
  setIsCardModalOpen(false);
  setEditingCard(null);
};


  return (
    <div className="bg-[#2B2B39] rounded-xl shadow-md p-2 w-80 flex-shrink-0 flex flex-col gap-2 relative">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white font-bold">{board.title}</h2>
        <BoardOptionsIcon
          board={board}
          deleteBoard={deleteBoard}
          setEditMode={(v) => {}}
        />
      </div>

      <div className="flex flex-col gap-2">

<SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
  {cards.map((card) => (
    <TaskCard
      key={card.id}
      card={card}
      deleteCard={deleteCard}
      onEdit={(c) => {
        setEditingCard(c);
        setIsCardModalOpen(true);
      }}
    />
  ))}
</SortableContext>

      </div>

      <AddCardButton onClick={handleAddCard} disabled={cards.length >= maxCards} />

      {isCardModalOpen && (
        <CardFormModal
          isOpen={true}
          onClose={() => setIsCardModalOpen(false)}
          onSave={handleSaveCard}
          defaultValues={editingCard || undefined}
          isEditMode={!!editingCard}
        />
      )}
    </div>
  );
};

export default BoardContainer;
