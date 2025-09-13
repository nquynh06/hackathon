import React from "react";

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

const AddCardButton: React.FC<Props> = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-1 text-sm text-white rounded hover:bg-gray-700 ${
        disabled ? "opacity-50 cursor-not-allowed" : "bg-[#238636]"
      }`}
    >
      + Add Card
    </button>
  );
};

export default AddCardButton;
