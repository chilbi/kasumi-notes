import { useState, useCallback } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Edit from '@material-ui/icons/Edit';
import SkeletonImage from './SkeletonImage';
import Infobar from './Infobar';
import UserProfilesForm from './UserProfilesForm';
import { getPublicImageURL, getValidID } from '../DBHelper/helper';
import { maxChara } from '../DBHelper/maxUserProfile';
import { CharaBaseData } from '../DBHelper';
import { PCRStoreValue } from '../db';
import Big from 'big.js';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    iconSize = Big(128).times(scalage).div(rem);

  return {
    gup: {
      marginLeft: theme.spacing(3),
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      padding: 0,
      height: '3rem',
      color: '#fff',
      backgroundColor: theme.palette.primary.main,
      overflow: 'hidden',
    },
    content: {
      padding: theme.spacing(2),
      overflowX: 'hidden',
    },
    avatars: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(2),
    },
    iconRoot: {
      width: iconSize + 'rem',
      height: iconSize + 'rem',
      borderRadius: '50%',
      overflow: 'hidden',
    },
    charaEdit: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(2),
    },
    editButton: {
      marginLeft: theme.spacing(2),
    },
    iconButton: {
      padding: 0,
    },
    fullScreen: {
      maxWidth: theme.breakpoints.width('sm'),
    },
  };
});

interface UserFormProps {
  user?: string;
  avatar?: string;
  userProfiles?: PCRStoreValue<'user_profile'>[];
  allUser: string[];
  allChara: CharaBaseData[];
  onCancel: () => void;
  onSubmit: ( user: string, avatar: string, userProfiles: PCRStoreValue<'user_profile'>[]) => void;
}

function UserForm(props: UserFormProps) {
  const { allUser, allChara, onCancel, onSubmit } = props;
  const styles = useStyles();

  const [openAvatars, setOpenAvatars] = useState(false);
  const handleOpen = useCallback(() => setOpenAvatars(true), []);
  const handleCloseAvatars = useCallback(() => setOpenAvatars(false), []);

  const [openCharaList, setOpenCharaList] = useState(false);
  const handleOpenCharaList = useCallback(() => setOpenCharaList(true), []);
  const handleCloseCharaList = useCallback(() => setOpenCharaList(false), []);

  const [user, setUser] = useState(props.user ? props.user : '');

  const [avatars, setAvatars] = useState(props.avatar ? [props.avatar] : []);

  const [userProfiles, setUserProfiles] = useState(props.userProfiles ? props.userProfiles : []);

  const handleChangeAvatars = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const unitID = e.currentTarget.getAttribute('data-unit-id')!;
    const rarity = parseInt(e.currentTarget.getAttribute('data-rarity')!);
    const maxRarity = e.currentTarget.getAttribute('data-max-rarity')!;
    const rarities = [1, 3];
    if (maxRarity === '6') rarities.push(6);
    const avatar = getValidID(unitID, rarity);
    const newValue = [avatar];
    for (let item of rarities) {
      const value = getValidID(unitID, item);
      if (value !== avatar) newValue.push(value);
    }
    setAvatars(newValue);
    setOpenAvatars(false);
  }, []);

  const handleChangeOtherAvatars = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const avatar = e.currentTarget.getAttribute('data-avatar')!;
    setAvatars(prev => {
      const newValue = prev.filter(value => value !== avatar);
      newValue.unshift(avatar);
      return newValue;
    });
  }, []);

  const handleChangeUserName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
  }, []);

  const handleSubmitUserProfiles = useCallback((userProfiles: PCRStoreValue<'user_profile'>[]) => {
    setUserProfiles(userProfiles);
    setOpenCharaList(false);
  }, []);

  const handleSubmit = () => {
    const _userProfiles = userProfiles.map(item => {
      item.user_name = user;
      return item;
    });
    onSubmit(user, avatars[0], _userProfiles);
  };

  const charaCount = userProfiles.length;
  const charaCountError = charaCount === 0;
  const userAvatarError = avatars.length < 1;
  const userNameError = user === '' || (props.user === undefined && allUser.indexOf(user) > -1);
  const [userAvatar, ...otherAvatar] = avatars;

  return (
    <>
      <DialogTitle className={styles.title}>
        <span className={styles.gup}>{props.user ? `${props.user}を編集` : '新規ユーザー'}</span>
      </DialogTitle>
      <DialogContent className={styles.content}>
        <div className={styles.avatars}>
          <IconButton onClick={handleOpen} color="primary">
            <Badge variant="dot" color={userAvatarError ? 'error' : 'primary'}>
              <SkeletonImage classes={{ root: styles.iconRoot }} src={getPublicImageURL('icon_unit', userAvatar)} save />
            </Badge>
          </IconButton>
          {otherAvatar.map(avatar => (
            <IconButton key={avatar} color="primary" data-avatar={avatar} onClick={handleChangeOtherAvatars}>
              <SkeletonImage classes={{ root: styles.iconRoot }} src={getPublicImageURL('icon_unit', avatar)} save />
            </IconButton>
          ))}
        </div>
        <TextField
          label="ユーザー名"
          required
          fullWidth
          color="primary"
          error={userNameError}
          value={user}
          onChange={handleChangeUserName}
        />
        <div className={styles.charaEdit}>
          <Badge variant="dot" color={charaCountError ? 'error' : 'primary'}>
            <Infobar
              label="キャラ数"
              value={`${charaCount}/${maxChara}`}
            />
          </Badge>
          <IconButton className={styles.editButton} color="primary" onClick={handleOpenCharaList}>
            <Edit />
          </IconButton>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={onCancel}>キャンセル</Button>
        <Button variant="outlined" color="primary" disabled={charaCountError || userAvatarError || userNameError} onClick={handleSubmit}>OK</Button>
      </DialogActions>

      <Dialog classes={{ paperFullScreen: styles.fullScreen }} open={openAvatars} fullScreen onClose={handleCloseAvatars}>
        <DialogTitle className={styles.title}>
          <IconButton color="inherit" onClick={handleCloseAvatars}>
            <ArrowBack />
          </IconButton>
          <span>アイコンを選択</span>
        </DialogTitle>
        <DialogContent className={clsx(styles.content, styles.avatars)}>
          {allChara.map(item => {
            const unit_id = item.charaData.unit_id;
            const rarity = item.userProfile.rarity;
            const max_rarity = item.charaData.max_rarity;
            return (
              <IconButton key={unit_id} data-unit-id={unit_id} data-rarity={rarity} data-max-rarity={max_rarity} onClick={handleChangeAvatars}>
                <SkeletonImage classes={{ root: styles.iconRoot }} src={getPublicImageURL('icon_unit', getValidID(unit_id, rarity))} save />
              </IconButton>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={handleCloseAvatars}>キャンセル</Button>
        </DialogActions>
      </Dialog>

      <Dialog classes={{ paperFullScreen: styles.fullScreen }} open={openCharaList} fullScreen onClose={handleCloseCharaList}>
        <UserProfilesForm
          allChara={allChara}
          userProfiles={userProfiles}
          onCancel={handleCloseCharaList}
          onSubmit={handleSubmitUserProfiles}
        />
      </Dialog>
    </>
  );
}

export default UserForm;
