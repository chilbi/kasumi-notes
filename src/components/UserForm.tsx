import { useContext, useState, useCallback } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Edit from '@material-ui/icons/Edit';
import Infobar from './Infobar';
import UserProfilesForm from './UserProfilesForm';
import { CharaListContext } from './Contexts';
import { getPublicImageURL, getValidID } from '../DBHelper/helper';
import { maxChara } from '../DBHelper/maxUserProfile';
import { PCRStoreValue } from '../db';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  return {
    title: {
      color: '#fff',
      backgroundColor: theme.palette.primary.main,
    },
    content: {
      padding: theme.spacing(2),
    },
    avatars: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    charaEdit: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(2, 0),
    },
    editButton: {
      marginLeft: theme.spacing(2),
    },
  };
});

interface UserFormProps {
  title: string;
  allUser: string[];
  onCancel: () => void;
  onSubmit: () => void;
}

function UserForm(props: UserFormProps) {
  const { title, allUser, onCancel, onSubmit } = props;
  const styles = useStyles();
  const [charaList] = useContext(CharaListContext);

  const [openAvatars, setOpenAvatars] = useState(false);
  const handleOpen = useCallback(() => setOpenAvatars(true), []);
  const handleCloseAvatars = useCallback(() => setOpenAvatars(false), []);

  const [openCharaList, setOpenCharaList] = useState(false);
  const handleOpenCharaList = useCallback(() => setOpenCharaList(true), []);
  const handleCloseCharaList = useCallback(() => setOpenCharaList(false), []);

  const [userName, setUserName] = useState('');

  const [avatars, setAvatars] = useState<string[]>([]);

  const [userProfiles, setUserProfiles] = useState<PCRStoreValue<'user_profile'>[]>([]);

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
    setUserName(e.target.value);
  }, []);

  const charaCount = userProfiles.length;
  const charaCountError = charaCount === 0;
  const userAvatarError = avatars.length < 0;
  const userNameError = userName === '' || allUser.indexOf(userName) > -1;
  const [userAvatar, ...otherAvatar] = avatars;

  return (
    <>
      <DialogTitle className={styles.title}>{title}</DialogTitle>
      <DialogContent className={styles.content}>
        <div className={styles.avatars}>
          <IconButton onClick={handleOpen} color="primary">
            <Badge variant="dot" color={userAvatarError ? 'error' : 'primary'}>
              <Avatar src={getPublicImageURL('icon_unit', userAvatar)} />
            </Badge>
          </IconButton>
          {otherAvatar.map(avatar => (
            <IconButton key={avatar} color="primary" data-avatar={avatar} onClick={handleChangeOtherAvatars}>
              <Avatar src={getPublicImageURL('icon_unit', avatar)} />
            </IconButton>
          ))}
        </div>

        <TextField
          label="ユーザー名"
          required
          fullWidth
          color="primary"
          error={userNameError}
          value={userName}
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
        <Button variant="outlined" color="primary" disabled={charaCountError || userAvatarError || userNameError} onClick={onSubmit}>OK</Button>
      </DialogActions>

      <Dialog open={openAvatars} fullWidth onClose={handleCloseAvatars}>
        {openAvatars && charaList && (
          <DialogContent className={clsx(styles.content, styles.avatars)}>
            {charaList.map(item => {
              const unit_id = item.charaData.unit_id;
              const rarity = item.userProfile.rarity;
              const max_rarity = item.charaData.max_rarity;
              return (
                <IconButton key={unit_id} data-unit-id={unit_id} data-rarity={rarity} data-max-rarity={max_rarity} onClick={handleChangeAvatars}>
                  <Avatar src={getPublicImageURL('icon_unit', getValidID(unit_id, rarity))} />
                </IconButton>
              );
            })}
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={openCharaList} fullWidth onClose={handleCloseCharaList}>
        {openCharaList && (
          <UserProfilesForm
            charaList={charaList}
            userProfiles={userProfiles}
            onCancel={handleCloseCharaList}
            onSubmit={() => {}}
          />
        )}
      </Dialog>
    </>
  );
}

export default UserForm;
