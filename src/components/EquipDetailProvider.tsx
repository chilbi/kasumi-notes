import { useState, useMemo } from 'react';
import { EquipDetailContext, State } from './Contexts';
import { EquipDetailData } from '../DBHelper';

interface EquipDetailProviderProps {
  children?: React.ReactNode;
}

function EquipDetailProvider(props: EquipDetailProviderProps) {
  const [value, set] = useState<EquipDetailData>();
  const state: State<EquipDetailData> = useMemo(() => [value, set], [value]);
  return (
    <EquipDetailContext.Provider value={state}>
      {props.children}
    </EquipDetailContext.Provider>
  );
}

export default EquipDetailProvider;
