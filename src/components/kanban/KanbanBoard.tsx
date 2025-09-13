import { useEffect, useState } from "react";
import type { Board, Task } from "/workspaces/hackathon/src/types/index.ts";
import BoardFormModal from "./BoardFormModal"; 
import DragAndDropWrapper from "./DragAndDropWrapper";

import * as boardService from "/workspaces/hackathon/src/services/boardService.ts";
import * as taskService from "/workspaces/hackathon/src/services/taskService.ts";

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

function KanbanBoard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  // Chỉ load dữ liệu từ service để đồng bộ với table view
  useEffect(() => {
    setBoards(boardService.getBoards());
    setTasks(taskService.getTasks());
  }, []);

  const getTasksByBoard = (boardId: string) =>
    tasks
      .filter((t) => t.boardId === boardId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleAddBoard = () => {
    setEditingBoard(null);
    setIsBoardModalOpen(true);
  };

  const handleSubmitBoard = (data: Partial<Board>) => {
    if (editingBoard) {
      boardService.updateBoard(editingBoard.id, data);
    } else {
      const newBoard = boardService.createBoard(data as Omit<Board, "id">);
      taskService.createTask({
        boardId: newBoard.id,
        title: "New Task",
        taskType: "General",
        status: newBoard.title,
        priority: "Normal",
      });
    }

    // Reload dữ liệu từ service
    setBoards(boardService.getBoards());
    setTasks(taskService.getTasks());
    setIsBoardModalOpen(false);
    setEditingBoard(null);
  };

  async function handleDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = String(event.over?.id);
    if (!overId || activeId === overId) return;

    const activeTaskData = tasks.find((t) => t.id === activeId);
    const overTaskData = tasks.find((t) => t.id === overId);
    const activeBoardData = boards.find((b) => b.id === activeId);
    const overBoardData = boards.find((b) => b.id === overId);

    if (activeTaskData && overTaskData) {
      const boardTasks = getTasksByBoard(activeTaskData.boardId);
      const oldIndex = boardTasks.findIndex((t) => t.id === activeId);
      const newIndex = boardTasks.findIndex((t) => t.id === overId);
      const newTasks = arrayMove(boardTasks, oldIndex, newIndex);

      newTasks.forEach((t, index) =>
        taskService.updateTask(t.id, { order: index + 1 })
      );
      setTasks(taskService.getTasks());
    } else if (activeBoardData && overBoardData) {
      const oldIndex = boards.findIndex((b) => b.id === activeBoardData.id);
      const newIndex = boards.findIndex((b) => b.id === overBoardData.id);

      const newBoards = arrayMove([...boards], oldIndex, newIndex);
      setBoards(newBoards);

      newBoards.forEach((b) => {
        boardService.updateBoard(b.id, { title: b.title });
      });
    }

    setActiveTask(null);
  }

  return (
    <div className="flex flex-col gap-8 w-full bg-[#1F1D29] min-h-screen">
      <div className="flex items-center justify-between p-4 bg-[#2B2B39] border-b border-[#2F2F3C]">
        <h1 className="text-3xl font-bold text-white">Kanban LocalStorage</h1>
        <button
          className="px-4 py-2 bg-[#8038F0] rounded text-white"
          onClick={handleAddBoard}
        >
          Add new board
        </button>
      </div>

      <DragAndDropWrapper
        boards={boards}
        cards={tasks}
        activeCard={activeTask}
        setActiveCard={setActiveTask}
        getCardsByBoard={getTasksByBoard}
        handleDragEnd={handleDragEnd}
        handleAddBoard={handleAddBoard}
        deleteBoard={(id) => {
          boardService.deleteBoard(id);
          setBoards(boardService.getBoards());
          return Promise.resolve();
        }}
        updateBoard={(id, data) => {
          boardService.updateBoard(id, data);
          setBoards(boardService.getBoards());
          return Promise.resolve();
        }}
        createCard={async (boardId, card) => {
          const board = boards.find((b) => b.id === boardId);
          if (!board) return;

          taskService.createTask({
            boardId,
            title: card.title ?? "New Task",
            taskType: card.taskType ?? "General",
            status: card.status ?? board.title,
            priority: card.priority ?? "Normal",
            description: card.description ?? "",
            startDate: card.startDate,
            dueDate: card.dueDate,
            actualDoneDate: card.actualDoneDate,
          });

          setTasks(taskService.getTasks());
          return Promise.resolve();
        }}
        deleteCard={(id) => {
          taskService.deleteTask(id);
          setTasks(taskService.getTasks());
          return Promise.resolve();
        }}
        updateCard={(id, card) => {
          taskService.updateTask(id, card);
          setTasks(taskService.getTasks());
          return Promise.resolve();
        }}
        fetchCards={() => {
          setTasks(taskService.getTasks());
          return Promise.resolve();
        }}
        maxCards={Math.max(...boards.map((b) => getTasksByBoard(b.id).length), 0)}
      />

      <BoardFormModal
        isOpen={isBoardModalOpen}
        onClose={() => {
          setIsBoardModalOpen(false);
          setEditingBoard(null);
        }}
        onSubmit={handleSubmitBoard}
        defaultValues={editingBoard || undefined}
      />
    </div>
  );
}

export default KanbanBoard;
