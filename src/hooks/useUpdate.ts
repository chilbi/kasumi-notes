import { useCallback, useState } from 'react';

function useUpdate() {
  const [, setState] = useState(false);
  return useCallback(() => setState(prevValue => !prevValue), []);
}

export default useUpdate;
