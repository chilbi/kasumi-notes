import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';

interface HeaderProps {
  classes: Record<'bar' | 'subtitle', string>;
  subtitle: string;
  disabled: boolean;
  onClick: (e: React.MouseEvent) => void;
}

function Header(props: HeaderProps) {
  const { classes, subtitle, disabled, onClick } = props;

  return (
    <div id="header" className={classes.bar}>
      <IconButton disabled={disabled} color="primary" onClick={onClick}><ArrowBack /></IconButton>
      <h5 className={classes.subtitle}>{subtitle}</h5>
    </div>
  );
}

export default Header;
