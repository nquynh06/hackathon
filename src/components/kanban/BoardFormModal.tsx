import { useEffect, useState } from "react";
import type { Board } from "/workspaces/hackathon/src/types/index.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Board>) => void;
  defaultValues?: Partial<Board>;
}

const BoardFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, defaultValues }) => {
  const [title, setTitle] = useState(defaultValues?.title || "");

  useEffect(() => {
    setTitle(defaultValues?.title || "");
  }, [defaultValues]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#2B2B39] rounded-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">
          {defaultValues ? "Edit Board" : "Add Board"}
        </h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-[#1F1D29] text-white mb-4"
          placeholder="Board title"
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-600 text-white" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-[#238636] text-white"
            onClick={() => onSubmit({ title })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardFormModal;
