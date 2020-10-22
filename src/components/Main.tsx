import React, { useState, useCallback, useMemo } from 'react';
import { Redirect, useRouteMatch, useHistory } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Header from './Header';
import Footer from './Footer';
import CharaList from './CharaList';
import CharaDetail from './CharaDetail';
import Quest from './Quest';
import Menu from './Menu';
import clsx from 'clsx';

function parseParamsUnitID(unit_id: string): number {
  const len = unit_id.length;
  if (len <= 4) unit_id = '100'.substr(0, 4 - len) + unit_id + '01';
  if (len !== 6) unit_id = unit_id.substr(0, 4) + '01';
  return parseInt(unit_id);
}

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    '&>*': {
      width: '100%',
      height: '100%',
    },
  },
  fixedBar: {
    zIndex: theme.zIndex.appBar,
    position: 'absolute',
    width: '100%',
    height: '3.5rem',
  },
  topBar: {
    top: 0,
    right: 0,
    bottom: 'auto',
    left: 0,
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid ' + theme.palette.grey[100],
    backgroundColor: '#fff', // theme.palette.primary.main,
  },
  bottomBar: {
    top: 'auto',
    right: 0,
    bottom: 0,
    left: 0,
    borderTop: '1px solid ' + theme.palette.grey[100],
  },
  subtitle: {
    flexGrow: 1,
    textAlign: 'center',
    ...theme.typography.h6,
  },
}));

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

  const [bottomNavgationValue, setBottomNavigationValue] = useState('/');
  const handleChangeBottomNavigationValue = useCallback((e: React.SyntheticEvent, value: string) => {
    history.push(value);
    setBottomNavigationValue(value);
  }, [history]);

  const [variant, setVariant] = useState<'icon_unit' | 'unit_plate'>('unit_plate');
  const handleChangeVariant = useCallback(() => {
    setVariant(prevValue => prevValue === 'icon_unit' ? 'unit_plate' : 'icon_unit');
  }, []);
  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const subtitle = useMemo(() => {
    if (charaDetailMatch) {
      return 'キャラ詳細';
    } else if (questMatch) {
      return '装備一覧';
    } else if (menuMatch) {
      return 'メニュー';
    } else {
      return 'キャラ一覧';
    }
  }, [charaDetailMatch, questMatch, menuMatch]);

  const header = useMemo(() => (
    <Header
      classes={{ bar: clsx(styles.fixedBar, styles.topBar), subtitle: styles.subtitle }}
      variant={variant}
      subtitle={subtitle}
      disabledBack={!!rootMatch || !!questMatch || !!menuMatch}
      disabledVariant={!rootMatch}
      onBack={handleBack}
      onChangeVariant={handleChangeVariant}
    />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [handleBack, rootMatch, questMatch, menuMatch, subtitle]);

  const footer = useMemo(() => (
    <Footer
      className={clsx(styles.fixedBar, styles.bottomBar)}
      value={bottomNavgationValue}
      onChange={handleChangeBottomNavigationValue}
    />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [bottomNavgationValue, handleChangeBottomNavigationValue]);

  return (
    <>
      {header}
      <div id="main" className={styles.main}>
        <div id="chara-list" hidden={!rootMatch}>
          <CharaList variant={variant} />
        </div>
        <div id="chara-detail" hidden={!charaDetailMatch}>
          {charaDetailMatch && <CharaDetail unitID={parseParamsUnitID(charaDetailMatch.params.unit_id)} />}
        </div>
        <div id="quest" hidden={!questMatch}>
          <Quest />
        </div>
        <div id="menu" hidden={!menuMatch}>
          <Menu />
        </div>
      </div>
      {footer}
      {noMatch && <Redirect to="/" />}
    </>
  );
}

export default Main;
