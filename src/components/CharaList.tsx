import React, { Fragment, useState, useCallback, useContext, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import SortRounded from '@material-ui/icons/SortRounded';
import FilterList from '@material-ui/icons/FilterList';
import ViewModule from '@material-ui/icons/ViewModule';
import ViewStream from '@material-ui/icons/ViewStream';
import Header from './Header';
import CharaListItem from './CharaListItem';
import { DBHelperContext, CharaListContext } from './Contexts';
import { getPositionText } from '../DBHelper/helper';
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
      ...theme.typography.h6,
      flexGrow: 1,
      margin: 0,
      paddingRight: '1.5rem',
      fontWeight: 700,
      textAlign: 'center',
    },
    popover: {
      padding: theme.spacing(2, 3),
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
  const handleChangeAtkType = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const atkType = parseInt(e.target.value);
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
  }, []);

  const [positionArr, setPositionArr] = useState(() => localValue.charaList.positionArr.get());
  const handleChangePosition = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const position = parseInt(e.target.value);
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
  }, []);

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
          marginThreshold={0}
          anchorEl={anchorEl}
          open={!!anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          onClose={handleClose}
        >
          <div className={styles.form}>
            {[[1, 2, 3].map(value => {
              const label = getPositionText(value);
              const id = 'chara-list-filter-position_' + value;
              return (
                <Fragment key={value}>
                  <label htmlFor={id}>{label}</label>
                  <Checkbox id={id} value={value} checked={positionArr.indexOf(value) > -1} onChange={handleChangePosition} />
                </Fragment>
              )
            })]}
          </div>
          <Divider />
          <div className={styles.form}>
            {([[1, '物理'], [2, '魔法']] as [number, string][]).map(item => {
              const [value, label] = item
              const id = 'chara-list-filter-atk_type_' + value;
              return (
                <Fragment key={value}>
                  <label htmlFor={id}>{label}</label>
                  <Checkbox id={id} value={value} checked={atkTypeArr.indexOf(value) > -1} onChange={handleChangeAtkType} />
                </Fragment>
              );
            })}
          </div>
          <Divider />
          <div className={styles.form}>
            {[['unit_id', 'ID'], ['search_area_width', '攻撃距離']].map(item => {
              const [value, label] = item;
              const name = 'chara-list-order';
              const id = name + '-' + value;
              return (
                <Fragment key={value}>
                  <label htmlFor={id}>{label}</label>
                  <Radio id={id} name={name} value={value} checked={order === value} onChange={handleChangeOrder} />
                </Fragment>
              )
            })}
          </div>
          <Divider />
          <div className={styles.form}>
            <label htmlFor="chara-list-sort">{sort==='asc' ? '昇順' : '降順'}</label>
            <IconButton
              id="chara-list-sort"
              className={clsx(styles.sort, sort === 'asc' && styles.sortRotate)}
              color="secondary"
              onClick={handleToggleSort}
            >
              <SortRounded />
            </IconButton>
            <label htmlFor="chara-list-variant">{variant === 'icon_unit' ? '小' : '大'}</label>
            <IconButton
              id="chara-list-variant"
              color="secondary"
              onClick={handleChangeVariant}
            >
              {variant === 'icon_unit' ? <ViewModule /> : <ViewStream />}
            </IconButton>
          </div>
        </Popover>
        <h6 className={styles.subtitle}>キャラ一覧</h6>
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
