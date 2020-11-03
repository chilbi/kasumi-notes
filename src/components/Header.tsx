import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => {
  const h = '3rem';

  return {
    root: {
      zIndex: theme.zIndex.appBar,
      position: 'fixed',
      margin: '0 auto',
      maxWidth: theme.maxWidth,
      top: 0,
      right: 0,
      bottom: 'auto',
      left: 0,
      height: h,
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid ' + theme.palette.grey[100],
      backgroundColor: '#fff',
    },
    offset: {
      height: h,
    },
  };
});

interface HeaderProps {
  children?: React.ReactNode;
}

function Header(props: HeaderProps) {
  const { children } = props;
  const styles = useStyles();

  return (
    <>
      <div id="header" className={styles.root}>
        {children}
      </div>
      <div className={styles.offset} />
    </>
  );
}

export default Header;
