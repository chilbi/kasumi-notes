import { useRef, useState, useCallback } from 'react';
import { makeStyles, Theme, StyleRules } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';
import Rarities from './Rarities';
import DebouncedSlider from './DebouncedSlider';
import { marks } from './ComboSlider';
import Infobar from './Infobar';
import { CharaBaseData } from '../DBHelper';
import { PCRStoreValue } from '../db';
import { getCharaID, getRankPoint } from '../DBHelper/helper';
import maxUserProfile, { nullID } from '../DBHelper/maxUserProfile';
import Big from 'big.js';
import clsx from 'clsx';
import loveLevelPng from '../images/love_level.png';
import uniquePng from '../images/unique.png';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.75,
    LoveLevelWidth = Big(28).times(scalage).div(rem),
    LoveLevelHeight = Big(24).times(scalage).div(rem),
    uniqueSize = LoveLevelHeight,
    h = LoveLevelHeight + 'rem',
    r = LoveLevelHeight.div(2) + 'rem';

  const bgStyles = {} as StyleRules<string>;
  const rankColorKeys = Object.keys(theme.rankColor) as any as (keyof typeof theme.rankColor)[];
  for (let key of rankColorKeys) {
    bgStyles['bg' + key] = {
      backgroundColor: theme.rankColor[key],
    };
  }

  return {
    title: {
      color: '#fff',
      backgroundColor: theme.palette.primary.main,
    },
    content: {
      overflowX: 'hidden',
    },
    line: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(2, 0),
      lineHeight: h,
    },
    slider: {
      margin: theme.spacing(0, 2, 0, 1.5),
    },
    label: {
      display: 'block',
      flex: '0 0 4.5rem',
      height: h,
      lineHeight: 'inherit',
      overflow: 'hidden',
    },
    level: {
      padding: 0,
    },
    love: {
      paddingLeft: LoveLevelWidth.plus(0.25) + 'rem',
      backgroundImage: `url(${loveLevelPng})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: LoveLevelWidth + 'rem ' + LoveLevelHeight + 'rem',
      backgroundPosition: 'left center',
    },
    unique: {
      paddingLeft: uniqueSize.plus(0.25) + 'rem',
      backgroundImage: `url(${uniquePng})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: uniqueSize + 'rem ' + uniqueSize + 'rem',
      backgroundPosition: 'left center',
    },
    promotionBox: {
      display: 'inline-flex',
      alignItems: 'stretch',
      marginLeft: 'auto',
      padding: theme.spacing(0, 2),
      height: h,
      lineHeight: 'inherit',
      borderRadius: r,
    },
    promotion: {
      margin: 0,
      padding: 0,
      width: '2.5rem',
      lineHeight: 'inherit',
      textAlign: 'center',
      color: '#fff',
    },
    sepa: {
      margin: theme.spacing(0, 0.5),
      padding: 0,
      lineHeight: 'inherit',
      color: '#fff',
    },
    slot: {
      margin: 0,
      padding: 0,
      width: '1.5rem',
      lineHeight: 'inherit',
      textAlign: 'center',
      color: '#fff',
    },
    list: {
      margin: 0,
      padding: 0,
      lineHeight: h,
      listStyle: 'none',
      '&>li': {
        display: 'flex',
        margin: '2px 0 0 0',
        padding: 0,
        height: h,
        lineHeight: 'inherit',
      },
      '&>li:first-child': {
        margin: 0,
      },
    },
    popover: {
      overflow: 'hidden',
    },
    disableUnique: {
      filter: 'grayscale(100%)',
    },
    ...bgStyles,
  };
});

export interface EditData {
  level: number;
  rarity: number;
  loveLevel: number;
  uniqueLevel: number;
  promotionLevel: number;
  slotCount: number;
}

interface UserProfileFormProps {
  count?: number;
  charaBaseData?: CharaBaseData;
  userProfile?: PCRStoreValue<'user_profile'>;
  onCancel: () => void;
  onSubmit: (editData: EditData) => void;
  onDelete?: () => void;
}

