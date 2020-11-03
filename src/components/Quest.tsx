import React from 'react';
import { makeStyles, Theme, StyleRules } from '@material-ui/core/styles'
import SkeletonImage from './SkeletonImage';
import useDBHelper from '../hooks/useDBHelper';
import { getPublicImageURL, mapQuestType } from '../DBHelper/helper';
import clsx from 'clsx';
import Big from 'big.js';
import manaPng from '../images/mana.png';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    iconSize = Big(128).times(scalage).div(rem),
    manaSize = Big(28).times(scalage).div(rem);
  
  const colors = [
    ['normal', '#0e87c7'],
    ['hard', '#c70e4e'],
    ['veryhard', '#8d0ec7'],
    ['survey', '#0ebac7']
  ];

  const bgStyles: StyleRules = {};
  for (let color of colors) {
    bgStyles[color[0]] = {
      backgroundColor: color[1],
    };
  }

  return {
    root: {
      padding: '0.5em',
    },
    item: {
      margin: '0.5em 0 0 0',
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
      margin: '0 0 0 0.25em',
      padding: '0 0.25em',
      borderRadius: '0.25em',
      color: '#fff',
      backgroundColor: theme.palette.primary.dark,
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
      padding: '0.125em',
    },
    dropItem: {
      display: 'inline-block',
      margin: '0.125em',
    },
    dropIcon: {
      width: iconSize + 'rem',
      height: iconSize + 'rem',
    },
    odds: {
      display: 'inline-block',
      width:' 100%',
      fontFamily: '"Arial","Microsoft YaHei",sans-serif',
      textAlign: 'center',
    },
    ...bgStyles,
  };
});

interface QuestProps {}

function Quest(props: QuestProps) {
  const styles = useStyles();
  const questList = useDBHelper(dbHelper => dbHelper.getQuestList('veryhard'), []);
  if (!questList) return null;
  // console.log(questList);
  return (
    <div className={styles.root}>
      {questList.map((quest, i) => {
        const { drop_gold, drop_reward } = quest.drop_data;
        if (drop_reward.length < 1) return null;
        const label = mapQuestType(quest.quest_id);
        return (
          <div key={i} className={styles.item}>
            <div className={styles.titleBox}>
              <span className={clsx(styles.label, styles[label as keyof typeof styles])}>{label}</span>
              <span className={styles.name}>{quest.quest_name}</span>
              {drop_gold > 0 && <span className={styles.mana}>{drop_gold}</span>}
            </div>
            <div className={styles.dropList}>
              {drop_reward.map(drop => (
                <div key={drop.reward_id} className={styles.dropItem}>
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

export default Quest;
