import React, { useRef, useState, useCallback } from 'react';
import { makeStyles, Theme, StyleRules } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';
import ComboSlider, { marks } from './ComboSlider';
import Rarities from './Rarities';
import Infobar from './Infobar';
import { getCharaID, getRankPoint } from '../DBHelper/helper';
import maxUserProfile from '../DBHelper/maxUserProfile';
import { PCRStoreValue } from '../db';
import Big from 'big.js';
import clsx from 'clsx';
import loveLevelPng from '../images/love_level.png';
import uniquePng from '../images/unique.png';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.75,
    LoveLevelWidth = Big(28).times(scalage).div(rem),
    LoveLevelHeight = Big(24).times(scalage).div(rem),
    uniqueSize = LoveLevelHeight,
    padding = Big(4).div(rem),
    height = LoveLevelHeight.plus(padding.times(2));

  const bgStyles = {} as StyleRules<string>;
  const rankColorKeys = Object.keys(theme.rankColor) as any as (keyof typeof theme.rankColor)[];
  for (let key of rankColorKeys) {
    bgStyles['bg' + key] = {
      backgroundColor: theme.rankColor[key],
    };
  }

  return {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: padding + 'rem',
      height: height + 'rem',
      lineHeight: LoveLevelHeight + 'rem',
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
      backgroundImage: `url(${loveLevelPng})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: LoveLevelWidth + 'rem ' + LoveLevelHeight + 'rem',
      backgroundPosition: 'left center',
    },
    unique: {
      fontFamily: 'inherit',
      flexBasis: '3rem',
      paddingLeft: uniqueSize + 'rem',
      backgroundImage: `url(${uniquePng})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: uniqueSize + 'rem ' + uniqueSize + 'rem',
      backgroundPosition: 'left center',
    },
    promotion: {
      margin: '0',
      padding: '0',
      width: '6em',
      height: LoveLevelHeight + 'rem',
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
    promotionPaper: {
      borderRadius: 10,
    },
    disableUnique: {
      filter: 'grayscale(100%)',
    },
    p0: {
      padding: 0,
    },
    ...bgStyles,
  };
});

interface CharaUserProfileProps {
  maxRarity?: number;
  userProfile?: PCRStoreValue<'user_profile'>;
  onChangeRarity?: (rarity: number) => void;
  onChangeLevel?: (level: number) => void;
  onChangeLove?: (loveLevel: number, charaID: number) => void;
  onChangeUnique?: (uniqueEnhanceLevel: number) => void;
  onChangePromotion?: (promotionLevel: number) => void;
}

function CharaUserProfile(props: CharaUserProfileProps) {
  const {
    maxRarity = maxUserProfile.rarity,
    userProfile = maxUserProfile,
    onChangeRarity,
    onChangeLevel,
    onChangeLove,
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

  let chara_id = 0;
  let love_level = 1;
  if (userProfile.unit_id) {
    chara_id = getCharaID(userProfile.unit_id);
    love_level = userProfile.love_level_status[chara_id];
  }

  return (
    <div className={styles.root}>
      <Rarities
        maxRarity={maxRarity}
        rarity={userProfile.rarity}
        onChange={onChangeRarity}
      />

      <ComboSlider
        classes={{ button: styles.level }}
        marks={marks.level}
        min={1}
        max={maxUserProfile.level}
        defaultValue={userProfile.level}
        onDebouncedChange={onChangeLevel}
      >
        <Infobar className={styles.p0} width={100} size="small" label="Lv" value={userProfile.level} />
      </ComboSlider>

      <ComboSlider
        classes={{ button: styles.love }}
        marks={marks.love}
        min={1}
        max={maxRarity === 6 ? 12 : 8}
        defaultValue={userProfile.unit_id ? userProfile.love_level_status[chara_id] : love_level}
        onDebouncedChange={onChangeLove && (value => userProfile.unit_id && onChangeLove(value, chara_id))}
      >
        <span>{love_level}</span>
      </ComboSlider>

      {userProfile.unique_equip_id !== maxUserProfile.unique_equip_id && (
        <ComboSlider
          classes={{ button: clsx(styles.unique, userProfile.unique_enhance_level < 1 && styles.disableUnique) }}
          marks={marks.unique}
          min={0}
          max={maxUserProfile.unique_enhance_level}
          defaultValue={userProfile.unique_enhance_level}
          onDebouncedChange={onChangeUnique}
        >
          <span>{userProfile.unique_enhance_level}</span>
        </ComboSlider>
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
                onClick={onChangePromotion && (() => {
                  if (userProfile.promotion_level !== promotionLevel) onChangePromotion(promotionLevel);
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
