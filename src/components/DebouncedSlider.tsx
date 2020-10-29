import React, { useState, useCallback } from 'react';
import Slider, { SliderProps } from '@material-ui/core/Slider';
import useDebounced from '../hooks/useDebounced';

interface DebouncedSliderProps extends SliderProps {
  wait?: number;
  onDebouncedChange?: (e: React.SyntheticEvent, value: number) => void;
}

function DebouncedSlider(props: DebouncedSliderProps) {
  const { wait = 200, defaultValue, onDebouncedChange, orientation = 'vertical', valueLabelDisplay = 'on', step = 1, ...other } = props;
  const [value, setValue] = useState(defaultValue);

  const handleDebouncedChange = useDebounced((e: React.SyntheticEvent, value: number) => {
    onDebouncedChange && onDebouncedChange(e, value);
  }, wait);

  const handleChange = useCallback((e: React.SyntheticEvent, value: number | number[]) => {
    setValue(value as number);
    handleDebouncedChange(e, value as number);
  }, [handleDebouncedChange]);

  return (
    <Slider {...other} orientation={orientation} valueLabelDisplay={valueLabelDisplay} step={step} value={value} onChange={handleChange} />
  );
}

export default DebouncedSlider;
