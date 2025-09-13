import {
  DndContext,
  closestCorners,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import BoardContainer from "./BoardContainer";
import TaskCard from "./TaskCard";
import AddBoardButton from "./AddBoardButton";
import type { Board, Task } from "/workspaces/hackathon/src/types/index.ts";

interface Props {
  boards: Board[];
  cards: Task[];
  activeCard: Task | null;
  setActiveCard: (card: Task | null) => void;
  getCardsByBoard: (boardId: string) => Task[];
  handleDragEnd: (event: DragEndEvent) => void;
  handleAddBoard: () => void;
  deleteBoard: (id: string) => void;
  updateBoard: (id: string, data: Partial<Board>) => void;
  createCard: (boardId: string, card: Partial<Task>) => void;
  deleteCard: (id: string) => void;
  updateCard: (id: string, card: Partial<Task>) => void;
  fetchCards: () => void;
  maxCards: number;
}

const DragAndDropWrapper: React.FC<Props> = ({
  boards,
  cards,
  activeCard,
  setActiveCard,
  getCardsByBoard,
  handleDragEnd,
  handleAddBoard,
  deleteBoard,
  updateBoard,
  createCard,
  deleteCard,
  updateCard,
  fetchCards,
  maxCards,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragStart={(e) => {
        const found = cards.find((c) => c.id === String(e.active.id));
        if (found) setActiveCard(found);
      }}
      onDragCancel={() => setActiveCard(null)}
    >
      <div className="flex gap-4 p-4 overflow-x-auto">
        <SortableContext items={boards.map((b) => b.id)} strategy={horizontalListSortingStrategy}>
          {boards.map((board) => (
            <BoardContainer
              key={board.id}
              board={board}
              cards={getCardsByBoard(board.id)}
              deleteBoard={deleteBoard}
              updateBoard={updateBoard}
              createCard={createCard}
              deleteCard={deleteCard}
              updateCard={updateCard}
              fetchCards={fetchCards}
              maxCards={maxCards}
            />
          ))}
          <AddBoardButton onClick={handleAddBoard} />
        </SortableContext>
      </div>

      <DragOverlay>
        {activeCard && (
          <TaskCard card={activeCard} deleteCard={() => {}} onEdit={() => {}} />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default DragAndDropWrapper;
