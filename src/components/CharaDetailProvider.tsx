import React, { useState, useMemo } from 'react';
import { CharaDetailContext, State } from './Contexts';
import { CharaDetailData } from '../DBHelper';

interface CharaDetailProviderProps {
  children?: React.ReactNode;
}

function CharaDetailProvider(props: CharaDetailProviderProps) {
  const [value, set] = useState<CharaDetailData>();
  const state: State<CharaDetailData> = useMemo(() => [value, set], [value]);
  return (
    <CharaDetailContext.Provider value={state}>
      {props.children}
    </CharaDetailContext.Provider>
  );
}

export default CharaDetailProvider;
