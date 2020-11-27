import { makeStyles, Theme } from '@material-ui/core/styles';
import useImage from '../hooks/useImage';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.grey[300],
  },
  imgBox: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  img: {
    width: '100%',
    height: 'auto',
    userSelect: 'none',
  },
  hidden: {
    opacity: 0,
  },
  absolute0: {
    zIndex: 0,
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

interface SkeletonImageProps {
  classes?: Partial<Record<'root' | 'img', string>>;
  src?: string;
  save?: boolean;
  onlyImg?: boolean;
  children?: React.ReactNode;
}

function SkeletonImage(props: SkeletonImageProps) {
  const { classes = {}, src, save, onlyImg, children } = props;
  const styles = useStyles();
  const url = useImage(src, save);

  const hiddenClassName = url === undefined && styles.hidden;

  const imgEle = (
    <img
      className={clsx(styles.img, !onlyImg && styles.absolute0, classes.img, hiddenClassName)}
      src={url}
      alt=""
    />
  );

  if (onlyImg) return imgEle;

  return (
    <div className={clsx(styles.root, classes.root)}>
      <div className={clsx(styles.imgBox, hiddenClassName)}>
        {imgEle}
        {children}
      </div>
    </div>
  );
}

export default SkeletonImage;
