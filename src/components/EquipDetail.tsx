import { Fragment, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { makeStyles, alpha, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import SortRounded from '@material-ui/icons/SortRounded';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import ExpandLess from '@material-ui/icons/ExpandLess';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import SkeletonImage from './SkeletonImage';
import Rarities from './Rarities';
import SliderPlus from './SliderPlus';
import { marks } from './DebouncedSlider';
import QuestDropList from './QuestDropList';
import QuestLabel from './QuestLabel';
import CharaStatus from './CharaStatus';
import { DBHelperContext, EquipDetailContext } from './Contexts';
import useQuery from '../hooks/useQuery';
import { getUniqueCraft } from '../DBHelper/unique_craft';
import { CraftData } from '../DBHelper/equip_craft';
import { getPublicImageURL, QuestType } from '../DBHelper/helper';
import { propertyKeys, Property } from '../DBHelper/property';
import maxUserProfile from '../DBHelper/maxUserProfile';
import useDBHelper from '../hooks/useDBHelper';
import localValue from '../localValue';
import Big from 'big.js';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    iconSize = Big(128).times(scalage).div(rem),
    iconRadius = Big(12).times(scalage).div(rem);

  return {
    paper: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(1),
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
      marginLeft: theme.spacing(1),
    },
    control: {
      flexGrow: 1,
      marginRight: theme.spacing(2),
      padding: '0!important',
    },
    iconButton: {
      margin: theme.spacing(0, 1),
      padding: 0,
    },
    name: {
      display: 'inline-block',
      fontSize: '1.1em',
    },
    genre: {
      display: 'inline-block',
      marginRight: theme.spacing(1),
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
      padding: theme.spacing(0),
    },
    checkbox: {
      margin: 0,
      padding: 0,
    },
    subtitle: {
      ...theme.typography.h6,
      flexGrow: 1,
      margin: 0,
      paddingRight: '3rem',
      fontWeight: 700,
      textAlign: 'center',
    },
    labelBox: {
      display: 'flex',
      padding: theme.spacing(1),
    },
    label: {
      display: 'inline-block',
      padding: theme.spacing(0, 2),
      lineHeight: 1.5,
      borderRadius: '0.25rem',
      color: '#fff',
      backgroundColor: theme.palette.secondary.light,
    },
    craft: {
      padding: 0,
    },
    craftList: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: theme.spacing(1),
    },
    craftItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'left',
      margin: theme.spacing(0, 0, 1, 1),
      width: '5.25rem',
    },
    consume: {
      marginLeft: theme.spacing(1),
      fontFamily: 'sans-serif',
    },
    uniqueCraftList: {
      marginTop: theme.spacing(1),
    },
    uniqueCraftItem: {
      display: 'flex',
      marginBottom: theme.spacing(1),
    },
    button: {
      alignSelf: 'center',
      margin: theme.spacing(0, 1, 0, 'auto'),
      width: '5em',
      textTransform: 'none',
    },
    types: {
      display: 'flex',
      alignItems: 'center',
      margin: '0 0 0 auto',
    },
    hidden: {
      display: 'none',
    },
    selected: {
      backgroundColor: alpha(theme.palette.warning.main, 0.35),
    },
    expandless: {
      alignSelf: 'center',
      margin: '0 0 0 auto',
      padding: 0,
      transform: 'rotate(0)',
      transition: 'transform 0.2s',
    },
    expandlessRotate: {
      transform: 'rotate(180deg)',
    },
    sortLabel: {
      display: 'inline-block',
      marginLeft: theme.spacing(2),
    },
    sort: {
      padding: 0,
      transform: 'rotateX(0)',
      transition: 'transform 0.2s',
    },
    sortRotate: {
      transform: 'rotateX(180deg)',
    },
  };
});

