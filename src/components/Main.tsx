import React, { useState, useCallback, useMemo } from 'react';
import { Navigate, useNavigate, useMatch } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Footer from './Footer';
import CharaList from './CharaList';
import CharaDetail from './CharaDetail';
import { getParamsUnitID } from '../DBHelper/helper';

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      margin: '0 auto',
      maxWidth: theme.maxWidth,
      minHeight: '100vh',
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
  const rootMatch = useMatch({
    path: '/chara',
    caseSensitive: true,
  });
  const charaDetailMatch = useMatch({
    path: '/chara/:unit_id',
    caseSensitive: true,
  });
  const questMatch = useMatch({
    path: '/quest',
    caseSensitive: true,
  });
  const menuMatch = useMatch({
    path: '/menu',
    caseSensitive: true,
  });
  const noMatch = !rootMatch && !charaDetailMatch && !questMatch && !menuMatch;

  const [path, setPath] = useState(() => '/chara');
  const handleChange = useCallback((e: React.SyntheticEvent, newPath: string) => {
    navigate(newPath);
    setPath(newPath);
  }, [navigate]);

  const footer = useMemo(() => !charaDetailMatch && (
    <Footer value={path} onChange={handleChange} />
  ), [path, charaDetailMatch, handleChange]);

  return (
    <div className={styles.root}>
      <div id="chara-list" className={rootMatch ? undefined : styles.hidden}>
        <CharaList />
      </div>
      <div id="chara-detail" className={charaDetailMatch ? undefined : styles.hidden}>
        {charaDetailMatch && <CharaDetail unitID={getParamsUnitID(charaDetailMatch.params.unit_id)} />}
      </div>
      <div id="quest" className={questMatch ? undefined : styles.hidden}>
        未完成
      </div>
      <div id="menu" className={menuMatch ? undefined : styles.hidden}>
        未完成
      </div>
      {footer}
      {noMatch && <Navigate to="/chara" replace />}
    </div>
  );
}

export default Main;
