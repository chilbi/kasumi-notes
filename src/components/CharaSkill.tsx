import { Fragment } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import SkeletonImage from './SkeletonImage';
import PopoverSlider from './PopoverSlider';
import { marks } from './DebouncedSlider';
import { AttackPattern, SkillData, UnitSkillData, SkillEnhanceStatus } from '../DBHelper/skill';
import { DescData } from '../DBHelper/skill_action';
import { getPublicImageURL } from '../DBHelper/helper';
import maxUserProfile from '../DBHelper/maxUserProfile';
import { Property } from '../DBHelper/property';
import { state } from '../DBHelper/state';
import { PCRStoreValue } from '../db';
import Big from 'big.js';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    iconSize = Big(128).times(scalage).div(rem),
    borderRadius = Big(12).times(scalage).div(rem),
    descObjSize = Big(1.25);

  return {
    root: {
      padding: theme.spacing(1),
    },
    item: {
      padding: theme.spacing(2, 0),
    },
    flexBox: {
      display: 'flex',
      alignItems: 'center',
      margin: theme.spacing(1, 0),
    },
    label: {
      display: 'inline-block',
      padding: theme.spacing(0, 2),
      lineHeight: 1.5,
      borderRadius: '0.25rem',
      color: '#fff',
      backgroundColor: theme.palette.primary.dark,
    },
    level: {
      display: 'inline-block',
      margin: theme.spacing(0, 1, 0, 'auto'),
      width: '3.5rem',
      paddingLeft: theme.spacing(1),
      lineHeight: 1.5,
      color: theme.palette.secondary.main,
    },
    patternBox: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: theme.spacing(1, 0),
      justifyContent: 'flex-start',
    },
    patternItem: {
      margin: theme.spacing(0, 1, 1, 0),
      lineHeight: '1rem',
      textAlign: 'center',
      wordBreak: 'keep-all',
      overflow: 'hidden',
    },
    loopLabel: {
      width: iconSize + 'rem',
      height: '1rem',
      fontSize: '0.625em',
      color: theme.palette.secondary.dark,
    },
    patternLabel: {
      width: iconSize + 'rem',
      height: '1rem',
      fontSize: '0.625em',
      color: theme.palette.primary.dark,
    },
    imgRoot: {
      width: iconSize + 'rem',
      height: iconSize + 'rem',
      borderRadius: borderRadius + 'rem',
    },
    nameBox: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginLeft: theme.spacing(1),
    },
    name: {
      fontSize: '1.1em',
    },
    castTime: {
      color: theme.palette.grey[600],
    },
    skillDesc: {
      wordBreak: 'break-all',
    },
    actionLabel: {
      margin: theme.spacing(2, 0, 1, 0),
      color: theme.palette.grey[600],
    },
    actionList: {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
    },
    actionItem: {
      position: 'relative',
      margin: theme.spacing(1, 0),
      paddingLeft: descObjSize.plus(0.25) + 'rem',
      lineHeight: descObjSize + 'rem',
      wordBreak: 'break-all',
    },
    actionNum: {
      display: 'inline-block',
      width: descObjSize + 'rem',
      height: descObjSize + 'rem',
      fontFamily: 'sans-serif',
      fontWeight: 700,
      textAlign: 'center',
      borderRadius: '50%',
      color: '#fff',
      backgroundColor: theme.palette.grey[600],
      clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
    },
    stateRoot: {
      position: 'relative',
      display: 'inline-block',
      width: descObjSize + 'rem',
      height: '1rem',
    },
    stateImg: {
      position: 'absolute',
      top: descObjSize.minus(1).div(-2) + 'rem',
      left: 0,
      width: descObjSize + 'rem',
      height: descObjSize + 'rem',
    },
    formula: {
      padding: theme.spacing(0, 1),
      color: theme.palette.primary.main,
      wordBreak: 'inherit',
    },
    absolute0: {
      zIndex: 0,
      position: 'absolute',
      top: 0,
      left: 0,
    },
  };
});

interface PatternItemProps {
  label: string;
  pattern: AttackPattern;
}

