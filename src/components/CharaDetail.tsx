import React, { useState, useCallback, useMemo, useContext, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CharaBaseInfo from './CharaBaseInfo';
import CharaUserProfile from './CharaUserProfile';
import CharaSkill from './CharaSkill';
import CharaEquip from './CharaEquip';
import CharaStory from './CharaStory';
import CharaStatus from './CharaStatus';
import CharaProfile from './CharaProfile';
import { DBHelperContext } from './PCRDBProvider';
import { CharaDetailData } from '../DBHelper';
import { EquipEnhanceStatus } from '../DBHelper/promotion';
import { PromotionStatusData } from '../DBHelper/promotion_status';
import { SkillEnhanceStatus } from '../DBHelper/skill';
import { PCRStoreValue } from '../db';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
  },
  tabpanel: {
    backgroundColor: '#fff',
  },
  infoBox: {
    display: 'flex',
    flexFlow: 'wrap',
  },
  tabs: {
    margin: '0.25em 0',
    backgroundColor: '#fff',
  },
  text: {
    padding: '0.5em 0',
    lineHeight: 1.8,
    textAlign: 'center',
  },
  comment: {},
  catchCopy: {},
  selfText: {},
});

interface CharaDetailProps {
  unitID: number;
}

// TODO 实现用户可编辑userProfile功能
function CharaDetail(props: CharaDetailProps) {
  const styles = useStyles();
  const dbHelper = useContext(DBHelperContext);
  const userProfileRef = useRef<PCRStoreValue<'user_profile'>>();
  const [detail, setDetail] = useState<CharaDetailData>();

  useEffect(() => {
    if (dbHelper) dbHelper.getCharaDetailData(props.unitID).then(detailData => {
      if (detailData) {
        userProfileRef.current = detailData.userProfile;
        setDetail(detailData);
      }
    });
  }, [dbHelper, props.unitID]);

  const [tabsValue, setTabsValue] = useState(0);
  const handleChangeTabsValue = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  }, []);

  const handleChangeRarity = useCallback((rarity: number) => {
    if (dbHelper && detail) dbHelper.getRarityData(detail.charaData.unit_id, rarity).then(rarityData => {
      detail.userProfile.rarity = rarity;
      detail.propertyData[0] = rarityData;
      setDetail({ ...detail });
    });
  }, [dbHelper, detail]);

  const handleChangeLevel = useCallback((level: number) => {
    if (detail) {
      const skill_enhance_status = detail.userProfile.skill_enhance_status;
      skill_enhance_status['ub'] = level;
      skill_enhance_status[1] = level;
      skill_enhance_status[2] = level;
      skill_enhance_status['ex'] = level;
      detail.userProfile.level = level;
      setDetail({ ...detail });
    }
  }, [detail]);

  const handleChangeLove = useCallback((loveLevel: number, charaID: number) => {
    if (detail) {
      const love_level_status = { ...detail.userProfile.love_level_status };
      love_level_status[charaID] = loveLevel;
      detail.userProfile.love_level_status = love_level_status;
      setDetail({ ...detail });
    }
  }, [detail]);

  const handleChangeUnique = useCallback((unique_enhancle_level: number) => {
    if (detail) {
      detail.userProfile.unique_enhance_level = unique_enhancle_level;
      setDetail({ ...detail });
    }
  }, [detail]);

  const handleChangeSkill = useCallback((level: number, skillKey: keyof SkillEnhanceStatus) => {
    if (detail) {
      detail.userProfile.skill_enhance_status[skillKey] = level;
      setDetail({ ...detail });
    }
  }, [detail]);

  const handleChangePromotion = useCallback((promotion_level: number) => {
    if (!detail) return;
    const _change = (promotionStatusData: PromotionStatusData) => {
      const promotionData = detail.promotions.find(item => item.promotion_level === promotion_level)!;
      const equip_enhance_status: EquipEnhanceStatus = {};
      for (let slot of promotionData.equip_slots) {
        if (slot) equip_enhance_status[slot.equipment_id] = slot.max_enhance_level;
      }
      detail.userProfile.equip_enhance_status = equip_enhance_status;
      detail.userProfile.promotion_level = promotion_level;
      detail.propertyData[1] = promotionStatusData;
      detail.propertyData[2] = promotionData;
      setDetail({ ...detail });
    };
    if (promotion_level > 1 && dbHelper) {
      dbHelper.getPromotionStatusData(detail.charaData.unit_id, promotion_level).then(promotionStatusData => {
        _change(promotionStatusData);
      });
    } else {
      const promotionStatusData = {
        getProperty() { return {}; }
      } as any;
      _change(promotionStatusData);
    }
  }, [dbHelper, detail]);

  const property = useMemo(() => detail && detail.getProperty(), [detail]);

  const detailMemo = useMemo(() => ({
    baseInfo: (
      <CharaBaseInfo
        rarity={detail && detail.userProfile.rarity}
        charaData={detail && detail.charaData}
      />
    ),
    comment: (
      <div className={clsx(styles.text, styles.comment)}>
        {(detail ? detail.charaData.comment : ' \n \n ').split('\n').map((txt, i) => (
          <React.Fragment key={i}>{txt}<br /></React.Fragment>
        ))}
      </div>
    ),
    catchCopy: (
      <div className={clsx(styles.text, styles.catchCopy)}>
        {detail ? detail.unitProfile.catch_copy : '???'}
      </div>
    ),
    selfText: (
      <div className={clsx(styles.text, styles.selfText)}>
        {(detail ? detail.unitProfile.self_text : '???').split('\n').map((txt, i) => (
          <React.Fragment key={i}>{txt}<br /></React.Fragment>
        ))}
      </div>
    ),
    profile: (
      <div className={styles.infoBox}>
        <CharaProfile profile={detail && detail.unitProfile} />
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [detail]);

  const userProfileMemo = useMemo(() => ({
    userProfile: (
      <CharaUserProfile
        maxRarity={detail && detail.charaData.max_rarity}
        userProfile={detail && detail.userProfile}
        onChangeRarity={handleChangeRarity}
        onChangeLevel={handleChangeLevel}
        onChangeLove={handleChangeLove}
        onChangeUnique={handleChangeUnique}
        onChangePromotion={handleChangePromotion}
      />
    ),
    skill: (
      <CharaSkill
        atkType={detail && detail.charaData.atk_type}
        atkCastTime={detail && detail.charaData.normal_atk_cast_time}
        property={property}
        unitSkillData={detail && detail.unitSkillData}
        userProfile={detail && detail.userProfile}
        onChangeSkill={handleChangeSkill}
      />
    ),
    equip: (
      <CharaEquip
        maxRarity={detail && detail.charaData.max_rarity}
        promotions={detail && detail.promotions}
        uniqueEquip={detail && detail.propertyData[4]}
        userProfile={detail && detail.userProfile}
        onChangeUnique={handleChangeUnique}
        onChangePromotion={handleChangePromotion}
      />
    ),
    story: (
      <CharaStory
        storyStatus={detail && detail.propertyData[3]}
        userProfile={detail && detail.userProfile}
        onChangeLove={handleChangeLove}
      />
    ),
    status: (
      <div className={styles.infoBox}>
        <CharaStatus property={property} />
      </div>
    ),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [detail, detail && detail.userProfile]);

  const tabsValueMemo = useMemo(() => ({
    tabs: (
      <Tabs
        className={styles.tabs}
        variant="scrollable"
        textColor="secondary"
        indicatorColor="secondary"
        value={tabsValue}
        onChange={handleChangeTabsValue}
      >
        <Tab label="スキル" />
        <Tab label="ランク" />
        <Tab label="ストーリー" />
        <Tab label="ステータス" />
        <Tab label="プロフィール" />
      </Tabs>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [tabsValue]);

  return (
    <div className={styles.root}>
      {detailMemo.baseInfo}
      {userProfileMemo.userProfile}
      {tabsValueMemo.tabs}
      <div className={styles.tabpanel} role="tabpanel" hidden={tabsValue !== 0}>
        {userProfileMemo.skill}
      </div>
      <div className={styles.tabpanel} role="tabpanel" hidden={tabsValue !== 1}>
        {userProfileMemo.equip}
      </div>
      <div className={styles.tabpanel} role="tabpanel" hidden={tabsValue !== 2}>
        {userProfileMemo.story}
      </div>
      <div className={styles.tabpanel} role="tabpanel" hidden={tabsValue !== 3}>
        {userProfileMemo.status}
        {detailMemo.comment}
      </div>
      <div className={styles.tabpanel} role="tabpanel" hidden={tabsValue !== 4}>
        {detailMemo.profile}
        {detailMemo.catchCopy}
        {detailMemo.selfText}
      </div>
    </div>
  );
}

export default CharaDetail;
