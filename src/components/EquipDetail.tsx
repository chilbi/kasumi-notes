import React, { useMemo, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Checkbox from '@material-ui/core/Checkbox';
import Header from './Header';
import SkeletonImage from './SkeletonImage';
import Rarities from './Rarities';
import DebouncedSlider, { marks } from './DebouncedSlider';
import CharaStatus from './CharaStatus';
import { EquipData } from '../DBHelper/equip';
import { UniqueEquipData } from '../DBHelper/unique_equip';
import { getPublicImageURL } from '../DBHelper/helper';
import { propertyKeys, Property } from '../DBHelper/property';
import maxUserProfile from '../DBHelper/maxUserProfile';
import Big from 'big.js';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    iconSize = Big(128).times(scalage).div(rem);

  return {
    root: {
      zIndex: theme.zIndex.modal,
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 'auto',
      left: 0,
      margin: '0 auto',
      maxWidth: theme.maxWidth,
      minHeight: '100vh',
      textAlign: 'left',
      backgroundColor: theme.palette.grey[100],
    },
    infoBox: {
      display: 'flex',
      margin: '0.25em 0 0 0',
      padding: '0.5em',
      backgroundColor: '#fff',
    },
    nameBox: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      margin: '0 0.5em',
      justifyContent: 'space-between',
    },
    name: {
      fontSize: '1.2em',
    },
    genre: {
      marginLeft: '0.25em',
      color: theme.palette.grey[600],
    },
    desc: {
      margin: '0.25em 0 0 0',
      padding: '0.5em',
      backgroundColor: '#fff',
    },
    iconRoot: {
      width: iconSize + 'rem',
      height: iconSize + 'rem',
    },
    property: {
      display: 'flex',
      flexFlow: 'wrap',
      margin: '0.25em 0 0 0',
      padding: '0.25em',
      backgroundColor: '#fff',
    },
    subtitle: {
      flexGrow: 1,
      paddingRight: '3rem',
      textAlign: 'center',
      ...theme.typography.h6,
    },
  };
});

interface EquipDetailProps {
  equipData?: EquipData;
  uniqueEquipData?: UniqueEquipData;
  enhanceLevel?: number;
  onChangeEnhance?: (enhanceLevel: number) => void;
  onBack?: () => void;
}

function EquipDetail(props: EquipDetailProps) {
  const { equipData, uniqueEquipData, enhanceLevel, onChangeEnhance, onBack } = props;
  const styles = useStyles();

  const isUnique = !equipData;
  let min: number, max: number, id: number, name: string, desc: string;
  if (isUnique) {
    min = 0;
    max = maxUserProfile.unique_enhance_level;
    id = uniqueEquipData!.equipment_id;
    name = uniqueEquipData!.unique_equipment_data.equipment_name;
    desc = uniqueEquipData!.unique_equipment_data.description;
  } else {
    min = -1;
    max = equipData!.max_enhance_level;
    id = equipData!.equipment_id;
    name = equipData!.equipment_data.equipment_name;
    desc = equipData!.equipment_data.description;
  }

  const [level, setLevel] = useState(() => {
    return enhanceLevel !== undefined ? enhanceLevel : max;
  });

  const genre = isUnique ? level.toString() : equipData!.equipment_enhance_rate.description;

  const property = useMemo(() => {
    const result: Partial<Property<Big>> = {};
    const _property = isUnique ? uniqueEquipData!.getProperty(level > 0 ? level : 1) : equipData!.getProperty(level);
    for (let key of propertyKeys) {
      const value = _property[key];
      if (value && value.gt(0)) result[key] = value;
    }
    return result;
  }, [level, equipData, uniqueEquipData, isUnique]);

  const header = useMemo(() => (
    <Header>
      <IconButton color="primary" onClick={onBack}>
        <ArrowBack />
      </IconButton>
      <h6 className={styles.subtitle}>装備詳細</h6>
    </Header>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [onBack]);

  return (
    <div className={styles.root}>
      {header}
      <div className={styles.infoBox}>
        <SkeletonImage
          classes={{ root: styles.iconRoot }}
          src={getPublicImageURL('icon_equipment', (level > min ? '' : 'invalid_') + id)}
          save
        />
        <div className={styles.nameBox}>
          <div>
            <span className={styles.name}>{name}</span>
            <span className={styles.genre}>（{genre}）</span>
          </div>
          {equipData && equipData.max_enhance_level > 0 && (
            <Rarities
              maxRarity={equipData.max_enhance_level}
              rarity={level}
              onChange={value => {
                onChangeEnhance && onChangeEnhance(value);
                setLevel(value);
              }}
            />)
          }
          {uniqueEquipData && (
            <DebouncedSlider
              orientation="horizontal"
              valueLabelDisplay="auto"
              marks={marks.unique}
              min={min + 1}
              max={max}
              defaultValue={level}
              onDebouncedChange={value => {
                onChangeEnhance && onChangeEnhance(value);
                setLevel(value);
              }}
            />
          )}
        </div>
        {enhanceLevel !== undefined && onChangeEnhance && (
          <Checkbox
            checked={level > min}
            onChange={() => {
              const newLevel = level > min ? min : max;
              onChangeEnhance(newLevel);
              setLevel(newLevel);
            }}
          />
        )}
      </div>
      <div className={styles.desc}>
        {desc}
      </div>
      <div className={styles.property}>
        <CharaStatus property={property} partial />
      </div>
    </div>
  );
}

export default EquipDetail;
