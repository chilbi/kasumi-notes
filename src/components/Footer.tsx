import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PeopleAlt from '@material-ui/icons/PeopleAlt';
import Gavel from '@material-ui/icons/Gavel';
import Menu from '@material-ui/icons/Menu';

interface FooterProps {
  className?: string;
  value: string;
  onChange: (e: React.SyntheticEvent, newValue: string) => void;
}

function Footer(props: FooterProps) {
  const { className, value, onChange } = props;
  return (
    <BottomNavigation id="footer" className={className} showLabels value={value} onChange={onChange}>
      <BottomNavigationAction value="/" label="キャラ" icon={<PeopleAlt />} />
      <BottomNavigationAction value="/quest" label="クエスト" icon={<Gavel />} />
      <BottomNavigationAction value="/menu" label="メニュー" icon={<Menu />} />
    </BottomNavigation>
  );
}

export default Footer;
