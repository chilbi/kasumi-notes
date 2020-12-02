import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => {

  return {
    root: {
      zIndex: theme.zIndex.appBar,
      position: 'sticky',
      top: 0,
      right: 0,
      bottom: 'auto',
      left: 0,
      display: 'flex',
      alignItems: 'center',
      height: '3rem',
      color: '#fff',
      backgroundColor: theme.palette.primary.main,
      overflow: 'hidden',
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
    <div className={styles.root}>
      {children}
    </div>
  );
}

export default Header;
