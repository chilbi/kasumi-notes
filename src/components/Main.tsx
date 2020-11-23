import { useState, useCallback } from 'react';
import { Navigate, useNavigate, useLocation, matchPath } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Footer from './Footer';
import CharaList from './CharaList';
import CharaDetail from './CharaDetail';
import EquipDetail from './EquipDetail';
import Quest from './Quest';
import Menu from './Menu';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      backgroundColor: '#263238',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      maxWidth: theme.maxWidth,
      minHeight: '100vh',
      backgroundColor: theme.palette.grey[100],
    },
    item: {
      flex: '1 0 auto',
    },
    hidden: {
      display: 'none',
    },
  };
});

function Main() {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname + location.search;
  const charaMatch = matchPath({
    path: '/chara*',
    caseSensitive: true,
    end: true,
  }, url);
  const questMatch = matchPath({
    path: '/quest*',
    caseSensitive: true,
    end: true,
  }, url);
  const menuMatch = matchPath({
    path: '/menu*',
    caseSensitive: true,
    end: true,
  }, url);
  const charaDetailMatch = url.indexOf('/chara?unit_id=') > -1;
  const equipDetailMatch = url.indexOf('equip_id=') > -1;
  // const charaDetailMatch = matchPath({
  //   path: '/chara?unit_id=*',
  //   caseSensitive: true,
  //   end: true,
  // }, url);
  // const equipDetailMatch = matchPath({
  //   path: '*&equip_id=*',
  //   caseSensitive: true,
  //   end: true,
  // }, url);
  const noMatch = !charaMatch && !charaDetailMatch && !equipDetailMatch && !questMatch && !menuMatch;

  const [path, setPath] = useState('/chara');
  const handleChange = useCallback((e: React.SyntheticEvent, newPath: string) => {
    navigate(newPath);
    setPath(newPath);
  }, [navigate]);

  if (charaMatch && path !== '/chara') setPath('/chara');
  else if (questMatch && path !== '/quest') setPath('/quest');
  else if (menuMatch && path !== '/menu') setPath('/menu')
 
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div id="chara-list" className={clsx(styles.item, (!charaMatch || charaDetailMatch || equipDetailMatch) && styles.hidden)}>
          <CharaList />
        </div>
        <div id="chara-detail" className={clsx(styles.item, (!charaDetailMatch || equipDetailMatch) && styles.hidden)}>
          {charaDetailMatch && <CharaDetail />}
        </div>
        <div id="equip-detail" className={clsx(styles.item, !equipDetailMatch && styles.hidden)}>
          {equipDetailMatch && <EquipDetail />}
        </div>
        <div id="quest" className={clsx(styles.item, !questMatch && styles.hidden)}>
          {questMatch && <Quest />}
        </div>
        <div id="menu" className={clsx(styles.item, !menuMatch && styles.hidden)}>
          {menuMatch && <Menu />}
        </div>
        {!charaDetailMatch && <Footer value={path} onChange={handleChange} />}
        {noMatch && <Navigate to="/chara" replace />}
      </div>
    </div>
  );
}

export default Main;
