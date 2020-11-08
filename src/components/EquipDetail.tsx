import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { makeStyles, alpha, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Header from './Header';
import SkeletonImage from './SkeletonImage';
import Rarities from './Rarities';
import DebouncedSlider from './DebouncedSlider';
import { marks } from './ComboSlider';
import QuestDropList from './QuestDropList';
import QuestLabel from './QuestLabel';
import CharaStatus from './CharaStatus';
import { EquipData } from '../DBHelper/equip';
import { UniqueEquipData } from '../DBHelper/unique_equip';
import { getUniqueCraft } from '../DBHelper/unique_craft';
import { CraftData } from '../DBHelper/equip_craft';
import { getPublicImageURL, QuestType } from '../DBHelper/helper';
import { propertyKeys, Property } from '../DBHelper/property';
import maxUserProfile from '../DBHelper/maxUserProfile';
import Big from 'big.js';
import useDBHelper from '../hooks/useDBHelper';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    iconSize = Big(128).times(scalage).div(rem),
    iconRadius = Big(12).times(scalage).div(rem);

  return {
    root: {
      zIndex: theme.zIndex.modal,
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 'auto',
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      maxWidth: theme.maxWidth,
      height: '100vh',
      textAlign: 'left',
      backgroundColor: theme.palette.grey[100],
    },
    paper: {
      flex: '0 0 auto',
      marginTop: '0.25em',
      padding: '0.25em 0.5em',
      backgroundColor: '#fff',
    },
    flexBox: {
      display: 'flex',
      alignItems: 'center',
    },
    nameBox: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      margin: '0 0 0 0.5em',
    },
    control: {
      flexGrow: 1,
      margin: '0 0.5em 0 0',
      padding: 0,
    },
    name: {
      display: 'inline-block',
      fontSize: '1.1em',
    },
    genre: {
      display: 'inline-block',
      fontSize: '0.9em',
      margin: '0 0.5em 0 0',
      minWidth: '2rem',
      textAlign: 'center',
      color: theme.palette.grey[600],
    },
    desc: {
      textAlign: 'center',
    },
    iconRoot: {
      width: iconSize + 'rem',
      height: iconSize + 'rem',
      borderRadius: iconRadius + 'rem',
    },
    property: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '0 0.25em',
    },
    checkbox: {
      margin: 0,
      padding: 0,
    },
    subtitle: {
      flexGrow: 1,
      paddingRight: '3rem',
      textAlign: 'center',
      ...theme.typography.h6,
    },
    labelBox: {
      display: 'flex',
      padding: '0.25em 0.5em',
    },
    label: {
      display: 'inline-block',
      padding: '0 0.5em',
      lineHeight: 1.5,
      borderRadius: '0.25em',
      color: '#fff',
      backgroundColor: theme.palette.secondary.light,
    },
    craft: {
      padding: 0,
    },
    craftList: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: '0.25em',
    },
    craftItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'left',
      margin: '0 0 0.25em 0.5em',
      width: '5.25rem',
    },
    consume: {
      margin: '0 0 0 0.25em',
      fontFamily: '"Arial","Microsoft YaHei",sans-serif',
    },
    uniqueCraftList: {
      maxHeight: 350,
      marginTop: '0.25em',
      overflow: 'auto',
    },
    uniqueCraftItem: {
      display: 'flex',
      margin: '0 0 0.25em 0',
    },
    button: {
      alignSelf: 'center',
      margin: '0 0.25em 0 auto',
      width: '6rem',
    },
    types: {
      display: 'flex',
      alignItems: 'center',
      margin: '0 0 0 auto',
    },
    dropList: {
      flex: '1 1 auto',
      overflowY: 'auto',
    },
    dropLabel: {
      display: 'inline-block',
      margin: '0 0 0 0.5em',
      padding: '0 0.25em',
      borderRadius: '0.25em',
      color: '#fff',
    },
    selected: {
      backgroundColor: alpha(theme.palette.secondary.main, 0.35),
    },
    expandless: {
      alignSelf: 'center',
      margin: '0 0 0 auto',
      padding: 0,
      transform: 'rotate(0)',
      transition: 'transform 0.2s',
    },
    rotate: {
      transform: 'rotate(180deg)',
    },
    hidden: {
      display: 'none',
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

  const [search, setSearch] = useState<Set<number>>(new Set());

  const [descExpand, setDescExpand] = useState(true);
  const handleToggleDesc = useCallback(() => setDescExpand(prev => !prev), []);

  const [craftExpand, setCraftExpand] = useState(true);
  const handleToggleCraft = useCallback(() => setCraftExpand(prev => !prev), []);

  const [nChecked, setNChecked] = useState(true);
  const handleToggleN = useCallback(() => setNChecked(prev => !prev), []);

  const [hChecked, setHChecked] = useState(true);
  const handleToggleH = useCallback(() => setHChecked(prev => !prev), []);

  const [vhChecked, setVHChecked] = useState(true);
  const handleToggleVH = useCallback(() => setVHChecked(prev => !prev), []);

  const [sChecked, setSChecked] = useState(true);
  const handleToggleS = useCallback(() => setSChecked(prev => !prev), []);

  const equipCraft = useDBHelper(dbHelper => {
    return equipData && equipData.equipment_data.craft_flg === 1
      ? dbHelper.getEquipCraft(equipData.equipment_id)
      : Promise.resolve(undefined);
  }, [equipData]);

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

  const types = useMemo(() => {
    const result: QuestType[] = [];
    if (sChecked) result.push('S');
    if (vhChecked) result.push('VH');
    if (hChecked) result.push('H');
    if (nChecked) result.push('N');
    return result;
  }, [sChecked, vhChecked, hChecked, nChecked]);

  const property = useMemo(() => {
    const result: Partial<Property<Big>> = {};
    const _property = isUnique ? uniqueEquipData!.getProperty(level > 0 ? level : 1) : equipData!.getProperty(level);
    for (let key of propertyKeys) {
      const value = _property[key];
      if (value && value.gt(0)) result[key] = value;
    }
    return result;
  }, [level, equipData, uniqueEquipData, isUnique]);

  const uniqueCraft = useMemo(() => {
    if (!uniqueEquipData) return null;
    return getUniqueCraft(uniqueEquipData.equipment_id);
  }, [uniqueEquipData]);
  
  const header = useMemo(() => (
    <Header>
      <IconButton color="primary" onClick={onBack}>
        <ArrowBack />
      </IconButton>
      <h6 className={styles.subtitle}>装備詳細</h6>
    </Header>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [onBack]);


  const renderCraftItem = (item: CraftData, i: number) => {
    const { material_id, consume_num } = item;
    const selected = search.has(material_id);
    return (
      <ButtonBase
        key={i}
        className={clsx(styles.craftItem, selected && styles.selected)}
        onClick={() => {
          if (selected) {
            search.delete(material_id);
            setSearch(new Set(search));
            if (isUnique) setCraftExpand(true);
          } else if (material_id !== 140000 && material_id !== 140001) {
            search.add(material_id);
            setSearch(new Set(search));
            if (isUnique) setCraftExpand(false);
          }
          if (search.size > 0) setDescExpand(false);
          else setDescExpand(true);
        }}
      >
        <SkeletonImage
          classes={{ root: styles.iconRoot }}
          src={getPublicImageURL(item.material_id > 33000 ? 'icon_equipment' : 'icon_item', material_id)}
          save
        />
        <div className={styles.consume}>&times;{consume_num}</div>
      </ButtonBase>
    );
  };

  return (
    <div className={styles.root}>
      {header}
      <div className={clsx(styles.paper, styles.flexBox)}>
        <SkeletonImage
          classes={{ root: styles.iconRoot }}
          src={getPublicImageURL('icon_equipment', (level > min ? '' : 'invalid_') + id)}
          save
        />
        <div className={styles.nameBox}>
          <div>
            <span className={styles.name}>{name}</span>
            <IconButton className={clsx(styles.expandless, descExpand && styles.rotate)} onClick={handleToggleDesc}>
              <ExpandLess />
            </IconButton>
          </div>
          <div className={styles.flexBox}>
            <span className={styles.genre}>{genre}</span>
            {equipData && equipData.max_enhance_level > 0 && (
              <Rarities
                classes={{ root: styles.control }}
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
                classes={{ root: styles.control }}
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
            {enhanceLevel !== undefined && onChangeEnhance && (
              <Checkbox
                classes={{ root: styles.checkbox }}
                checked={level > min}
                onChange={() => {
                  const newLevel = level > min ? min : max;
                  onChangeEnhance(newLevel);
                  setLevel(newLevel);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className={clsx(styles.paper, styles.desc, !descExpand && styles.hidden)}>
        {desc.split('\n').map((txt, i) => (
          <Fragment key={i}>{txt}<br /></Fragment>
        ))}
      </div>
      <div className={clsx(styles.property, styles.paper)}>
        <CharaStatus property={property} partial />
      </div>
      {(equipCraft || uniqueCraft) && (
        <div className={clsx(styles.paper, styles.craft)}>
          <div className={styles.labelBox}>
            <div className={styles.label}>合成素材</div>
            <IconButton className={clsx(styles.expandless, craftExpand && styles.rotate)} onClick={handleToggleCraft}>
              <ExpandLess />
            </IconButton>
          </div>
          {equipCraft && (
            <div className={clsx(styles.craftList, !craftExpand && styles.hidden)}>
              {equipCraft.craft_data.map(renderCraftItem)}
            </div>
          )}
          {uniqueCraft && (
            <div className={clsx(styles.uniqueCraftList, !craftExpand && styles.hidden)}>
              {uniqueCraft.map(item => {
                const lv = item[0];
                return (
                  <div key={lv} className={styles.uniqueCraftItem}>
                    {item[1].map(renderCraftItem)}
                    <Button
                      className={styles.button}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        onChangeEnhance && onChangeEnhance(lv);
                        setLevel(lv);
                      }}
                    >
                      {'LEVEL' + item[0]}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {search.size > 0 && (
        <>
          <div className={clsx(styles.paper, styles.labelBox)}>
            <div className={styles.label}>入手場所</div>
            <div className={styles.types}>
              <QuestLabel type="N" component="label" htmlFor="equip-detail-N" />
              <Checkbox id="equip-detail-N" classes={{ root: styles.checkbox }} checked={nChecked} onChange={handleToggleN} />
              <QuestLabel type="H" component="label" htmlFor="equip-detail-H" />
              <Checkbox id="equip-detail-H" classes={{ root: styles.checkbox }} checked={hChecked} onChange={handleToggleH} />
              <QuestLabel type="VH" component="label" htmlFor="equip-detail-VH" />
              <Checkbox id="equip-detail-VH" classes={{ root: styles.checkbox }} checked={vhChecked} onChange={handleToggleVH} />
              <QuestLabel type="S" component="label" htmlFor="equip-detail-S" />
              <Checkbox id="equip-detail-S" classes={{ root: styles.checkbox }} checked={sChecked} onChange={handleToggleS} />
            </div>
          </div>
          <QuestDropList classes={{ root: styles.dropList }} search={search} types={types} />
        </>
      )}
    </div>
  );
}

export default EquipDetail;
