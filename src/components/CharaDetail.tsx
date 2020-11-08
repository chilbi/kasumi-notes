import React, { Fragment, useContext, useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Clear from '@material-ui/icons/Clear';
import Done from '@material-ui/icons/Done';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import CharaBaseInfo from './CharaBaseInfo';
import CharaUserProfile from './CharaUserProfile';
import CharaSkill from './CharaSkill';
import CharaEquip from './CharaEquip';
import CharaStory from './CharaStory';
import CharaStatus from './CharaStatus';
import CharaProfile from './CharaProfile';
import { DBHelperContext, CharaDetailContext, CharaListContext } from './Contexts';
import { EquipEnhanceStatus } from '../DBHelper/promotion';
import { SkillEnhanceStatus } from '../DBHelper/skill';
import { deepClone, equal } from '../DBHelper/helper';
import { PCRStoreValue } from '../db';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  return {
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
    subtitle: {
      flexGrow: 1,
      textAlign: 'center',
      ...theme.typography.h6,
    },
    hidden: {
      display: 'none',
    },
  };
});

interface CharaDetailProps {
  unitID: number;
}

function CharaDetail(props: CharaDetailProps) {
  const styles = useStyles();

  const navigate = useNavigate();

  const dbHelper = useContext(DBHelperContext);
  const [charaList, setCharaList] = useContext(CharaListContext);
  const [charaDetail, setDetail] = useContext(CharaDetailContext);
  const detail = charaDetail && charaDetail.charaData.unit_id === props.unitID ? charaDetail : undefined

  const userProfileRef = useRef<PCRStoreValue<'user_profile'>>();
  if (!userProfileRef.current && charaDetail) {
    userProfileRef.current = deepClone(charaDetail.userProfile);
  }

  useEffect(() => {
    if (dbHelper && (!charaDetail || charaDetail.charaData.unit_id !== props.unitID)) {
      const base = charaList && charaList.find(item => item.charaData.unit_id === props.unitID);
      dbHelper.getCharaDetailData(props.unitID, base).then(detailData => {
        if (detailData) {
          userProfileRef.current = deepClone(detailData.userProfile);
          setDetail(detailData);
        }
      });
    }
  }, [dbHelper, charaDetail, setDetail, props.unitID, charaList]);

  const [tabsValue, setTabsValue] = useState(0);
  const handleChangeTabsValue = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  }, []);

  const handleSaveUserProfile = useCallback(() => {
    if (dbHelper && detail) dbHelper.setUserProfile(detail.userProfile).then(() => {
      userProfileRef.current = deepClone(detail.userProfile);
      setCharaList((prevCharaList = []) => prevCharaList.map(item => {
        if (item.userProfile.unit_id === props.unitID) {
          item.userProfile = userProfileRef.current!;
        }
        return item;
      }));
    });
  }, [dbHelper, detail, props.unitID, setCharaList]);

  const handleChangeRarity = useCallback((rarity: number) => {
    if (dbHelper && rarity > 0) dbHelper.getRarityData(props.unitID, rarity).then(rarityData => {
      setDetail(prevDetail => {
        if (prevDetail) {
          prevDetail.userProfile.rarity = rarity;
          prevDetail.propertyData[0] = rarityData;
          return { ...prevDetail };
        }
      });
    });
  }, [dbHelper, setDetail, props.unitID]);

  const handleChangeLevel = useCallback((level: number) => {
    setDetail(prevDetail => {
      if (prevDetail) {
        const skill_enhance_status = prevDetail.userProfile.skill_enhance_status;
        skill_enhance_status['ub'] = level;
        skill_enhance_status[1] = level;
        skill_enhance_status[2] = level;
        skill_enhance_status['ex'] = level;
        prevDetail.userProfile.level = level;
        return { ...prevDetail };
      }
    });
  }, [setDetail]);

  const handleChangeLove = useCallback((loveLevel: number, charaID: number) => {
    setDetail(prevDetail => {
      if (prevDetail) {
        const love_level_status = { ...prevDetail.userProfile.love_level_status };
        love_level_status[charaID] = loveLevel;
        prevDetail.userProfile.love_level_status = love_level_status;
        return { ...prevDetail };
      }
    });
  }, [setDetail]);

  const handleChangeEquip = useCallback((equip_enhance_level: number, i: number) => {
    setDetail(prevDetail => {
      if (prevDetail) {
        const equip_enhance_status = { ...prevDetail.userProfile.equip_enhance_status };
        equip_enhance_status[i] = equip_enhance_level;
        prevDetail.userProfile.equip_enhance_status = equip_enhance_status;
        return { ...prevDetail };
      }
    });
  }, [setDetail]);

  const handleChangeUnique = useCallback((unique_enhancle_level: number) => {
    setDetail(prevDetail => {
      if (prevDetail) {
        prevDetail.userProfile.unique_enhance_level = unique_enhancle_level;
        return { ...prevDetail };
      }
    });
  }, [setDetail]);

  const handleChangeSkill = useCallback((level: number, skillKey: keyof SkillEnhanceStatus) => {
    setDetail(prevDetail => {
      if (prevDetail) {
        const skill_enhance_status = { ...prevDetail.userProfile.skill_enhance_status };
        skill_enhance_status[skillKey] = level;
        prevDetail.userProfile.skill_enhance_status = skill_enhance_status;
        return { ...prevDetail };
      }
    });
  }, [setDetail]);

  const handleChangePromotion = useCallback((promotion_level: number) => {
    if (dbHelper) dbHelper.getPromotionStatusData(props.unitID, promotion_level).then(promotionStatusData => {
      setDetail(prevDetail => {
        if (prevDetail) {
          const promotionData = prevDetail.promotions.find(item => item.promotion_level === promotion_level)!;
          const equip_enhance_status: EquipEnhanceStatus = {};
          for (let i = 0; i < 6; i++) {
            const slot = promotionData.equip_slots[i];
            if (slot) equip_enhance_status[i] = slot.max_enhance_level;
          }
          prevDetail.userProfile.equip_enhance_status = equip_enhance_status;
          prevDetail.userProfile.promotion_level = promotion_level;
          prevDetail.propertyData[1] = promotionStatusData;
          prevDetail.propertyData[2] = promotionData;
          return { ...prevDetail };
        }
      });
    });
  }, [dbHelper, setDetail, props.unitID]);

  const property = useMemo(() => detail && detail.getProperty(), [detail]);

  const detailMemo = useMemo(() => ({
    baseInfo: (
      <CharaBaseInfo
        rarity={detail && detail.userProfile.rarity}
        position={detail && detail.getPosition()}
        charaData={detail && detail.charaData}
      />
    ),
    comment: (
      <div className={styles.text}>
        {(detail ? detail.charaData.comment : ' \n \n ').split('\n').map((txt, i) => (
          <Fragment key={i}>{txt}<br /></Fragment>
        ))}
      </div>
    ),
    catchCopy: (
      <div className={styles.text}>
        {detail ? detail.unitProfile.catch_copy : '???'}
      </div>
    ),
    selfText: (
      <div className={styles.text}>
        {(detail ? detail.unitProfile.self_text : '???').split('\n').map((txt, i) => (
          <Fragment key={i}>{txt}<br /></Fragment>
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
        onChangeEquip={handleChangeEquip}
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
  
  const isEqual = useMemo(() => {
    return detail ? equal(userProfileRef.current, detail.userProfile) : true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileRef.current, detail]);

  const handleBack = useCallback(() => {
    if (!isEqual) {
      setDetail(prevDetail => {
        if (prevDetail && userProfileRef.current) {
          prevDetail.userProfile = deepClone(userProfileRef.current);
          return { ...prevDetail };
        }
      });
    } else {
      navigate(-1);
    }
  }, [isEqual, setDetail, navigate]);

  const header = useMemo(() => (
    <Header>
      <IconButton color={isEqual ? 'primary' : 'secondary'} onClick={handleBack}>
        {isEqual ? <ArrowBack /> : <Clear />}
      </IconButton>
      <h6 className={styles.subtitle}>キャラ詳細</h6>
      <IconButton
        color="secondary"
        disabled={isEqual}
        onClick={handleSaveUserProfile}
      >
        <Done />
      </IconButton>
    </Header>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [isEqual, handleBack, handleSaveUserProfile]);

  const tabs = useMemo(() => (
    <Tabs
      className={styles.tabs}
      variant="scrollable"
      scrollButtons={true}
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [tabsValue]);

  return (
    <>
      {header}
      {detailMemo.baseInfo}
      {userProfileMemo.userProfile}
      {tabs}
      <div className={clsx(styles.tabpanel, tabsValue !== 0 && styles.hidden)} role="tabpanel">
        {userProfileMemo.skill}
      </div>
      <div className={clsx(styles.tabpanel, tabsValue !== 1 && styles.hidden)} role="tabpanel">
        {userProfileMemo.equip}
      </div>
      <div className={clsx(styles.tabpanel, tabsValue !== 2 && styles.hidden)} role="tabpanel">
        {userProfileMemo.story}
      </div>
      <div className={clsx(styles.tabpanel, tabsValue !== 3 && styles.hidden)} role="tabpanel">
        {userProfileMemo.status}
        {detailMemo.comment}
      </div>
      <div className={clsx(styles.tabpanel, tabsValue !== 4 && styles.hidden)} role="tabpanel">
        {detailMemo.profile}
        {detailMemo.catchCopy}
        {detailMemo.selfText}
      </div>
    </>
  );
}

export default CharaDetail;
