import React, { useState, useCallback, useMemo } from 'react';
import { Redirect, useRouteMatch, useHistory } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Footer from './Footer';
import CharaList from './CharaList';
import CharaDetail from './CharaDetail';

function parseParamsUnitID(unit_id: string): number {
  const len = unit_id.length;
  if (len <= 4) unit_id = '100'.substr(0, 4 - len) + unit_id + '01';
  if (len !== 6) unit_id = unit_id.substr(0, 4) + '01';
  return parseInt(unit_id);
}

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

  const history = useHistory();
  const rootMatch = useRouteMatch({
    path: '/',
    exact: true,
  });
  const charaDetailMatch = useRouteMatch<{ unit_id: string }>({
    path: '/chara/detail/:unit_id',
    exact: true,
  });
  const questMatch = useRouteMatch({
    path: '/quest',
    exact: true,
  });
  const menuMatch = useRouteMatch({
    path: '/menu',
    exact: true,
  });
  const noMatch = !rootMatch && !charaDetailMatch && !questMatch && !menuMatch;

  const [value, setValue] = useState(() => rootMatch ? '/' : questMatch ? '/quest' : '/menu');
  const handleChange = useCallback((e: React.SyntheticEvent, newValue: string) => {
    history.push(newValue);
    setValue(newValue);
  }, [history]);

  const footer = useMemo(() => !charaDetailMatch && (
    <Footer value={value} onChange={handleChange} />
  ), [value, charaDetailMatch, handleChange]);

  return (
    <div className={styles.root}>
      <div id="chara-list" className={rootMatch ? undefined : styles.hidden}>
        <CharaList />
      </div>
      <div id="chara-detail" className={charaDetailMatch ? undefined : styles.hidden}>
        {charaDetailMatch && <CharaDetail unitID={parseParamsUnitID(charaDetailMatch.params.unit_id)} />}
      </div>
      <div id="quest" className={questMatch ? undefined : styles.hidden}>
        quest
      </div>
      <div id="menu" className={menuMatch ? undefined : styles.hidden}>
        menu
      </div>
      {footer}
      {noMatch && <Redirect to="/" />}
    </div>
  );
}

export default Main;
