import React, { useState, useCallback, useRef } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';
import ButtonPopover from './ButtonPopover';
import DebouncedSlider from './DebouncedSlider';
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
      fontFamily: 'inherit',
      flexBasis: '4rem',
    },
    love: {
      fontFamily: 'inherit',
      flexBasis: '2.5rem',
      paddingLeft: LoveLevelWidth + 'rem',
      lineHeight: 1.25,
      backgroundImage: `url(${loveLevel})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: LoveLevelWidth + 'rem ' + LoveLevelHeight + 'rem',
      backgroundPosition: 'left center',
    },
    unique: {
      fontFamily: 'inherit',
      flexBasis: '3rem',
      paddingLeft: uniqueSize + 'rem',
      lineHeight: 1.25,
      backgroundImage: `url(${unique})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: uniqueSize + 'rem ' + uniqueSize + 'rem',
      backgroundPosition: 'left center',
    },
    promotion: {
      margin: '0',
      padding: '0',
      width: '6em',
      textAlign: 'center',
      borderRadius: 10,
      color: '#fff',
    },
    list: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      '&>li': {
        display: 'block',
        borderRadius: 0,
        marginTop: 2,
      },
      '&>li:first-child': {
        marginTop: 0,
      },
    },
    sliderPaper: {
      padding: '0.5em 0',
      height: 200,
      overflow: 'unset',
    },
    promotionPaper: {
      borderRadius: 10,
    },
    disableUnique: {
      filter: 'grayscale(100%)',
    },
    p0: {
      padding: 0,
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
  onChangeLevel?: (e: React.SyntheticEvent, level: number) => void;
  onChangeLove?: (e: React.SyntheticEvent, level: number) => void;
  onChangeRarity?: (e: React.MouseEvent, rarity: number) => void;
  onChangeUnique?: (e: React.SyntheticEvent, uniqueEnhanceLevel: number) => void;
  onChangePromotion?: (e: React.MouseEvent, promotionLevel: number) => void;
}

function CharaUserProfile(props: CharaUserProfileProps) {
  const {
    maxRarity = maxUserProfile.rarity,
    userProfile = maxUserProfile,
    onChangeLevel,
    onChangeLove,
    onChangeRarity,
    onChangeUnique,
    onChangePromotion
  } = props;
  const styles = useStyles();

  const promotionLevelHeightRef = useRef(0);
  const [promotionLevelEl, setPromotionLevelEl] = useState<Element | null>(null);
  const handleOpenPromotionLevel = useCallback((e: React.MouseEvent) => {
    promotionLevelHeightRef.current = e.currentTarget.clientHeight + 2;
    setPromotionLevelEl(e.currentTarget);
  }, []);
  const handleClosePromotionLevel = useCallback(() => {
    setPromotionLevelEl(null);
  }, []);

  return (
    <div className={styles.root}>
      <ButtonPopover
        classes={{ button: styles.level, popover: styles.sliderPaper }}
        content={
          <DebouncedSlider
            min={1}
            max={maxUserProfile.level}
            defaultValue={userProfile.level}
            onDebouncedChange={onChangeLevel}
          />
        }
        children={
          <Infobar className={styles.p0} width={100} size="small" label="Lv" value={userProfile.level} />
        }
      />

      <ButtonPopover
        classes={{ button: styles.love, popover: styles.sliderPaper }}
        content={userProfile.unit_id && (
          <DebouncedSlider
            min={0}
            max={maxRarity === 6 ? 12 : 8}
            defaultValue={userProfile.love_level_status[getCharaID(userProfile.unit_id)]}
            onDebouncedChange={onChangeLove}
          />
        )}
        children={userProfile.unit_id ? userProfile.love_level_status[getCharaID(userProfile.unit_id)] : 0}
      />

      <Rarities
        maxRarity={maxRarity}
        rarity={userProfile.rarity}
        onChange={onChangeRarity}
      />

      {userProfile.unique_equip_id !== maxUserProfile.unique_equip_id && (
        <ButtonPopover
          classes={{
            button: clsx(styles.unique, userProfile.unique_enhance_level < 1 && styles.disableUnique),
            popover: styles.sliderPaper
          }}
          content={
            <DebouncedSlider
              min={0}
              max={maxUserProfile.unique_enhance_level}
              defaultValue={userProfile.unique_enhance_level}
              onDebouncedChange={onChangeUnique}
            />
          }
          children={userProfile.unique_enhance_level}
        />
      )}

      <ButtonBase
        component="div"
        className={clsx(
          styles.promotion,
          styles['bg' + getRankPoint(userProfile.promotion_level) as keyof typeof styles]
        )}
        onClick={handleOpenPromotionLevel}
      >
        {'RANK' + userProfile.promotion_level}
      </ButtonBase>
      <Popover
        classes={{ paper: styles.promotionPaper }}
        open={!!promotionLevelEl}
        anchorEl={promotionLevelEl}
        marginThreshold={0}
        anchorOrigin={{ horizontal: 0, vertical: 0 }}
        transformOrigin={{ horizontal: 0, vertical: promotionLevelHeightRef.current * (maxUserProfile.promotion_level - userProfile.promotion_level) }}
        onClose={handleClosePromotionLevel}
      >
        <ul className={styles.list}>
          {Array.from(Array(maxUserProfile.promotion_level)).map((_, i) => {
            const promotionLevel = maxUserProfile.promotion_level - i;
            return (
              <ButtonBase
                key={promotionLevel}
                component="li"
                className={clsx(
                  styles.promotion,
                  styles['bg' + getRankPoint(promotionLevel) as keyof typeof styles]
                )}
                onClick={onChangePromotion && ((e: React.MouseEvent) => {
                  if (userProfile.promotion_level !== promotionLevel) onChangePromotion(e, promotionLevel);
                  setPromotionLevelEl(null);
                })}
              >
                {'RANK' + promotionLevel}
              </ButtonBase>
            )
          })}
        </ul>
      </Popover>
    </div>
  );
}

export default CharaUserProfile;
