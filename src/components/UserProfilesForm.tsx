import { useContext, useState, useMemo, useCallback } from 'react';
import { makeStyles, alpha, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DoneAll from '@material-ui/icons/DoneAll';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import CheckCircle from '@material-ui/icons/CheckCircle';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import UserProfileForm, { EditData } from './UserProfileForm';
import SkeletonImage from './SkeletonImage';
import Infobar from './Infobar';
import { DBHelperContext } from './Contexts';
import { getPublicImageURL, getCharaID, getValidID } from '../DBHelper/helper';
import maxUserProfile, { maxChara, nullID } from '../DBHelper/maxUserProfile';
import { PromotionData } from '../DBHelper/promotion';
import { CharaBaseData } from '../DBHelper';
import { PCRStoreValue } from '../db';
import Big from 'big.js';
import clsx from 'clsx';

function getUserProfile(charaData: PCRStoreValue<'chara_data'>, originUserProfile: PCRStoreValue<'user_profile'>, promotionData: PromotionData | undefined, editData: EditData): PCRStoreValue<'user_profile'> {
  const { disabledObj } = editData;
  const maxRarity = charaData.max_rarity;
  let equipEnhanceStatus: Record<number, number> = {};
  if (disabledObj.promotion) {
    equipEnhanceStatus = { ...originUserProfile.equip_enhance_status };
  } else {
    const slots = [0, 2, 4, 5, 3, 1];
    let i = editData.slotCount;
    while (i-- > 0) {
      const slot = slots.pop()!;
      if (promotionData) {
        const equipData = promotionData.equip_slots[slot];
        if (equipData) {
          equipEnhanceStatus[slot] = equipData.max_enhance_level;
        }
      } else {
        equipEnhanceStatus[slot] = 5;
      }
    }
  }
  const skillEnhanceStatus = disabledObj.level ? { ...originUserProfile.skill_enhance_status } : {
    ub: editData.level,
    1: editData.level,
    2: editData.level,
    ex: editData.level,
  };
  const loveLevelStatus = { ...originUserProfile.love_level_status };
  if (!disabledObj.loveLevel) {
    loveLevelStatus[getCharaID(originUserProfile.unit_id)] = Math.min(editData.loveLevel, maxRarity === 6 ? 12 : 8);
  }
  return {
    user_name: originUserProfile.user_name,
    unit_id: originUserProfile.unit_id,
    level: disabledObj.level ? originUserProfile.level : editData.level,
    rarity: disabledObj.rarity ? originUserProfile.rarity : Math.min(editData.rarity, maxRarity),
    promotion_level: disabledObj.promotion ? originUserProfile.promotion_level : editData.promotionLevel,
    unique_enhance_level: disabledObj.uniqueLevel ? originUserProfile.unique_enhance_level : charaData.unique_equip_id === nullID ? 0 : editData.uniqueLevel,
    skill_enhance_status: skillEnhanceStatus,
    equip_enhance_status: equipEnhanceStatus,
    love_level_status: loveLevelStatus,
  };
}

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
      padding: theme.spacing(0, 2),
      overflowX: 'hidden',
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
      padding: theme.spacing(1, 0),
    },
    sticky: {
      zIndex: theme.zIndex.modal,
      position: 'sticky',
      top: 0,
      right: 0,
      bottom: 'auto',
      left: 0,
      borderBottom: '1px solid ' + theme.palette.grey[100],
      backgroundColor: '#fff',
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
  allChara: CharaBaseData[];
  userProfiles: PCRStoreValue<'user_profile'>[];
  onCancel: () => void;
  onSubmit: (userProfiles: PCRStoreValue<'user_profile'>[]) => void;
}

