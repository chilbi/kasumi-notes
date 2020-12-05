import { Fragment, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { makeStyles, alpha, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import QuestDropList from './QuestDropList';
import Checkbox from '@material-ui/core/Checkbox';
import Search from '@material-ui/icons/Search';
import SkeletonImage from './SkeletonImage';
import QuestLabel from './QuestLabel';
import { DBHelperContext } from './Contexts';
import { getPublicImageURL, QuestType } from '../DBHelper/helper';
import localValue from '../localValue';
import Big from 'big.js';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    iconSize = Big(128).times(scalage).div(rem),
    iconRadius = Big(12).times(scalage).div(rem);

  return {
    toolbar: {
      zIndex: theme.zIndex.appBar,
      position: 'sticky',
      top: '3rem',
      right: 0,
      bottom: 'auto',
      left: 0,
      margin: 0,
      padding: theme.spacing(1),
      backgroundColor: '#fff',
      borderBottom: '1px solid ' + theme.palette.grey[100],
    },
    sets: {
      display: 'flex',
      marginBottom: theme.spacing(1),
      borderRadius: '0.25rem',
      border: '1px solid ' + theme.palette.primary.main,
      overflow: 'hidden',
    },
    disabledSets: {
      border: '1px solid ' + theme.palette.action.disabled,
    },
    set: {
      flex: '1 1 auto',
      margin: 0,
      padding: 0,
      borderLeft: '1px solid ' + theme.palette.primary.main,
      color: 'inherit',
      backgroundColor: '#fff',
      '&:first-child': {
        borderLeft: 'none',
      },
    },
    disabledSet: {
      borderLeft: '1px solid ' + theme.palette.action.disabled,
      color: theme.palette.text.disabled,
    },
    checked: {
      color: '#fff',
      backgroundColor: theme.palette.primary.main,
    },
    disabledChecked: {
      backgroundColor: theme.palette.action.disabled,
    },
    seting: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    search: {
      display: 'inline-flex',
      marginRight: theme.spacing(0, 1),
    },
    rightPart: {
      flex: '1 1 auto',
      position: 'relative',
    },
    types: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
    },
    iconButton: {
      margin: theme.spacing(0.5),
      padding: theme.spacing(1),
    },
    iconRoot: {
      width: iconSize + 'rem',
      height: iconSize + 'rem',
      borderRadius: iconRadius + 'rem',
    },
    checkbox: {
      padding: 0,
    },
    material: {
      backgroundColor: '#fff',
    },
    mToolbar: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: 'inline-flex',
      alignItems: 'center',
    },
    mTypes: {
      display: 'inline-flex',
      marginLeft: 'auto',
      borderRadius: '0.25rem',
      border: '1px solid ' + theme.palette.secondary.main,
      overflow: 'hidden',
    },
    mType: {
      margin: 0,
      padding: theme.spacing(0, 1),
      borderLeft: '1px solid ' + theme.palette.secondary.main,
      color: '#000',
      backgroundColor: '#fff',
      '&:first-child': {
        borderLeft: 'none',
      },
    },
    mCheck: {
      color: '#fff',
      backgroundColor: theme.palette.secondary.main,
    },
    items: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    hidden: {
      display: 'none',
    },
    selected: {
      backgroundColor: alpha(theme.palette.warning.main, 0.35),
    },
  };
});

interface QuestSearchListProps {
  sort: 'asc' | 'desc';
}

