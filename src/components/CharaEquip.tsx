import React, { useState, useCallback, useLayoutEffect } from 'react';
import { makeStyles, Theme, StyleRules } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import ButtonBase from '@material-ui/core/ButtonBase';
import SkeletonImage from './SkeletonImage';
import RankBorder from './RankBorder';
import Rarities from './Rarities';
import EquipDetail from './EquipDetail';
import { EquipData } from '../DBHelper/equip';
import { PromotionData } from '../DBHelper/promotion';
import { UniqueEquipData } from '../DBHelper/unique_equip';
import { getPublicImageURL, getRankPoint, getValidID } from '../DBHelper/helper';
import maxUserProfile from '../DBHelper/maxUserProfile';
import { PCRStoreValue } from '../db';
import Big from 'big.js';
import clsx from 'clsx';

const dishMap = ['topLeft', 'topRight', 'left', 'right', 'bottomLeft', 'bottomRight'] as const;

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    iconSize = Big(128).times(scalage).div(rem),
    starSize = Big(24).times(scalage).div(rem),
    iconRadius = Big(12).times(scalage).div(rem),
    gup = iconSize.minus(starSize.times(5)).div(2),
    iconStarSize = starSize.times(iconSize.div(starSize.times(6)).round(1, 0)),
    iconGup = iconSize.minus(iconStarSize.times(6)).div(2).round(2, 0),
    pLeft = 0.75,
    lvWidth = pLeft + 4,
    lvScalage = iconSize.div(1.25).div(lvWidth).round(2, 0),
    len = iconSize.times(1.75),
    x = len.times(Math.cos(Math.PI / 4)).round(3, 0),
    y = len.times(Math.sin(Math.PI / 4)).round(3, 0);

  const rankStyles = {} as StyleRules<string>;
  const rankColorKeys = Object.keys(theme.rankColor) as any as (keyof typeof theme.rankColor)[];
  for (let key of rankColorKeys) {
    rankStyles['rankColor' + key] = {
      color: theme.rankColor[key],
    };
  }

  return {
    root: {
      padding: '0.25em 0',
      textAlign: 'center',
    },
    inner: {
      display: 'inline-block',
    },
    equipList: {
      paddingTop: '0.25em',
      textAlign: 'left',
    },
    equipItem: {
      margin: '0.5em 0',
    },
    labelBox: {
      display: 'flex',
    },
    label: {
      display: 'inline-block',
      width: '6em',
      lineHeight: '24px',
      textAlign: 'center',
      verticalAlign: 'middle',
      borderRadius: '0.5em 0.5em 0 0',
      backgroundColor: 'currentcolor',
    },
    checkbox: {
      margin: '0 0.25em 0 auto',
      padding: 0,
    },
    equipBox: {
      display: 'flex',
      justifyContent: 'flex-start',
      padding: '0.125rem',
      border: '1px solid currentcolor',
      borderRadius: '0 0.5em 0.5em 0.5em',
    },
    m0125: {
      margin: '0.125rem',
    },
    iconRoot: {
      width: iconSize + 'rem',
      height: iconSize + 'rem',
      borderRadius: iconRadius + 'rem',
    },
    stars: {
      zIndex: 2,
      position: 'absolute',
      bottom: gup + 'rem',
      left: gup + 'rem',
    },
    star: {
      width: starSize + 'rem',
      height: starSize + 'rem',
      backgroundSize: starSize + 'rem ' + starSize + 'rem',
    },
    iconStars: {
      zIndex: 2,
      position: 'absolute',
      bottom: iconGup + 'rem',
      left: iconGup + 'rem',
    },
    iconStar: {
      width: iconStarSize + 'rem',
      height: iconStarSize + 'rem',
      backgroundSize: iconStarSize + 'rem ' + iconStarSize + 'rem',
    },
    uniqueInfo: {
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    uniqueName: {
      fontSize: '1.2em',
      color: theme.palette.primary.dark,
    },
    uniqueLevel: {
      color: theme.palette.secondary.main,
    },
    dish: {
      display: 'inline-block',
      position: 'relative',
      margin: `${y}rem ${len}rem`,
      width: iconSize + 'rem',
      height: iconSize + 'rem',
    },
    dishItem: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '50% 50% 0',
    },
    dishUniqueLevel: {
      zIndex: 2,
      position: 'absolute',
      right: 0,
      bottom: 0,
      display: 'inline-block',
      paddingLeft: pLeft + 'rem',
      width: lvWidth + 'rem',
      textAlign: 'center',
      overflow: 'hidden',
      borderBottomRightRadius: iconRadius.div(lvScalage) + 'rem',
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      transformOrigin: 'right bottom',
      transform: `scale(${lvScalage})`,
      clipPath: `polygon(${pLeft}rem 0, 100% 0, 100% 100%, 0 100%)`,
    },
    center: {
      transform: `translate(0, 0)`,
    },
    top: {
      transform: `translate(0, -${y}rem)`,
    },
    bottom: {
      transform: `translate(0, ${y}rem)`,
    },
    left: {
      transform: `translate(-${len}rem, 0)`,
    },
    right: {
      transform: `translate(${len}rem, 0)`,
    },
    topLeft: {
      transform: `translate(-${x}rem, -${y}rem)`,
    },
    topRight: {
      transform: `translate(${x}rem, -${y}rem)`,
    },
    bottomLeft: {
      transform: `translate(-${x}rem, ${y}rem)`,
    },
    bottomRight: {
      transform: `translate(${x}rem, ${y}rem)`,
    },
    invalidColor: {
      color: theme.palette.grey[600],
    },
    labelColor: {
      color: '#fff',
    },
    uniqueColor: {
      color: '#d34bef',
    },
    hiddenScroll: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 'auto',
      left: 0,
      overflow: 'hidden',
    },
    ...rankStyles,
  };
});

