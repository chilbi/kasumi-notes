import { makeStyles, Theme, StyleRules } from '@material-ui/core/styles';
import { getRankPoint } from '../DBHelper/helper';
import Big from 'big.js';
import clsx from 'clsx';
import borderIcon1Png from '../images/border_icon_1.png';
import borderIcon2Png from '../images/border_icon_2.png';
import borderIcon3Png from '../images/border_icon_3.png';
import borderIcon4Png from '../images/border_icon_4.png';
import borderIcon5Png from '../images/border_icon_5.png';
import borderIcon6Png from '../images/border_icon_6.png';
import borderPlate1Png from '../images/border_plate_1.png';
import borderPlate2Png from '../images/border_plate_2.png';
import borderPlate3Png from '../images/border_plate_3.png';
import borderPlate4Png from '../images/border_plate_4.png';
import borderPlate5Png from '../images/border_plate_5.png';
import borderPlate6Png from '../images/border_plate_6.png';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    iScalage = 0.5,
    iconBorderWidth = Big(8).times(iScalage).div(rem),
    iconBorderSlice = 12,
    plateBorderWidth = [8, 7, 11, 7].map(v => Big(v).div(rem)),
    plateBorderSlice = [16, 16, 21, 16];

  const borderStyles = {} as StyleRules<string>;
  const borders = {
    1: [borderIcon1Png, borderPlate1Png],
    2: [borderIcon2Png, borderPlate2Png],
    3: [borderIcon3Png, borderPlate3Png],
    4: [borderIcon4Png, borderPlate4Png],
    5: [borderIcon5Png, borderPlate5Png],
    6: [borderIcon6Png, borderPlate6Png],
  };
  const rankColorKeys = Object.keys(borders) as any as (keyof typeof borders)[];
  const borderTypes = [['icon', 0], ['plate', 1]] as const;
  for (let key of rankColorKeys) {
    for (let type of borderTypes) {
      borderStyles[`${type[0]}Border${key}`] = {
        borderColor: theme.rankColor[key],
        borderImageSource: `url(${borders[key][type[1]]})`,
      };
    }
  }

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
    ...borderStyles,
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
