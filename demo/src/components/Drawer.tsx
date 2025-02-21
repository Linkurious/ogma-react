import React, { useState, useEffect } from "react";
import "./Drawer.css";

interface DrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClosed?: () => void;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  children,
  onClosed,
  className,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(isOpen);

  useEffect(() => {
    setIsDrawerOpen(isOpen);
  }, [isOpen]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    if (onClosed) onClosed();
  };

  return (
    <>
      {isDrawerOpen && (
        <div
          className={`drawer-underlay ${isDrawerOpen ? "show" : ""}`}
          onClick={closeDrawer}
        ></div>
      )}
      <div
        className={`drawer ${isDrawerOpen ? "open" : ""} ${className || ""}`}
      >
        <button className="close-button" onClick={closeDrawer}>
          &times;
        </button>
        <div className="drawer-content">{children}</div>
      </div>
    </>
  );
};
