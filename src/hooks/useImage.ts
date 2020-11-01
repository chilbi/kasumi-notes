import { useRef, useEffect, useContext } from 'react';
import useUpdate from './useUpdate';
import { DBHelperContext } from '../components/PCRDBProvider';

function useImage(src?: string, save?: boolean): string | undefined {
  const srcRef = useRef<Record<string, string | undefined>>({});
  const update = useUpdate();
  const dbHelper = useContext(DBHelperContext);

  useEffect(() => {
    if (src) delete srcRef.current[src];
    if (save) {
      if (dbHelper && src) {
        const resultPromise = dbHelper.getImageDataURL({ src }).then(result => {
          srcRef.current[src] = result.dataURL;
          update();
          return result.image ? result : undefined;
        });
        return () => resultPromise.then(result => result && result.image!.removeEventListener('load', result.handleLoad!));
      }
    } else {
      if (src) {
        const image = new Image();
        const handleLoad = () => {
          srcRef.current[src] = src;
          update();
        }
        image.addEventListener('load', handleLoad, false);
        image.src = src;
        return () => image.removeEventListener('load', handleLoad, false);
      }
    }
  }, [dbHelper, save, src, update]);

  return src && srcRef.current[src];
}

export default useImage;
