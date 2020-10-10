import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import SkeletonImage from './SkeletonImage';
import { AttackPattern, SkillData, UnitSkillData, SkillEnhanceStatus } from '../DBHelper/skill';
import { getPublicImageURL } from '../DBHelper/helper';
import { Property } from '../DBHelper/property';
import { PCRStoreValue } from '../db';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 0.375,
    iconSize = 128 * scalage / rem,
    borderRadius = 12 * scalage / rem,
    labelSize = 1.5;

  return {
    root: {
      padding: '0.25em',
    },
    item: {
      padding: '0.5em 0',
    },
    label: {
      display: 'inline-block',
      padding: '0 0.5em',
      lineHeight: 1.5,
      borderRadius: '0.25em',
      color: '#fff',
      backgroundColor: theme.palette.primary.dark,
    },
    patternBox: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: '0.25em 0',
      justifyContent: 'flex-start',
    },
    patternItem: {
      marginRight: '0.5em',
      lineHeight: '1rem',
      textAlign: 'center',
      wordBreak: 'keep-all',
      overflow: 'hidden',
      // fontFamily: '"Helvetica", "Arial", sans-serif',
    },
    loopLabel: {
      width: iconSize + 'rem',
      height: '1rem',
      fontSize: '0.75rem',
      color: theme.palette.secondary.dark,
    },
    patternLabel: {
      width: iconSize + 'rem',
      height: '1rem',
      fontSize: '0.75rem',
      color: theme.palette.primary.dark,
    },
    infoBox: {
      display: 'flex',
      padding: '0.25em 0',
    },
    imgRoot: {
      width: iconSize + 'rem',
      height: iconSize + 'rem',
      borderRadius: borderRadius + 'rem',
    },
    nameBox: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      flexGrow: 1,
      margin: '0.25em',
    },
    name: {
      fontSize: '1.2em',
    },
    castTime: {
      color: theme.palette.grey[600],
    },
    skillDesc: {
      wordBreak: 'break-all',
    },
    actionLabel: {
      margin: '0.5em 0 0.25em 0',
      color: theme.palette.grey[600],
    },
    actionList: {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
    },
    actionItem: {
      position: 'relative',
      margin: '0.25em 0',
      paddingLeft: (labelSize + 0.25) + 'em',
      lineHeight: labelSize + 'em',
      wordBreak: 'break-all',
    },
    actionItemLabel: {
      display: 'inline-block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: labelSize + 'em',
      height: labelSize + 'em',
      fontFamily: '"Arial","Microsoft YaHei",sans-serif',
      fontWeight: 700,
      textAlign: 'center',
      color: '#fff',
      backgroundColor: theme.palette.grey[600],
      clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
    },
  };
});

interface PatternItemProps {
  label: string;
  data: UnitSkillData;
  atkType: number;
  pattern: AttackPattern;
}

interface SkillItemProps {
  label: string;
  data: SkillData;
  skillLevel: number;
}

interface CharaSkillProps {
  atkType?: number;
  property?: Property;
  charaSkill?: UnitSkillData;
  userProfile?: PCRStoreValue<'user_profile'>;
}

function CharaSkill(props: CharaSkillProps) {
  const { atkType, property, charaSkill, userProfile = {} as Partial<PCRStoreValue<'user_profile'>> } = props;
  const { skill_enhance_status = { ub: 1, 1: 1, 2: 1, ex: 1 } } = userProfile;
  const styles = useStyles();

  if (!charaSkill || !atkType || !property) return null;
  console.log(charaSkill);

  const getPatternItem = ({ label, data, atkType, pattern }: PatternItemProps) => {
    const getItemData = (atkItem: number, index: number) => {
      let loopLabel = index + 1 === pattern.loop_start ? 'START' : index + 1 === pattern.loop_end ? 'END' : '';
      let imgSrc = '';
      let patternLabel = '';
      if (atkItem === 1) {
        imgSrc = getPublicImageURL('equipment', atkType === 1 ? '101011' : '101251');
        patternLabel = 'A';
      } else {
        let iconType: number;
        const i = atkItem % 10;
        if (atkItem < 2000) {
          iconType = data.main_skill[i - 1].icon_type;
          patternLabel = 'Main' + i;
        } else {
          iconType = data.sp_skill[i - 1].icon_type;
          patternLabel = 'SP' + i;
        }
        imgSrc = getPublicImageURL('skill', iconType);
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

  const getSkillItem = ({ label, data, skillLevel }: SkillItemProps) => (
    <div key={label} className={styles.item}>
      <div className={styles.label}>{label}</div>
      <div className={styles.infoBox}>
        <SkeletonImage classes={{ root: styles.imgRoot }} src={getPublicImageURL('skill', data.icon_type)} save />
        <div className={styles.nameBox}>
          <span className={styles.name}>{data.name}</span>
          <span className={styles.castTime}>待機時間：{data.skill_cast_time}s</span>
        </div>
      </div>
      <div className={styles.skillDesc}>{data.description}</div>
      <div className={styles.actionLabel}>スキルアクション</div>
      <ol className={styles.actionList}>
        {data.action.map((item, i) => (
          <li key={item.action_id} className={styles.actionItem}>
            <span className={styles.actionItemLabel}>{i + 1}</span>
            {item.getDescription(skillLevel, property)}
          </li>
        ))}
      </ol>
    </div>
  );
  const skillList: SkillItemProps[] = [];
  skillList.push({ label: 'UB', data: charaSkill.union_burst, skillLevel: skill_enhance_status['ub'] });
  if (charaSkill.union_burst_evolution) {
    skillList.push({ label: 'UB+', data: charaSkill.union_burst_evolution, skillLevel: skill_enhance_status['ub'] });
  }
  const pushItem = (label: string, normal: SkillData[], evolution: SkillData[], ex?: boolean) => {
    const len = normal.length;
    for (let i = 0; i < len; i++) {
      const n = i + 1;
      const skillLevel = ex ? skill_enhance_status['ex'] : (skill_enhance_status[n as keyof SkillEnhanceStatus] || skill_enhance_status['ub']);
      skillList.push({
        label: label + n,
        data: normal[i],
        skillLevel,
      });
      const evItem = evolution[i];
      if (evItem) {
        skillList.push({
          label: label + n + '+',
          data: evItem,
          skillLevel,
        });
      }
    }
  };
  pushItem('Main', charaSkill.main_skill, charaSkill.main_skill_evolution);
  pushItem('SP', charaSkill.sp_skill, charaSkill.sp_skill_evolution);
  pushItem('EX', charaSkill.ex_skill, charaSkill.ex_skill_evolution, true);

  return (
    <div className={styles.root}>
      {charaSkill.attack_pattern.map((item, i) => (
        getPatternItem({ label: '攻撃パターン' + (i + 1), data: charaSkill, atkType, pattern: item })
      ))}
      {skillList.map(item => (
        <React.Fragment key={item.label}>
          <Divider />
          {getSkillItem(item)}
        </React.Fragment>
      ))}
    </div>
  );
}

export default CharaSkill;
