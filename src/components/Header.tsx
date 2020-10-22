import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ViewModule from '@material-ui/icons/ViewModule';
import ViewStream from '@material-ui/icons/ViewStream';

interface HeaderProps {
  classes: Record<'bar' | 'subtitle', string>;
  variant: 'icon_unit' | 'unit_plate';
  subtitle: string;
  disabledBack: boolean;
  disabledVariant: boolean;
  onBack: (e: React.MouseEvent) => void;
  onChangeVariant: (e: React.MouseEvent) => void;
}

function Header(props: HeaderProps) {
  const { classes, variant, subtitle, disabledBack, disabledVariant, onBack, onChangeVariant } = props;

  return (
    <div id="header" className={classes.bar}>
      <IconButton disabled={disabledBack} style={disabledBack ? { opacity: 0 } : undefined} color="primary" onClick={onBack}>
        <ArrowBack />
      </IconButton>
      <h6 className={classes.subtitle}>{subtitle}</h6>
      <IconButton disabled={disabledVariant} style={disabledVariant ? { opacity: 0 } : undefined} color="primary" onClick={onChangeVariant}>
        {variant === 'icon_unit' ? <ViewModule /> : <ViewStream />}
      </IconButton>
    </div>
  );
}

export default Header;
