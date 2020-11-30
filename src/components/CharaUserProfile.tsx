import { useRef, useState, useCallback } from 'react';
import { makeStyles, Theme, StyleRules } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';
import ComboSlider, { marks } from './ComboSlider';
import Rarities from './Rarities';
import Infobar from './Infobar';
import { getCharaID, getRankPoint } from '../DBHelper/helper';
import maxUserProfile, { nullID } from '../DBHelper/maxUserProfile';
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
    h = LoveLevelHeight + 'rem',
    r = LoveLevelHeight.div(2) + 'rem';

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
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      lineHeight: h,
      backgroundColor: '#fff',
    },
    level: {
      flexBasis: '4rem',
      alignItems: 'stretch',
      height: h,
      lineHeight: 'inherit',
    },
    love: {
      flexBasis: '2.5rem',
      height: h,
      lineHeight: 'inherit',
      paddingLeft: LoveLevelWidth + 'rem',
      backgroundImage: `url(${loveLevelPng})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: LoveLevelWidth + 'rem ' + LoveLevelHeight + 'rem',
      backgroundPosition: 'left center',
    },
    unique: {
      flexBasis: '3rem',
      height: h,
      lineHeight: 'inherit',
      paddingLeft: uniqueSize + 'rem',
      backgroundImage: `url(${uniquePng})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: uniqueSize + 'rem ' + uniqueSize + 'rem',
      backgroundPosition: 'left center',
    },
    promotion: {
      margin: 0,
      padding: 0,
      width: '3rem',
      height: h,
      lineHeight: 'inherit',
      textAlign: 'center',
      color: '#fff',
    },
    list: {
      margin: 0,
      padding: 0,
      lineHeight: h,
      listStyle: 'none',
      '&>li': {
        display: 'flex',
        margin: '2px 0 0 0',
        padding: 0,
        height: h,
        lineHeight: 'inherit',
      },
      '&>li:first-child': {
        margin: 0,
      },
    },
    radius: {
      borderRadius: r,
    },
    promotionPaper: {
      overflow: 'hidden',
    },
    disableUnique: {
      filter: 'grayscale(100%)',
    },
    infobar: {
      padding: 0,
    },
    ...bgStyles,
  };
});

interface CharaUserProfileProps {
  maxRarity?: number;
  uniqueEquipID?: number;
  userProfile?: PCRStoreValue<'user_profile'>;
  onChangeRarity?: (rarity: number) => void;
  onChangeLevel?: (level: number) => void;
  onChangeLove?: (loveLevel: number, charaID: number) => void;
  onChangeUnique?: (uniqueEnhanceLevel: number) => void;
  onChangePromotion?: (promotionLevel: number) => void;
}

function CharaUserProfile(props: CharaUserProfileProps) {
  const {
    maxRarity = 5,
    uniqueEquipID = nullID,
    userProfile = maxUserProfile,
    onChangeRarity,
    onChangeLevel,
    onChangeLove,
    onChangeUnique,
    onChangePromotion
  } = props;
  const styles = useStyles();

  const heightRef = useRef(0);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleOpen = useCallback((e: React.MouseEvent) => {
    heightRef.current = e.currentTarget.clientHeight + 2;
    setAnchorEl(e.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleChangePromotion = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const value = parseInt(e.currentTarget.getAttribute('data-value')!);
    if (onChangePromotion && userProfile.promotion_level !== value) onChangePromotion(value);
    setAnchorEl(null);
  }, [onChangePromotion, userProfile.promotion_level]);

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
        <Infobar classes={{ root: styles.infobar }} width={100} size="small" label="Lv" value={userProfile.level} />
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

      {uniqueEquipID !== nullID && (
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
        className={clsx(
          styles.promotion,
          styles.radius,
          styles['bg' + getRankPoint(userProfile.promotion_level) as keyof typeof styles]
        )}
        onClick={handleOpen}
      >
        {'R' + userProfile.promotion_level}
      </ButtonBase>
      <Popover
        classes={{ paper: clsx(styles.promotionPaper, styles.radius) }}
        open={!!anchorEl}
        anchorEl={anchorEl}
        marginThreshold={0}
        anchorOrigin={{ horizontal: 0, vertical: 0 }}
        transformOrigin={{ horizontal: 0, vertical: heightRef.current * (maxUserProfile.promotion_level - userProfile.promotion_level) }}
        onClose={handleClose}
      >
        <ul className={styles.list}>
          {Array.from(Array(maxUserProfile.promotion_level)).map((_, i) => {
            const promotionLevel = maxUserProfile.promotion_level - i;
            return (
              <li key={promotionLevel}>
                <ButtonBase
                  className={clsx(styles.promotion, styles['bg' + getRankPoint(promotionLevel) as keyof typeof styles])}
                  data-value={promotionLevel}
                  onClick={handleChangePromotion}
                >
                  {'R' + promotionLevel}
                </ButtonBase>
              </li>
            );
          })}
        </ul>
      </Popover>
    </div>
  );
}

export default CharaUserProfile;
