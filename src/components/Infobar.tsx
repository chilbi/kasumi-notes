import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  diffBar: {
    textAlign: 'right',
  },
  plus: {
    color: theme.palette.success.main,
  },
  minus: {
    color: theme.palette.error.main,
  },
  zero: {
    '&::after': {
      content: '"\\00A0"',
    },
  },
  valueBar: {
    display: 'flex',
  },
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '0.25rem',
    wordBreak: 'keep-all',
    overflow: 'hidden',
  },
  value: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    textAlign: 'right',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 'auto',
      right: 0,
      bottom: 0,
      left: -2,
      borderBottom: '1px dashed ' + theme.palette.primary.main,
    },
  },
  small: {
    width: '1.75rem',
  },
  medium: {
    width: '4rem',
  },
  large: {
    width: '7.5rem',
  },
  50: {
    width: '50%',
  },
  100: {
    width: '100%',
  },
}));

interface InfobarProps extends ClassesProps<typeof useStyles> {
  label: string;
  value?: string | number;
  diffValue?: number;
  showDiff?: boolean;
  width?: 50 | 100;
  size?: 'small' | 'medium' | 'large';
}

function Infobar(props: InfobarProps) {
  const { className, classes = {}, label, value, diffValue, showDiff, width, size } = props;
  const styles = useStyles();

  return (
    <div className={clsx(styles.root, classes.root, width && styles[width], className)}>
      {showDiff && (
        <div className={clsx(styles.diffBar, diffValue! > 0 ? styles.plus : diffValue! < 0 ? styles.minus : styles.zero)}>
          {diffValue! > 0 ? '+' + diffValue : diffValue! < 0 ? diffValue : ''}
        </div>
      )}
      <div className={styles.valueBar}>
        <span className={clsx(styles.label, classes.label, size && styles[size])}>
          {label}
        </span>
        <span className={clsx(styles.value, classes.value)}>
          {value}
        </span>
      </div>
    </div>
  );
}

export default Infobar;
