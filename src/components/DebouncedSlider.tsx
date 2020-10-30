import React, { useState, useCallback, useRef, useEffect } from 'react';
import Slider, { SliderProps } from '@material-ui/core/Slider';
import useDebounced from '../hooks/useDebounced';

export const marks = (() => {
  const getMark = (value: number) => ({ value, label: undefined });
  return {
    level: [50, 100, 150].map(value => getMark(value)),
    love: [2, 4, 6, 8, 10].map(value => getMark(value)),
    unique: [30, 50, 70, 90, 110, 130].map(value => getMark(value)),
  };
})();

interface DebouncedSliderProps extends SliderProps {
  wait?: number;
  onDebouncedChange?: (value: number) => void;
}

function DebouncedSlider(props: DebouncedSliderProps) {
  const { wait = 200, defaultValue, onDebouncedChange, orientation = 'vertical', valueLabelDisplay = 'on', step = 1, ...other } = props;
  const [value, setValue] = useState(defaultValue);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (defaultValue !== valueRef.current) setValue(defaultValue);
  }, [defaultValue]);

  const handleDebouncedChange = useDebounced((value: number) => {
    onDebouncedChange && onDebouncedChange(value);
  }, wait);

  const handleChange = useCallback((e: React.SyntheticEvent, value: number | number[]) => {
    setValue(value as number);
    handleDebouncedChange(value as number);
  }, [handleDebouncedChange]);

  return (
    <Slider {...other} orientation={orientation} valueLabelDisplay={valueLabelDisplay} step={step} value={value} onChange={handleChange} />
  );
}

export default DebouncedSlider;
