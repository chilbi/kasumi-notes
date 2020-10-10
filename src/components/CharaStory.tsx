import React, { useState, useCallback, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SkeletonImage from './SkeletonImage';
import CharaStatus from './CharaStatus';
import { StoryStatus, StoryStatusData } from '../DBHelper/story_status';
import { getPublicImageURL } from '../DBHelper/helper';
import { PCRStoreValue } from '../db';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = 75 / 128,
    thumbWidth = 256 * scalage / rem,
    thumbHeight = 128 * scalage / rem;

  return {
    item: {
      margin: '0.5em 0.25em',
      lineHeight: 1.5,
    },
    titleBox: {
      padding: '0.5em 0',
    },
    contentBox: {
      display: 'flex',
      alignItems: 'flex-start',
      borderRadius: '0.5em',
      height: thumbHeight + 'rem',
      border: '1px solid ' + theme.palette.grey[200],
      boxShadow: '0 1px 1px ' + theme.palette.grey[100],
      overflow: 'hidden',
    },
    title: {
      display: 'inline-block',
      padding: '0 0.5em',
      borderBottom: '1px solid ' + theme.palette.primary.dark,
      borderRadius: '0.5em 0.5em 0 0',
      color: '#fff',
      backgroundColor: theme.palette.primary.dark,
    },
    subTitle: {
      display: 'inline-block',
      padding: '0 1em',
      borderBottom: '1px dashed ' + theme.palette.primary.dark,
      color: theme.palette.primary.dark,
    },
    property: {
      zIndex: 3,
      flexGrow: 1,
      flexShrink: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    thumbRoot: {
      flexBasis: thumbWidth + 'rem',
      flexGrow: 0,
      flexShrink: 0,
      margin: '0 -0.5em',
      width: thumbWidth + 'rem',
      height: thumbHeight + 'rem',
    },
    thumbImgBox: {
      '&::before': {
        zIndex: 2,
        content: '""',
        position: 'absolute',
        top: 0,
        right: -1,
        bottom: 0,
        left: 0,
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0) 30%, rgba(255,255,255,1))',
      },
    },
    tabs: {
      backgroundColor: '#fff',
    },
    iconRoot: {
      width: '3rem',
      height: '3rem',
      borderRadius: '0.28125rem',
    },
  };
});

interface CharaStoryProps {
  // classes?: Partial<Record<'infoBox', string>>;
  storyStatus?: StoryStatusData;
  userProfile?: PCRStoreValue<'user_profile'>;
}

function CharaStory(props: CharaStoryProps) {
  const { storyStatus = {} as Partial<StoryStatusData>, userProfile } = props;
  const loveLevelStatus = userProfile ? userProfile.love_level_status : {};
  const styles = useStyles();

  const dataStatusMemo = useMemo(() => {
    const storyViewArr: JSX.Element[][] = [];
    const infoArr: { chara_id: number; label: string, imgSrc: string }[] = [];
    const getStoryView = (storyStatus: StoryStatus) => storyStatus.stories.map((story, i) => (
      <div key={i} className={styles.item}>
        <div className={styles.titleBox}>
          <span className={styles.title}>{story.title}</span>
          <span className={styles.subTitle}>{story.sub_title}</span>
        </div>
        <div className={styles.contentBox}>
          <SkeletonImage
            classes={{ root: styles.thumbRoot, imgBox: styles.thumbImgBox }}
            src={getPublicImageURL('thumb_story', storyStatus.chara_id + story.story_id.toString().padStart(3, '0'))}
            save
          />
          <div className={styles.property}>
            <CharaStatus property={story.property} partial abbr />
          </div>
        </div>
      </div>
    ));
    const getImgSrc = (charaID: number) => {
      let rarity = '3';
      const loveLevel = loveLevelStatus[charaID];
      if (loveLevel) {
        if (loveLevel > 8) rarity = '6';
        if (loveLevel < 5) rarity = '1';
      }
      return getPublicImageURL('icon_unit', charaID.toString() + rarity + '1');
    };
    const push = (storyStatus: StoryStatus) => {
      storyViewArr.push(getStoryView(storyStatus));
      infoArr.push({
        chara_id: storyStatus.chara_id,
        label: storyStatus.chara_type,
        imgSrc: getImgSrc(storyStatus.chara_id),
      });
    };
    if (storyStatus.self_story) {
      push(storyStatus.self_story);
    }
    if (storyStatus.share_stories && storyStatus.share_stories.length > 0) {
      for (let item of storyStatus.share_stories) {
        push(item);
      }
    }
    return {
      storyViewArr,
      infoArr,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyStatus, loveLevelStatus]);

  const [tabsValue, setTabsValue] = useState(0);

  const handleChangeTabsValue = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  }, []);

  const tabsValueMemo = useMemo(() => ({
    tabs: dataStatusMemo.infoArr.length > 0 && (
      <Tabs
        className={styles.tabs}
        variant="scrollable"
        textColor="primary"
        indicatorColor="primary"
        value={tabsValue}
        onChange={handleChangeTabsValue}
      >
        {dataStatusMemo.infoArr.map(info => (
          <Tab
            key={info.chara_id}
            label={info.label}
            icon={<SkeletonImage classes={{ root: styles.iconRoot }} src={info.imgSrc} save />}
          />
        ))}
      </Tabs>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [dataStatusMemo, tabsValue]);

  return (
    <div>
      {tabsValueMemo.tabs}
      {dataStatusMemo.storyViewArr.map((item, i) => (
        <div key={i} hidden={i !== tabsValue}>
          {item}
        </div>
      ))}
    </div>
  );
}

export default CharaStory;
