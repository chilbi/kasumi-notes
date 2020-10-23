import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import openPCRDB, { PCRDB } from '../db';
import DBHelper from '../DBHelper';
import Big from 'big.js';

export const DBHelperContext = React.createContext<DBHelper | null>(null);

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.grey[100],
    '& > *': {
      margin: theme.spacing(0, 1),
    },
  },
}));

interface PCRDBConnectProps {
  onSuccess: (db: PCRDB) => void;
}

function PCRDBConnect(props: PCRDBConnectProps) {
  const { onSuccess } = props;
  const styles = useStyles();
  const [status, setStatus] = useState<-1 | 0 | 1>(-1);
  const [progress, setProgress] = useState(Big(0));

  useEffect(() => {
    openPCRDB({
      onInserted: (db) => {
        onSuccess(db);
        setStatus(1);
        setProgress(Big(1));
      },
      onProgress: (count, total) => {
        setProgress(prevState => Big(count).div(total).plus(prevState));
      }
    }).then(db => {
      db.transaction('unit_unique_equip').store.count()
        .then(count => {
          if (count > 0) {
            onSuccess(db);
            setStatus(1);
            setProgress(Big(1));
          } else {
            setStatus(0);
          }
        });
    });
  }, [onSuccess]);

  if (status === 1) return null;

  return (
      <Backdrop open={status < 1} className={styles.backdrop}>
        {status === -1 && (
          <React.Fragment>
            <CircularProgress key={0} size="1.5em" color="inherit" />
            <span>opening...</span>
          </React.Fragment>
        )}
        {status === 0 && (
          <React.Fragment>
            <span key={1}>{progress.times(100).round()}%</span>
            <span>updating...</span>
          </React.Fragment>
        )}
      </Backdrop>
  );
}

interface PCRDBProviderProps {
  children?: React.ReactNode;
}

function PCRDBProvider(props: PCRDBProviderProps) {
  const dbRef = React.useRef<PCRDB | null>(null);
  const [dbHelper, setDBHelper] = React.useState<DBHelper | null>(null);

  const handleSuccess = React.useCallback((db: PCRDB) => {
    dbRef.current = db;
    setDBHelper(new DBHelper(db));
  }, []);

  React.useEffect(() => {
    return () => dbRef.current?.close();
  }, []);
  
  return (
    <>
      <DBHelperContext.Provider value={dbHelper}>
        {props.children}
      </DBHelperContext.Provider>
      <PCRDBConnect onSuccess={handleSuccess} />
    </>
  )
}

export default PCRDBProvider;
