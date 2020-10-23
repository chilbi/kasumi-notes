import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Infobar from './Infobar';
import Rarities from './Rarities';
import { getCharaID, getRankPoint } from '../DBHelper/helper';
import { PCRStoreValue } from '../db';
import Big from 'big.js';
import clsx from 'clsx';
import loveLevel from '../images/love_level.png';
import unique from '../images/unique.png';

export const defaultUserProfile: PCRStoreValue<'user_profile'> = {
  // unit_id: undefined,
  level: 1,
  rarity: 5,
  promotion_level: 1,
  equip_enhance_status: {},
  unique_equip_id: 999999,
  unique_enhance_level: 0,
} as any;

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.625,
    LoveLevelWidth = Big(28).times(scalage).div(rem),
    LoveLevelHeight = Big(24).times(scalage).div(rem),
    uniqueSize = Big(24).times(scalage).div(rem);

  return {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5em 0',
      backgroundColor: '#fff',
    },
    loveLevel: {
      paddingLeft: LoveLevelWidth + 'rem',
      lineHeight: 1.25,
      backgroundImage: `url(${loveLevel})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: LoveLevelWidth + 'rem ' + LoveLevelHeight + 'rem',
      backgroundPosition: 'left center',
    },
    unique: {
      paddingLeft: uniqueSize + 'rem',
      lineHeight: 1.25,
      backgroundImage: `url(${unique})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: uniqueSize + 'rem ' + uniqueSize + 'rem',
      backgroundPosition: 'left center',
    },
    disableUnique: {
      filter: 'grayscale(100%)',
    },
    promotionLevel: {
      marginRight: '0.25em',
      padding: '0 0.5em',
      borderRadius: '1em',
      color: '#fff',
    },
    bg1: {
      backgroundColor: theme.rankColor[1],
    },
    bg2: {
      backgroundColor: theme.rankColor[2],
    },
    bg4: {
      backgroundColor: theme.rankColor[4],
    },
    bg7: {
      backgroundColor: theme.rankColor[7],
    },
    bg11: {
      backgroundColor: theme.rankColor[11],
    },
    bg18: {
      backgroundColor: theme.rankColor[18],
    },
  };
});

interface CharaUserProfileProps {
  maxRarity?: number;
  userProfile?: PCRStoreValue<'user_profile'>;
  onChangeRarity?: (e: React.MouseEvent, rarity: number) => void;
}

function CharaUserProfile(props: CharaUserProfileProps) {
  const { maxRarity = 5, userProfile = defaultUserProfile, onChangeRarity } = props;
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Infobar
        size="small"
        label="Lv"
        value={userProfile.level}
      />
      <div className={styles.loveLevel}>
        {userProfile.unit_id ? userProfile.love_level_status[getCharaID(userProfile.unit_id)] : 0}
      </div>
      <Rarities maxRarity={maxRarity} rarity={userProfile.rarity} onChange={onChangeRarity} />
      <div className={clsx(styles.unique, userProfile.unique_enhance_level < 1 && styles.disableUnique)}>
        {userProfile.unique_enhance_level}
      </div>
      <div className={clsx(styles.promotionLevel, styles['bg' + getRankPoint(userProfile.promotion_level) as keyof typeof styles])}>
        {'RANK' + userProfile.promotion_level}
      </div>
    </div>
  );
}

export default CharaUserProfile;
