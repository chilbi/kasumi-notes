import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import DebouncedSlider, { DebouncedSliderProps } from './DebouncedSlider';
import clsx from 'clsx';

export const marks = (() => {
  const getMark = (value: number) => ({ value, label: undefined });
  return {
    level: [50, 100, 150].map(value => getMark(value)),
    love: [2, 4, 6, 8, 10].map(value => getMark(value)),
    unique: [30, 50, 70, 90, 110, 130].map(value => getMark(value)),
  };
})();

const useStyles = makeStyles(() => {
  return {
    popover: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 280,
      overflow: 'unset',
    },
    iconButton: {
      margin: '0.25rem 0',
      padding: 0,
    },
  };
});

interface ComboSliderProps extends DebouncedSliderProps {
  classes?: Partial<Record<'button' | 'popover' | 'iconButton', string>>;
  position?: 'left' | 'right';
  children?: React.ReactNode;
}

function ComboSlider(props: ComboSliderProps) {
  const { classes = {}, position = 'right', children, defaultValue, min, max, onDebouncedChange, ...other } = props;
  const styles = useStyles();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleOpenLevel = useCallback((e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <ButtonBase className={classes.button} onClick={handleOpenLevel}>
        {children}
      </ButtonBase>
      <Popover
        classes={{ paper: clsx(styles.popover, classes.popover) }}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: position, vertical: 'bottom' }}
        transformOrigin={{ horizontal: position === 'right' ? 'left' : 'right', vertical: 'bottom' }}
        onClose={handleClose}
      >
        <IconButton
          className={clsx(styles.iconButton, classes.iconButton)}
          disabled={defaultValue === max}
          onClick={onDebouncedChange && (() => onDebouncedChange(defaultValue as number + 1))}
        >
          <Add />
        </IconButton>
        <DebouncedSlider
          orientation="vertical"
          valueLabelDisplay="auto"
          min={min}
          max={max}
          defaultValue={defaultValue}
          onDebouncedChange={onDebouncedChange}
          {...other}
        />
        <IconButton
          className={clsx(styles.iconButton, classes.iconButton)}
          disabled={defaultValue === min}
          onClick={onDebouncedChange && (() => onDebouncedChange(defaultValue as number - 1))}
        >
          <Remove />
        </IconButton>
      </Popover>
    </>
  );
}

export default ComboSlider;