interface SkillItemProps {
  label: string;
  skillData: SkillData;
  skillKey: keyof SkillEnhanceStatus;
}

interface CharaSkillProps {
  atkType?: number;
  atkCastTime?: number;
  property?: Property<Big>;
  unitSkillData?: UnitSkillData;
  userProfile?: PCRStoreValue<'user_profile'>;
  onChangeSkill: (level: number, skillKey: keyof SkillEnhanceStatus) => void;
}

function CharaSkill(props: CharaSkillProps) {
  const { atkType, atkCastTime, property, unitSkillData, userProfile = maxUserProfile, onChangeSkill } = props;
  const { skill_enhance_status, unique_enhance_level } = userProfile;
  const styles = useStyles();

  if (!unitSkillData || !atkType || !atkCastTime || !property)
    return <LinearProgress color="secondary" />;
  // console.log(unitSkillData);
  const atkData = atkType === 1
    ? {
      name: '物理',
      src: getPublicImageURL('icon_equipment', '101011'),
      damege: property.atk,
    }
    : {
      name: '魔法',
      src: getPublicImageURL('icon_equipment', '101251'),
      damege: property.magic_str,
    };

  const getPatternItem = ({ label, pattern }: PatternItemProps) => {
    const getItemData = (atkItem: number, index: number) => {
      let loopLabel = index + 1 === pattern.loop_start ? 'START' : index + 1 === pattern.loop_end ? 'END' : '';
      let imgSrc = '';
      let patternLabel = '';
      if (atkItem === 1) {
        imgSrc = atkData.src;
        patternLabel = 'A';
      } else {
        let iconType: number;
        const i = atkItem % 10;
        if (atkItem < 2000) {
          iconType = unitSkillData.main_skill[i - 1].icon_type;
          patternLabel = 'Main' + i;
        } else {
          iconType = unitSkillData.sp_skill[i - 1].icon_type;
          patternLabel = 'SP' + i;
        }
        if (i === 1 && unique_enhance_level > 0) {
          patternLabel += '+';
        }
        imgSrc = getPublicImageURL('icon_skill', iconType);
      }
      return {
        loopLabel,
        imgSrc,
        patternLabel,
      };
    };
    return (
      <div key={label} className={styles.item}>
        <div className={styles.label}>{label}</div>
        <div className={styles.patternBox}>
          {pattern.atk_pattern.map((item, i) => {
            const { loopLabel, imgSrc, patternLabel } = getItemData(item, i);
            return (
              <div key={i} className={styles.patternItem}>
                <div className={styles.loopLabel}>{loopLabel}</div>
                <SkeletonImage classes={{ root: styles.imgRoot }} src={imgSrc} save />
                <div className={styles.patternLabel}>{patternLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDesc = (descData: DescData, key: number): React.ReactNode => {
    if (Array.isArray(descData)) {
      return descData.map((item, i) => renderDesc(item, i));
    } else {
      if (typeof descData === 'object') {
        switch (descData.type) {
          case 'formula':
            let desc: React.ReactNode ;
            const _value = descData.value.toString();
            const match = _value.match(/{(\d+)}/);
            if (match) {
              const stateID = parseInt(match[1]);
              const arr = _value.split(match[0]);
              desc = (
                <Fragment key={stateID}>
                  {arr[0]}
                  {renderDesc({ type: 'state', value: stateID }, stateID)}
                  {arr[1]}
                </Fragment>
              );
            } else {
              desc = _value;
            }
            return (
              <span key={key} className={styles.formula}>[{desc}]</span>
            );
          case 'action':
            return (
              <Fragment key={key}>
                {'「アクション'}
                <span className={styles.actionNum}>{descData.value}</span>
                {'」'}
              </Fragment>
            );
          case 'state':
            return (
              <Fragment key={key}>
                {state[descData.value as number]}
                <span className={styles.stateRoot}>
                  <SkeletonImage classes={{ img: styles.stateImg }} src={getPublicImageURL('icon_state', descData.value)} save onlyImg />
                </span>
              </Fragment>
            );
        }
      }
      return descData;
    }
  };

  const getSkillItem = ({ label, skillData, skillKey }: SkillItemProps) => {
    const skillLevel = skill_enhance_status[skillKey];
    return (
      <div key={label} className={styles.item}>
        <div className={styles.flexBox}>
          <div className={styles.label}>{label}</div>
          <PopoverSlider 
            classes={{ button: styles.level }}
            position="left"
            marks={marks.level}
            min={1}
            max={maxUserProfile.level}
            defaultValue={skillLevel}
            onDebouncedChange={value => onChangeSkill(value, skillKey)} 
          >
            <span>{'Lv' + skillLevel}</span>
          </PopoverSlider>
        </div>
        <div className={styles.flexBox}>
          <SkeletonImage classes={{ root: styles.imgRoot }} src={getPublicImageURL('icon_skill', skillData.icon_type)} save />
          <div className={styles.nameBox}>
            <span className={styles.name}>{skillData.name}</span>
            <span className={styles.castTime}>待機時間：{skillData.skill_cast_time}s</span>
          </div>
        </div>
        <div className={styles.skillDesc}>{skillData.description}</div>
        <div className={styles.actionLabel}>スキルアクション</div>
        <ol className={styles.actionList}>
          {skillData.action.map((item, i) => (
            <li key={item.action_id} className={styles.actionItem}>
              <span className={clsx(styles.actionNum, styles.absolute0)}>{i + 1}</span>
              {renderDesc(item.getDescData(skillLevel, property, skillData.action), item.action_id)}
            </li>
          ))}
        </ol>
      </div>
    );
  };
  const skillList: SkillItemProps[] = [];
  skillList.push({ label: 'UB', skillData: unitSkillData.union_burst, skillKey: 'ub' });
  if (unitSkillData.union_burst_evolution) {
    skillList.push({ label: 'UB+', skillData: unitSkillData.union_burst_evolution, skillKey: 'ub' });
  }
  const pushItem = (label: string, normal: SkillData[], evolution: SkillData[], key?: keyof SkillEnhanceStatus) => {
    const len = normal.length;
    const isOneEX = key === 'ex' && len === 1 && evolution.length === 1;
    for (let i = 0; i < len; i++) {
      const n = i + 1;
      const skillKey = key || n as keyof SkillEnhanceStatus;
      const renameLabel = label + (isOneEX ? '' : n);
      skillList.push({
        label: renameLabel,
        skillData: normal[i],
        skillKey,
      });
      const evItem = evolution[i];
      if (evItem) {
        skillList.push({
          label: renameLabel + '+',
          skillData: evItem,
          skillKey,
        });
      }
    }
  };
  pushItem('Main', unitSkillData.main_skill, unitSkillData.main_skill_evolution);
  if (unitSkillData.sp_union_burst) {
    skillList.push({ label: 'SPUB', skillData: unitSkillData.sp_union_burst, skillKey: 'ub' });
  }
  pushItem('SP', unitSkillData.sp_skill, unitSkillData.sp_skill_evolution, 'ub');
  pushItem('EX', unitSkillData.ex_skill, unitSkillData.ex_skill_evolution, 'ex');

  return (
    <div className={styles.root}>
      {unitSkillData.attack_pattern.map((item, i, arr) => (
        <Fragment key={i}>
          {getPatternItem({ label: '行動パターン' + (arr.length > 1 ? (i + 1) : ''), pattern: item })}
          <Divider />
        </Fragment>
      ))}
      <div key="A" className={styles.item}>
        <div className={styles.label}>A</div>
        <div className={styles.flexBox}>
          <SkeletonImage classes={{ root: styles.imgRoot }} src={atkData.src} save />
          <div className={styles.nameBox}>
            <span className={styles.name}>{atkData.name}通常攻撃</span>
            <span className={styles.castTime}>待機時間：{atkCastTime}s</span>
          </div>
        </div>
        <div className={styles.skillDesc}>敵単体に{atkData.damege.round(0, 1).toString()}の{atkData.name}ダメージを与える。</div>
      </div>
      {skillList.map(item => (
        <Fragment key={item.label}>
          <Divider />
          {getSkillItem(item)}
        </Fragment>
      ))}
    </div>
  );
}

export default CharaSkill;
