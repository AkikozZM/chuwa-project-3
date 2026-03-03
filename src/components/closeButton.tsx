import React from "react";
import "./CloseButton.css";
import { icons } from "../constants/icons"; 

interface CloseButtonProps {
  onClick: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
}) => (
  <button
    type="button"
    className="close-button"
    onClick={onClick}
  >
    {icons.CLOSE}
  </button>
);
