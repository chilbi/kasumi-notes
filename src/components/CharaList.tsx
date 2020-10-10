import React from 'react';
import ButtonLink from './ButtonLink';
import Infohead from './Infohead';
import useDBHelper from '../hooks/useDBHelper';
import { CharaBaseData } from '../DBHelper';
import { getValidID } from '../DBHelper/helper';

function CharaList() {
  const allBaseData = useDBHelper(dbHelper => dbHelper.getAllCharaBaseData(), []);

  const nullableAllBaseData: (CharaBaseData | undefined)[] = allBaseData || Array.from(Array(10));

  return (
    <div>
      {nullableAllBaseData.map((base, i) => (
        <ButtonLink
          key={i}
          disabled={!base}
          to={`/chara/detail/${base?.charaData.unit_id}`}
        >
          <Infohead
            imageName={base && getValidID(base.charaData.unit_id, base.userProfile.rarity)}
            unitName={base && base.charaData.unit_name}
            actualName={base && base.charaData.actual_name}
            variant="icon"
            rarity={base ? base.userProfile.rarity : 6}
            maxRarity={base ? base.charaData.max_rarity : 6}
            promotionLevel={base ? base.userProfile.promotion_level : 18}
            position={base ? base.charaData.position : 1}
            hasUnique={base ? base.userProfile.unique_enhance_level > 0 : true}
          />
        </ButtonLink>
      ))}
    </div>
  );
}

export default CharaList;
