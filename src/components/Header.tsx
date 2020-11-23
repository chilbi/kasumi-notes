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
      height: '3rem',
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid ' + theme.palette.grey[100],
      backgroundColor: '#fff',
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
