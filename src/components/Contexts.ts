import { createContext } from 'react';
import DBHelper, { CharaBaseData, CharaDetailData } from '../DBHelper';

export type State<S> = [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>];

export const CharaListContext = createContext<State<CharaBaseData[]>>([undefined, () => null]);

export const CharaDetailContext = createContext<State<CharaDetailData>>([undefined, () => null]);

export const DBHelperContext = createContext<DBHelper | null>(null);
