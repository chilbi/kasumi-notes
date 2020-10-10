import { useState, useEffect, useContext } from 'react';
import { DBHelperContext } from '../components/PCRDBProvider';

function useImage(src?: string, save?: boolean): string | undefined {
  const [url, setURL] = useState<string | undefined>();
  const dbHelper = useContext(DBHelperContext);

  useEffect(() => {
    if (save) {
      if (dbHelper && src) {
        const resultPromise = dbHelper.getImageDataURL({ src }).then(result => {
          setURL(result.dataURL);
          return result.image ? result : undefined;
        });
        return () => resultPromise.then(result => result && result.image!.removeEventListener('load', result.handleLoad!));
      }
    } else {
      if (src) {
        const image = new Image();
        const handleLoad = () => setURL(src);
        image.addEventListener('load', handleLoad, false);
        image.src = src;
        return () => image.removeEventListener('load', handleLoad, false);
      }
    }
  }, [dbHelper, save, src]);

  return url;
}

export default useImage;
