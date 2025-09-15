import React, { useState } from "react";

interface TaskFieldEditorProps {
  field: "taskType" | "status" | "priority" | "dueDate" | "title" | "boardId";
  value: string;
  onSave: (newValue: string) => void;
  onCancel: () => void;
}

const predefinedOptions: Record<string, string[]> = {
  taskType: ["Study", "Work", "Life"],
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
        className="border px-2 py-1 rounded bg-[#141821] text-white"
      />
    );
  }

  if (field === "taskType" || field === "status" || field === "priority") {
    return (
      <div className="absolute bg-[#141821] border border-gray-900 shadow-2xl rounded-2xl z-20 min-w-[140px] py-3 px-3 flex flex-col gap-2" style={{maxHeight: 'none', overflow: 'visible'}}>
        {/* Ô input thêm nhãn mới */}
        <input
          type="text"
          placeholder="Type & Enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAdd}
          className="border-2 border-gray-400 bg-[#222] text-black px-3 py-2 mb-2 w-full rounded-xl focus:border-green-500 outline-none placeholder-gray-500"
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
              className={`px-4 py-2 rounded-xl cursor-pointer font-semibold flex items-center gap-2 mx-1 ${
                selected === opt
                  ? "bg-[#03C73C] text-black" : "bg-gray-700 text-gray-100"
              }`}
            >
              {opt}
            </span>
          ))}
        </div>

        <div className="flex justify-end mt-2 gap-2">
          <button
            onClick={onCancel}
            className="bg-gray-400 text-black font-bold px-4 py-2 rounded-xl shadow"
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
      className="border px-2 py-1 rounded bg-[#141821] text-white"
    />
  );
};

export default TaskFieldEditor;
