import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PeopleAlt from '@material-ui/icons/PeopleAlt';
import Gavel from '@material-ui/icons/Gavel';
import Menu from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      zIndex: theme.zIndex.appBar,
      position: 'sticky',
      top: 'auto',
      right: 0,
      bottom: 0,
      left: 0,
      height: '3.5rem',
      flex: '0 0 auto',
      borderTop: '1px solid ' + theme.palette.grey[100],
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
    <BottomNavigation className={styles.root} showLabels value={value} onChange={onChange}>
      <BottomNavigationAction value="/chara" label="キャラ" icon={<PeopleAlt />} />
      <BottomNavigationAction value="/quest" label="クエスト" icon={<Gavel />} disabled />
      <BottomNavigationAction value="/menu" label="メニュー" icon={<Menu />} disabled />
    </BottomNavigation>
  );
}

export default Footer;
