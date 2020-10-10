import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    width: '100%',
    textDecoration: 'none',
    color: 'inherit',
  },
});

interface ButtonProps {
  className?: string;
  to: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

function ButtonLink(props: ButtonProps) {
  const { className, to, disabled, children } = props;
  const styles = useStyles();
  const history = useHistory();

  return (
    <ButtonBase
      className={clsx(styles.root, className)}
      disabled={disabled}
      component="a"
      onClick={() => history.push(to)}
    >
      {children}
    </ButtonBase>
  );
}

export default ButtonLink;
