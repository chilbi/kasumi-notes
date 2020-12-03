import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import SkeletonImage from './SkeletonImage';
import { getPositionText, getPublicImageURL, getValidID } from '../DBHelper/helper';
import Big from 'big.js';
import clsx from 'clsx';
import positionBorder1Png from '../images/position_border_1.png';
import positionBorder2Png from '../images/position_border_2.png';
import positionBorder3Png from '../images/position_border_3.png';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    imgSize = Big(128).times(scalage).div(rem),
    borderWidth = [2, 12, 2, 26].map(v => Big(v).times(0.75).div(rem)),
    borderSlice = [2, 12, 2, 26, 'fill'];

  return {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: theme.spacing(1),
      backgroundColor: '#fff',
    },
    imgRoot: {
      width: imgSize + 'rem',
      height: imgSize + 'rem',
      borderRadius: '50%',
      overflow: 'hidden',
    },
    nameBox: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginLeft: theme.spacing(1),
    },
    unitName: {
      fontSize: '1.1em',
      color: theme.palette.primary.dark,
    },
    actualName: {
      color: theme.palette.secondary.main,
    },
    expandless: {
      margin: '0 0 0 auto',
      padding: theme.spacing(0.5),
      transform: 'rotate(180deg)',
      transition: 'transform 0.2s',
    },
    expandlessRotate: {
      transform: 'rotate(0)',
    },
    positionBox: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    position: {
      paddingLeft: theme.spacing(1),
      lineHeight: borderWidth[3].minus(borderWidth[0]) + 'rem',
      borderWidth: borderWidth.map(v => v + 'rem').join(' '),
      borderStyle: 'solid',
      borderImageSlice: borderSlice.join(' '),
      borderImageWidth: borderWidth.map(v => v + 'rem').join(' '),
      borderImageOutset: 0,
      borderImageRepeat: 'repeat stretch',
    },
    position1: {
      borderImageSource: `url(${positionBorder1Png})`,
    },
    position2: {
      borderImageSource: `url(${positionBorder2Png})`,
    },
    position3: {
      borderImageSource: `url(${positionBorder3Png})`,
    },
  };
});

interface CharaBaseInfoProps {
  unitID?: number;
  unitName?: string;
  actualName?: string;
  rarity?: number;
  position?: number;
  stillExpand: boolean;
  onToggleStillExpand: () => void;
}

function CharaBaseInfo(props: CharaBaseInfoProps) {
  const { rarity = 5, position = 1, unitID, unitName = '???', actualName = '???', stillExpand, onToggleStillExpand } = props;
  const styles = useStyles();

  const iconImgSrc = unitID ? getPublicImageURL('icon_unit', getValidID(unitID, rarity)) : undefined;

  return (
    <div className={styles.root}>
      <SkeletonImage classes={{ root: styles.imgRoot }} src={iconImgSrc} save />
      <div className={clsx(styles.nameBox)}>
        <span className={styles.unitName}>{unitName}</span>
        <span className={styles.actualName}>{actualName}</span>
      </div>
      <div className={styles.positionBox}>
        <IconButton className={clsx(styles.expandless, stillExpand && styles.expandlessRotate)} onClick={onToggleStillExpand}>
          <ExpandLess />
        </IconButton>
        <div className={clsx(styles.position, styles['position' + position as keyof typeof styles])}>
          {getPositionText(position)}
        </div>
      </div>
    </div>
  );
}

export default CharaBaseInfo;
