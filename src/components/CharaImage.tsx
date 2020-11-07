import React, { useRef, useLayoutEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SkeletonImage from './SkeletonImage';
import RankBorder from './RankBorder';
import Rarities from './Rarities';
import Big from 'big.js';
import clsx from 'clsx';
import position1Png from '../images/position_1.png';
import position2Png from '../images/position_2.png';
import position3Png from '../images/position_3.png';
import uniquePng from '../images/unique.png';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    iScalage = 0.5,
    positionSize = Big(32).times(iScalage).div(rem),
    starSize = Big(24).times(iScalage).div(rem),
    uniqueSize = Big(24).times(iScalage).div(rem),
    iconImageSize = Big(128).times(iScalage).div(rem),
    iconBorderSlice = 12,
    iconBorderRadius = Big(iconBorderSlice).times(iScalage).div(rem),
    iconScalage = iconImageSize.div(starSize.times(5).plus(positionSize)).round(1, 0),
    iconPositionSize = positionSize.times(iconScalage),
    iconStarSize = starSize.times(iconScalage),
    iconUniqueSize = uniqueSize.times(iconScalage),
    iconGup = iconImageSize.minus(iconStarSize.times(5).plus(iconPositionSize)).div(2).round(2, 0),
    pScalage = 0.359375,
    plateImageWidth = Big(512).times(pScalage).div(rem),
    plateImageHeight = Big(256).times(pScalage).div(rem),
    plateBorderRadius = Big(32).times(pScalage).div(rem),
    plateScalage = plateImageWidth.div(1.5).div(starSize.times(6).plus(positionSize)).round(1, 0),
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
      backgroundImage: `url(${position1Png})`,
    },
    position2: {
      backgroundImage: `url(${position2Png})`,
    },
    position3: {
      backgroundImage: `url(${position3Png})`,
    },
    iconUnique: {
      zIndex: 2,
      position: 'absolute',
      bottom: iconGup + 'rem',
      left: iconGup + 'rem',
      width: iconUniqueSize + 'rem',
      height: iconUniqueSize + 'rem',
      backgroundImage: `url(${uniquePng})`,
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
      backgroundImage: `url(${uniquePng})`,
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
          const isUnit6 = variant === 'icon_unit' && maxRarity === 6;
          if (isUnit6 || hasUnique)
            raritiesRef.current.classList.add(styles.fadeOut);
          if (isUnit6)
            positionRef.current.classList.add(styles.fadeIn);
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
    starsClassName = '',
    starClassName = '',
    positionClassName = '',
    uniqueClassName = '';

  if (variant === 'icon_unit') {
    rootClassName = styles.icon;
    imgClassName = styles.iconImg;
    starsClassName = styles.iconStars;
    starClassName = styles.iconStar;
    positionClassName = styles.iconPosition;
    uniqueClassName = clsx(hasUnique && styles.iconUnique);
  } else {
    rootClassName = styles.plate;
    imgClassName = styles.plateImg;
    starsClassName = styles.plateStars;
    starClassName = styles.plateStar;
    positionClassName = styles.platePosition;
    uniqueClassName = clsx(hasUnique && styles.plateUnique);
  }

  positionClassName = clsx(positionClassName, styles['position' + position as keyof typeof styles]);

  return (
    <SkeletonImage classes={{ root: rootClassName, img: imgClassName }} src={src} save>
      <RankBorder variant={variant} promotionLevel={promotionLevel} />
      <Rarities rootRef={raritiesRef} classes={{ root: starsClassName, star: starClassName }} maxRarity={maxRarity} rarity={rarity} />
      <div ref={positionRef} className={positionClassName} />
      <div ref={uniqueRef} className={uniqueClassName} />
    </SkeletonImage>
  );
}

export default CharaImage;
