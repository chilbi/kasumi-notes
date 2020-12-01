import { useContext, useState, useCallback, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Slider from '@material-ui/core/Slider';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Add from '@material-ui/icons/Add';
import Done from '@material-ui/icons/Done';
import Edit from '@material-ui/icons/Edit';
import Clear from '@material-ui/icons/Clear';
import Header from './Header';
import UserForm from './UserForm';
import { PCRThemeContext, DBHelperContext, CharaListContext } from './Contexts';
import { deepClone, getPublicImageURL } from '../DBHelper/helper';
import maxUserProfile from '../DBHelper/maxUserProfile';
import { CharaBaseData } from '../DBHelper';
import localValue from '../localValue';
import clsx from 'clsx';
import { PCRStoreValue } from '../db';

const marks = (() => {
  const getMark = (value: number, label: string) => ({ value, label });
  return {
    fontSize: [
      getMark(10, '超小'),
      getMark(12, '小'),
      getMark(14, '中'),
      getMark(16, '大'),
      getMark(18, '超大')
    ],
    fontWeight: [
      getMark(100, '超細'),
      getMark(200, '細'),
      getMark(400, '中'),
      getMark(700, '粗'),
      getMark(900, '超粗')
    ],
  };
})();

const useStyles = makeStyles((theme: Theme) => {
  return {
    subtitle: {
      ...theme.typography.h6,
      flexGrow: 1,
      margin: 0,
      fontWeight: 700,
      textAlign: 'center',
    },
    forms: {
      padding: theme.spacing(2),
      backgroundColor: '#fff',
    },
    form: {
      margin: theme.spacing(4, 0),
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'start',
      alignItems: 'center',
    },
    chip: {
      margin: theme.spacing(2),
    },
    sliderBox: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(4),
    },
    slider: {
      margin: theme.spacing(0, 4),
    },
    sample: {
      margin: theme.spacing(0, 4),
      fontFamily: '"Arial","Microsoft YaHei","黑体","宋体",sans-serif',
      fontSize: 16,
      fontWeight: 400,
    },
    minSize: {
      fontSize: 10,
    },
    maxSize: {
      fontSize: 18,
    },
    minWeight: {
      fontWeight: 100,
    },
    maxWeight: {
      fontWeight: 900,
    },
  };
});

interface UserData {
  currUser: string;
  allUser: string[];
  avatars: Record<string, string>;
}