function UserProfileForm(props: UserProfileFormProps) {
  const { count, charaBaseData, userProfile = maxUserProfile, onCancel, onSubmit, onDelete } = props;
  const styles = useStyles();

  const maxRarity = charaBaseData ? charaBaseData.charaData.max_rarity : 6;
  const maxLoveLevel = maxRarity === 6 ? 12 : 8;
  const hasUnique = charaBaseData ? charaBaseData.charaData.unique_equip_id !== nullID : true;

  const [rarity, setRarity] = useState(charaBaseData ? userProfile.rarity : 6);
  const [level, setLevel] = useState(userProfile.level);
  const [loveLevel, setLoveLevel] = useState(() => charaBaseData ? userProfile.love_level_status[getCharaID(charaBaseData.charaData.unit_id)] : maxLoveLevel);
  const [uniqueLevel, setUniqueLevel] = useState(userProfile.unique_enhance_level);
  const [promotionLevel, setPromotionLevel] = useState(userProfile.promotion_level);
  const [slotCount, setSlotCount] = useState(() => charaBaseData ? Object.keys(userProfile.equip_enhance_status).length : 6);

  const handleChangeRarity = useCallback((value: number) => setRarity(value), []);
  const handleChangeLevel = useCallback((value: number) => setLevel(value), []);
  const handleChangeLove = useCallback((value: number) => setLoveLevel(value), []);
  const handleChangeUnique = useCallback((value: number) => setUniqueLevel(value), []);
  const handleChangePromotion = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const value = parseInt(e.currentTarget.getAttribute('data-value')!);
    setPromotionLevel(value);
    setAnchorEl(null);
  }, []);
  const handleChangeSlot = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const value = parseInt(e.currentTarget.getAttribute('data-value')!);
    setSlotCount(value);
    setAnchorEl(null);
  }, []);

  const dataPopoverRef = useRef('promotion');
  const heightRef = useRef(0);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    dataPopoverRef.current = e.currentTarget.getAttribute('data-popover')!;
    heightRef.current = e.currentTarget.clientHeight + 2;
    setAnchorEl(e.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  let vertical;
  let items;
  if (dataPopoverRef.current === 'promotion') {
    vertical = heightRef.current * (maxUserProfile.promotion_level - promotionLevel);
    items = Array.from(Array(maxUserProfile.promotion_level)).map((_, i) => {
      const _promotionLevel = maxUserProfile.promotion_level - i;
      return (
        <li key={_promotionLevel}>
          <ButtonBase
            className={clsx(styles.promotion, styles['bg' + getRankPoint(_promotionLevel) as keyof typeof styles])}
            data-value={_promotionLevel}
            onClick={handleChangePromotion}
          >
            {'R' + _promotionLevel}
          </ButtonBase>
        </li>
      );
    });
  } else {
    vertical = heightRef.current * (6 - slotCount);
    items = Array.from(Array(7)).map((_, i) => {
      const _slotCount = 6 - i;
      return (
        <li key={_slotCount}>
          <ButtonBase
            className={clsx(styles.slot, styles['bg' + getRankPoint(promotionLevel) as keyof typeof styles])}
            data-value={_slotCount}
            onClick={handleChangeSlot}
          >
            {_slotCount}
          </ButtonBase>
        </li>
      );
    });
  }

  const handleSubmit = () => {
    onSubmit({
      level,
      rarity,
      loveLevel,
      uniqueLevel,
      promotionLevel,
      slotCount,
    });
  };

  return (
    <>
      <DialogTitle className={styles.title}>
        {(charaBaseData ? charaBaseData.charaData.unit_name + 'を' : `選択中の${count}キャラをまとめて`) + (onDelete ? '編集' : '追加')}
      </DialogTitle>
      <DialogContent className={styles.content}>
        <div className={styles.line}>
          <Rarities maxRarity={maxRarity} rarity={rarity} onChange={handleChangeRarity} />
          <div className={clsx(styles.promotionBox, styles['bg' + getRankPoint(promotionLevel) as keyof typeof styles])}>
            <ButtonBase className={styles.promotion} data-popover="promotion" onClick={handleOpen}>
              {'R' + promotionLevel}
            </ButtonBase>
            <span className={styles.sepa}>-</span>
            <ButtonBase className={styles.slot} data-popover="slot" onClick={handleOpen}>
              {slotCount}
            </ButtonBase>
          </div>
          <Popover
            classes={{ paper: styles.popover }}
            open={!!anchorEl}
            anchorEl={anchorEl}
            marginThreshold={0}
            anchorOrigin={{ horizontal: 0, vertical: 0 }}
            transformOrigin={{ horizontal: 0, vertical }}
            onClose={handleClose}
          >
            <ul className={styles.list}>
              {items}
            </ul>
          </Popover>
        </div>
        <div className={styles.line}>
          <Infobar classes={{ root: clsx(styles.label, styles.level) }} label="Lv" value={level} />
          <DebouncedSlider
            className={styles.slider}
            orientation="horizontal"
            valueLabelDisplay="auto"
            marks={marks.level}
            min={1}
            max={maxUserProfile.level}
            defaultValue={level}
            onDebouncedChange={handleChangeLevel}
          />
        </div>
        <div className={styles.line}>
          <span className={clsx(styles.label, styles.love)}>{loveLevel}</span>
          <DebouncedSlider
            className={styles.slider}
            orientation="horizontal"
            valueLabelDisplay="auto"
            marks={marks.love}
            min={1}
            max={maxLoveLevel}
            defaultValue={loveLevel}
            onDebouncedChange={handleChangeLove}
          />
        </div>
        {hasUnique && (
          <div className={styles.line}>
            <span className={clsx(styles.label, styles.unique, uniqueLevel < 1 && styles.disableUnique)}>{uniqueLevel}</span>
            <DebouncedSlider
              className={styles.slider}
              orientation="horizontal"
              valueLabelDisplay="auto"
              marks={marks.unique}
              min={0}
              max={maxUserProfile.unique_enhance_level}
              defaultValue={uniqueLevel}
              onDebouncedChange={handleChangeUnique}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={onCancel}>キャンセル</Button>
        {onDelete && < Button variant="outlined" color="primary" onClick={onDelete}>削除</Button>}
        <Button variant="outlined" color="primary" onClick={handleSubmit}>OK</Button>
      </DialogActions>
    </>
  );
}

export default UserProfileForm;