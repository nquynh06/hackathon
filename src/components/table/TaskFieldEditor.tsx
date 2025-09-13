import React, { useState } from "react";

interface TaskFieldEditorProps {
  field: "taskType" | "status" | "priority" | "dueDate" | "title" | "boardId";
  value: string;
  onSave: (newValue: string) => void;
  onCancel: () => void;
}

const predefinedOptions: Record<string, string[]> = {
  taskType: ["Bug", "Feature", "Research"],
  status: ["Todo", "In Progress", "Done"],
  priority: ["Low", "Medium", "High"],
};

const TaskFieldEditor: React.FC<TaskFieldEditorProps> = ({
  field,
  value,
  onSave,
  onCancel,
}) => {
  const STORAGE_KEY = `labels_${field}`;
  const [options, setOptions] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) return JSON.parse(saved);
    return predefinedOptions[field] || [];
  });
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState(value);

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      if (!options.includes(inputValue)) {
        const newOptions = [...options, inputValue];
        setOptions(newOptions);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newOptions));
      }
      setInputValue("");
    }
  };

  if (field === "dueDate") {
    return (
      <input
        type="date"
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          onSave(e.target.value);
        }}
        autoFocus
        className="border px-2 py-1 rounded bg-[#242424] text-white"
      />
    );
  }

  if (field === "taskType" || field === "status" || field === "priority") {
    return (
      <div className="absolute bg-black border shadow p-2 rounded z-10 w-48">
        {/* Ô input thêm nhãn mới */}
        <input
          type="text"
          placeholder="Type & Enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAdd}
          className="border px-2 py-1 mb-2 w-full rounded text-black"
        />

        {/* Hiển thị các label */}
        <div className="flex flex-col gap-2">
          {options.map((opt) => (
            <span
              key={opt}
              onClick={() => {
                setSelected(opt);
                onSave(opt);
              }}
              className={`px-2 py-1 rounded cursor-pointer ${
                selected === opt
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {opt}
            </span>
          ))}
        </div>

        <div className="flex justify-end mt-2 gap-2">
          <button
            onClick={onCancel}
            className="bg-gray-400 text-black px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // default text
  return (
    <input
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      onBlur={() => onSave(selected)}
      autoFocus
      className="border px-2 py-1 rounded bg-[#242424] text-white"
    />
  );
};

export default TaskFieldEditor;
