import React, { useState, useMemo } from 'react';
import { makeStyles, alpha, Theme } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress';
import SkeletonImage from './SkeletonImage';
import QuestLabel from './QuestLabel';
import useDBHelper from '../hooks/useDBHelper';
import { getPublicImageURL, getRange, mergeRanges, mapQuestType, QuestType, Range } from '../DBHelper/helper';
import { QuestData } from '../DBHelper/quest';
import Big from 'big.js';
import clsx from 'clsx';
import manaPng from '../images/mana.png';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    iconSize = Big(128).times(scalage).div(rem),
    manaSize = Big(28).times(scalage).div(rem),
    iconRadius = Big(12).times(scalage).div(rem);

  return {
    item: {
      margin: '0.25em 0 0 0',
      backgroundColor: '#fff',
      '&:first-child': {
        margin: 0,
      },
    },
    titleBox: {
      display: 'flex',
      padding: '0.25em 0',
    },
    label: {
      display: 'inline-block',
      margin: '0 0 0 0.5em',
      padding: '0 0.25em',
      borderRadius: '0.25em',
      color: '#fff',
    },
    name: {
      margin: '0 0 0 0.25em',
    },
    mana: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: '"Arial","Microsoft YaHei",sans-serif',
      flexBasis: manaSize.plus(3.25) + 'rem',
      margin: '0 0.25em 0 auto',
      paddingLeft: manaSize.plus(0.25) + 'rem',
      lineHeight: 1.25,
      backgroundImage: `url(${manaPng})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: manaSize + 'rem ' + manaSize + 'rem',
      backgroundPosition: 'left center',
    },
    dropList: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '0.25em',
    },
    dropItem: {
      display: 'inline-block',
      margin: '0.125em',
    },
    dropIcon: {
      width: iconSize + 'rem',
      height: iconSize + 'rem',
      borderRadius: iconRadius + 'rem',
    },
    odds: {
      display: 'inline-block',
      width:' 100%',
      fontFamily: '"Arial","Microsoft YaHei",sans-serif',
      textAlign: 'center',
    },
    selected: {
      backgroundColor: alpha(theme.palette.secondary.main, 0.35),
    },
  };
});

interface QuestDropListProps {
  classes?: Partial<Record<'root', string>>;
  sort?: 'asc' | 'desc';
  search: Set<number>;
  rangeTypes: QuestType[] | Range;
}

function QuestDropList(props: QuestDropListProps) {
  const { classes = {}, sort, search, rangeTypes } = props;
  const styles = useStyles();

  const [loading, setLoading] = useState(true);

  const questList = useDBHelper(dbHelper => {
    setLoading(true);
    const resolveUndefiend = () => {
      setLoading(false);
      return Promise.resolve(undefined);
    };
    const isMapMode = typeof rangeTypes[0] === 'number';
    if ((search.size < 1 && !isMapMode) || rangeTypes.length < 1)
      return resolveUndefiend();
    if (isMapMode) {
      return dbHelper.getQuestList(rangeTypes as Range).then(result => {
        setLoading(false);
        return result;
      });
    } else {
      const ranges: Range[] = [];
      const values: number[] = [];
      for (let type of rangeTypes as QuestType[]) {
        for (let rewardID of search) {
          const range = getRange(type, rewardID);
          if (range) ranges.push(range);
          values.push(rewardID);
        }
      }
      if (ranges.length < 1)
        return resolveUndefiend();
      return dbHelper.getQuestList(mergeRanges(ranges)).then(data => {
        const result: QuestData[] = [];
        for (let list of data) {
          for (let item of list) {
            if (values.some(value => item.hasReward(value))) {
              result.push(item);
            }
          }
        }
        setLoading(false);
        return result;
      });
    }
  }, [search, rangeTypes]);

  const sortedList = useMemo(() => {
    return questList && questList.sort(sort === 'asc'
      ? (a, b) => a.quest_id - b.quest_id
      : (a, b) => b.quest_id - a.quest_id
    );
  }, [sort, questList]);

  if (loading || !sortedList)
    return <LinearProgress color="secondary" />;

  return (
    <div className={classes.root}>
      {sortedList.map(quest => {
        const { drop_gold, drop_reward } = quest.drop_data;
        if (drop_reward.length < 1) return null;
        const type = mapQuestType(quest.quest_id);
        return (
          <div key={quest.quest_id} className={styles.item}>
            <div className={styles.titleBox}>
              <QuestLabel type={type} />
              <span className={styles.name}>{quest.quest_name}</span>
              {drop_gold > 0 && <span className={styles.mana}>{drop_gold}</span>}
            </div>
            <div className={styles.dropList}>
              {drop_reward.map((drop, i) => (
                <div key={i} className={clsx(styles.dropItem, search.has(drop.reward_id) && styles.selected)}>
                  <SkeletonImage classes={{ root: styles.dropIcon }} src={getPublicImageURL(drop.reward_type === 4 ? 'icon_equipment' : 'icon_item', drop.reward_id)} />
                  <span className={styles.odds}>{drop.odds}%</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuestDropList;
