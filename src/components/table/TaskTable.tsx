import React, { useState } from "react";
import type { Task } from "../../types";
import AddNewTaskRow from "./AddNewTaskRow";
import TaskFieldEditor from "./TaskFieldEditor";

// Thêm ở đầu file
type EditableField = "title" | "taskType" | "dueDate" | "status" | "priority" | "boardId";


interface TaskTableProps {
  tasks: Task[];
  onUpdateTask: (id: string, updated: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (taskData: Omit<Task, "id">) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onUpdateTask, onDeleteTask, onAddTask }) => {
  const [showAddRow, setShowAddRow] = useState(false);
  const [editing, setEditing] = useState<{ id: string; field: EditableField } | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleCellClick = (task: Task, field: EditableField) => {
    setEditing({ id: task.id, field });
    setTempValue(task[field] ? String(task[field]) : "");
  };

  const handleSave = () => {
    if (editing) {
      onUpdateTask(editing.id, { [editing.field]: tempValue });
      setEditing(null);
      setTempValue("");
    }
  };

  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-[#242424] text-white">
          <th className="border px-2 py-1">Title</th>
          <th className="border px-2 py-1">Type</th>
          <th className="border px-2 py-1">Due Date</th>
          <th className="border px-2 py-1">Status</th>
          <th className="border px-2 py-1">Priority</th>
          <th className="border px-2 py-1">Board</th>
          <th className="border px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            {(["title", "taskType", "dueDate", "status", "priority", "boardId"] as EditableField[]).map((field) => (
              <td
                key={field}
                className="border px-2 py-1 cursor-pointer"
                onClick={() => handleCellClick(task, field)}
              >
                {editing?.id === task.id && editing?.field === field ? (
                  <div onClick={(e) => e.stopPropagation()}>
                  <TaskFieldEditor
                    field={field}
                    value={String(task[field] || "")}
                    onSave={(newValue) => {
                      onUpdateTask(task.id, { [field]: newValue });
                      setEditing(null);
                    }}
                    onCancel={() => setEditing(null)}
                  />
                  </div>
                ) : (
                  task[field] as string
                )}
              </td>
            ))}

            <td className="border px-2 py-1">
              <button
                onClick={() =>
                  onUpdateTask(task.id, {
                    status: "Done",
                    actualDoneDate: new Date().toISOString(),
                  })
                }
                className="mr-2 text-blue-500"
              >
                Done
              </button>
              <button onClick={() => onDeleteTask(task.id)} className="text-red-500">
                Delete
              </button>
            </td>
          </tr>
        ))}

        {/* Row add new task */}
        {showAddRow ? (
          <AddNewTaskRow
            onAddTask={(data) => {
              onAddTask(data);
              setShowAddRow(false);
            }}
            onCancel={() => setShowAddRow(false)}
          />
        ) : (
          <tr>
            <td colSpan={7}>
              <button
                className="w-full text-left px-2 py-1 text-green-500"
                onClick={() => setShowAddRow(true)}
              >
                + Add New Task
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TaskTable;
