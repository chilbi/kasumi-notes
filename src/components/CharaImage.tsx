import React, { useRef, useLayoutEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SkeletonImage from './SkeletonImage';
import Rarities from './Rarities';
import { getRankPoint } from '../DBHelper/helper';
import Big from 'big.js';
import clsx from 'clsx';
import borderIcon1 from '../images/border_icon_1.png';
import borderIcon2 from '../images/border_icon_2.png';
import borderIcon4 from '../images/border_icon_4.png';
import borderIcon7 from '../images/border_icon_7.png';
import borderIcon11 from '../images/border_icon_11.png';
import borderIcon18 from '../images/border_icon_18.png';
import borderPlate1 from '../images/border_plate_1.png';
import borderPlate2 from '../images/border_plate_2.png';
import borderPlate4 from '../images/border_plate_4.png';
import borderPlate7 from '../images/border_plate_7.png';
import borderPlate11 from '../images/border_plate_11.png';
import borderPlate18 from '../images/border_plate_18.png';
import position1 from '../images/position_1.png';
import position2 from '../images/position_2.png';
import position3 from '../images/position_3.png';
import unique from '../images/unique.png';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    iScalage = 0.5,
    positionSize = Big(32).times(iScalage).div(rem),
    starSize = Big(24).times(iScalage).div(rem),
    uniqueSize = Big(24).times(iScalage).div(rem),
    iconImageSize = Big(128).times(iScalage).div(rem),
    iconBorderWidth = Big(8).times(iScalage).div(rem),
    iconBorderSlice = 12,
    iconBorderRadius = Big(iconBorderSlice).times(iScalage).div(rem),
    iconScalage = iconImageSize.div(starSize.times(5).plus(positionSize)).round(1),
    iconPositionSize = positionSize.times(iconScalage),
    iconStarSize = starSize.times(iconScalage),
    iconUniqueSize = uniqueSize.times(iconScalage),
    iconGup = iconImageSize.minus(iconStarSize.times(5).plus(iconPositionSize)).div(2).round(2, 0),
    pScalage = 0.359375,
    plateImageWidth = Big(512).times(pScalage).div(rem),
    plateImageHeight = Big(256).times(pScalage).div(rem),
    plateBorderWidth = [8, 7, 11, 7].map(v => Big(v).div(rem)),
    plateBorderSlice = [16, 16, 21, 16],
    plateBorderRadius = Big(32).times(pScalage).div(rem),
    plateScalage = plateImageWidth.div(1.5).div(starSize.times(6).plus(positionSize)).round(1),
    platePositionSize = positionSize.times(plateScalage),
    plateStarSize = starSize.times(plateScalage),
    plateUniqueSize = uniqueSize.times(plateScalage),
    plateGup = Big(7).times(pScalage).div(rem).round(2, 0);
  
  return {
    '@keyframes fadeIn': {
      '0%': { opacity: 0 },
      '42.5%': { opacity: 0 },
      '57.5%': { opacity: 1 },
      '100%': { opacity: 1 },
    },
    '@keyframes fadeOut': {
      '0%': { opacity: 1 },
      '42.5%': { opacity: 1 },
      '57.5%': { opacity: 0 },
      '100%': { opacity: 0 },
    },
    fadeIn: {
      animation: '$fadeIn 3.5s linear 0s infinite alternate',
    },
    fadeOut: {
      animation: '$fadeOut 3.5s linear 0s infinite alternate',
    },
    icon: {
      width: iconImageSize + 'rem',
      height: iconImageSize + 'rem',
      borderRadius: iconBorderRadius + 'rem',
    },
    iconImg: {
      borderRadius: iconBorderRadius + 'rem',
    },
    plate: {
      width: plateImageWidth + 'rem',
      height: plateImageHeight + 'rem',
      borderRadius: plateBorderRadius + 'rem',
    },
    plateImg: {
      borderRadius: plateBorderRadius + 'rem',
    },
    iconBorder: {
      zIndex: 1,
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderWidth: iconBorderWidth + 'rem',
      borderStyle: 'solid',
      borderImageSlice: iconBorderSlice,
      borderImageWidth: iconBorderWidth + 'rem',
      borderImageOutset: 0,
      borderImageRepeat: 'round stretch',
    },
    plateBorder: {
      zIndex: 1,
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: plateBorderWidth[0].minus(plateBorderWidth[2]) + 'rem',
      left: 0,
      borderWidth: plateBorderWidth.map(v => v + 'rem').join(' '),
      borderStyle: 'solid',
      borderImageSlice: plateBorderSlice.join(' '),
      borderImageWidth: plateBorderWidth.map(v => v + 'rem').join(' '),
      borderImageOutset: 0,
      borderImageRepeat: 'round stretch',
    },
    iconBorder1: {
      borderColor: theme.rankColor[1],
      borderImageSource: `url(${borderIcon1})`,
    },
    iconBorder2: {
      borderColor: theme.rankColor[2],
      borderImageSource: `url(${borderIcon2})`,
    },
    iconBorder4: {
      borderColor: theme.rankColor[4],
      borderImageSource: `url(${borderIcon4})`,
    },
    iconBorder7: {
      borderColor: theme.rankColor[7],
      borderImageSource: `url(${borderIcon7})`,
    },
    iconBorder11: {
      borderColor: theme.rankColor[11],
      borderImageSource: `url(${borderIcon11})`,
    },
    iconBorder18: {
      borderColor: theme.rankColor[18],
      borderImageSource: `url(${borderIcon18})`,
    },
    plateBorder1: {
      borderColor: theme.rankColor[1],
      borderImageSource: `url(${borderPlate1})`,
    },
    plateBorder2: {
      borderColor: theme.rankColor[2],
      borderImageSource: `url(${borderPlate2})`,
    },
    plateBorder4: {
      borderColor: theme.rankColor[4],
      borderImageSource: `url(${borderPlate4})`,
    },
    plateBorder7: {
      borderColor: theme.rankColor[7],
      borderImageSource: `url(${borderPlate7})`,
    },
    plateBorder11: {
      borderColor: theme.rankColor[11],
      borderImageSource: `url(${borderPlate11})`,
    },
    plateBorder18: {
      borderColor: theme.rankColor[18],
      borderImageSource: `url(${borderPlate18})`,
    },
    iconStars: {
      zIndex: 2,
      position: 'absolute',
      bottom: iconGup + 'rem',
      left: iconGup + 'rem',
    },
    plateStars: {
      zIndex: 2,
      position: 'absolute',
      bottom: plateGup + 'rem',
      left: plateGup + 'rem',
    },
    iconStar: {
      width: iconStarSize + 'rem',
      height: iconStarSize + 'rem',
      backgroundSize: iconStarSize + 'rem ' + iconStarSize + 'rem',
    },
    plateStar: {
      width: plateStarSize + 'rem',
      height: plateStarSize + 'rem',
      backgroundSize: plateStarSize + 'rem ' + plateStarSize + 'rem',
    },
    iconPosition: {
      zIndex: 2,
      position: 'absolute',
      right: iconGup + 'rem',
      bottom: iconGup + 'rem',
      width: iconPositionSize + 'rem',
      height: iconPositionSize + 'rem',
      backgroundRepeat: 'no-repeat',
      backgroundSize: iconPositionSize + 'rem ' + iconPositionSize + 'rem',
      backgroundPosition: 'center',
    },
    platePosition: {
      zIndex: 2,
      position: 'absolute',
      right: plateGup + 'rem',
      bottom: plateGup + 'rem',
      width: platePositionSize + 'rem',
      height: platePositionSize + 'rem',
      backgroundRepeat: 'no-repeat',
      backgroundSize: platePositionSize + 'rem ' + platePositionSize + 'rem',
      backgroundPosition: 'center',
    },
    position1: {
      backgroundImage: `url(${position1})`,
    },
    position2: {
      backgroundImage: `url(${position2})`,
    },
    position3: {
      backgroundImage: `url(${position3})`,
    },
    iconUnique: {
      zIndex: 2,
      position: 'absolute',
      bottom: iconGup + 'rem',
      left: iconGup + 'rem',
      width: iconUniqueSize + 'rem',
      height: iconUniqueSize + 'rem',
      backgroundImage: `url(${unique})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: iconUniqueSize + 'rem ' + iconUniqueSize + 'rem',
      backgroundPosition: 'center',
    },
    plateUnique: {
      zIndex: 2,
      position: 'absolute',
      bottom: plateGup + 'rem',
      left: plateGup + 'rem',
      width: plateUniqueSize + 'rem',
      height: plateUniqueSize + 'rem',
      backgroundImage: `url(${unique})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: plateUniqueSize + 'rem ' + plateUniqueSize + 'rem',
      backgroundPosition: 'center',
    },
  };
});