function QuestSearchList(props: QuestSearchListProps) {
  const { sort } = props;
  const styles = useStyles();
  const dbHelper = useContext(DBHelperContext);

  const [items, setItmes] = useState({ equipMaterial: [] as number[], memoryPiece: [] as number[] });

  useEffect(() => {
    if (dbHelper) Promise.all([dbHelper.getAllEquipMaterial(), dbHelper.getAllMemoryPiece()]).then(([equipMaterial, memoryPiece]) => {
      setItmes({
        equipMaterial: equipMaterial.sort((a, b) => b - a),
        memoryPiece: memoryPiece.sort((a, b) => b - a),
      });
    });
  }, [dbHelper]);

  const [index, setIndex] = useState(() => localValue.questSearchList.index.get());
  const handleChangeIndex = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const i = parseInt(e.currentTarget.getAttribute('data-index')!);
    localValue.questSearchList.index.set(i);
    setIndex(i);
  }, []);

  const [sets, setSets] = useState(() => localValue.questSearchList.sets.get());

  const handleChangeTypes = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const type = (e.target.value) as QuestType;
    setSets(prev => {
      const newValue = [...prev];
      const types = prev[index].types;
      let newTypes: QuestType[];
      if (types.indexOf(type) > -1) {
        newTypes = types.filter(value => value !== type);
      } else {
        newTypes = [...types, type];
      }
      newValue[index].types = newTypes;
      localValue.questSearchList.sets.set(newValue);
      return newValue;
    });
  }, [index]);

  const search = useMemo(() => {
    return new Set(sets[index].search.filter(item => item !== null) as number[]);
  }, [index, sets]);

  const [open, setOpen] = useState(() => search.size < 1);

  const [listIndex, setListIndex] = useState('0');
  const handleChangeListIndex = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setListIndex(e.currentTarget.getAttribute('data-i')!);
  }, []);

  const [searchIndex, setSearchIndex] = useState<number | null>(null);

  const [select, setSelect] = useState<number | null>(null);

  const handleSearch = useCallback(() => {
    setSearchIndex(null);
    setSelect(null);
    setOpen(false);
  }, []);

  const handleClickSearch = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const currSearchIndex = parseInt(e.currentTarget.getAttribute('data-i')!);
    setSearchIndex(prevSearchIndex => {
      if (select !== null) {
        setSets(prev => {
          const newValue = [...prev];
          const newSearch = [...prev[index].search];
          newSearch[currSearchIndex] = select;
          newValue[index].search = newSearch;
          localValue.questSearchList.sets.set(newValue);
          return newValue;
        });
        setSelect(null);
        return null;
      } else {
        if (prevSearchIndex !== null) {
          if (prevSearchIndex === currSearchIndex) {
            setSets(prev => {
              const newValue = [...prev];
              const newSearch = [...prev[index].search];
              newSearch[currSearchIndex] = null;
              newValue[index].search = newSearch;
              localValue.questSearchList.sets.set(newValue);
              return newValue;
            });
          } else {
            setSets(prev => {
              const newValue = [...prev];
              const newSearch = [...prev[index].search];
              const currIndexValue = newSearch[currSearchIndex];
              const prevIndexValue = newSearch[prevSearchIndex];
              newSearch[currSearchIndex] = prevIndexValue;
              newSearch[prevSearchIndex] = currIndexValue;
              newValue[index].search = newSearch;
              localValue.questSearchList.sets.set(newValue);
              return newValue;
            });
          }
          return null;
        } else {
          return currSearchIndex;
        }
      }
    });
    setOpen(true);
  }, [index, select]);

  const handleClickItem = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const currSelect = parseInt(e.currentTarget.getAttribute('data-item')!);
    setSelect(prevSelect => {
      if (searchIndex !== null) {
        setSets(prev => {
          const newValue = [...prev];
          const newSearch = [...prev[index].search];
          newSearch[searchIndex] = currSelect;
          newValue[index].search = newSearch;
          localValue.questSearchList.sets.set(newValue);
          return newValue;
        });
        setSearchIndex(null);
        return null;
      } else {
        if (prevSelect === currSelect) {
          return null;
        } else {
          return currSelect;
        }
      }
    });
  }, [index, searchIndex]);

  const types = sets[index].types;

  const renderList = (list: number[], type: 'icon_equipment' | 'icon_item') => list.map(item => {
    return (
      <ButtonBase key={item} className={clsx(styles.iconButton, select === item && styles.selected)} data-item={item} onClick={handleClickItem}>
        <SkeletonImage classes={{ root: styles.iconRoot }} src={getPublicImageURL(type, item)} save />
      </ButtonBase>
    );
  });

  return (
    <>
      <div className={styles.toolbar}>
        <div className={clsx(styles.sets, open && styles.disabledSets)}>
          {sets.map((set, i) => (
            <ButtonBase
              key={i}
              className={clsx(styles.set, { [styles.disabledSet]: open, [styles.checked]: index === i, [styles.disabledChecked]: index === i && open })}
              data-index={i}
              disabled={open}
              onClick={handleChangeIndex}
            >
              {set.name}
            </ButtonBase>
          ))}
        </div>
        <div className={styles.seting}>
          <div className={styles.search}>
            {sets[index].search.map((materialID, i) => (
              <ButtonBase key={i} className={clsx(styles.iconButton, searchIndex === i && styles.selected)} data-i={i} onClick={handleClickSearch}>
                <SkeletonImage
                  classes={{ root: styles.iconRoot }}
                  src={materialID === null ? undefined : getPublicImageURL(materialID > 33000 ? 'icon_equipment' : 'icon_item', materialID)}
                />
              </ButtonBase>
            ))}
          </div>
          <div className={styles.rightPart}>
            <Fade in={open}>
              <div className={styles.mToolbar}>
                <IconButton color="primary" onClick={handleSearch}>
                  <Search />
                </IconButton>
                <div className={styles.mTypes}>
                  <ButtonBase className={clsx(styles.mType, listIndex === '0' && styles.mCheck)} data-i="0" onClick={handleChangeListIndex}>
                    装備品
                  </ButtonBase>
                  <ButtonBase className={clsx(styles.mType, listIndex === '1' && styles.mCheck)} data-i="1" onClick={handleChangeListIndex}>
                    メモリーピース
                  </ButtonBase>
                </div>
              </div>
            </Fade>
            <Fade in={!open}>
              <div className={styles.types}>
                {(['N', 'H', 'VH', 'S'] as const).map(value => {
                  const id = 'quest-search-types-' + value;
                  return (
                    <Fragment key={value}>
                      <QuestLabel type={value} component="label" htmlFor={id} />
                      <Checkbox id={id} value={value} className={styles.checkbox} checked={types.indexOf(value) > -1} onChange={handleChangeTypes} />
                    </Fragment>
                  );
                })}
              </div>
            </Fade>
          </div>
        </div>
      </div>
      <Fade in={open}>
        <div className={clsx(styles.material, !open && styles.hidden)}>
          <Slide in={listIndex === '0'} direction="right">
            <div className={clsx(styles.items, listIndex !== '0' && styles.hidden)}>{renderList(items.equipMaterial, 'icon_equipment')}</div>
          </Slide>
          <Slide in={listIndex === '1'} direction="left">
            <div className={clsx(styles.items, listIndex !== '1' && styles.hidden)}>{renderList(items.memoryPiece, 'icon_item')}</div>
          </Slide>
        </div>
      </Fade>
      <Fade in={!open} mountOnEnter unmountOnExit>
        <div>
          {search.size > 0 && (
            <QuestDropList
              sort={sort}
              search={search}
              rangeTypes={types}
            />
          )}
        </div>
      </Fade>
    </>
  );
}

export default QuestSearchList;
