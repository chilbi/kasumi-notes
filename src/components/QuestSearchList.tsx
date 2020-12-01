import { Fragment, useState, useCallback, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import QuestDropList from './QuestDropList';
import Checkbox from '@material-ui/core/Checkbox';
import SkeletonImage from './SkeletonImage';
import QuestLabel from './QuestLabel';
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
    set: {
      flex: '1 1 auto',
      margin: 0,
      padding: 0,
      borderLeft: '1px solid ' + theme.palette.primary.main,
      color: '#000',
      backgroundColor: '#fff',
      '&:first-child': {
        borderLeft: 'none',
      },
    },
    check: {
      color: '#fff',
      backgroundColor: theme.palette.primary.main,
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
    types: {
      display: 'inline-flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    iconRoot: {
      marginRight: theme.spacing(1),
      width: iconSize + 'rem',
      height: iconSize + 'rem',
      borderRadius: iconRadius + 'rem',
    },
    checkbox: {
      padding: 0,
    },
  };
});

interface QuestSearchListProps {
  sort: 'asc' | 'desc';
}

function QuestSearchList(props: QuestSearchListProps) {
  const { sort } = props;
  const styles = useStyles();

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

  const types = sets[index].types;

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.sets}>
          {sets.map((set, i) => (
            <ButtonBase
              key={i}
              className={clsx(styles.set, index === i && styles.check)}
              data-index={i}
              onClick={handleChangeIndex}
            >
              {set.name}
            </ButtonBase>
          ))}
        </div>
        <div className={styles.seting}>
          <div className={styles.search}>
            {sets[index].search.map((rewardID, i) => (
              <ButtonBase key={i}>
                <SkeletonImage
                  classes={{ root: styles.iconRoot }}
                  src={rewardID === null ? undefined : getPublicImageURL('icon_equipment', rewardID)}
                />
              </ButtonBase>
            ))}
          </div>
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
        </div>
      </div>
      {search.size > 0 && (
        <QuestDropList
          sort={sort}
          search={search}
          rangeTypes={types}
        />
      )}
    </>
  );
}

export default QuestSearchList;
