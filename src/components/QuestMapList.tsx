import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Pagination from '@material-ui/core/Pagination';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Radio from '@material-ui/core/Radio';
import FilterList from '@material-ui/icons/FilterList';
import ViewModule from '@material-ui/icons/ViewModule';
import ViewStream from '@material-ui/icons/ViewStream';
import SortRounded from '@material-ui/icons/SortRounded';
import QuestDropList from './QuestDropList';
import QuestLabel from './QuestLabel';
import Header from './Header';
import { mapQuestType, QuestType, Range } from '../DBHelper/helper';
import localValue from '../localValue';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  return {
    subtitle: {
      flexGrow: 1,
      margin: 0,
      textAlign: 'center',
      ...theme.typography.h6,
    },
    nav: {
      zIndex: theme.zIndex.appBar,
      position: 'sticky',
      top: 48,
      right: 0,
      bottom: 'auto',
      left: 0,
      margin: 0,
      padding: '0.25em',
      backgroundColor: '#fff',
      borderBottom: '1px solid ' + theme.palette.grey[100],
    },
    ul: {
      justifyContent: 'center',
    },
    popover: {
      padding: '0.5em 0.75em',
    },
    form: {
      display: 'flex',
      alignItems: 'center',
    },
    sort: {
      transform: 'rotateX(0)',
      transition: 'transform 0.2s',
    },
    sortRotate: {
      transform: 'rotateX(180deg)',
    },
  };
});

function QuestMapList() {
  const styles = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const [search] = useState<Set<number>>(new Set());

  const [sort, setSort] = useState(() => localValue.questMapList.sort.get());
  const handleToggleSort = useCallback(() => {
    setSort(prev => {
      const value = prev === 'asc' ? 'desc' : 'asc';
      localValue.questMapList.sort.set(value);
      return value;
    });
  }, []);
  
  const [type, setType] = useState(() => localValue.questMapList.type.get());
  const handleChangeType = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as QuestType;
    localValue.questMapList.type.set(value);
    setType(value);
  }, []);

  const [area, setArea] = useState(() => localValue.questMapList.area.get());
  const handleChangeArea = useCallback((e: React.ChangeEvent<unknown>, page: number) => {
    const value = page;
    localValue.questMapList.area.set(value);
    setArea(value);
  }, []);

  const range: Range = useMemo(() => {
    if (type === 'VH' || type === 'S')
      return mapQuestType(type);
    const getAreaStr = (_area: number) => (_area < 10 ? '0' : '') + _area;
    const typeStr = type === 'N' ? '110' : type === 'H' ? '120' : '130';
    return [parseInt(typeStr + getAreaStr(area) + '001'), parseInt(typeStr + getAreaStr(area + 1) + '000')];
  }, [type, area]);

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
            <label htmlFor="sort-chara-list">{sort === 'asc' ? '昇順' : '降順'}</label>
            <IconButton
              id="sort-chara-list"
              className={clsx(styles.sort, sort === 'asc' && styles.sortRotate)}
              color="secondary"
              onClick={handleToggleSort}
            >
              <SortRounded />
            </IconButton>
          </div>
          <div className={styles.form}>
            {(['N', 'H', 'VH', 'S'] as const).map(value => (
              <Fragment key={value}>
                <QuestLabel type={value} component="label" htmlFor={'quest-map-list-type-' + value} />
                <Radio
                  id={'quest-map-list-type-' + value}
                  name="quest-map-list-type"
                  value={value}
                  checked={type === value}
                  onChange={handleChangeType}
                />
              </Fragment>
            ))}
          </div>
        </Popover>
        <h6 className={styles.subtitle}>クエスト一覧</h6>
        <IconButton color="primary">
          {false ? <ViewModule /> : <ViewStream />}
        </IconButton>
      </Header>
      {(type === 'N' || type === 'H') && (
        <Pagination
          classes={{ root: styles.nav, ul: styles.ul }}
          size="small"
          shape="rounded"
          color="secondary"
          siblingCount={3}
          boundaryCount={1}
          hidePrevButton
          hideNextButton
          count={39}
          page={area}
          onChange={handleChangeArea}
        />
      )}
      <QuestDropList sort={sort} search={search} rangeTypes={range} />
    </>
  );
}

export default QuestMapList;
