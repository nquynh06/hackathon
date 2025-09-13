import { useEffect, useState } from "react";
import type { Task } from "/workspaces/hackathon/src/types/index.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Task>) => void;
  defaultValues?: Partial<Task>;
  isEditMode?: boolean;
}

const CardFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, defaultValues = {}, isEditMode = false }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    taskType: "General",
    status: "",
    priority: "Normal",
  });

  useEffect(() => {
    setFormData({
      title: defaultValues.title || "",
      taskType: defaultValues.taskType || "General",
      status: defaultValues.status || "",
      priority: defaultValues.priority || "Normal",
    });
  }, [defaultValues]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#2B2B39] rounded-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">{isEditMode ? "Edit Task" : "Add Task"}</h2>

        <input
          type="text"
          placeholder="Task title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full p-2 rounded bg-[#1F1D29] text-white mb-4"
        />

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-600 text-white" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded bg-[#238636] text-white" onClick={() => onSave(formData)}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CardFormModal;
