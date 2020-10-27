import React, { useState, useCallback, useRef } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Infobar from './Infobar';
import Rarities from './Rarities';
import { getCharaID, getRankPoint } from '../DBHelper/helper';
import maxUserProfile from '../DBHelper/maxUserProfile';
import { PCRStoreValue } from '../db';
import Big from 'big.js';
import clsx from 'clsx';
import loveLevel from '../images/love_level.png';
import unique from '../images/unique.png';

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
      padding: '0.25em',
      backgroundColor: '#fff',
    },
    level: {
      padding: 0,
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
    list: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      '&>li': {
        borderRadius: 0,
        marginTop: 2,
      },
      '&>li:first-child': {
        marginTop: 0,
      },
    },
    promotionLevel: {
      margin: '0',
      padding: '0',
      width: '6.5em',
      textAlign: 'center',
      borderRadius: '1em',
      color: '#fff',
    },
    pointer: {
      cursor: 'pointer',
    },
    popover: {
      borderRadius: '1em',
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
  onChangePromotionLevel?: (e: React.MouseEvent, promotionLevel: number) => void;
}

function CharaUserProfile(props: CharaUserProfileProps) {
  const {
    maxRarity = maxUserProfile.rarity,
    userProfile = maxUserProfile,
    onChangeRarity,
    onChangePromotionLevel
  } = props;
  const styles = useStyles();
  const promotionLevelHeightRef = useRef(0);

  const [promotionLevelEl, setPromotionLevelEl] = useState<HTMLDivElement | null>(null);

  const handleOpenPromotionLevel = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    promotionLevelHeightRef.current = e.currentTarget.clientHeight + 2;
    setPromotionLevelEl(e.currentTarget);
  }, []);

  const handleClosePromotionLevel = useCallback(() => {
    setPromotionLevelEl(null);
  }, []);

  return (
    <div className={styles.root}>
      <Infobar
        className={clsx(styles.level, styles.pointer)}
        size="small"
        label="Lv"
        value={userProfile.level}
      />
      <div
        className={clsx(
          styles.loveLevel,
          styles.pointer
        )}
      >
        {userProfile.unit_id ? userProfile.love_level_status[getCharaID(userProfile.unit_id)] : 0}
      </div>
      <Rarities
        maxRarity={maxRarity}
        rarity={userProfile.rarity}
        onChange={onChangeRarity}
      />
      {userProfile.unique_equip_id !== maxUserProfile.unique_equip_id && (
        <React.Fragment>
          <div
            className={clsx(
              styles.unique,
              styles.pointer,
              userProfile.unique_enhance_level < 1 && styles.disableUnique
            )}
          >
            {userProfile.unique_enhance_level}
          </div>
        </React.Fragment>
      )}
      <div
        className={clsx(
          styles.promotionLevel,
          styles.pointer,
          styles['bg' + getRankPoint(userProfile.promotion_level) as keyof typeof styles]
        )}
        onClick={handleOpenPromotionLevel}
      >
        {'RANK' + userProfile.promotion_level}
      </div>
      <Popover
        className={styles.popover}
        open={!!promotionLevelEl}
        anchorEl={promotionLevelEl}
        marginThreshold={0}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        transformOrigin={{ horizontal: 0, vertical: promotionLevelHeightRef.current * (maxUserProfile.promotion_level - userProfile.promotion_level) }}
        onClose={handleClosePromotionLevel}
      >
        <ul className={clsx(styles.list, styles.pointer)}>
          {Array.from(Array(maxUserProfile.promotion_level)).map((_, i) => {
            const promotionLevel = maxUserProfile.promotion_level - i;
            return (
              <li
                key={promotionLevel}
                className={clsx(
                  styles.promotionLevel,
                  styles['bg' + getRankPoint(promotionLevel) as keyof typeof styles]
                )}
                onClick={onChangePromotionLevel && (e => {
                  if (userProfile.promotion_level !== promotionLevel) onChangePromotionLevel(e, promotionLevel);
                  setPromotionLevelEl(null);
                })}
              >
                {'RANK' + promotionLevel}
              </li>
            )
          })}
        </ul>
      </Popover>
    </div>
  );
}

export default CharaUserProfile;
