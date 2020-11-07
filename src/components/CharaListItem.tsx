import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useNavigate } from 'react-router-dom';
import { getPublicImageURL, getValidID } from '../DBHelper/helper';
import CharaImage from './CharaImage';

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    margin: '0.25em',
  },
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
  const navigate = useNavigate();
  let src;
  if (unitID) src = getPublicImageURL(other.variant, getValidID(unitID, other.rarity));
  return (
    <ButtonBase
      className={styles.root}
      component="a"
      disabled={unitID === undefined}
      onClick={() => navigate(`/chara/${unitID}`)}
    >
      <CharaImage src={src} {...other} />
    </ButtonBase>
  );
}

export default CharaListItem;
