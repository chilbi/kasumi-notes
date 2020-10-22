import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useHistory } from 'react-router-dom';
import { getPublicImageURL, getValidID } from '../DBHelper/helper';
import CharaImage from './CharaImage';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'inline-block',
    margin: '0.25em',
  },
}));

interface CharaListItemProps {
  variant: 'icon_unit' | 'unit_plate';
  unitID?: number;
  unitName?: string;
  actualName?: string;
  rarity: number;
  maxRarity: number;
  promotionLevel: number;
  position: number;
  hasUnique: boolean;
}

function CharaListItem(props: CharaListItemProps) {
  const { unitID, unitName, actualName, ...other } = props;
  const styles = useStyles();
  const history = useHistory();
  let src;
  if (unitID) src = getPublicImageURL(other.variant, getValidID(unitID, other.rarity));
  return (
    <ButtonBase
      className={styles.root}
      component="a"
      disabled={unitID === undefined}
      onClick={() => history.push(`/chara/detail/${unitID}`)}
    >
      <CharaImage src={src} {...other} />
    </ButtonBase>
  );
}

export default CharaListItem;
