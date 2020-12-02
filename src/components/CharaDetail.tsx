import { Fragment, useContext, useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Clear from '@material-ui/icons/Clear';
import Done from '@material-ui/icons/Done';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import CharaStillImage from './CharaStillImage';
import CharaBaseInfo from './CharaBaseInfo';
import CharaUserProfile from './CharaUserProfile';
import CharaSkill from './CharaSkill';
import CharaEquip from './CharaEquip';
import CharaStory from './CharaStory';
import CharaStatus from './CharaStatus';
import CharaProfile from './CharaProfile';
import { DBHelperContext, CharaDetailContext, CharaListContext } from './Contexts';
import useQuery from '../hooks/useQuery';
import { EquipEnhanceStatus } from '../DBHelper/promotion';
import { SkillEnhanceStatus } from '../DBHelper/skill';
import { deepClone, equal, getParamsUnitID } from '../DBHelper/helper';
import maxUserProfile from '../DBHelper/maxUserProfile';
import { getCharaProperty, PropertyData } from '../DBHelper';
import { PCRStoreValue } from '../db';
import localValue from '../localValue';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  return {
    sticky: {
      zIndex: theme.zIndex.appBar,
      position: 'sticky',
      top: '3rem',
      right: 0,
      bottom: 'auto',
      left: 0,
      backgroundColor: '#fff',
    },
    tabpanel: {
      backgroundColor: '#fff',
    },
    infoBox: {
      display: 'flex',
      flexFlow: 'wrap',
      padding: theme.spacing(1),
    },
    tabs: {
      borderTop: '1px solid ' + theme.palette.grey[100],
      borderBottom: '1px solid ' + theme.palette.grey[100],
    },
    text: {
      padding: theme.spacing(2, 0),
      lineHeight: 1.8,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.h6,
      flexGrow: 1,
      margin: 0,
      fontWeight: 700,
      textAlign: 'center',
    },
    hidden: {
      display: 'none',
    },
  };
});

