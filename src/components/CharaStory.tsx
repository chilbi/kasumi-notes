import { useState, useCallback, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Checkbox from '@material-ui/core/Checkbox';
import SkeletonImage from './SkeletonImage';
import CharaStatus from './CharaStatus';
import { StoryStatus, StoryStatusData } from '../DBHelper/story_status';
import { getPublicImageURL } from '../DBHelper/helper';
import maxUserProfile from '../DBHelper/maxUserProfile';
import { PCRStoreValue } from '../db';
import Big from 'big.js';

const useStyles = makeStyles((theme: Theme) => {
  const
    rem = 16,
    scalage = Big(75).div(128),
    thumbWidth = Big(256).times(scalage).div(rem),
    thumbHeight = Big(128).times(scalage).div(rem);

  return {
    item: {
      margin: theme.spacing(2, 1),
      lineHeight: 1.5,
    },
    titleBox: {
      display: 'flex',
      padding: theme.spacing(2, 0),
    },
    contentBox: {
      display: 'flex',
      alignItems: 'flex-start',
      borderRadius: '0.5rem',
      height: thumbHeight + 'rem',
      border: '1px solid ' + theme.palette.grey[200],
      boxShadow: '0 1px 1px ' + theme.palette.grey[100],
      overflow: 'hidden',
    },
    title: {
      display: 'inline-block',
      padding: theme.spacing(0, 2),
      borderBottom: '1px solid ' + theme.palette.primary.dark,
      borderRadius: '0.5rem 0.5rem 0 0',
      color: '#fff',
      backgroundColor: theme.palette.primary.dark,
    },
    subTitle: {
      display: 'inline-block',
      padding: theme.spacing(0, 4),
      borderBottom: '1px dashed ' + theme.palette.primary.dark,
      color: theme.palette.primary.dark,
    },
    checkbox: {
      margin: theme.spacing(0, 1, 0, 'auto'),
      padding: 0,
    },
    property: {
      zIndex: 3,
      flexGrow: 1,
      flexShrink: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    thumbRoot: {
      position: 'relative',
      flexBasis: thumbWidth + 'rem',
      flexGrow: 0,
      flexShrink: 0,
      margin: theme.spacing(0, -2),
      width: thumbWidth + 'rem',
      height: thumbHeight + 'rem',
      '&::before': {
        zIndex: 2,
        content: '""',
        position: 'absolute',
        top: 0,
        right: -1,
        bottom: 0,
        left: 0,
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0) 30%, rgba(255,255,255,1))',
      }
    },
    tabs: {
      backgroundColor: '#fff',
    },
    iconRoot: {
      width: '3rem',
      height: '3rem',
      borderRadius: '0.28125rem',
    },
    hidden: {
      display: 'none',
    },
  };
});

interface CharaStoryProps {
  storyStatus?: StoryStatusData;
  userProfile?: PCRStoreValue<'user_profile'>;
  onChangeLove?: (loveLevel: number, charaID: number) => void;
}

function CharaStory(props: CharaStoryProps) {
  const { storyStatus = {} as Partial<StoryStatusData>, userProfile = maxUserProfile, onChangeLove: onChangeLoveLevel } = props;
  const { love_level_status } = userProfile;
  const styles = useStyles();

  const [tabsValue, setTabsValue] = useState(0);

  const handleChangeTabsValue = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  }, []);

  const dataStatusMemo = useMemo(() => {
    const storyViewArr: JSX.Element[][] = [];
    const infoArr: { chara_id: number; label: string, imgSrc: string }[] = [];
    const getStoryView = (storyStatus: StoryStatus) => {
      const charaID = storyStatus.chara_id;
      const loveLevel = love_level_status[charaID] || 1;
      const isMax4 = storyStatus.stories.length < 8;
      const unlockCount = isMax4 ? Math.max(Math.floor(loveLevel / 2), 1) : loveLevel;
      return storyStatus.stories.map((story, i) => {
        const n = i + 1;
        const checked = n <= unlockCount;
        let newLoveLevel: number;
        if (n === 1) {
          newLoveLevel = 1;
        } else {
          if (isMax4) {
            newLoveLevel = n * 2;
            if (newLoveLevel === loveLevel) newLoveLevel -= 2;
            if (newLoveLevel < 4) newLoveLevel = 1;
          } else {
            newLoveLevel = n;
            if (newLoveLevel === loveLevel) newLoveLevel -= 1;
          }
        }
        return (
          <div key={i} className={styles.item}>
            <div className={styles.titleBox}>
              <span className={styles.title}>{story.title}</span>
              <span className={styles.subTitle}>{story.sub_title}</span>
              <Checkbox
                classes={{ root: styles.checkbox }}
                checked={checked}
                onChange={onChangeLoveLevel && (() => newLoveLevel !== loveLevel && onChangeLoveLevel(newLoveLevel, charaID))}
              />
            </div>
            <div className={styles.contentBox}>
              <SkeletonImage
                classes={{ root: styles.thumbRoot }}
                src={getPublicImageURL('thumb_story', storyStatus.chara_id + story.story_id.toString().padStart(3, '0'))}
                save
              />
              <div className={styles.property}>
                <CharaStatus property={story.property} partial abbr />
              </div>
            </div>
          </div>
        )
      });
    };
    const getImgSrc = (charaID: number) => {
      let rarity = '3';
      const loveLevel = love_level_status[charaID];
      if (loveLevel) {
        if (loveLevel > 8) rarity = '6';
        if (loveLevel < 5) rarity = '1';
      }
      return getPublicImageURL('icon_unit', charaID.toString() + rarity + '1');
    };
    const storyViewArrPush = (storyStatus: StoryStatus) => {
      storyViewArr.push(getStoryView(storyStatus));
      infoArr.push({
        chara_id: storyStatus.chara_id,
        label: storyStatus.chara_type,
        imgSrc: getImgSrc(storyStatus.chara_id),
      });
    };
    if (storyStatus.self_story) {
      storyViewArrPush(storyStatus.self_story);
    }
    if (storyStatus.share_stories && storyStatus.share_stories.length > 0) {
      for (let item of storyStatus.share_stories) {
        storyViewArrPush(item);
      }
    }
    return {
      storyViewArr,
      infoArr,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyStatus, love_level_status]);

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
        <div key={i} className={i === tabsValue ? undefined : styles.hidden}>
          {item}
        </div>
      ))}
    </div>
  );
}

export default CharaStory;
