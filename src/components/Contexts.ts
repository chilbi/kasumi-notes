import { createContext } from 'react';
import { PCRTheme } from '../localValue';
import DBHelper, { CharaBaseData, CharaDetailData, EquipDetailData } from '../DBHelper';

export type State<S> = [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>];

export const PCRThemeContext = createContext<State<PCRTheme>>([undefined, () => undefined]);

export const CharaListContext = createContext<State<CharaBaseData[]>>([undefined, () => undefined]);

export const CharaDetailContext = createContext<State<CharaDetailData>>([undefined, () => undefined]);

export const EquipDetailContext = createContext<State<EquipDetailData>>([undefined, () => undefined]);

export const DBHelperContext = createContext<DBHelper | null>(null);
