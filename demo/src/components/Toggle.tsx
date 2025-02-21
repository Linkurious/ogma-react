import React from "react";
import "./Toggle.css";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  className,
}) => {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === "function") onChange(evt.target.checked);
    },
    [onChange]
  );

  return (
    <label className={`switch ${className || ""}`}>
      <input checked={checked} type="checkbox" onChange={handleChange} />
      <span className="slider"></span>
      {label && <span className="label-text">{label}</span>}
    </label>
  );
};