interface CharaImageProps {
  src?: string;
  variant: 'icon_unit' | 'unit_plate';
  promotionLevel: number;
  rarity: number;
  maxRarity: number;
  position: number;
  hasUnique: boolean;
}

function CharaImage(props: CharaImageProps) {
  const { src, variant, promotionLevel, rarity, maxRarity, position, hasUnique } = props;
  const styles = useStyles();
  const raritiesRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);
  const uniqueRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let timer: number;
    if (raritiesRef.current && positionRef.current && uniqueRef.current) {
      raritiesRef.current.classList.remove(styles.fadeOut);
      positionRef.current.classList.remove(styles.fadeIn);
      uniqueRef.current.classList.remove(styles.fadeIn);
      timer = window.setTimeout(() => {
        if (raritiesRef.current && positionRef.current && uniqueRef.current) {
          //[styles.fadeOut]: maxRarity === 6 || hasUnique
          if (maxRarity === 6 || hasUnique)
            raritiesRef.current.classList.add(styles.fadeOut);
          //icon_unit { [styles.fadeIn]: maxRarity === 6 }
          if (variant === 'icon_unit' && maxRarity === 6)
            positionRef.current.classList.add(styles.fadeIn);
          //[styles.fadeIn]: hasUnique
          if (hasUnique)
            uniqueRef.current.classList.add(styles.fadeIn);
        }
      }, 0);
    }
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  let
    rootClassName = '',
    imgClassName = '',
    borderClassName = '',
    starsClassName = '',
    starClassName = '',
    positionClassName = '',
    uniqueClassName = '';

  if (variant === 'icon_unit') {
    rootClassName = styles.icon;
    imgClassName = styles.iconImg;
    borderClassName = clsx(styles.iconBorder, styles['iconBorder' + getRankPoint(promotionLevel) as keyof typeof styles]);
    starsClassName = styles.iconStars;
    starClassName = styles.iconStar;
    positionClassName = styles.iconPosition;
    uniqueClassName = clsx(hasUnique && styles.iconUnique);
  } else {
    rootClassName = styles.plate;
    imgClassName = styles.plateImg;
    borderClassName = clsx(styles.plateBorder, styles['plateBorder' + getRankPoint(promotionLevel) as keyof typeof styles]);
    starsClassName = styles.plateStars;
    starClassName = styles.plateStar;
    positionClassName = styles.platePosition;
    uniqueClassName = clsx(hasUnique && styles.plateUnique);
  }

  positionClassName = clsx(positionClassName, styles['position' + position as keyof typeof styles]);

  return (
    <SkeletonImage classes={{ root: rootClassName, img: imgClassName }} src={src} save>
      <div className={borderClassName} />
      <Rarities rootRef={raritiesRef} classes={{ root: starsClassName, star: starClassName }} maxRarity={maxRarity} rarity={rarity} />
      <div ref={positionRef} className={positionClassName} />
      <div ref={uniqueRef} className={uniqueClassName} />
    </SkeletonImage>
  );
}

export default CharaImage;
