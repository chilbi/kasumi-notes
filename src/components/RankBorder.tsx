import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    iScalage = 0.5,
    iconBorderWidth = Big(8).times(iScalage).div(rem),
    iconBorderSlice = 12,
    plateBorderWidth = [8, 7, 11, 7].map(v => Big(v).div(rem)),
    plateBorderSlice = [16, 16, 21, 16];

  return {
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
  };
});

interface RankBorderProps {
  className?: string;
  variant: 'icon_unit' | 'unit_plate';
  promotionLevel: number;
}

function RankBorder(props: RankBorderProps) {
  const { className, variant, promotionLevel } = props;
  const styles = useStyles();

  const borderClassName = variant === 'icon_unit'
    ? clsx(styles.iconBorder, styles['iconBorder' + getRankPoint(promotionLevel) as keyof typeof styles])
    : clsx(styles.plateBorder, styles['plateBorder' + getRankPoint(promotionLevel) as keyof typeof styles]);

  return (
    <div className={clsx(borderClassName, className)} />
  );
}

export default RankBorder;
