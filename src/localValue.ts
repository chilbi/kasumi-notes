import { QuestType } from './DBHelper/helper';
import maxUserProfile from './DBHelper/maxUserProfile';
export interface PCRTheme {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
}

const localValue = (() => {
  const createlocalValue = <T>(key: string, defaultValue: T) => {
    const requireParse = typeof defaultValue !== 'string';
    return {
      get(): T {
        let value: unknown = window.localStorage.getItem(key);
        if (value === null) {
          value = defaultValue;
          window.localStorage.setItem(key, requireParse ? JSON.stringify(value) : value as string);
        } else if (requireParse) {
          value = JSON.parse(value as string);
        }
        return value as T;
      },
      set(value: T) {
        window.localStorage.setItem(key, requireParse ? JSON.stringify(value) : value as unknown as string);
      },
    };
  };
  return {
    app: {
      theme: createlocalValue<PCRTheme>('APP_THEME_KEY', {
        fontFamily: 'Marugo',
        fontSize: 14,
        fontWeight: 400,
      }),
      user: createlocalValue('APP_USER_KEY', maxUserProfile.user_name),
      avatars: createlocalValue('APP_AVATAR_KEY', { [maxUserProfile.user_name]: '101431' }),
    },
    charaList: {
      variant: createlocalValue<'icon_unit' | 'unit_plate'>('CHARA_LIST_VARIANT_KEY', 'unit_plate'),
      sort: createlocalValue<'asc' | 'desc'>('CHARA_LIST_SORT_KEY', 'asc'),
      order: createlocalValue('CHARA_LIST_ORDER_KEY', 'unit_id'),
      atkTypeArr: createlocalValue('CHARA_LIST_FILTER_ATK_TYPE_KEY', [1, 2]),
      positionArr: createlocalValue('CHARA_LIST_FILTER_POSITION_KEY', [1, 2, 3]),
    },
    questMapList: {
      sort: createlocalValue<'asc' | 'desc'>('QUEST_MAP_LIST_SORT_KEY', 'asc'),
      type: createlocalValue<QuestType>('QUEST_MAP_LIST_TYPE_KEY', 'N'),
      area: createlocalValue('QUEST_MAP_LIST_AREA_KEY', 39),
    },
    equipDetail: {
      sort: createlocalValue<'asc' | 'desc'>('EQUIP_DETAIL_SORT_KEY', 'desc'),
      types: createlocalValue<QuestType[]>('EQUIP_DETAIL_TYPES_KEY', ['N']),
    },
    charaEquip: {
      quick: createlocalValue('CHARA_EQUIP_QUICK_KEY', true),
    },
    charaBaseInfo: {
      stillExpand: createlocalValue('CHARA_BASE_INFO_STILL_KEY', true),
    },
  };
})();

export default localValue;