function UserProfilesForm(props: UserProfilesFormProps) {
  const { allChara, onCancel, onSubmit } = props;
  const styles = useStyles();
  const dbHelper = useContext(DBHelperContext);

  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);

  const [openData, setOpenData] = useState<{ list: 'lock' | 'unlock', target: 'set' | number }>({ list: 'lock', target: 0 });

  const [unlockList, setUnlockList] = useState(props.userProfiles);

  const unLockCount = unlockList.length;

  const lockList = useMemo(() => {
    const list: PCRStoreValue<'user_profile'>[] = [];
    const count = allChara.length;
    if (count < 1) return list;
    const lockCount = count - unLockCount;
    let _count = 0;
    let _lockCount = 0;
    while (_count < count && _lockCount < lockCount) {
      const item = allChara[_count];
      if (!unlockList.some(value => value.unit_id === item.userProfile.unit_id)) {
        list.push(item.userProfile);
        _lockCount++;
      }
      _count++;
    }
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChara, unLockCount]);

  const [selectLockList, setSelectLockList] = useState<Set<number> | null>(null);

  const [selectUnlockList, setSelectUnlockList] = useState<Set<number> | null>(null);

  const handleClearSelectList = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const setSelectList = e.currentTarget.getAttribute('data-list') === 'lock' ? setSelectLockList : setSelectUnlockList;
    setSelectList(new Set());
  }, []);

  const handleInvertSelectList = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    let
      list: PCRStoreValue<'user_profile'>[],
      setSelectList;
    if (e.currentTarget.getAttribute('data-list') === 'lock') {
      list = lockList;
      setSelectList = setSelectLockList;
    } else {
      list = unlockList;
      setSelectList = setSelectUnlockList;
    }
    setSelectList(prev => {
      const newValue = new Set<number>();
      for (let item of list) {
        if (!prev!.has(item.unit_id)) {
          newValue.add(item.unit_id);
        }
      }
      return newValue;
    });
  }, [lockList, unlockList]);

  const handleAllSelectList = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    let
      list: PCRStoreValue<'user_profile'>[],
      setSelectList;
    if (e.currentTarget.getAttribute('data-list') === 'lock') {
      list = lockList;
      setSelectList = setSelectLockList;
    } else {
      list = unlockList;
      setSelectList = setSelectUnlockList;
    }
    setSelectList(new Set(list.map(item => item.unit_id)));
  }, [lockList, unlockList]);

  const handleToggleListSelectable = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const setSelectList = e.currentTarget.getAttribute('data-list') === 'lock' ? setSelectLockList : setSelectUnlockList;
    setSelectList(prev => prev === null ? new Set() : null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget.getAttribute('data-target')!;
    const list = e.currentTarget.getAttribute('data-list')! as 'lock' | 'unlock';
    const clickMode = e.currentTarget.getAttribute('data-click')!;
    if (clickMode === 'select') {
      const unitID = parseInt(target);
      const setSelectList = list === 'lock' ? setSelectLockList : setSelectUnlockList;
      setSelectList(prev => {
        if (prev!.has(unitID)) prev!.delete(unitID);
        else prev!.add(unitID);
        return (new Set(prev));
      });
    } else {
      setOpenData({ list, target: target === 'set' ? target : parseInt(target), });
      setOpen(true);
    }
  }, []);

  const charaData = useMemo(() => {
    return openData.target !== 'set' ? allChara.find(value => value.charaData.unit_id === openData.target) : undefined;
  }, [allChara, openData.target]);

  const handleSubmitUserProfile = (editData: EditData) => {
    const allSlotLevel5 = editData.promotionLevel > 8 && editData.promotionLevel < maxUserProfile.promotion_level;
    const isLock = openData.list === 'lock';
    let
      selectList: typeof selectLockList,
      setSelectList: typeof setSelectLockList;
    if (isLock) {
      selectList = selectLockList;
      setSelectList = setSelectLockList;
    } else {
      selectList = selectUnlockList;
      setSelectList = setSelectUnlockList;
    }
    if (openData.target === 'set') {
      if (allSlotLevel5) {
        setUnlockList(prev => {
          for (let unitID of selectList!) {
            const baseData = allChara.find(value => unitID === value.userProfile.unit_id)!;
            const originUserProfile = isLock ? baseData.userProfile : prev.find(value => unitID === value.unit_id)!;
            const userProfile = getUserProfile(baseData.charaData, originUserProfile, undefined, editData);
            if (isLock) {
              prev.push(userProfile);
            } else {
              prev[prev.findIndex(value => unitID === value.unit_id)] = userProfile;
            }
          }
          if (isLock) {
            return prev.sort((a, b) => a.unit_id - b.unit_id);
          } else {
            return [...prev];
          }
        });
        setSelectList(new Set());
        setOpen(false);
      } else {
        const promiseArr = [];
        for (let unitID of selectList!) {
          promiseArr.push(dbHelper!.getPromotionData(unitID, editData.promotionLevel).then(promotionData => {
            return {
              baseData: allChara.find(value => unitID === value.userProfile.unit_id)!,
              promotionData,
            };
          }));
        }
        Promise.all(promiseArr).then(arr => {
          setUnlockList(prev => {
            for (let item of arr) {
              const originUserProfile = isLock ? item.baseData.userProfile : prev.find(value => item.baseData.userProfile.unit_id === value.unit_id)!;
              const userProfile = getUserProfile(item.baseData.charaData, originUserProfile, item.promotionData, editData);
              if (isLock) prev.push(userProfile);
              else prev[prev.findIndex(value => userProfile.unit_id === value.unit_id)] = userProfile;
            }
            if (isLock) return prev.sort((a, b) => a.unit_id - b.unit_id);
            return [...prev];
          });
          setSelectList(new Set());
          setOpen(false);
        });
      }
    } else {
      const unitID = openData.target;
      const baseData = allChara.find(value => unitID === value.userProfile.unit_id)!;
      if (allSlotLevel5) {
        setUnlockList(prev => {
          const originUserProfile = isLock ? baseData.userProfile : prev.find(value => unitID === value.unit_id)!;
          const userProfile = getUserProfile(baseData.charaData, originUserProfile, undefined, editData);
          if (openData.list === 'lock') {
            prev.push(userProfile);
            return prev.sort((a, b) => a.unit_id - b.unit_id);
          } else {
            prev[prev.findIndex(value => unitID === value.unit_id)] = userProfile;
            return [...prev];
          }
        });
        setOpen(false);
      } else {
        dbHelper!.getPromotionData(unitID, editData.promotionLevel).then(promotionData => {
          setUnlockList(prev => {
            const originUserProfile = isLock ? baseData.userProfile : prev.find(value => unitID === value.unit_id)!;
            const userProfile = getUserProfile(baseData.charaData, originUserProfile, promotionData, editData);
            if (openData.list === 'lock') {
              prev.push(userProfile);
              return prev.sort((a, b) => a.unit_id - b.unit_id);
            } else {
              prev[prev.findIndex(value => unitID === value.unit_id)] = userProfile;
              return [...prev];
            }
          });
          setOpen(false);
        });
      }
    }
  };

  const handleSubmit = () => {
    for (let item of unlockList) {
      const charaID = getCharaID(item.unit_id);
      for (let key in item.love_level_status) {
        const _charaID = parseInt(key);
        if (charaID !== _charaID) {
          const _item = unlockList.find(value => getCharaID(value.unit_id) === _charaID);
          item.love_level_status[_charaID] = _item ? _item.love_level_status[_charaID] : 1;
        }
      }
    }
    onSubmit(unlockList);
  };

  const getList = (dataList: 'lock' | 'unlock') => {
    let
      label: string,
      list: PCRStoreValue<'user_profile'>[],
      selectList: Set<number> | null,
      listCount: number,
      selectCount = 0,
      isNullSelect = true,
      isZeroSelect = true,
      isAllSelect = false,
      iconEl: JSX.Element;

    if (dataList === 'lock') {
      label = '未解放キャラ';
      list = lockList;
      selectList = selectLockList;
      iconEl = <Add />;
    } else {
      label = '解放キャラ';
      list = unlockList;
      selectList = selectUnlockList;
      iconEl = <Edit />;
    }
    listCount = list.length;
    if (selectList) {
      isNullSelect = false;
      selectCount = selectList.size;
    } else {
      isNullSelect = true;
    }
    isZeroSelect = selectCount === 0;
    isAllSelect = selectCount === listCount;
    return (
      <div>
        <div className={styles.sticky}>
          <Infobar className={styles.infobar} label={label} value={`${listCount}/${maxChara}`} />
          <div className={styles.toolbar}>
            {selectList && (
              <>
                <span>{selectCount}/{listCount}</span>
                <IconButton
                  className={styles.editButton}
                  size="small" color="secondary"
                  data-target="set"
                  data-list={dataList}
                  data-click="open"
                  disabled={isZeroSelect}
                  onClick={handleClick}
                >
                  {iconEl}
                </IconButton>
              </>
            )}
            <IconButton
              size="small"
              color="secondary"
              data-list={dataList}
              disabled={isNullSelect || isZeroSelect}
              onClick={handleClearSelectList}
            >
              <HighlightOff />
            </IconButton>
            <IconButton
              size="small"
              color="secondary"
              data-list={dataList}
              disabled={isNullSelect || isZeroSelect || isAllSelect}
              onClick={handleInvertSelectList}
            >
              <CheckCircle />
            </IconButton>
            <IconButton
              size="small"
              color="secondary"
              data-list={dataList}
              disabled={isNullSelect || isAllSelect}
              onClick={handleAllSelectList}
            >
              <CheckCircleOutline />
            </IconButton>
            <IconButton
              size="small"
              data-list={dataList}
              color={isNullSelect ? 'default' : 'secondary'}
              onClick={handleToggleListSelectable}
            >
              <DoneAll />
            </IconButton>
          </div>
        </div>
        <div className={styles.list}>
          {list.map(userProfile => {
            const unitID = userProfile.unit_id;
            return (
              <ButtonBase
                key={unitID}
                className={clsx(styles.item, selectList && selectList.has(unitID) && styles.selected)}
                data-target={unitID}
                data-list={dataList}
                data-click={isNullSelect ? 'open' : 'select'}
                onClick={handleClick}
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
    );
  };

  const disabledOK = unLockCount < 1 || (selectLockList !== null && selectLockList.size > 0) || (selectLockList !== null && selectLockList.size > 0);

  return (
    <>
      <DialogTitle className={styles.title}>編集チャラ</DialogTitle>
      <DialogContent className={styles.content}>
        {getList('unlock')}
        {getList('lock')}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={onCancel}>キャンセル</Button>
        <Button variant="outlined" color="primary" disabled={disabledOK} onClick={handleSubmit}>OK</Button>
      </DialogActions>
      
      <Dialog open={open} fullWidth onClose={handleClose}>
        {open && (
          <UserProfileForm
            charaBaseData={charaData}
            userProfile={openData.target === 'set' ? undefined : ((openData.list === 'lock' ? lockList : unlockList).find(value => value.unit_id === openData.target))}
            onCancel={handleClose}
            onSubmit={handleSubmitUserProfile}
            onDelete={openData.list === 'lock' ? undefined : (() => {
              if (openData.target === 'set') {
                setUnlockList(prev => prev.filter(value => !selectUnlockList!.has(value.unit_id)));
                setSelectUnlockList(new Set());
              } else {
                setUnlockList(prev => prev.filter(value => value.unit_id !== openData.target));
              }
              setOpen(false);
            })}
          />
        )}
      </Dialog>
    </>
  );
}

export default UserProfilesForm;