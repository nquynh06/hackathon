import { useState } from "react";
import type { Board } from "/workspaces/hackathon/src/types/index.ts";
import BoardFormModal from "./BoardFormModal";
import * as boardService from "/workspaces/hackathon/src/services/boardService.ts";

interface Props {
  board: Board;
  deleteBoard: (id: string) => void;
  setEditMode: (value: boolean) => void;
}

const BoardOptionsIcon: React.FC<Props> = ({ board, deleteBoard }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="text-white px-2 rounded hover:bg-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
      >
        ⚙
      </button>
      {showDropdown && (
        <div className="absolute right-0 top-10 bg-[#1F1D29] text-white border border-gray-600 rounded shadow-md w-32">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
            onClick={() => { setIsEditModalOpen(true); setShowDropdown(false); }}
          >
            Edit
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-red-700/20"
            onClick={() => { deleteBoard(board.id); setShowDropdown(false); }}
          >
            Delete
          </button>
        </div>
      )}

      {isEditModalOpen && (
        <BoardFormModal
          isOpen={true}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(data) => {
            boardService.updateBoard(board.id, data);
            setIsEditModalOpen(false);
          }}
          defaultValues={board}
        />
      )}
    </div>
  );
};

export default BoardOptionsIcon;
