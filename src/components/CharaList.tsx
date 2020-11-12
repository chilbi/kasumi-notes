import React, { useState, useCallback, useContext, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import CircularProgress from '@material-ui/core/CircularProgress';
import SortRounded from '@material-ui/icons/SortRounded';
import FilterList from '@material-ui/icons/FilterList';
import ViewModule from '@material-ui/icons/ViewModule';
import ViewStream from '@material-ui/icons/ViewStream';
import Header from './Header';
import CharaListItem from './CharaListItem';
import { DBHelperContext, CharaListContext } from './Contexts';
import { CharaBaseData } from '../DBHelper';
import localValue from '../localValue';
import clsx from 'clsx';

function filterCharaList(charaList: CharaBaseData[], order: string, sort: string, atkTypeArr: number[], positionArr: number[]): CharaBaseData[] {
  const list: CharaBaseData[] = [];
  if (atkTypeArr.length < 1 || positionArr.length < 1)
    return list;
  for (let item of charaList) {
    if (atkTypeArr.indexOf(item.charaData.atk_type) > -1 && positionArr.indexOf(item.getPosition()) > -1) {
      list.push(item);
    }
  }
  if (typeof (list[0] as any).charaData[order] !== 'number')
    return list;
  return list.sort(sort === 'asc'
    ? ((a: any, b: any) => a.charaData[order] - b.charaData[order])
    : ((a: any, b: any) => b.charaData[order] - a.charaData[order])
  );
}

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
      margin: 0,
      textAlign: 'center',
      ...theme.typography.h6,
    },
    popover: {
      padding: '0.5em 0.75em',
    },
    form: {
      display: 'flex',
      alignItems: 'center',
    },
    label: {
    },
    sort: {
      transform: 'rotateX(0)',
      transition: 'transform 0.2s',
    },
    sortRotate: {
      transform: 'rotateX(180deg)',
    },
    loading: {
      zIndex: theme.zIndex.tooltip,
      position: 'fixed',
      top: '50%',
      left: '50%',
      display: 'inline-block',
      transform: 'translate(-50%, -50%)',
    },
  };
});

function CharaList() {
  const styles = useStyles();

  const dbHelper = useContext(DBHelperContext);
  const [charaList] = useContext(CharaListContext);

  const [variant, setVariant] = useState(() => localValue.charaList.variant.get());
  const handleChangeVariant = useCallback(() => {
    setVariant(prevValue => {
      const value = prevValue === 'icon_unit' ? 'unit_plate' : 'icon_unit';
      localValue.charaList.variant.set(value);
      return value;
    });
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const [sort, setSort] = useState(() => localValue.charaList.sort.get());
  const handleToggleSort = useCallback(() => {
    setSort(prev => {
      const value = prev === 'asc' ? 'desc' : 'asc';
      localValue.charaList.sort.set(value);
      return value;
    });
  }, []);

  const [order, setOrder] = useState(() => localValue.charaList.order.get());
  const handleChangeOrder = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    localValue.charaList.order.set(value);
    setOrder(value);
  }, []);

  const [atkTypeArr, setAtkTypeArr] = useState(() => localValue.charaList.atkTypeArr.get());
  const [handleToggleAtkType1, handleToggleAtkType2] = [1, 2].map(atkType => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(() => {
      setAtkTypeArr(prev => {
        let value: number[];
        if (prev.indexOf(atkType) > -1) {
          value = prev.filter(value => value !== atkType);
        } else {
          value = [...prev, atkType];
        }
        localValue.charaList.atkTypeArr.set(value);
        return value;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  });

  const [positionArr, setPositionArr] = useState(() => localValue.charaList.positionArr.get());
  const [handleTogglePosition1, handleTogglePosition2, handleTogglePosition3] = [1, 2, 3].map(position => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(() => {
      setPositionArr(prev => {
        let value: number[];
        if (prev.indexOf(position) > -1) {
          value = prev.filter(value => value !== position);
        } else {
          value = [...prev, position];
        }
        localValue.charaList.positionArr.set(value);
        return value;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  });

  const nullableCharaList: (CharaBaseData | undefined)[] = useMemo(() => {
    return (charaList && filterCharaList(charaList, order, sort, atkTypeArr, positionArr)) || Array.from(Array(130));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charaList, sort, order, atkTypeArr.length, positionArr.length]);

  return (
    <>
      <Header>
        <IconButton color="primary" onClick={handleOpen}>
          <FilterList />
        </IconButton>
        <Popover
          classes={{ paper: styles.popover }}
          keepMounted
          anchorEl={anchorEl}
          open={!!anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handleClose}
        >
          <div className={styles.form}>
            <label htmlFor="filter-atk_type_1">物理</label>
            <Checkbox
              id="filter-atk_type_1"
              checked={atkTypeArr.indexOf(1) > -1}
              onChange={handleToggleAtkType1}
            />
            <label htmlFor="filter-atk_type_2">魔法</label>
            <Checkbox
              id="filter-atk_type_2"
              checked={atkTypeArr.indexOf(2) > -1}
              onChange={handleToggleAtkType2}
            />
          </div>
          <div className={styles.form}>
            <label htmlFor="filter-position_1">前衛</label>
            <Checkbox
              id="filter-position_1"
              checked={positionArr.indexOf(1) > -1}
              onChange={handleTogglePosition1}
            />
            <label htmlFor="filter-position_2">中衛</label>
            <Checkbox
              id="filter-position_2"
              checked={positionArr.indexOf(2) > -1}
              onChange={handleTogglePosition2}
            />
            <label htmlFor="filter-position_3">後衛</label>
            <Checkbox
              id="filter-position_3"
              checked={positionArr.indexOf(3) > -1}
              onChange={handleTogglePosition3}
            />
          </div>
          <div className={styles.form}>
            <label htmlFor="order-unit_id">ID</label>
            <Radio
              id="order-unit_id"
              name="chara-list-order"
              value="unit_id"
              checked={order === 'unit_id'}
              onChange={handleChangeOrder}
            />
            <label htmlFor="order-search_area_width">攻撃距離</label>
            <Radio
              id="order-search_area_width"
              name="chara-list-order"
              value="search_area_width"
              checked={order === 'search_area_width'}
              onChange={handleChangeOrder}
            />
            <label htmlFor="sort-chara-list">{sort==='asc' ? '昇順' : '降順'}</label>
            <IconButton
              id="sort-chara-list"
              className={clsx(styles.sort, sort === 'asc' && styles.sortRotate)}
              color="secondary"
              onClick={handleToggleSort}
            >
              <SortRounded />
            </IconButton>
          </div>
        </Popover>
        <h6 className={styles.subtitle}>キャラ一覧</h6>
        <IconButton color="primary" onClick={handleChangeVariant}>
          {variant === 'icon_unit' ? <ViewModule /> : <ViewStream />}
        </IconButton>
      </Header>
      <div className={clsx(styles.list, styles.spaceEvenly)}>
        {nullableCharaList.map((base, i) => (
          <CharaListItem
            key={base ? base.charaData.unit_id : i}
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
      {dbHelper && !charaList && (
        <div className={styles.loading}>
          <CircularProgress color="secondary" />
        </div>
      )}
    </>
  );
}

export default CharaList;
