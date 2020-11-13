import React, { makeStyles, Theme } from '@material-ui/core/styles';
import SkeletonImage from './SkeletonImage';
import { getPositionText, getPublicImageURL, getValidID } from '../DBHelper/helper';
import { PCRStoreValue } from '../db';
import Big from 'big.js';
import clsx from 'clsx';
import positionBorder1Png from '../images/position_border_1.png';
import positionBorder2Png from '../images/position_border_2.png';
import positionBorder3Png from '../images/position_border_3.png';

const defaultCharaData: PCRStoreValue<'chara_data'> = {
  unit_name: '???',
  actual_name: '???',
} as any;

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    imgSize = Big(128).times(scalage).div(rem),
    borderWidth = [2, 12, 2, 26].map(v => Big(v).times(0.75).div(rem)),
    borderSlice = [2, 12, 2, 26, 'fill'];

  return {
    stillRoot: {
      maxWidth: '100%',
      width: 'calc(100vw - (100vw - 100%))',
      paddingBottom: 'calc(792 / 1408 * (100vw - (100vw - 100%)))',
      position: 'relative',
      '&::before': {
        content: '"Loading..."',
        zIndex: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        display: 'inline-block',
        color: theme.palette.grey[800],
        fontSize: '2.5em',
        transform: 'translate(-50%, -50%)',
      },
    },
    iconRoot: {
      width: imgSize + 'rem',
      height: imgSize + 'rem',
      borderRadius: '50%',
      overflow: 'hidden',
    },
    infoBox: {
      display: 'flex',
      padding: '0.25em',
      backgroundColor: '#fff',
    },
    position: {
      alignSelf: 'center',
      marginLeft: 'auto',
      paddingLeft: '0.25em',
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
    nameBox: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      flexGrow: 1,
      margin: '0.25em',
    },
    unitName: {
      fontSize: '1.2em',
      color: theme.palette.primary.dark,
    },
    actualName: {
      color: theme.palette.secondary.main,
    },
  };
});

interface CharaBaseInfoProps {
  rarity?: number;
  position?: number;
  charaData?: PCRStoreValue<'chara_data'>;
}

function CharaBaseInfo(props: CharaBaseInfoProps) {
  const { rarity = 5, position = 1, charaData = defaultCharaData } = props;
  const styles = useStyles();

  const stillImgSrc = charaData.unit_id ? getPublicImageURL('still_unit', getValidID(charaData.unit_id, rarity, 3)) : undefined;
  const iconImgSrc = charaData.unit_id ? getPublicImageURL('icon_unit', getValidID(charaData.unit_id, rarity)) : undefined;

  return (
    <>
      <SkeletonImage classes={{ root: styles.stillRoot }} src={stillImgSrc} />
      <div className={styles.infoBox}>
        <SkeletonImage classes={{ root: styles.iconRoot }} src={iconImgSrc} save />
        <div className={clsx(styles.nameBox)}>
          <span className={styles.unitName}>{charaData.unit_name}</span>
          <span className={styles.actualName}>{charaData.actual_name}</span>
        </div>
        <div className={clsx(styles.position, styles['position' + position as keyof typeof styles])}>
          {getPositionText(position)}
        </div>
      </div>
    </>
  );
}

export default CharaBaseInfo;
