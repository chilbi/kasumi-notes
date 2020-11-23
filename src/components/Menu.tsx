import { useContext, useCallback } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Slider from '@material-ui/core/Slider';
import Divider from '@material-ui/core/Divider';
// import Chip from '@material-ui/core/Chip';
// import IconButton from '@material-ui/core/IconButton';
// import Add from '@material-ui/icons/Add';
// import Face from '@material-ui/icons/Face';
// import Clear from '@material-ui/icons/Clear';
// import Done from '@material-ui/icons/Done';
import Header from './Header';
import { PCRThemeContext } from './Contexts';
import localValue from '../localValue';
import clsx from 'clsx';

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
    // chips: {
    //   display: 'flex',
    //   flexWrap: 'wrap',
    //   justifyContent: 'start',
    //   alignItems: 'center',
    // },
    // chip: {
    //   margin: theme.spacing(2),
    // },
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

function Menu() {
  const styles = useStyles();
  const [pcrTheme, setPCRTheme] = useContext(PCRThemeContext);
  // const dbHelper = useContext(DBHelperContext);

  // const [currUser, setCurrUser] = useState(() => localValue.app.user.get());

  // const [allUser, setAllUser] = useState(() => [currUser]);

  // useEffect(() => {
  //   if (dbHelper) dbHelper.getAllUser().then(value => {
  //     setAllUser(value);
  //   });
  // }, [dbHelper]);

  // const handleChangeUser = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  // }, []);

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
        {/* <FormControl className={styles.form} component="fieldset" color="secondary" fullWidth>
          <FormLabel component="legend">ユーザー</FormLabel>
          <div className={styles.chips}>
            {allUser.map(user => {
              const isCurr = user = currUser;
              return (
                <Chip
                  key={user}
                  className={styles.chip}
                  variant="outlined"
                  color="secondary"
                  label={user}
                  icon={<Face />}
                  deleteIcon={isCurr ? <Done /> : <Clear />}
                  onDelete={() => {}}
                />
              );
            })}
            <IconButton color="secondary">
              <Add />
            </IconButton>
          </div>
        </FormControl>

        <Divider /> */}
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
    </>
  );
}

export default Menu;
