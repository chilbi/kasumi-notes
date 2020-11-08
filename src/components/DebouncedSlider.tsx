import React, { useRef, useState, useCallback, useEffect } from 'react';
import Slider, { SliderProps } from '@material-ui/core/Slider';
import useDebounced from '../hooks/useDebounced';

export interface DebouncedSliderProps extends SliderProps {
  wait?: number;
  onDebouncedChange?: (value: number) => void;
}

function DebouncedSlider(props: DebouncedSliderProps) {
  const { wait = 200, step = 1, defaultValue, onDebouncedChange, ...other } = props;
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
    <Slider {...other} step={step} value={value} onChange={handleChange} />
  );
}

export default DebouncedSlider;