function Menu() {
  const styles = useStyles();
  const [pcrTheme, setPCRTheme] = useContext(PCRThemeContext);
  const dbHelper = useContext(DBHelperContext);
  const [charaList, setCharaList] = useContext(CharaListContext);

  const [openMode, setOpenMode] = useState<'add' | 'edit' | null>(null);
  const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => setOpenMode(e.currentTarget.getAttribute('data-click')! as any), []);
  const handleClose = useCallback(() => setOpenMode(null), []);

  const [allChara, setAllChara] = useState<CharaBaseData[]>();

  const [state, setState] = useState<UserData>(() => {
    const user = localValue.app.user.get();
    return {
      currUser: user,
      allUser: [user],
      avatars: localValue.app.avatars.get(),
    };
  });

  useEffect(() => {
    if (dbHelper) dbHelper.getAllUser().then(value => {
      setState(prev => ({ ...prev, allUser: value }));
    });
  }, [dbHelper]);

  useEffect(() => {
    if (!allChara) {
      if (charaList && charaList[0].userProfile.user_name === maxUserProfile.user_name) {
        setAllChara(charaList);
      } else if (dbHelper) {
        dbHelper.getAllCharaBaseData(maxUserProfile.user_name).then(data => {
          setAllChara(data);
        });
      }
    }
  }, [allChara, charaList, dbHelper]);

  const handleChangeUser = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const user = e.currentTarget.getAttribute('data-user')!;
    const currUser = e.currentTarget.getAttribute('data-curr');
    if (user !== currUser) {
      dbHelper!.getAllCharaBaseData(user).then(data => {
        setCharaList(data);
        setState(prev => {
          const newState = deepClone(prev);
          newState.currUser = user;
          localValue.app.user.set(user);
          return newState;
        });
      });
    }
  }, [dbHelper, setCharaList]);

  const handleUserMAX = useCallback(() => {}, []);
  
  const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const user = e.currentTarget.getAttribute('data-user')!;
    dbHelper!.deleteUserProfiles(user).then(() => {
      setState(prev => {
        const newState = deepClone(prev);
        newState.allUser = prev.allUser.filter(value => value !== user);
        return newState;
      });
    });
  }, [dbHelper]);

  const handleSubmit = useCallback((currUser: string, user: string, avatar: string, userProfiles: PCRStoreValue<'user_profile'>[]) => {
    const p = currUser === maxUserProfile.user_name ? Promise.resolve() : dbHelper!.deleteUserProfiles(currUser);
    p.then(() => {
      dbHelper!.setUserProfiles(userProfiles).then(() => {
        setState(prev => {
          const newState = deepClone(prev);
          newState.currUser = user;
          if (prev.currUser === maxUserProfile.user_name) {
            newState.allUser.push(user);
          } else {
            newState.allUser[prev.allUser.indexOf(prev.currUser)] = user;
            delete newState.avatars[prev.currUser];
          }
          newState.avatars[user] = avatar;
          localValue.app.user.set(user);
          localValue.app.avatars.set(newState.avatars);
          dbHelper!.getAllCharaBaseData(user).then(data => {
            setCharaList(data);
          });
          setOpenMode(null);
          return newState;
        });
      });
    });
  }, [dbHelper, setCharaList]);

  const handleChangeFontFamily = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPCRTheme(prev => {
      const newValue = {
        ...prev!,
        fontFamily: e.target.value,
      };
      localValue.app.theme.set(newValue);
      return newValue;
    });
  }, [setPCRTheme]);

  const handleChangeFontSize = useCallback((e: React.SyntheticEvent, value: number | number[]) => {
    setPCRTheme(prev => {
      const newValue = {
        ...prev!,
        fontSize: value as number,
      };
      localValue.app.theme.set(newValue);
      return newValue;
    });
  }, [setPCRTheme]);

  const handleChangeFontWeight = useCallback((e: React.SyntheticEvent, value: number | number[]) => {
    setPCRTheme(prev => {
      const newValue = {
        ...prev!,
        fontWeight: value as number,
      };
      localValue.app.theme.set(newValue);
      return newValue;
    });
  }, [setPCRTheme]);

  const isMarugo = pcrTheme!.fontFamily === 'Marugo';

  return (
    <>
      <Header>
        <h6 className={styles.subtitle}>メニュー</h6>
      </Header>
      <div className={styles.forms}>
        <FormControl className={styles.form} component="fieldset" color="secondary" fullWidth>
          <FormLabel component="legend">ユーザー</FormLabel>
          <div className={styles.chips}>
            {state.allUser.map((user, i) => {
              const _isCurr = user === state.currUser;
              const _isUserMAX = user === maxUserProfile.user_name;
              return (
                <Chip
                  key={i}
                  className={styles.chip}
                  variant="outlined"
                  color={_isCurr ? 'secondary' : 'default'}
                  clickable
                  avatar={<Avatar src={getPublicImageURL('icon_unit', state.avatars[user])} />}
                  label={user}
                  deleteIcon={_isUserMAX ? <Done /> : _isCurr ? <Edit data-click="edit" /> : <Clear data-user={user} />}
                  data-user={user}
                  data-curr={state.currUser}
                  onDelete={_isUserMAX ? handleUserMAX : _isCurr ? handleOpen : handleDelete}
                  onClick={handleChangeUser}
                />
              );
            })}
            <IconButton color="secondary" data-click="add" onClick={handleOpen}>
              <Add />
            </IconButton>
          </div>
        </FormControl>

        <Divider />
        <FormControl className={styles.form} component="fieldset" color="secondary" fullWidth>
          <FormLabel component="legend">フォント</FormLabel>
          <RadioGroup
            row
            name="font-family"
            value={pcrTheme!.fontFamily}
            onChange={handleChangeFontFamily}
          >
            <FormControlLabel labelPlacement="start" value="Marugo" label="丸ゴ" control={<Radio />} />
            <FormControlLabel labelPlacement="start" value="Hanzi Pen" label="漢字筆" control={<Radio />} />
            <FormControlLabel labelPlacement="start" value="" label="無" control={<Radio />} />
          </RadioGroup>
        </FormControl>

        <Divider />
        <FormControl className={styles.form} component="fieldset" color="secondary" fullWidth>
          <FormLabel component="legend">フォントサイズ</FormLabel>
          <div className={styles.sliderBox}>
            <span className={clsx(styles.sample, styles.minSize)}>A</span>
            <Slider
              className={styles.slider}
              min={10}
              max={18}
              step={null}
              track={false}
              color="secondary"
              valueLabelDisplay="off"
              marks={marks.fontSize}
              value={pcrTheme!.fontSize}
              onChange={handleChangeFontSize}
            />
            <span className={clsx(styles.sample, styles.maxSize)}>A</span>
          </div>
        </FormControl>

        <Divider />
        <FormControl className={styles.form} component="fieldset" color="secondary" disabled={isMarugo} fullWidth>
          <FormLabel component="legend">フォントウエート</FormLabel>
          <div className={styles.sliderBox}>
            <span className={clsx(styles.sample, styles.minWeight)}>A</span>
            <Slider
              className={styles.slider}
              min={100}
              max={900}
              step={null}
              track={false}
              color="secondary"
              valueLabelDisplay="off"
              marks={marks.fontWeight}
              disabled={isMarugo}
              value={isMarugo ? 700 : pcrTheme!.fontWeight}
              onChange={handleChangeFontWeight}
            />
            <span className={clsx(styles.sample, styles.maxWeight)}>A</span>
          </div>
        </FormControl>
      </div>
      <Dialog open={openMode !== null} fullWidth onClose={handleClose}>
        {openMode !== null && (
          <UserForm
            user={openMode === 'add' ? undefined : state.currUser}
            avatar={openMode === 'add' ? undefined : state.avatars[state.currUser]}
            userProfiles={openMode === 'add' ? undefined : charaList!.map(item => item.userProfile)}
            currUser={state.currUser}
            allUser={state.allUser}
            allChara={allChara || []}
            onCancel={handleClose}
            onSubmit={handleSubmit}
          />
        )}
      </Dialog>
    </>
  );
}

export default Menu;
