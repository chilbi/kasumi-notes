import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PeopleAlt from '@material-ui/icons/PeopleAlt';
import Gavel from '@material-ui/icons/Gavel';
import Menu from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) => {
  const h = '3.5rem';

  return {
    root: {
      zIndex: theme.zIndex.appBar,
      position: 'fixed',
      top: 'auto',
      right: 0,
      bottom: 0,
      left: 0,
      margin: '0 auto',
      maxWidth: theme.maxWidth,
      height: h,
      borderTop: '1px solid ' + theme.palette.grey[100],
    },
    offset: {
      flexShrink: 0,
      height: h,
    },
  };
});

interface FooterProps {
  value: string;
  onChange: (e: React.SyntheticEvent, newValue: string) => void;
}

function Footer(props: FooterProps) {
  const { value, onChange } = props;
  const styles = useStyles();

  return (
    <>
      <div className={styles.offset} />
      <BottomNavigation id="footer" className={styles.root} showLabels value={value} onChange={onChange}>
        <BottomNavigationAction value="/chara" label="キャラ" icon={<PeopleAlt />} />
        <BottomNavigationAction value="/quest" label="クエスト" icon={<Gavel />} />
        <BottomNavigationAction value="/menu" label="メニュー" icon={<Menu />} />
      </BottomNavigation>
    </>
  );
}

export default Footer;
