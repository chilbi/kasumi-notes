import React, { useState, useCallback, useRef } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';
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
      padding: 0,
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
      borderRadius: '1em',
      color: '#fff',
    },
    sliderPaper: {
      padding: '0.5em 0',
      height: 200,
      overflow: 'unset',
    },
    list: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      '&>li': {
        display: 'flex',
        borderRadius: 0,
        marginTop: 2,
      },
      '&>li:first-child': {
        marginTop: 0,
      },
    },
    promotionPaper: {
      borderRadius: '1em',
    },
    disableUnique: {
      filter: 'grayscale(100%)',
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

  const [levelEl, setLevelEl] = useState<Element | null>(null);
  const handleOpenLevel = useCallback((e: React.MouseEvent) => {
    setLevelEl(e.currentTarget);
  }, []);
  const handleCloseLevel = useCallback(() => {
    setLevelEl(null);
  }, []);

  const [loveEl, setLoveEl] = useState<Element | null>(null);
  const handleOpenLove = useCallback((e: React.MouseEvent) => {
    setLoveEl(e.currentTarget);
  }, []);
  const handleCloseLove = useCallback(() => {
    setLoveEl(null);
  }, []);

  const [uniqueEl, setUniqueEl] = useState<Element | null>(null);
  const handleOpenUnique = useCallback((e: React.MouseEvent) => {
    setUniqueEl(e.currentTarget);
  }, []);
  const handleCloseUnique = useCallback(() => {
    setUniqueEl(null);
  }, []);

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
      <ButtonBase component="div" className={styles.level} onClick={handleOpenLevel}>
        <Infobar
          className={styles.level}
          width={100}
          size="small"
          label="Lv"
          value={userProfile.level}
        />
      </ButtonBase>
      <Popover
        classes={{ paper: styles.sliderPaper }}
        open={!!levelEl}
        anchorEl={levelEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={handleCloseLevel}
      >
        <DebouncedSlider
          orientation="vertical"
          wait={200}
          min={1}
          max={maxUserProfile.level}
          step={1}
          valueLabelDisplay="on"
          defaultValue={userProfile.level}
          onDebouncedChange={onChangeLevel}
        />
      </Popover>

      <ButtonBase component="div" className={styles.love} onClick={handleOpenLove}>
        {userProfile.unit_id ? userProfile.love_level_status[getCharaID(userProfile.unit_id)] : 0}
      </ButtonBase>
      {userProfile.unit_id && (
        <Popover
          classes={{ paper: styles.sliderPaper }}
          open={!!loveEl}
          anchorEl={loveEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          onClose={handleCloseLove}
        >
          <DebouncedSlider
            orientation="vertical"
            wait={200}
            min={0}
            max={maxRarity === 6 ? 12 : 8}
            step={1}
            valueLabelDisplay="on"
            defaultValue={userProfile.love_level_status[getCharaID(userProfile.unit_id)]}
            onDebouncedChange={onChangeLove}
          />
        </Popover>
      )}

      <Rarities
        maxRarity={maxRarity}
        rarity={userProfile.rarity}
        onChange={onChangeRarity}
      />
  
      {userProfile.unique_equip_id !== maxUserProfile.unique_equip_id && (
        <React.Fragment>
          <ButtonBase
            component="div"
            className={clsx(
              styles.unique,
              userProfile.unique_enhance_level < 1 && styles.disableUnique
            )}
            onClick={handleOpenUnique}
          >
            {userProfile.unique_enhance_level}
          </ButtonBase>
          <Popover
            classes={{ paper: styles.sliderPaper }}
            open={!!uniqueEl}
            anchorEl={uniqueEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            onClose={handleCloseUnique}
          >
            <DebouncedSlider
              orientation="vertical"
              wait={200}
              min={0}
              max={maxUserProfile.unique_enhance_level}
              step={1}
              valueLabelDisplay="on"
              defaultValue={userProfile.unique_enhance_level}
              onDebouncedChange={onChangeUnique}
            />
          </Popover>
        </React.Fragment>
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
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
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