function EquipDetail() {
  const styles = useStyles();
  const navigate = useNavigate();
  const query = useQuery();
  const equipID = parseInt(query.get('equip_id') || '0');
  const isUnique = !!parseInt(query.get('is_unique') || '0');
  
  const dbHelper = useContext(DBHelperContext);
  const [equipDetail, setEquipDetail] = useContext(EquipDetailContext);

  useEffect(() => {
    if (dbHelper && (!equipDetail || (isUnique ? equipDetail.uniqueEquipData!.equipment_id : equipDetail.equipData!.equipment_id) !== equipID)) {
      if (isUnique) {
        dbHelper.getUniqueEquipData(equipID).then(uniqueEquipData => {
          if (uniqueEquipData) setEquipDetail({ uniqueEquipData });
        });
      } else {
        dbHelper.getEquipData(equipID).then(equipData => {
          if (equipData) setEquipDetail({ equipData });
        });
      }
    }
  }, [dbHelper, equipDetail, setEquipDetail, equipID, isUnique]);

  const [search, setSearch] = useState<Set<number>>(() => new Set());

  const [descExpand, setDescExpand] = useState(true);
  const handleToggleDesc = useCallback(() => setDescExpand(prev => !prev), []);

  const [craftExpand, setCraftExpand] = useState(true);
  const handleToggleCraft = useCallback(() => setCraftExpand(prev => !prev), []);

  const [types, setTypes] = useState(() => localValue.equipDetail.types.get());
  const handleChangeTypes = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const type = (e.target.value) as QuestType;
    setTypes(prev => {
      let value: QuestType[];
      if (prev.indexOf(type) > -1) {
        value = prev.filter(value => value !== type);
      } else {
        value = [...prev, type];
      }
      localValue.equipDetail.types.set(value);
      return value;
    });
  }, []);

  const [sort, setSort] = useState(() => localValue.equipDetail.sort.get());
  const handleToggleSort = useCallback(() => {
    setSort(prev => {
      const value = prev === 'asc' ? 'desc' : 'asc';
      localValue.equipDetail.sort.set(value);
      return value;
    });
  }, []);

  const { equipData, uniqueEquipData, enhanceLevel, onChangeEnhance } = equipDetail || {};

  const equipCraft = useDBHelper(dbHelper => {
    return equipData && equipData.equipment_data.craft_flg === 1
      ? dbHelper.getEquipCraft(equipData.equipment_id)
      : Promise.resolve(undefined);
  }, [equipData]);

  let min: number, max: number, id: number, name: string, desc: string;
  if (isUnique) {
    min = 0;
    max = maxUserProfile.unique_enhance_level;
    id = uniqueEquipData ? uniqueEquipData.equipment_id : 999999;
    name = uniqueEquipData ? uniqueEquipData.unique_equipment_data.equipment_name : '???';
    desc = uniqueEquipData ? uniqueEquipData.unique_equipment_data.description : '???';
  } else {
    min = -1;
    max = equipData ? equipData.max_enhance_level : 5;
    id = equipData ? equipData.equipment_id : 999999;
    name = equipData ? equipData.equipment_data.equipment_name : '???';
    desc = equipData ? equipData.equipment_data.description : '???';
  }

  const [level, setLevel] = useState(() => {
    return enhanceLevel !== undefined ? enhanceLevel : max;
  });

  const genre = isUnique ? level.toString() : equipData ? equipData.equipment_enhance_rate.description : '???';

  const property = useMemo(() => {
    const result: Partial<Property<Big>> = {};
    const _property: Partial<Property<Big>> = isUnique
      ? (uniqueEquipData ? uniqueEquipData.getProperty(level > 0 ? level : 1) : {})
      : (equipData ? equipData.getProperty(level) : {});
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

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const header = useMemo(() => (
    <Header>
      <IconButton color="inherit" onClick={handleBack}>
        <ArrowBack />
      </IconButton>
      <h6 className={styles.subtitle}>装備詳細</h6>
    </Header>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [handleBack]);

  const renderCraftItem = (item: CraftData, i: number) => {
    const { material_id, consume_num } = item;
    const isHeart = material_id === 140000 || material_id === 140001;
    const selected = search.has(material_id) || (isHeart && search.has(140001));
    return (
      <ButtonBase
        key={i}
        className={clsx(styles.craftItem, selected && styles.selected)}
        onClick={() => {
          if (selected) {
            if (isHeart) {
              search.delete(140001);
              if (types.indexOf('S') > -1) handleChangeTypes({ target: { value: 'S' } } as any);
            } else {
              search.delete(material_id);
            }
            setSearch(new Set(search));
            if (isUnique) setCraftExpand(true);
          } else {
            if (isHeart) {
              search.add(140001);
              if (types.indexOf('S') < 0) handleChangeTypes({ target: { value: 'S' } } as any);
            } else {
              if (material_id > 32000 && material_id < 33000 && types.indexOf('VH') < 0) handleChangeTypes({ target: { value: 'VH' } } as any);
              else if (material_id > 31000 && material_id < 32000 && types.indexOf('H') < 0) handleChangeTypes({ target: { value: 'H' } } as any);
              search.add(material_id);
            }
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
    <>
      {header}
      <div className={clsx(styles.paper, styles.flexBox)}>
        <SkeletonImage
          classes={{ root: styles.iconRoot }}
          src={id === 999999 ? undefined : getPublicImageURL('icon_equipment', (level > min ? '' : 'invalid_') + id)}
          save
        />
        <div className={styles.nameBox}>
          <div>
            <span className={styles.name}>{name}</span>
            <IconButton className={clsx(styles.expandless, descExpand && styles.expandlessRotate)} onClick={handleToggleDesc}>
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
              <SliderPlus
                className={styles.control}
                classes={{ iconButton: styles.iconButton }}
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
                className={styles.checkbox}
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
      <Collapse in={descExpand}>
        <div className={clsx(styles.paper, styles.desc)}>
          {desc.split('\n').map((txt, i) => (
            <Fragment key={i}>{txt}<br /></Fragment>
          ))}
        </div>
      </Collapse>
      <div className={clsx(styles.property, styles.paper)}>
        <CharaStatus property={property} partial />
      </div>
      {(equipCraft || uniqueCraft) && (
        <div className={clsx(styles.paper, styles.craft)}>
          <div className={styles.labelBox}>
            <div className={styles.label}>合成素材</div>
            <IconButton className={clsx(styles.expandless, craftExpand && styles.expandlessRotate)} onClick={handleToggleCraft}>
              <ExpandLess />
            </IconButton>
          </div>
          <Collapse in={craftExpand}>
            {equipCraft && (
              <div className={styles.craftList}>
                {equipCraft.craft_data.map(renderCraftItem)}
              </div>
            )}
            {uniqueCraft && (
              <div className={styles.uniqueCraftList}>
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
                        {'Lv' + item[0]}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Collapse>
        </div>
      )}
      <Fade in={search.size > 0}>
        <div className={clsx(search.size < 1 && styles.hidden)}>
          <div className={clsx(styles.paper, styles.labelBox)}>
            <div className={styles.label}>入手場所</div>
            <div className={styles.types}>
              {(['N', 'H', 'VH', 'S'] as const).map(value => {
                const id = 'equip-detail-types-' + value;
                return (
                  <Fragment key={value}>
                    <QuestLabel type={value} component="label" htmlFor={id} />
                    <Checkbox id={id} className={styles.checkbox} value={value} checked={types.indexOf(value) > -1} onChange={handleChangeTypes} />
                  </Fragment>
                );
              })}
              <label className={styles.sortLabel} htmlFor="equip-detail-sort">{sort === 'asc' ? '昇順' : '降順'}</label>
              <IconButton
                id="equip-detail-sort"
                className={clsx(styles.sort, sort === 'asc' && styles.sortRotate)}
                color="secondary"
                onClick={handleToggleSort}
              >
                <SortRounded />
              </IconButton>
            </div>
          </div>
          <QuestDropList sort={sort} search={search} rangeTypes={types} />
        </div>
      </Fade>
    </>
  );
}

export default EquipDetail;
