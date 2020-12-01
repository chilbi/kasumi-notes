import { Fragment, useState, useCallback } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import SortRounded from '@material-ui/icons/SortRounded';
import QuestLabel from './QuestLabel';
import Header from './Header';
import QuestMapList from './QuestMapList';
import QuestSearchList from './QuestSearchList';
import { QuestType } from '../DBHelper/helper';
import localValue from '../localValue';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  return {
    subtitle: {
      ...theme.typography.h6,
      flexGrow: 1,
      margin: 0,
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
    sort: {
      transform: 'rotateX(0)',
      transition: 'transform 0.2s',
    },
    sortRotate: {
      transform: 'rotateX(180deg)',
    },
  };
});

function Quest() {
  const styles = useStyles();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const [mode, setMode] = useState(() => localValue.quest.mode.get());
  const [sort, setSort] = useState(() => mode === 'map' ? localValue.questMapList.sort.get() : localValue.questSearchList.sort.get());
  const [type, setType] = useState(() => mode === 'map' ? localValue.questMapList.type.get() : localValue.questSearchList.type.get());

  const handleToggleSort = useCallback(() => {
    setSort(prev => {
      const value = prev === 'asc' ? 'desc' : 'asc';
      if (mode === 'map') localValue.questMapList.sort.set(value);
      else localValue.questSearchList.sort.set(value);
      return value;
    });
  }, [mode]);

  const handleChangeType = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as QuestType;
    if (mode === 'map') localValue.questMapList.type.set(value);
    else localValue.questSearchList.type.set(value);
    setType(value);
  }, [mode]);

  const handleToggleMode = useCallback(() => {
    setMode(prev => {
      let newValue: 'map' | 'search';
      if (prev === 'map') {
        newValue = 'search';
        setSort(localValue.questSearchList.sort.get());
        setType(localValue.questSearchList.type.get());
      } else {
        newValue = 'map';
        setSort(localValue.questMapList.sort.get());
        setType(localValue.questMapList.type.get());
      }
      localValue.quest.mode.set(newValue);
      return newValue;
    });
  }, []);

  const isSearchMode = mode === 'search';

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
            {(['N', 'H', 'VH', 'S'] as const).map(value => {
              const name = 'quest-list-type';
              const id = name + '-' + value;
              return (
                <Fragment key={value}>
                  <QuestLabel type={value} component="label" htmlFor={id} />
                  <Radio id={id} name={name} value={value} checked={type === value} onChange={handleChangeType} />
                </Fragment>
              );
            })}
          </div>
          <Divider />
          <div className={styles.form}>
            <label htmlFor="quest-list-sort">{sort === 'asc' ? '昇順' : '降順'}</label>
            <IconButton
              id="quet-list-sort"
              className={clsx(styles.sort, sort === 'asc' && styles.sortRotate)}
              color="secondary"
              onClick={handleToggleSort}
            >
              <SortRounded />
            </IconButton>
          </div>
        </Popover>
        <h6 className={styles.subtitle}>{`クエスト${isSearchMode ? '検索' : '一覧'}`}</h6>
        <IconButton color={isSearchMode ? 'secondary' : 'default'} onClick={handleToggleMode}>
          <Search />
        </IconButton>
      </Header>
      {isSearchMode ? <QuestSearchList sort={sort} /> : <QuestMapList sort={sort} type={type} />}
    </>
  );
}

export default Quest;
