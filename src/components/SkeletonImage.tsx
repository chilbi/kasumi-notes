import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useImage from '../hooks/useImage';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.grey[200], // '#ecebf0',
  },
  imgBox: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  img: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 'auto',
    userSelect: 'none',
  },
  hidden: {
    opacity: 0,
  },
}));

interface SkeletonImageProps {
  classes?: Partial<Record<'root' | 'imgBox' | 'img', string>>;
  src?: string;
  save?: boolean;
  children?: React.ReactNode;
}

function SkeletonImage(props: SkeletonImageProps) {
  const { classes = {}, src, save, children } = props;
  const styles = useStyles();
  const url = useImage(src, save);

  return (
    <div className={clsx(styles.root, classes.root)}>
      <div className={clsx(styles.imgBox, classes.imgBox, url === undefined && styles.hidden)}>
        <img className={clsx(styles.img, classes.img)} src={url} alt="" />
        {children}
      </div>
    </div>
  );
}

export default SkeletonImage;
