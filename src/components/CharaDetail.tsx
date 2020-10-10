import React, { useState, useCallback, useMemo, useContext, useEffect, useRef } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
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
import { PCRStoreValue } from '../db';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
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
    color: '#34627d',
  },
  comment: {},
  catchCopy: {},
  selfText: {},
}));

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
    if (dbHelper) dbHelper.getCharaDetailData(props.unitID).then(data => {
      if (data) {
        userProfileRef.current = data.userProfile;
        setDetail(data);
      }
    });
  }, [dbHelper, props.unitID]);

  const [tabsValue, setTabsValue] = useState(0);
  const handleChangeTabsValue = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  }, []);

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
        {detail ? detail.charaProfile.catch_copy : '???'}
      </div>
    ),
    selfText: (
      <div className={clsx(styles.text, styles.selfText)}>
        {(detail ? detail.charaProfile.self_text : '???').split('\n').map((txt, i) => (
          <React.Fragment key={i}>{txt}<br /></React.Fragment>
        ))}
      </div>
    ),
    profile: (
      <div className={styles.infoBox}>
        <CharaProfile profile={detail && detail.charaProfile} />
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [detail]);

  const userProfileMemo = useMemo(() => ({
    userProfile: (
      <CharaUserProfile
        maxRarity={detail && detail.charaData.max_rarity}
        userProfile={detail && detail.userProfile}
      />
    ),
    skill: (
      <CharaSkill
        atkType={detail && detail.charaData.atk_type}
        property={property}
        charaSkill={detail && detail.charaSkillData}
        userProfile={detail && detail.userProfile}
      />
    ),
    equip: (
      <CharaEquip
        promotions={detail && detail.charaPromotions}
        uniqueEquip={detail && detail.propertyData[4]}
        userProfile={detail && detail.userProfile}
      />
    ),
    story: (
      <CharaStory
        storyStatus={detail && detail.propertyData[3]}
        userProfile={detail && detail.userProfile}
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
        {detailMemo.comment}
        {userProfileMemo.status}
      </div>
      <div className={styles.tabpanel} role="tabpanel" hidden={tabsValue !== 4}>
        {detailMemo.catchCopy}
        {detailMemo.selfText}
        {detailMemo.profile}
      </div>
    </div>
  );
}

export default CharaDetail;