function CharaDetail() {
  const styles = useStyles();
  const navigate = useNavigate();
  const query = useQuery();
  const unitID = getParamsUnitID(query.get('unit_id') || '0');

  const currUser = useState(() => localValue.app.user.get())[0];

  const dbHelper = useContext(DBHelperContext);
  const [charaList, setCharaList] = useContext(CharaListContext);
  const [charaDetail, setDetail] = useContext(CharaDetailContext);
  const detail = charaDetail && charaDetail.charaData.unit_id === unitID && charaDetail.userProfile.user_name === currUser
    ? charaDetail : undefined;

  const userProfileRef = useRef<PCRStoreValue<'user_profile'>>();
  const propertyDataRef = useRef<PropertyData>();
  if (!userProfileRef.current && charaDetail) {
    userProfileRef.current = deepClone(charaDetail.userProfile);
    propertyDataRef.current = [...charaDetail.propertyData];
  }

  useEffect(() => {
    if (dbHelper && (!charaDetail || charaDetail.charaData.unit_id !== unitID || charaDetail.userProfile.user_name !== currUser)) {
      const base = charaList && charaList.find(item => item.charaData.unit_id === unitID);
      dbHelper.getCharaDetailData(unitID, currUser, base).then(detailData => {
        if (detailData) {
          userProfileRef.current = deepClone(detailData.userProfile);
          propertyDataRef.current = [...detailData.propertyData];
          setDetail(detailData);
        }
      });
    }
  }, [dbHelper, charaDetail, setDetail, unitID, currUser, charaList]);

  const [stillExpand, setStillExpand] = useState(() => localValue.charaBaseInfo.stillExpand.get());
  const handleToggleStillExpand = useCallback(() => {
    setStillExpand(prev => {
      const value = !prev;
      localValue.charaBaseInfo.stillExpand.set(value);
      return value;
    });
  }, []);

  const [tabsValue, setTabsValue] = useState(0);
  const handleChangeTabsValue = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  }, []);

  const handleSaveUserProfile = useCallback(() => {
    if (dbHelper && detail) dbHelper.setUserProfile(detail.userProfile).then(() => {
      userProfileRef.current = deepClone(detail.userProfile);
      propertyDataRef.current = [...detail.propertyData];
      setCharaList((prevCharaList = []) => prevCharaList.map(item => {
        if (item.userProfile.unit_id === unitID) {
          item.userProfile = deepClone(userProfileRef.current!);
          item.propertyData = [...propertyDataRef.current!];
        }
        return item;
      }));
    });
  }, [dbHelper, detail, unitID, setCharaList]);

  const handleChangeRarity = useCallback((rarity: number) => {
    if (dbHelper && rarity > 0) dbHelper.getRarityData(unitID, rarity).then(rarityData => {
      setDetail(prevDetail => {
        if (prevDetail) {
          prevDetail.userProfile.rarity = rarity;
          prevDetail.propertyData[0] = rarityData;
          return { ...prevDetail };
        }
      });
    });
  }, [dbHelper, setDetail, unitID]);

  const handleChangeLevel = useCallback((level: number) => {
    setDetail(prevDetail => {
      if (prevDetail) {
        prevDetail.userProfile.level = level;
        prevDetail.userProfile.skill_enhance_status = {
          ub: level,
          1: level,
          2: level,
          ex: level,
        };
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
    if (dbHelper) dbHelper.getPromotionStatusData(unitID, promotion_level).then(promotionStatusData => {
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
  }, [dbHelper, setDetail, unitID]);

  const property = useMemo(() => detail && detail.getProperty(), [detail]);

  const refProperty = useMemo(() => {
    return userProfileRef.current && propertyDataRef.current && getCharaProperty(userProfileRef.current, propertyDataRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileRef.current, propertyDataRef.current]);

  const isEqual = useMemo(() => {
    return userProfileRef.current && detail ? equal(userProfileRef.current, detail.userProfile) : true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileRef.current, detail]);

  const handleBack = useCallback(() => {
    if (!isEqual) {
      setDetail(prevDetail => {
        if (prevDetail && userProfileRef.current && propertyDataRef.current) {
          prevDetail.userProfile = deepClone(userProfileRef.current);
          prevDetail.propertyData = [...propertyDataRef.current];
          return { ...prevDetail };
        }
      });
    } else {
      navigate(-1);
    }
  }, [isEqual, setDetail, navigate]);

  const detailMemo = useMemo(() => {
    let unit_id, unit_name, actual_name, rarity, position, unitProfile,
      comment = ' \n \n ', catch_copy = '???', self_text = '???';
    if (detail) {
      unit_id = detail.charaData.unit_id;
      unit_name = detail.charaData.unit_name;
      actual_name = detail.charaData.actual_name;
      rarity = detail.userProfile.rarity;
      position = detail.getPosition();
      comment = detail.charaData.comment;
      unitProfile = detail.unitProfile;
      catch_copy = unitProfile.catch_copy;
      self_text = unitProfile.self_text;
    }
    return {
      stillImage: stillExpand && (
        <CharaStillImage unitID={unit_id} rarity={rarity} />
      ),
      baseInfo: (
        <CharaBaseInfo
          unitID={unit_id}
          unitName={unit_name}
          actualName={actual_name}
          rarity={rarity}
          position={position}
          stillExpand={stillExpand}
          onToggleStillExpand={handleToggleStillExpand}
        />
      ),
      comment: (
        <div className={styles.text}>
          {comment.split('\n').map((txt, i) => (
            <Fragment key={i}>{txt}<br /></Fragment>
          ))}
        </div>
      ),
      catchCopy: (
        <div className={styles.text}>{catch_copy}</div>
      ),
      selfText: (
        <div className={styles.text}>
          {self_text.split('\n').map((txt, i) => (
            <Fragment key={i}>{txt}<br /></Fragment>
          ))}
        </div>
      ),
      profile: (
        <div className={styles.infoBox}>
          <CharaProfile profile={unitProfile} />
        </div>
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, stillExpand, handleToggleStillExpand]);

  const userProfileMemo = useMemo(() => {
    let max_rarity, unique_equip_id, atk_type, normal_atk_cast_time,
      userProfile, propertyData, uniqueEquip, storyStatus, unitSkillData, promotions;
    if (detail) {
      max_rarity = detail.charaData.max_rarity;
      unique_equip_id = detail.charaData.unique_equip_id;
      atk_type = detail.charaData.atk_type;
      normal_atk_cast_time = detail.charaData.normal_atk_cast_time;
      userProfile = detail.userProfile;
      propertyData = detail.propertyData;
      uniqueEquip = propertyData[4];
      storyStatus = propertyData[3];
      unitSkillData = detail.unitSkillData;
      promotions = detail.promotions;
    }
    return {
      userProfile: (
        <CharaUserProfile
          maxRarity={max_rarity}
          uniqueEquipID={unique_equip_id}
          userProfile={userProfile}
          onChangeRarity={handleChangeRarity}
          onChangeLevel={handleChangeLevel}
          onChangeLove={handleChangeLove}
          onChangeUnique={handleChangeUnique}
          onChangePromotion={handleChangePromotion}
        />
      ),
      skill: (
        <CharaSkill
          atkType={atk_type}
          atkCastTime={normal_atk_cast_time}
          property={property}
          unitSkillData={unitSkillData}
          userProfile={userProfile}
          onChangeSkill={handleChangeSkill}
        />
      ),
      equip: (
        <CharaEquip
          maxRarity={max_rarity}
          promotions={promotions}
          uniqueEquip={uniqueEquip}
          userProfile={userProfile}
          onChangeEquip={handleChangeEquip}
          onChangeUnique={handleChangeUnique}
          onChangePromotion={handleChangePromotion}
        />
      ),
      story: (
        <CharaStory
          storyStatus={storyStatus}
          userProfile={userProfile}
          onChangeLove={handleChangeLove}
        />
      ),
      status: (
        <div className={styles.infoBox}>
          <CharaStatus
            property={property}
            refProperty={refProperty}
            showDiff={!isEqual}
          />
        </div>
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, detail && detail.userProfile, isEqual]);

  const header = useMemo(() => (
    <Header>
      <IconButton color="inherit" onClick={handleBack}>
        {isEqual ? <ArrowBack /> : <Clear />}
      </IconButton>
      <h6 className={styles.subtitle}>キャラ詳細</h6>
      <IconButton
        color="inherit"
        disabled={currUser === maxUserProfile.user_name || isEqual}
        onClick={handleSaveUserProfile}
      >
        <Done />
      </IconButton>
    </Header>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [isEqual, currUser, handleBack, handleSaveUserProfile]);

  const tabs = useMemo(() => (
    <Tabs
      className={styles.tabs}
      variant="scrollable"
      scrollButtons
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
      {detailMemo.stillImage}
      <div className={styles.sticky}>
        {detailMemo.baseInfo}
        {userProfileMemo.userProfile}
        {tabs}
      </div>
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
