import React, { useCallback, useState, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ViewModule from '@material-ui/icons/ViewModule';
import ViewStream from '@material-ui/icons/ViewStream';
import Header from './Header';
import CharaListItem from './CharaListItem';
import useDBHelper from '../hooks/useDBHelper';
import { CharaBaseData } from '../DBHelper';
import clsx from 'clsx';

const VARIANT_KEY = 'VARIANT_KEY';

const useStyles = makeStyles((theme: Theme) => {
  return {
    list: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    spaceEvenly: {
      justifyContent: 'space-evenly',
    },
    subtitle: {
      flexGrow: 1,
      paddingLeft: '3rem',
      textAlign: 'center',
      ...theme.typography.h6,
    },
  };
});

function CharaList() {
  const styles = useStyles();

  const [variant, setVariant] = useState(() => {
    let _variant = window.localStorage.getItem(VARIANT_KEY) as 'icon_unit' | 'unit_plate' | null;
    if (_variant !== null) return _variant;
    _variant = 'unit_plate';
    window.localStorage.setItem(VARIANT_KEY, _variant);
    return _variant;
  });
  const handleChangeVariant = useCallback(() => {
    setVariant(prevValue => {
      if (prevValue === 'icon_unit') {
        window.localStorage.setItem(VARIANT_KEY, 'unit_plate');
        return 'unit_plate';
      } else {
        window.localStorage.setItem(VARIANT_KEY, 'icon_unit');
        return 'icon_unit';
      }
    });
  }, []);

  const header = useMemo(() => (
    <Header>
      <h6 className={styles.subtitle}>キャラ一覧</h6>
      <IconButton color="primary" onClick={handleChangeVariant}>
        {variant === 'icon_unit' ? <ViewModule /> : <ViewStream />}
      </IconButton>
    </Header>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [variant]);

  const allBaseData = useDBHelper(dbHelper => dbHelper.getAllCharaBaseData(), []);
  const nullableAllBaseData: (CharaBaseData | undefined)[] = allBaseData || Array.from(Array(130));

  return (
    <>
      {header}
      <div className={clsx(styles.list, styles.spaceEvenly)}>
        {nullableAllBaseData.map((base, i) => (
          <CharaListItem
            key={i}
            variant={variant}
            unitID={base && base.charaData.unit_id}
            rarity={base ? base.userProfile.rarity : 6}
            maxRarity={base ? base.charaData.max_rarity : 6}
            promotionLevel={base ? base.userProfile.promotion_level : 18}
            position={base ? base.getPosition() : 1}
            hasUnique={base ? base.userProfile.unique_enhance_level > 0 : true}
          />
        ))}
      </div>
    </>
  );
}

export default CharaList;
