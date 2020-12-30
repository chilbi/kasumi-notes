import { makeStyles, Theme, StyleRules } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  const rankStyles = {} as StyleRules<string>;
  const rankColorKeys = Object.keys(theme.rankColor) as any as (keyof typeof theme.rankColor)[];
  for (let key of rankColorKeys) {
    rankStyles['rankColor' + key] = {
      color: theme.rankColor[key],
    };
  }

  return {
    root: {
      display: 'flex',
      alignItems: 'flex-end',
      marginBottom: theme.spacing(1),
      paddingBottom: theme.spacing(0.5),
      borderBottom: '2px solid' + theme.palette.primary.main,
    },
    label: {
      display: 'inline-flex',
      '&::before': {
        content: '""',
        display: 'inline-block',
        alignSelf: 'flex-end',
        margin: theme.spacing(0, 1, 1, 0),
        width: '0.5rem',
        height: '0.625rem',
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
      },
    },
    uniqueColor: {
      color: '#d34bef',
    },
    ...rankStyles,
  }
});

interface LabelDividerProps {
  className?: string;
  point?: number | string;
  unique?: boolean;
  label: string;
  children?: React.ReactNode;
}

function LabelDivider(props: LabelDividerProps) {
  const { className, point, unique, label, children } = props;
  const styles = useStyles();

  return (
    <div className={clsx(styles.root, className)}>
      <span className={clsx(styles.label, unique && styles.uniqueColor, point && styles['rankColor' + point as keyof typeof styles])}>{label}</span>
      {children}
    </div>
  )
}

export default LabelDivider;
