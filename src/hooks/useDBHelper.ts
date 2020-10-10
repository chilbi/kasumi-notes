import { useContext, useState, useCallback, useEffect, DependencyList } from 'react';
import { DBHelperContext } from '../components/PCRDBProvider';
import DBHelper from '../DBHelper';

function useDBHelper<T>(getData: (dbHelper: DBHelper) => Promise<T | undefined>, deps: DependencyList): T | undefined {
  const dbHelper = useContext(DBHelperContext);
  const [data, setData] = useState<T>();
  const callback = useCallback(getData, deps);

  useEffect(() => {
    if (dbHelper) callback(dbHelper).then(data => setData(data));
  }, [dbHelper, callback]);

  return data;
}

export default useDBHelper;
