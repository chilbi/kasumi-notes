import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SkeletonImage from './SkeletonImage';
import RankBorder from './RankBorder';
import Rarities from './Rarities';
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
    labelLineHeight = 1.5,
    itemMarginTop = Big(labelLineHeight).plus(0.5),
    pLeft = 0.75,
    lvWidth = pLeft + 4,
    lvScalage = iconSize.div(1.25).div(lvWidth).round(2, 0),
    len = iconSize.times(1.75),
    x = len.times(Math.cos(Math.PI / 4)).round(3, 0),
    y = len.times(Math.sin(Math.PI / 4)).round(3, 0);

  return {
    root: {
      padding: '0.25em 0',
      textAlign: 'center',
    },
    inner: {
      display: 'inline-block',
    },
    rankList: {
      paddingTop: '0.25em',
      textAlign: 'left',
    },
    item: {
      position: 'relative',
      margin: itemMarginTop + 'em 0.25em 0.5em 0.25em',
      borderWidth: 2,
      borderStyle: 'solid',
      borderRadius: '0 0.5em 0.5em 0.5em',
      '&>.equip-label': {
        position: 'absolute',
        bottom: '100%',
        left: -2,
        display: 'inline-block',
        padding: '0 0.5em',
        lineHeight: labelLineHeight,
        borderRadius: '0.5em 0.5em 0 0',
        color: '#fff',
      },
    },
    equipBox: {
      display: 'flex',
      justifyContent: 'flex-start',
      padding: '0.25em',
    },
    iconRoot: {
      margin: '0.25em',
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
      margin: '0 auto 0 0.5em',
    },
    uniqueName: {
      fontSize: '1.2em',
      color: '#d34bef',
    },
    invalidUniqueName: {
      color: theme.palette.grey[600],
    },
    uniqueLevel: {
      color: theme.palette.secondary.light,
    },
    unique: {
      borderColor: '#d34bef',
      '&>.equip-label': {
        backgroundColor: '#d34bef',
      },
    },
    dish: {
      display: 'inline-block',
      position: 'relative',
      margin: len + 'rem',
      width: iconSize + 'rem',
      height: iconSize + 'rem',
    },
    dishItem: {
      position: 'absolute',
      margin: 0,
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
    top: {
      transform: `translate(0, -${len}rem)`,
    },
    bottom: {
      transform: `translate(0, ${len}rem)`,
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
    rank1: {
      borderColor: theme.rankColor[1],
      '&>.equip-label': {
        backgroundColor: theme.rankColor[1],
      },
    },
    rank2: {
      borderColor: theme.rankColor[2],
      '&>.equip-label': {
        backgroundColor: theme.rankColor[2],
      },
    },
    rank4: {
      borderColor: theme.rankColor[4],
      '&>.equip-label': {
        backgroundColor: theme.rankColor[4],
      },
    },
    rank7: {
      borderColor: theme.rankColor[7],
      '&>.equip-label': {
        backgroundColor: theme.rankColor[7],
      },
    },
    rank11: {
      borderColor: theme.rankColor[11],
      '&>.equip-label': {
        backgroundColor: theme.rankColor[11],
      },
    },
    rank18: {
      borderColor: theme.rankColor[18],
      '&>.equip-label': {
        backgroundColor: theme.rankColor[18],
      },
    },
  };
});

interface CharaEquipProps {
  maxRarity?: number;
  promotions?: PromotionData[];
  uniqueEquip?: UniqueEquipData;
  userProfile?: PCRStoreValue<'user_profile'>;
}

