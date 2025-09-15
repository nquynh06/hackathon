import React from "react";
import { Listbox } from "@headlessui/react";

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

const renderLabelChip = (field: keyof TaskFilterValues, value: string) => {
  if (!value) return value;

  const normalized = value.toLowerCase().replace(/\s+/g, "-");
  let className = "label-chip";

  if (field === "status") className += ` status-${normalized}`;
  else if (field === "priority") className += ` priority-${normalized}`;
  else if (field === "taskType") className += ` tasktype-${normalized}`;

  return <span className={className}>{value}</span>;
};

const TaskFilter: React.FC<TaskFilterProps> = ({
  value,
  onChange,
  statusOptions,
  priorityOptions,
  taskTypeOptions,
  className = "",
}) => {
  const renderListbox = (
    field: keyof TaskFilterValues,
    options: string[],
    placeholder: string
  ) => (
    <Listbox
      value={value[field]}
      onChange={(val) => onChange({ ...value, [field]: val })}
    >
      <div className="relative w-auto max-w-[140px]">
  <Listbox.Button className="px-2 py-1 rounded-2xl text-gray-500 cursor-pointer w-full text-left text-xs sm:text-sm shadow hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-0">
          {value[field] ? renderLabelChip(field, value[field]) : placeholder}
        </Listbox.Button>

  <Listbox.Options className="absolute mt-2 max-h-60 w-max min-w-full overflow-auto rounded-2xl bg-[#141821] shadow-2xl border border-gray-900 focus:outline-none z-20 text-sm sm:text-base py-1">
          <Listbox.Option
            key="all"
            value=""
            className={({ active }) =>
              `cursor-pointer select-none px-2 py-1 rounded-xl mx-1 my-1 font-semibold ${
                active ? "bg-[#03C73C] text-black" : "text-gray-300"
              }`
            }
          >
            {placeholder}
          </Listbox.Option>

          {options.map((opt) => (
            <Listbox.Option
              key={opt}
              value={opt}
              className={({ active }) =>
                `cursor-pointer select-none px-2 py-1 rounded-xl mx-1 my-1 font-semibold ${
                  active ? "bg-[#03C73C] text-black" : "text-gray-100"
                }`
              }
            >
              {renderLabelChip(field, opt)}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );

  return (
    <div className={`flex flex-wrap gap-2 sm:gap-4 mb-4 w-full ${className}`} style={{paddingLeft: 20, paddingRight: 20}}>
      {renderListbox("status", statusOptions, "All Status")}
      {renderListbox("priority", priorityOptions, "All Priority")}
      {renderListbox("taskType", taskTypeOptions, "All Task Type")}
    </div>
  );
};

export default TaskFilter;
