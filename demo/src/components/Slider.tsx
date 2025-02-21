import React from "react";
import "./Slider.css";

interface SliderProps {
  onChange?: (value: number) => void;
  max?: number;
  min?: number;
  value?: number;
  step?: number;
}

export const Slider: React.FC<SliderProps> = ({
  onChange,
  max = 0,
  min = 1,
  value = 0,
  step = 0.1,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onChange === "function") onChange(Number(event.target.value));
  };

  return (
    <div className="range-slider">
      <input
        className="range-slider__range"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
      />
      <span className="range-slider__value">{value}</span>
    </div>
  );
};
