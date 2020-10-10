import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
  nameBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    flexGrow: 1,
    margin: '0.25em',
  },
  unitName: {
    fontSize: '1.2em',
    color: theme.palette.primary.dark,
  },
  actualName: {
    color: theme.palette.secondary.light,
  },
  skeleton: {
    backgroundColor: theme.palette.grey[200], // '#ecebf0',
    '&::before': {
      content: '"\\00a0"',
    }
  },
}));

interface CharaNameProps {
  unitName?: string;
  actualName?: string;
}

function CharaName(props: CharaNameProps) {
  const { unitName, actualName } = props;
  const styles = useStyles();
  return (
    <div className={clsx(styles.nameBox)}>
      <span className={clsx(styles.unitName, !unitName && styles.skeleton)}>{unitName}</span>
      <span className={clsx(styles.actualName, !actualName && styles.skeleton)}>{actualName}</span>
    </div>
  );
}

export default CharaName;
