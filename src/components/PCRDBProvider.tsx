import { Fragment, useRef, useState, useCallback, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DBHelperContext } from './Contexts';
import openPCRDB, { PCRDB } from '../db';
import DBHelper from '../DBHelper';
import localValue from '../localValue';
import Big from 'big.js';

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.grey[100],
  },
  m1: {
    margin: theme.spacing(0, 1),
  },
}));

interface PCRDBConnectProps {
  onSuccess: (db: PCRDB) => void;
  onRequireUpdate: (db: PCRDB) => void;
}

function PCRDBConnect(props: PCRDBConnectProps) {
  const { onSuccess, onRequireUpdate } = props;
  const styles = useStyles();
  const [status, setStatus] = useState<-1 | 0 | 1>(-1);
  const [progress, setProgress] = useState(Big(0));

  useEffect(() => {
    openPCRDB({
      onInserted: (db) => {
        setStatus(1);
        setProgress(Big(1));
        if (localValue.app.requireUpdate.get()) {
          onRequireUpdate(db);
        } else {
          onSuccess(db);
        }
      },
      onProgress: (count, total) => {
        setProgress(prevState => Big(count).div(total).plus(prevState));
      }
    }).then(db => {
      db.transaction('wave_group_data').store.count()
        .then(count => {
          if (count > 0) {
            setStatus(1);
            setProgress(Big(1));
            onSuccess(db);
          } else {
            setStatus(0);
          }
        });
    });
  }, [onSuccess, onRequireUpdate]);

  if (status === 1) return null;

  return (
    <Backdrop className={styles.backdrop} open={status < 1}>
      {status === -1 && (
        <Fragment>
          <CircularProgress key={0} className={styles.m1} size="1.5em" color="inherit" />
          <span className={styles.m1}>opening...</span>
        </Fragment>
      )}
      {status === 0 && (
        <Fragment>
          <span key={1} className={styles.m1}>{progress.times(100).round(0, 0).toString()}%</span>
          <span className={styles.m1}>updating...</span>
        </Fragment>
      )}
    </Backdrop>
  );
}

interface PCRDBProviderProps {
  children?: React.ReactNode;
}

function PCRDBProvider(props: PCRDBProviderProps) {
  const dbRef = useRef<PCRDB | null>(null);
  const [dbHelper, setDBHelper] = useState<DBHelper | null>(null);

  const handleSuccess = useCallback((db: PCRDB) => {
    dbRef.current = db;
    setDBHelper(new DBHelper(db));
  }, []);

  const handleRequireUpdate = useCallback((db: PCRDB) => {
    dbRef.current = db;
    const dbHelper = new DBHelper(db);
    dbHelper.update().then(success => {
      if (success) {
        setDBHelper(dbHelper);
      }
    });
  }, []);

  useEffect(() => {
    return () => dbRef.current?.close();
  }, []);
  
  return (
    <>
      <DBHelperContext.Provider value={dbHelper}>
        {props.children}
      </DBHelperContext.Provider>
      <PCRDBConnect onSuccess={handleSuccess} onRequireUpdate={handleRequireUpdate} />
    </>
  )
}

export default PCRDBProvider;
