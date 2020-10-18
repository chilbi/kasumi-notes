import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SkeletonImage from './SkeletonImage';
import Rarities from './Rarities';
import { getRankPoint } from '../DBHelper/helper';
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
    scalage = 0.5,
    positionSize = 32 * scalage / rem,
    starSize = 24 * scalage / rem,
    uniqueSize = 24 * scalage / rem,
    iconImageSize = 128 * scalage / rem,
    iconBorderWidth = 8 * scalage / rem,
    iconBorderSlice = 12,
    iconBorderRadius = iconBorderSlice * scalage / rem ,
    iconScalage = Math.round(iconImageSize / (starSize * 5 + positionSize) * 10) / 10,
    iconPositionSize = positionSize * iconScalage,
    iconStarSize = starSize * iconScalage,
    iconUniqueSize = uniqueSize * iconScalage,
    iconGup = (iconImageSize - (iconPositionSize + iconStarSize * 5)) / 3,
    plateImageWidth = 512 * scalage / rem,
    plateImageHeight = 256 * scalage / rem,
    plateBorderWidth = [8, 7, 11, 7].map(v => v/* * scalage*/ / rem),
    plateBorderSlice = [16, 16, 21, 16],
    plateBorderRadius = 16 * scalage / rem,
    plateScalage = Math.round((plateImageWidth / 2) / (starSize * 6 + positionSize) * 10) / 10,
    platePositionSize = positionSize * plateScalage,
    plateStarSize = starSize * plateScalage,
    plateUniqueSize = uniqueSize * plateScalage,
    plateGup = 7 * scalage / rem;

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
      bottom: (plateBorderWidth[0] - plateBorderWidth[2]) + 'rem',
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
    starsClassName = clsx(styles.iconStars, { [styles.fadeOut]: maxRarity === 6 || hasUnique });
    starClassName = styles.iconStar;
    positionClassName = clsx(styles.iconPosition, { [styles.fadeIn]: maxRarity === 6 });
    uniqueClassName = clsx({ [styles.iconUnique]: hasUnique, [styles.fadeIn]: hasUnique });
  } else {
    rootClassName = styles.plate;
    imgClassName = styles.plateImg;
    borderClassName = clsx(styles.plateBorder, styles['plateBorder' + getRankPoint(promotionLevel) as keyof typeof styles]);
    starsClassName = clsx(styles.plateStars, { [styles.fadeOut]: (maxRarity === 6 || hasUnique) });
    starClassName = styles.plateStar;
    positionClassName = clsx(styles.platePosition);
    uniqueClassName = clsx({ [styles.plateUnique]: hasUnique, [styles.fadeIn]: hasUnique });
  }

  positionClassName = clsx(positionClassName, styles['position' + position as keyof typeof styles]);

  return (
    <SkeletonImage classes={{ root: rootClassName, img: imgClassName }} src={src} save>
      <div className={borderClassName} />
      <Rarities classes={{ root: starsClassName, star: starClassName }} maxRarity={maxRarity} rarity={rarity} />
      <div className={positionClassName} />
      <div className={uniqueClassName} />
    </SkeletonImage>
  );
}

export default CharaImage;
