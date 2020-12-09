import { useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import DebouncedSlider, { DebouncedSliderProps } from './DebouncedSlider';

interface SliderPlusProps extends DebouncedSliderProps {
  classes?: Partial<Record<'iconButton', string>>;
}

function SliderPlus(props: SliderPlusProps) {
  const { classes = {}, orientation, defaultValue, min, max, onDebouncedChange, ...other } = props;

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    onDebouncedChange(parseInt(e.currentTarget.getAttribute('data-value')!));
  }, [onDebouncedChange]);

  const plus = (
    <IconButton
      className={classes.iconButton}
      disabled={defaultValue === max}
      data-value={defaultValue as number + 1}
      onClick={handleClick}
    >
      <Add />
    </IconButton>
  );

  const minus = (
    <IconButton
      className={classes.iconButton}
      disabled={defaultValue === min}
      data-value={defaultValue as number - 1}
      onClick={handleClick}
    >
      <Remove />
    </IconButton>
  );

  const isVertical = orientation === 'vertical';

  return (
    <>
      {isVertical ? plus : minus}
      <DebouncedSlider
        orientation={orientation}
        valueLabelDisplay="auto"
        min={min}
        max={max}
        defaultValue={defaultValue}
        onDebouncedChange={onDebouncedChange}
        {...other}
      />
      {isVertical ? minus : plus}
    </>
  );
}

export default SliderPlus;