function CharaEquip(props: CharaEquipProps) {
  const { maxRarity = 5, promotions = [], uniqueEquip, userProfile = maxUserProfile } = props;
  const { promotion_level, equip_enhance_status, unique_enhance_level } = userProfile;
  const styles = useStyles();

  const equipSlots = promotions.length < 1
    ? Array(6).fill(undefined)
    : promotions.find(item => item.promotion_level === promotion_level)!.equip_slots;

  const getSlotData = (promotionLevel: number, slot: EquipData | undefined, invalidSrc = '') => {
    let srcName: number | string = 999999;
    let maxRarity: number | undefined = undefined;
    let rarity: number | undefined = undefined;
    if (slot) {
      let enhanceLevel = equip_enhance_status[slot.equipment_id];
      enhanceLevel = enhanceLevel === undefined ? -1 : enhanceLevel;
      const isCurrPromotion = promotionLevel === promotion_level;
      const invalid = (isCurrPromotion && enhanceLevel < 0) || (promotionLevel !== promotion_level);
      if (invalid) {
        srcName = invalidSrc + slot.equipment_id;
      } else {
        srcName = slot.equipment_id;
        if (isCurrPromotion) {
          maxRarity = slot.max_enhance_level;
          rarity = enhanceLevel;
        }
      }
    }
    const imgSrc = getPublicImageURL('icon_equipment', srcName)
    return { imgSrc, maxRarity, rarity };
  };

  let uniqueImgName: string | number = 'lock_unique';
  let uniqueName = '未実装';
  let invalidUnique = true;
  if (uniqueEquip) {
    uniqueImgName = uniqueEquip.unique_equipment_data.equipment_id;
    uniqueName = uniqueEquip.unique_equipment_data.equipment_name;
    invalidUnique = false;
    if (unique_enhance_level < 1) {
      uniqueImgName = 'invalid_' + uniqueImgName;
      invalidUnique = true;
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.dish}>
          <SkeletonImage
            key="chara"
            classes={{ root: clsx(styles.iconRoot, styles.dishItem, styles.top) }}
            src={userProfile.unit_id ? getPublicImageURL('icon_unit', getValidID(userProfile.unit_id, userProfile.rarity)) : undefined}
            save
          >
            <RankBorder variant="icon_unit" promotionLevel={promotion_level} />
            <Rarities classes={{ root: styles.iconStars, star: styles.iconStar }} maxRarity={maxRarity} rarity={userProfile.rarity} />
          </SkeletonImage>
          <SkeletonImage
            key="unique" classes={{ root: clsx(styles.iconRoot, styles.dishItem, styles.bottom) }}
            src={getPublicImageURL('icon_equipment', uniqueImgName)}
            save
          >
            {unique_enhance_level > 0 && <span className={styles.dishUniqueLevel}>Lv{unique_enhance_level}</span>}
          </SkeletonImage>
          {equipSlots.map((slot, i) => {
            const { imgSrc, maxRarity, rarity } = getSlotData(promotion_level, slot, 'invalid_');
            return (
              <SkeletonImage key={'equip' + i} classes={{ root: clsx(styles.iconRoot, styles.dishItem, styles[dishMap[i]]) }} src={imgSrc} save>
                {maxRarity && rarity && (
                  <Rarities classes={{ root: styles.stars, star: styles.star }} maxRarity={maxRarity} rarity={rarity} />
                )}
              </SkeletonImage>
            );
          })}
        </div>

        <div className={styles.rankList}>
          <div key="unique" className={clsx(styles.item, styles.unique)}>
            <div className="equip-label">専用装備</div>
            <div className={styles.equipBox}>
              <SkeletonImage classes={{ root: styles.iconRoot }} src={getPublicImageURL('icon_equipment', uniqueImgName)} save />
              <div className={styles.uniqueInfo}>
                <span className={clsx(styles.uniqueName, invalidUnique && styles.invalidUniqueName)}>{uniqueName}</span>
                {!invalidUnique && <span className={styles.uniqueLevel}>Lv{unique_enhance_level}</span>}
              </div>
            </div>
          </div>
          {promotions.map(promotion => (
            <div
              key={promotion.promotion_level}
              className={clsx(
                styles.item,
                styles['rank' + getRankPoint(promotion.promotion_level) as keyof typeof styles],
              )}
            >
              <div className="equip-label">
                {'RANK' + promotion.promotion_level}
              </div>
              <div className={styles.equipBox}>
                {promotion.equip_slots.map((slot, i) => (
                  <SkeletonImage
                    key={i}
                    classes={{ root: styles.iconRoot }}
                    src={getSlotData(promotion.promotion_level, slot).imgSrc}
                    save
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CharaEquip;
