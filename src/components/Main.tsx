import { useState, useCallback, useRef, useEffect } from 'react';
import { Navigate, useNavigate, useLocation, matchPath } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
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
      backgroundColor: theme.palette.grey.A400,
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      maxWidth: theme.breakpoints.width('sm'),
      minHeight: '100vh',
      backgroundColor: theme.palette.grey[100],
    },
    item: {
      flex: '1 0 auto',
      backgroundColor: theme.palette.grey[100],
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
  const noMatch = !charaMatch && !charaDetailMatch && !equipDetailMatch && !questMatch && !menuMatch;

  const [path, setPath] = useState('/chara');
  const handleChange = useCallback((e: React.SyntheticEvent, newPath: string) => {
    navigate(newPath);
    setPath(newPath);
  }, [navigate]);

  if (charaMatch && path !== '/chara') setPath('/chara');
  else if (questMatch && path !== '/quest') setPath('/quest');
  else if (menuMatch && path !== '/menu') setPath('/menu');

  const hiddenCharaList = !charaMatch || charaDetailMatch || equipDetailMatch;
  const hiddenCharaDetail = !charaDetailMatch || equipDetailMatch;
  const hiddenEquipDetail = !equipDetailMatch;
  const hiddenQuest = !questMatch;
  const hiddenMenu = !menuMatch;

  const currRef = useRef(equipDetailMatch ? 4 : charaDetailMatch ? 3 : menuMatch ? 2 : questMatch ? 1 : 0);
  const prev = currRef.current;
  useEffect(() => {
    currRef.current = equipDetailMatch ? 4 : charaDetailMatch ? 3 : menuMatch ? 2 : questMatch ? 1 : 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipDetailMatch, charaDetailMatch, !menuMatch, !questMatch]);
 
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Slide in={!hiddenCharaList} direction={prev > 0 ? 'right' : 'left'}>
          <div id="chara-list" className={clsx(styles.item, hiddenCharaList && styles.hidden)}>
            <CharaList />
          </div>
        </Slide>
        <Slide in={!hiddenQuest} direction={prev > 1 ? 'right' : 'left'}>
          <div id="quest" className={clsx(styles.item, hiddenQuest && styles.hidden)}>
            {questMatch && <Quest />}
          </div>
        </Slide>
        <Slide in={!hiddenMenu} direction="left">
          <div id="menu" className={clsx(styles.item, hiddenMenu && styles.hidden)}>
            {menuMatch && <Menu />}
          </div>
        </Slide>
        <Slide in={!hiddenCharaDetail} direction={prev > 3 ? 'right' : 'left'}>
          <div id="chara-detail" className={clsx(styles.item, hiddenCharaDetail && styles.hidden)}>
            {charaDetailMatch && <CharaDetail />}
          </div>
        </Slide>
        <Slide in={!hiddenEquipDetail} direction="left">
          <div id="equip-detail" className={clsx(styles.item, hiddenEquipDetail && styles.hidden)}>
            {equipDetailMatch && <EquipDetail />}
          </div>
        </Slide>
        <Footer className={clsx(charaDetailMatch && styles.hidden)} value={path} onChange={handleChange} />
        {noMatch && <Navigate to="/chara" replace />}
      </div>
    </div>
  );
}

export default Main;