interface CharaEquipProps {
  maxRarity?: number;
  promotions?: PromotionData[];
  uniqueEquip?: UniqueEquipData;
  userProfile?: PCRStoreValue<'user_profile'>;
  onChangeEquip?: (equipEnhanceLevel: number, i: number) => void;
  onChangeUnique?: (uniqueEnhanceLevel: number) => void;
  onChangePromotion?: (promotionLevel: number) => void;
}

interface CharaEquipState {
  equipData?: EquipData;
  uniqueEquipData?: UniqueEquipData;
  enhanceLevel?: number;
  onChangeEnhance?: (enhanceLevel: number) => void;
}

function CharaEquip(props: CharaEquipProps) {
  const { maxRarity = 5, promotions = [], uniqueEquip, userProfile = maxUserProfile, onChangeEquip, onChangeUnique, onChangePromotion } = props;
  const { promotion_level, equip_enhance_status, unique_enhance_level } = userProfile;
  const styles = useStyles();
  
  const [state, setState] = useState<CharaEquipState>();

  const handleClose = useCallback(() => {
    setState(undefined);
  }, []);
  
  useLayoutEffect(() => {
    if (state) document.body.classList.add(styles.hiddenScroll);
    else document.body.classList.remove(styles.hiddenScroll);
    return () => document.body.classList.remove(styles.hiddenScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const equipSlots: (EquipData | undefined)[] = promotions.length < 1
    ? Array(6).fill(undefined)
    : promotions.find(item => item.promotion_level === promotion_level)!.equip_slots;

  const getSlotData = (promotionLevel: number, slot: EquipData | undefined, i: number) => {
    let srcName: number | string = 999999;
    let maxEnhanceLevel = 5;
    let enhanceLevel = 5;
    let invalid = true;
    let isCurr = false;
    if (slot) {
      let enhance_level = equip_enhance_status[i];
      enhance_level = enhance_level === undefined ? -1 : enhance_level;
      isCurr = promotionLevel === promotion_level;
      invalid = (isCurr && enhance_level < 0);
      maxEnhanceLevel = slot.max_enhance_level;
      enhanceLevel = enhance_level;
      srcName = (invalid ? 'invalid_' : '') + slot.equipment_id;
    }
    const imgSrc = getPublicImageURL('icon_equipment', srcName);
    return { imgSrc, invalid, maxEnhanceLevel, enhanceLevel };
  };

  let uniqueImgName: string | number = 'lock_unique';
  let uniqueName = '未実装';
  let invalidUnique = true;
  const hasUnique = !!uniqueEquip;
  if (hasUnique) {
    uniqueImgName = uniqueEquip!.equipment_id;
    uniqueName = uniqueEquip!.unique_equipment_data.equipment_name;
    invalidUnique = false;
    if (unique_enhance_level < 1) {
      uniqueImgName = 'invalid_' + uniqueImgName;
      invalidUnique = true;
    }
  }
  const handleChangeUnique = useCallback(() => {
    setState({ uniqueEquipData: uniqueEquip, enhanceLevel: unique_enhance_level, onChangeEnhance: onChangeUnique })
  }, [onChangeUnique, uniqueEquip, unique_enhance_level]);

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.dish}>
          <SkeletonImage
            key="chara"
            classes={{ root: clsx(styles.iconRoot, styles.dishItem, styles.center) }}
            src={userProfile.unit_id ? getPublicImageURL('icon_unit', getValidID(userProfile.unit_id, userProfile.rarity)) : undefined}
            save
          >
            <RankBorder variant="icon_unit" promotionLevel={promotion_level} />
            <Rarities classes={{ root: styles.iconStars, star: styles.iconStar }} maxRarity={maxRarity} rarity={userProfile.rarity} />
          </SkeletonImage>
          <ButtonBase key="unique1" className={clsx(styles.dishItem, styles.bottom)} disabled={!hasUnique} onClick={handleChangeUnique}>
            <SkeletonImage
              classes={{ root: styles.iconRoot }}
              src={getPublicImageURL('icon_equipment', uniqueImgName)}
              save
            >
              {unique_enhance_level > 0 && <span className={styles.dishUniqueLevel}>Lv{unique_enhance_level}</span>}
            </SkeletonImage>
          </ButtonBase>
          <SkeletonImage
            key="unique2"
            classes={{ root: clsx(styles.iconRoot, styles.dishItem, styles.top) }}
            src={getPublicImageURL('icon_equipment', 'lock_unique')}
            save
          />
          {equipSlots.map((slot, i) => {
            const { imgSrc, invalid, maxEnhanceLevel, enhanceLevel } = getSlotData(promotion_level, slot, i);
            const handleClick = () => {
              setState({
                equipData: slot,
                enhanceLevel: enhanceLevel,
                onChangeEnhance: onChangeEquip && (enhanceLevel => onChangeEquip(enhanceLevel, i)),
              });
            };
            return (
              <ButtonBase key={'equip' + i} className={clsx(styles.dishItem, styles[dishMap[i]])} disabled={!slot} onClick={handleClick}>
                <SkeletonImage classes={{ root: styles.iconRoot }} src={imgSrc} save>
                  {!invalid && (
                    <Rarities classes={{ root: styles.stars, star: styles.star }} maxRarity={maxEnhanceLevel} rarity={enhanceLevel} />
                  )}
                </SkeletonImage>
              </ButtonBase>
            );
          })}
        </div>

        <div className={styles.equipList}>
          <div key="unique" className={clsx(styles.equipItem, styles.uniqueColor)}>
            <div className={styles.labelBox}>
              <div className={styles.label}>
                <span className={styles.labelColor}>専用装備</span>
              </div>
              <Checkbox
                classes={{ root: styles.checkbox }}
                indeterminate={!hasUnique}
                disabled={!hasUnique}
                checked={!invalidUnique}
                onChange={onChangeUnique && (() => onChangeUnique(invalidUnique ? maxUserProfile.unique_enhance_level : 0))}
              />
            </div>
            <div className={styles.equipBox}>
              <ButtonBase className={styles.m0125} disabled={!hasUnique} onClick={handleChangeUnique}>
                <SkeletonImage classes={{ root: styles.iconRoot }} src={getPublicImageURL('icon_equipment', uniqueImgName)} save />
              </ButtonBase>
              <div className={clsx(styles.uniqueInfo, styles.m0125)}>
                <span className={clsx(styles.uniqueName, invalidUnique && styles.invalidColor)}>{uniqueName}</span>
                {!invalidUnique && <span className={styles.uniqueLevel}>Lv{unique_enhance_level}</span>}
              </div>
            </div>
          </div>
          {promotions.map(promotion => {
            const promotionLevel = promotion.promotion_level;
            const isEqual = promotionLevel === promotion_level;
            return (
              <div
                key={promotionLevel}
                className={clsx(styles.equipItem, styles['rankColor' + getRankPoint(promotionLevel) as keyof typeof styles])}
              >
                <div className={styles.labelBox}>
                  <div className={styles.label}>
                    <span className={styles.labelColor}>{'RANK' + promotionLevel}</span>
                  </div>
                  <Radio
                    classes={{ root: styles.checkbox }}
                    checked={isEqual}
                    onChange={onChangePromotion && (() => !isEqual && onChangePromotion(promotionLevel))}
                  />
                </div>
                <div className={styles.equipBox}>
                  {promotion.equip_slots.map((slot, i) => (
                    <ButtonBase key={i} className={styles.m0125} disabled={!slot} onClick={slot ? (() => setState({ equipData: slot })) : undefined}>
                      <SkeletonImage
                        classes={{ root: styles.iconRoot }}
                        src={getSlotData(promotionLevel, slot, i).imgSrc}
                        save
                      />
                    </ButtonBase>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {state && (
        <EquipDetail
          equipData={state.equipData}
          uniqueEquipData={state.uniqueEquipData}
          enhanceLevel={state.enhanceLevel}
          onChangeEnhance={state.onChangeEnhance}
          onBack={handleClose}
        />
      )}
    </div>
  );
}

export default CharaEquip;
