import { useState, useMemo, useCallback } from 'react';
import { makeStyles, alpha, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import DoneAll from '@material-ui/icons/DoneAll';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import CheckCircle from '@material-ui/icons/CheckCircle';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import SkeletonImage from './SkeletonImage';
import Infobar from './Infobar';
import { getPublicImageURL, getValidID } from '../DBHelper/helper';
import { maxChara } from '../DBHelper/maxUserProfile';
import { CharaBaseData } from '../DBHelper';
import { PCRStoreValue } from '../db';
import Big from 'big.js';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.34375,
    iconSize = Big(128).times(scalage).div(rem);

  return {
    title: {
      color: '#fff',
      backgroundColor: theme.palette.primary.main,
    },
    content: {
      padding: theme.spacing(2),
    },
    list: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: theme.spacing(2, 0),
    },
    item: {
      margin: theme.spacing(0.5),
      padding: theme.spacing(1.5),
    },
    iconRoot: {
      width: iconSize + 'rem',
      height: iconSize + 'rem',
      borderRadius: '0.25rem',
    },
    infobar: {
      padding: 0,
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: theme.spacing(0.5),
    },
    editButton: {
      margin: theme.spacing(0, 'auto', 0, 1),
    },
    selected: {
      backgroundColor: alpha(theme.palette.warning.main, 0.35),
    },
  };
});

interface UserProfilesFormProps {
  charaList?: CharaBaseData[];
  userProfiles: PCRStoreValue<'user_profile'>[];
  onCancel: () => void;
  onSubmit: () => void;
}

function UserProfilesForm(props: UserProfilesFormProps) {
  const { charaList, onCancel, onSubmit } = props;
  const styles = useStyles();

  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const [selectUnlockList, setSelectUnlockList] = useState<Set<number> | null>(null);
  const [selectLockList, setSelectLockList] = useState<Set<number> | null>(null);

  const handleToggleLockListSelectable = useCallback(() => setSelectLockList(prev => prev === null ? new Set() : null), []);
  const handleToggleUnlockListSelectable = useCallback(() => setSelectUnlockList(prev => prev === null ? new Set() : null), []);

  const [unlockList, setUnkockList] = useState(props.userProfiles);

  const unLockCount = unlockList.length;

  const lockList = useMemo(() => {
    const list: PCRStoreValue<'user_profile'>[] = [];
    if (!charaList) return list;
    const count = charaList.length;
    const lockCount = count - unLockCount;
    let _count = 0;
    let _lockCount = 0;
    while (_count < count && _lockCount < lockCount) {
      const item = charaList[_count];
      if (!unlockList.some(value => value.unit_id === item.userProfile.unit_id)) {
        list.push(item.userProfile);
        _lockCount++;
      }
      _count++;
    }
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charaList, unLockCount]);

  const lockCount = lockList.length;

  const handleClearSelectLockList = useCallback(() => {
    setSelectLockList(new Set());
  }, []);

  const handleInvertSelectLockList = useCallback(() => {
    setSelectLockList(prev => {
      const newValue = new Set<number>();
      for (let item of lockList) {
        if (!prev!.has(item.unit_id)) {
          newValue.add(item.unit_id);
        }
      }
      return newValue;
    });
  }, [lockList]);

  const handleAllSelectLockList = useCallback(() => {
    setSelectLockList(new Set(lockList.map(item => item.unit_id)));
  }, [lockList]);

  const handleLockItemClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const mode = e.currentTarget.getAttribute('data-mode')!;
    const unitID = parseInt(e.currentTarget.getAttribute('data-unit-id')!);
    if (mode === 'select') {
      setSelectLockList(prev => {
        if (prev!.has(unitID)) prev!.delete(unitID);
        else prev!.add(unitID);
        return (new Set(prev));
      });
    } else {
      
    }
  }, []);

  return (
    <>
      <DialogTitle className={styles.title}>編集チャラ</DialogTitle>
      <DialogContent className={styles.content}>
        <div>
          <Infobar className={styles.infobar} label="解放キャラ" value={`${unLockCount}/${maxChara}`} />
          <div className={styles.list}>
            {unlockList.map(userProfile => (
              <ButtonBase className={styles.item} key={userProfile.unit_id}>
                <SkeletonImage
                  classes={{ root: styles.iconRoot }}
                  src={getPublicImageURL('icon_unit', getValidID(userProfile.unit_id, userProfile.rarity))}
                  save
                />
              </ButtonBase>
            ))}
          </div>
        </div>
        <div>
          <Infobar className={styles.infobar} label="未解放キャラ" value={`${lockCount}/${maxChara}`} />
          <div className={styles.toolbar}>
            {selectLockList && (
              <>
                <span>{selectLockList.size}/{lockCount}</span>
                <IconButton
                  className={styles.editButton}
                  size="small" color="secondary"
                  disabled={selectLockList.size < 1}
                  onClick={handleOpen}
                >
                  <Add />
                </IconButton>
              </>
            )}
            <IconButton size="small" color="secondary" disabled={selectLockList === null || selectLockList.size === 0} onClick={handleClearSelectLockList}>
              <HighlightOff />
            </IconButton>
            <IconButton size="small" color="secondary" disabled={selectLockList === null || selectLockList.size === 0 || selectLockList.size === lockCount} onClick={handleInvertSelectLockList}>
              <CheckCircle />
            </IconButton>
            <IconButton size="small" color="secondary" disabled={selectLockList === null || selectLockList.size === lockCount} onClick={handleAllSelectLockList}>
              <CheckCircleOutline />
            </IconButton>
            <IconButton size="small" color={ selectLockList ? 'secondary' : 'default' } onClick={handleToggleLockListSelectable}>
              <DoneAll />
            </IconButton>
          </div>
          <div className={styles.list}>
            {lockList.map(userProfile => {
              const unitID = userProfile.unit_id;
              return (
                <ButtonBase
                  key={unitID}
                  className={clsx(styles.item, selectLockList && selectLockList.has(unitID) && styles.selected)}
                  data-unit-id={unitID}
                  data-mode={selectLockList ? 'select' : 'click'}
                  onClick={handleLockItemClick}
                >
                  <SkeletonImage
                    classes={{ root: styles.iconRoot }}
                    src={getPublicImageURL('icon_unit', getValidID(unitID, userProfile.rarity))}
                    save
                  />
                </ButtonBase>
              );
            })}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={onCancel}>キャンセル</Button>
        <Button variant="outlined" color="primary" disabled={true} onClick={onSubmit}>OK</Button>
      </DialogActions>
      
      <Dialog open={open} fullWidth onClose={handleClose}>
        <DialogTitle className={styles.title}></DialogTitle>
        <DialogContent className={styles.content}></DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={handleClose}>キャンセル</Button>
          <Button variant="outlined" color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserProfilesForm;