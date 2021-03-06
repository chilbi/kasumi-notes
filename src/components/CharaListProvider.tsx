import { useState, useContext, useMemo, useEffect } from 'react';
import { CharaListContext, DBHelperContext, State } from './Contexts';
import { CharaBaseData } from '../DBHelper';
import localValue from '../localValue';

interface CharaListProviderProps {
  children?: React.ReactNode;
}

function CharaListProvider(props: CharaListProviderProps) {
  const [value, set] = useState<CharaBaseData[]>();
  const dbHelper = useContext(DBHelperContext);
  useEffect(() => {
    if (dbHelper) dbHelper.getAllCharaBaseData(localValue.app.user.get()).then(data => {
      set(data);
    });
  }, [dbHelper]);
  const state: State<CharaBaseData[]> = useMemo(() => [value, set], [value]);
  return (
    <CharaListContext.Provider value={state}>
      {props.children}
    </CharaListContext.Provider>
  );
}

export default CharaListProvider;
