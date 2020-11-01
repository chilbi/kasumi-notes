import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CharaListItem from './CharaListItem';
import useDBHelper from '../hooks/useDBHelper';
import { CharaBaseData } from '../DBHelper';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
});

interface CharaListProps {
  variant: 'icon_unit' | 'unit_plate';
}

function CharaList(props: CharaListProps) {
  const styles = useStyles();
  const allBaseData = useDBHelper(dbHelper => dbHelper.getAllCharaBaseData(), []);
  const nullableAllBaseData: (CharaBaseData | undefined)[] = allBaseData || Array.from(Array(130));
  return (
    <div className={clsx(styles.root, styles.spaceEvenly)}>
      {nullableAllBaseData.map((base, i) => (
        <CharaListItem
          key={i}
          variant={props.variant}
          unitID={base && base.charaData.unit_id}
          rarity={base ? base.userProfile.rarity : 6}
          maxRarity={base ? base.charaData.max_rarity : 6}
          promotionLevel={base ? base.userProfile.promotion_level : 18}
          position={base ? base.getPosition() : 1}
          hasUnique={base ? base.userProfile.unique_enhance_level > 0 : true}
        />
      ))}
    </div>
  );
}

export default CharaList;
