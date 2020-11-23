import { makeStyles, Theme } from '@material-ui/core/styles';
import SkeletonImage from './SkeletonImage';
import { getPublicImageURL, getValidID } from '../DBHelper/helper';

const useStyles = makeStyles((theme: Theme) => {
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
  };
});

interface CharaBaseInfoProps {
  unitID?: number;
  rarity?: number;
}

function CharaBaseInfo(props: CharaBaseInfoProps) {
  const { unitID, rarity = 5 } = props;
  const styles = useStyles();

  const stillImgSrc = unitID ? getPublicImageURL('still_unit', getValidID(unitID, rarity, 3)) : undefined;

  return (
    <SkeletonImage classes={{ root: styles.stillRoot }} src={stillImgSrc} />
  );
}

export default CharaBaseInfo;
