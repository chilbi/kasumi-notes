import React, { useContext, useState, useCallback } from 'react';
import { makeStyles, Theme, StyleRules } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import EditLocation from '@material-ui/icons/EditLocation';
import { Link, useLocation } from 'react-router-dom';
import SkeletonImage from './SkeletonImage';
import RankBorder from './RankBorder';
import Rarities from './Rarities';
import { EquipDetailContext } from './Contexts';
import { EquipData } from '../DBHelper/equip';
import { PromotionData } from '../DBHelper/promotion';
import { UniqueEquipData } from '../DBHelper/unique_equip';
import { getPublicImageURL, getRankPoint, getValidID } from '../DBHelper/helper';
import maxUserProfile from '../DBHelper/maxUserProfile';
import { PCRStoreValue } from '../db';
import localValue from '../localValue';
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
      padding: theme.spacing(1, 0),
      textAlign: 'center',
    },
    inner: {
      position: 'relative',
      display: 'inline-block',
      minWidth: iconSize.plus(0.5).times(6).plus(1.5).plus(Big(2).div(rem)) + 'rem',
    },
    quickButton: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    quickIcon: {
      width: '1.25rem',
      height: '1.25rem',
    },
    equipList: {
      paddingTop: theme.spacing(1),
      textAlign: 'left',
    },
    equipItem: {
      margin: theme.spacing(2, 0),
      padding: theme.spacing(1, 3),
      borderRadius: '0.5rem',
      border: '1px solid ' + theme.palette.grey[200],
      boxShadow: '0 1px 1px ' + theme.palette.grey[100],
    },
    labelBox: {
      display: 'flex',
      alignItems: 'flex-end',
      marginBottom: theme.spacing(1),
      paddingBottom: theme.spacing(0.5),
      borderBottom: '2px solid' + theme.palette.primary.main,
    },
    label: {
      display: 'inline-flex',
      '&::before': {
        content: '""',
        display: 'inline-block',
        alignSelf: 'flex-end',
        margin: theme.spacing(0, 1, 1, 0),
        width: '0.5rem',
        height: '0.625rem',
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
      },
    },
    checkbox: {
      margin: '0 0 0 auto',
      padding: 0,
    },
    equipBox: {
      display: 'flex',
      justifyContent: 'flex-start',
    },
    m025: {
      margin: theme.spacing(1),
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
      fontSize: '1.2rem',
      color: theme.palette.primary.dark,
    },
    uniqueLevel: {
      color: theme.palette.secondary.main,
    },
    dish: {
      display: 'inline-block',
      position: 'relative',
      margin: `${y.plus(0.25)}rem ${len.plus(0.25)}rem`,
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
    uniqueColor: {
      color: '#d34bef',
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

function CharaEquip(props: CharaEquipProps) {
  const { maxRarity = 5, promotions = [], uniqueEquip, userProfile = maxUserProfile, onChangeEquip, onChangeUnique, onChangePromotion } = props;
  const { promotion_level, equip_enhance_status, unique_enhance_level } = userProfile;
  const styles = useStyles();
  const location = useLocation();
  const url = location.pathname + location.search;
  const setEquipDetail = useContext(EquipDetailContext)[1];

  const [quick, setQuick] = useState(() => localValue.charaEquip.quick.get());
  const handleToggleQuick = useCallback(() => {
    setQuick(prev => {
      const value = !prev;
      localValue.charaEquip.quick.set(value);
      return value;
    });
  }, []);

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
    setEquipDetail({ uniqueEquipData: uniqueEquip, enhanceLevel: unique_enhance_level, onChangeEnhance: onChangeUnique })
  }, [setEquipDetail, onChangeUnique, uniqueEquip, unique_enhance_level]);
  const handleToggleUnique = useCallback(() => {
    onChangeUnique && onChangeUnique(invalidUnique ? maxUserProfile.unique_enhance_level : 0);
  }, [invalidUnique, onChangeUnique]);

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <IconButton
          className={styles.quickButton}
          color={quick ? 'secondary' : 'default'}
          onClick={handleToggleQuick}
        >
          <EditLocation className={styles.quickIcon} />
        </IconButton>
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
          <ButtonBase
            key="unique1"
            className={clsx(styles.dishItem, styles.bottom)}
            component={Link}
            disabled={!hasUnique}
            to={quick || !uniqueEquip ? location :  `${url}&equip_id=${uniqueEquip.equipment_id}&is_unique=1`}
            onClick={quick ? handleToggleUnique : handleChangeUnique}
          >
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
            let handleClick;
            if (quick) {
              handleClick = () => {
                onChangeEquip && onChangeEquip(enhanceLevel > -1 ? -1 : maxEnhanceLevel, i);
              };
            } else {
              handleClick = () => {
                setEquipDetail({
                  equipData: slot,
                  enhanceLevel: enhanceLevel,
                  onChangeEnhance: onChangeEquip && (enhanceLevel => onChangeEquip(enhanceLevel, i)),
                });
              };
            }
            return (
              <ButtonBase
                key={'equip' + i}
                className={clsx(styles.dishItem, styles[dishMap[i]])}
                component={Link}
                disabled={!slot}
                to={quick || !slot ? location : `${url}&equip_id=${slot.equipment_id}`}
                onClick={handleClick}
              >
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
          <div key="unique" className={styles.equipItem}>
            <div className={styles.labelBox}>
              <span className={clsx(styles.label, styles.uniqueColor)}>専用装備</span>
              <Checkbox
                classes={{ root: styles.checkbox }}
                indeterminate={!hasUnique}
                disabled={!hasUnique}
                checked={!invalidUnique}
                onChange={handleToggleUnique}
              />
            </div>
            <div className={styles.equipBox}>
              <ButtonBase
                className={styles.m025}
                component={Link}
                disabled={!hasUnique}
                to={uniqueEquip ? `${url}&equip_id=${uniqueEquip.equipment_id}&is_unique=1` : location}
                onClick={handleChangeUnique}
              >
                <SkeletonImage classes={{ root: styles.iconRoot }} src={getPublicImageURL('icon_equipment', uniqueImgName)} save />
              </ButtonBase>
              <div className={clsx(styles.uniqueInfo, styles.m025)}>
                <span className={clsx(styles.uniqueName, invalidUnique && styles.invalidColor)}>{uniqueName}</span>
                {!invalidUnique && <span className={styles.uniqueLevel}>Lv{unique_enhance_level}</span>}
              </div>
            </div>
          </div>
          {promotions.map(promotion => {
            const promotionLevel = promotion.promotion_level;
            const isEqual = promotionLevel === promotion_level;
            return (
              <div key={promotionLevel} className={styles.equipItem}>
                <div className={styles.labelBox}>
                  <span className={clsx(styles.label, styles['rankColor' + getRankPoint(promotionLevel) as keyof typeof styles])}>
                    {'RANK' + promotionLevel}
                  </span>
                  <Radio
                    classes={{ root: styles.checkbox }}
                    checked={isEqual}
                    onChange={onChangePromotion && (() => !isEqual && onChangePromotion(promotionLevel))}
                  />
                </div>
                <div className={styles.equipBox}>
                  {promotion.equip_slots.map((slot, i) => (
                    <ButtonBase
                      key={i}
                      className={styles.m025}
                      component={Link}
                      disabled={!slot}
                      to={slot ? `${url}&equip_id=${slot.equipment_id}` : location}
                      onClick={slot ? (() => setEquipDetail({ equipData: slot })) : undefined}
                    >
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
    </div>
  );
}

export default CharaEquip;
