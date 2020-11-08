import React, { useState, useCallback, useMemo } from 'react';
import { Navigate, useNavigate, useMatch } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Footer from './Footer';
import CharaList from './CharaList';
import CharaDetail from './CharaDetail';
import { getParamsUnitID } from '../DBHelper/helper';
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
      <div className={styles.container}>
        <div id="chara-list" className={clsx(styles.item, !rootMatch && styles.hidden)}>
          <CharaList />
        </div>
        <div id="chara-detail" className={clsx(styles.item, !charaDetailMatch && styles.hidden)}>
          {charaDetailMatch && <CharaDetail unitID={getParamsUnitID(charaDetailMatch.params.unit_id)} />}
        </div>
        <div id="quest" className={clsx(styles.item, !questMatch && styles.hidden)}>
          未完成
      </div>
        <div id="menu" className={clsx(styles.item, !menuMatch && styles.hidden)}>
          未完成
      </div>
        {footer}
        {noMatch && <Navigate to="/chara" replace />}
      </div>
    </div>
  );
}

export default Main;
