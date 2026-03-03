import React from "react";
import "./ProductButton.css";

interface ProductButtonProps {
  buttonText: string;
  handleClick: () => void;
  customStyle?: React.CSSProperties;
  className?: string;
}

export const ProductButton: React.FC<ProductButtonProps> = ({
  buttonText,
  handleClick,
  customStyle,
  className = '',
}) => (
  <button onClick={handleClick} className={`text-sm text-white h-[40px] flex items-center justify-center ${className} `} style={customStyle}>
    {buttonText}
  </button>
);
