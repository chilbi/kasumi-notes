import React, { useState, useCallback } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';

interface ButtonPopoverProps {
  classes?: Partial<Record<'button' | 'popover', string>>;
  position?: 'left' | 'right';
  content?: React.ReactNode;
  children?: React.ReactNode;
}

function ButtonPopover(props: ButtonPopoverProps) {
  const { classes = {}, position = 'right', content, children } = props;

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleOpenLevel = useCallback((e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <ButtonBase component="div" className={classes.button} onClick={handleOpenLevel}>
        {children}
      </ButtonBase>
      <Popover
        classes={{ paper: classes.popover }}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: position, vertical: 'bottom' }}
        transformOrigin={{ horizontal: position === 'right' ? 'left' : 'right', vertical: 'bottom' }}
        onClose={handleClose}
      >
        {content}
      </Popover>
    </>
  );
}

export default ButtonPopover;
