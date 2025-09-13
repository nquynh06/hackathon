import React from "react";

export interface TaskFilterValues {
  status: string;
  priority: string;
  taskType: string;
}

interface TaskFilterProps {
  value: TaskFilterValues;
  onChange: (value: TaskFilterValues) => void;
  statusOptions: string[];
  priorityOptions: string[];
  taskTypeOptions: string[];
  className?: string;
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  value,
  onChange,
  statusOptions,
  priorityOptions,
  taskTypeOptions,
  className = "",
}) => {
  const handleChange = (field: keyof TaskFilterValues) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, [field]: e.target.value });
  };

  return (
    <div className={`flex gap-2 mb-4 ${className}`}>
      <select className="px-2 py-1 rounded border" value={value.status} onChange={handleChange("status")}>
        <option value="">All Status</option>
        {statusOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <select className="px-2 py-1 rounded border" value={value.priority} onChange={handleChange("priority")}>
        <option value="">All Priority</option>
        {priorityOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <select className="px-2 py-1 rounded border" value={value.taskType} onChange={handleChange("taskType")}>
        <option value="">All Task Type</option>
        {taskTypeOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default TaskFilter;