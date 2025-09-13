import React from "react";

interface Props {
  onClick: () => void;
  showLabel?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const AddBoardButton: React.FC<Props> = ({ onClick, showLabel = false, className = "", children }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 bg-[#8038F0] hover:bg-[#6b2fc0] text-white rounded ${className}`}
    >
      +
      {showLabel && children}
    </button>
  );
};

export default AddBoardButton;
