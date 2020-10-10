import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SkeletonImage from './SkeletonImage';
import Rarities from './Rarities';
import { EquipData } from '../DBHelper/equip';
import { PromotionData } from '../DBHelper/promotion';
import { UniqueEquipData } from '../DBHelper/unique_equip';
import { getPublicImageURL, getRankPoint } from '../DBHelper/helper';
import { PCRStoreValue } from '../db';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  const
    labelLineHeight = 1.5,
    itemMarginTop = labelLineHeight + 0.5,
    rem = 16,
    scalage = 0.375,
    iconSize = 128 * scalage / rem,
    starSize = 24 * scalage / rem,
    iconRadius = 12 * scalage / rem,
    iconGup = (iconSize - starSize * 5) / 2;

  return {
    root: {
      // display: 'flex',
      // flexDirection: 'column-reverse',
      padding: '0.25em 0',
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
      margin: '0 0.25em',
      width: iconSize + 'rem',
      height: iconSize + 'rem',
      borderRadius: iconRadius + 'rem',
    },
    stars: {
      zIndex: 2,
      position: 'absolute',
      bottom: iconGup + 'rem',
      left: iconGup + 'rem',
    },
    star: {
      width: starSize + 'rem',
      height: starSize + 'rem',
      backgroundSize: starSize + 'rem ' + starSize + 'rem',
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
  promotions?: PromotionData[];
  uniqueEquip?: UniqueEquipData;
  userProfile?: PCRStoreValue<'user_profile'>;
}

function CharaEquip(props: CharaEquipProps) {
  const { promotions = [], uniqueEquip, userProfile = {} as Partial<PCRStoreValue<'user_profile'>> } = props;
  const { promotion_level = 18, equip_enhance_status = {}, unique_enhance_level = 0 } = userProfile;
  const styles = useStyles();

  const getSlotData = (promotionLevel: number, slot: EquipData | undefined) => {
    let srcName: number | string = 999999;
    let maxRarity: number | undefined = undefined;
    let rarity: number | undefined = undefined;
    if (slot) {
      let enhanceLevel = equip_enhance_status[slot.equipment_id];
      enhanceLevel = enhanceLevel === undefined ? -1 : enhanceLevel;
      const isCurrPromotion = promotionLevel === promotion_level;
      const invalid = (isCurrPromotion && enhanceLevel < 0) || (promotionLevel > promotion_level);
      if (invalid) {
        srcName = 'invalid_' + slot.equipment_id;
      } else {
        srcName = slot.equipment_id;
        if (isCurrPromotion) {
          maxRarity = slot.max_enhance_level;
          rarity = enhanceLevel;
        }
      }
    }
    const imgSrc = getPublicImageURL('equipment', srcName)
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
      <div key="unique" className={clsx(styles.item, styles.unique)}>
        <div className="equip-label">専用装備</div>
        <div className={styles.equipBox}>
          <SkeletonImage classes={{ root: styles.iconRoot }} src={getPublicImageURL('equipment', uniqueImgName)} save />
          <div className={styles.uniqueInfo}>
            <span className={clsx(styles.uniqueName, invalidUnique && styles.invalidUniqueName)}>{uniqueName}</span>
            {!invalidUnique && <span className={styles.uniqueLevel}>Lv{unique_enhance_level}</span>}
          </div>
        </div>
      </div>
      {promotions.map(promotion => (
        <div
          key={promotion.promotion_level}
          className={clsx(styles.item, styles['rank' + getRankPoint(promotion.promotion_level) as keyof typeof styles])}
        >
          <div className="equip-label">
            {'RANK' + promotion.promotion_level}
          </div>
          <div className={styles.equipBox}>
            {promotion.equip_slots.map((slot, i) => {
              const { imgSrc, maxRarity, rarity } = getSlotData(promotion.promotion_level, slot);
              return (
                <SkeletonImage key={i} classes={{ root: styles.iconRoot }} src={imgSrc} save>
                  {maxRarity && rarity && (
                    <Rarities classes={{ root: styles.stars, star: styles.star }} maxRarity={maxRarity} rarity={rarity} />
                  )}
                </SkeletonImage>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CharaEquip;
