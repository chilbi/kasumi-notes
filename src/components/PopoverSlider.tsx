import { useState, useCallback } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';
import { DebouncedSliderProps } from './DebouncedSlider';
import SliderPlus from './SliderPlus';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  return {
    popover: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 280,
      overflow: 'unset',
    },
    iconButton: {
      margin: theme.spacing(1, 0),
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
  const { classes = {}, position = 'right', children, orientation = 'vertical', ...other } = props;
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
        <SliderPlus classes={{ iconButton: clsx( styles.iconButton, classes.iconButton) }} orientation={orientation} {...other} />
      </Popover>
    </>
  );
}

export default ComboSlider;
