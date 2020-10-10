import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { getPublicImageURL } from '../DBHelper/helper';
import CharaImage from './CharaImage';
import CharaName from './CharaName';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    margin: '0.25em 0',
    padding: '0.25em',
    width: '100%',
    backgroundColor: '#fff',
  },
}));

interface InfoheadProps {
  imageName?: string;
  unitName?: string;
  actualName?: string;
  variant: 'icon' | 'plate';
  rarity: number;
  maxRarity: number;
  promotionLevel: number;
  position: number;
  hasUnique: boolean;
}

function Infohead(props: InfoheadProps) {
  const { imageName, unitName, actualName, ...other } = props;
  const styles = useStyles();
  return (
    <div className={clsx(styles.root)}>
      <CharaImage
        src={imageName && getPublicImageURL(other.variant === 'icon' ? 'icon_unit' : 'unit_plate', imageName)}
        {...other}
      />
      <CharaName
        unitName={unitName}
        actualName={actualName}
      />
    </div>
  );
}

export default Infohead;
