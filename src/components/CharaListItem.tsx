import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Link } from 'react-router-dom';
import { getPublicImageURL, getValidID } from '../DBHelper/helper';
import CharaImage from './CharaImage';

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      display: 'inline-block',
      margin: theme.spacing(1),
    },
  };
});

interface CharaListItemProps {
  variant: 'icon_unit' | 'unit_plate';
  unitID?: number;
  rarity: number;
  maxRarity: number;
  promotionLevel: number;
  position: number;
  hasUnique: boolean;
}

function CharaListItem(props: CharaListItemProps) {
  const { unitID, ...other } = props;
  const styles = useStyles();
  let src;
  if (unitID) src = getPublicImageURL(other.variant, getValidID(unitID, other.rarity));
  return (
    <ButtonBase
      className={styles.root}
      component={Link}
      disabled={unitID === undefined}
      to={`/chara?unit_id=${unitID}`}
    >
      <CharaImage src={src} {...other} />
    </ButtonBase>
  );
}

export default CharaListItem;
