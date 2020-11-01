import { PCRDB } from '../db';
import { propertyKeys, plus, Property } from './property';
import { getCharaID } from './helper';
import Big from 'big.js';

export type LoveLevelStatus = Record</*chara_id*/number, /*love_level*/number>;

export type StoryStatusMemo = Record</*chara_id*/number, StoryStatus>;

export interface StoryProperty {
  story_id: number;
  title: string;
  sub_title: string;
  property: Partial<Property<Big>>;
}

export interface StoryStatus {
  chara_id: number;
  chara_type: string;
  stories: StoryProperty[];
  share_chara_ids: number[];
  max_love_level: number;
  getProperty(loveLevelStatus: LoveLevelStatus): Property<Big>;
}

export interface StoryStatusData {
  unit_id: number;
  self_story: StoryStatus;
  share_stories: StoryStatus[];
  getProperty(loveLevelStatus: LoveLevelStatus): Property<Big>;
}

function getStoryStatusProperty(this: StoryStatus, LoveLevelStatus: LoveLevelStatus): Property<Big> {
  const loveLevel = LoveLevelStatus[this.chara_id] || 0;
  const unlockCount = this.stories.length < 8 ? Math.floor(loveLevel / 2) : loveLevel;
  const properties: Partial<Property>[] = [];
  for (let i = 0; i < unlockCount; i++) {
    properties.push(this.stories[i].property);
  }
  return plus(properties);
}

async function getStoryStatus(db: PCRDB, chara_id: number, memo?: StoryStatusMemo): Promise<StoryStatus> {
  if (memo && memo[chara_id]) return memo[chara_id];
  const status = {} as StoryStatus;
  status.chara_id = chara_id;
  status.chara_type = '';
  status.stories = [];
  status.share_chara_ids = [];
  const charaStoryStatusArr = await db.transaction('chara_story_status', 'readonly').store.index('chara_story_status_0_chara_id').getAll(chara_id);
  const arrLen = charaStoryStatusArr.length;
  for (let i = 0; i < arrLen; i++) {
    const value = charaStoryStatusArr[i];
    const property: Partial<Property<Big>> = {};
    let statusIndex = 1;
    while (statusIndex <= 5) {
      let pType = value['status_type_' + statusIndex as keyof typeof value] as number;
      if (pType === 0) break;
      let pKey = propertyKeys[pType - 1];
      let pValue = value['status_rate_' + statusIndex as keyof typeof value] as number;
      property[pKey] = Big(pValue);
      statusIndex++;
    }
    status.stories.push({
      story_id: value.story_id,
      title: value.title,
      sub_title: value.sub_title,
      property,
    });
  }
  const firstValue = charaStoryStatusArr[0];
  let idIndex = 1;
  while (idIndex <= 10) {
    let id = firstValue['chara_id_' + idIndex as keyof typeof firstValue] as number;
    if (id === 0) break;
    if (chara_id !== id) status.share_chara_ids.push(id);
    idIndex++;
  }
  status.chara_type = firstValue.chara_type;
  status.max_love_level = arrLen > 8 ? 12 : 8;
  status.getProperty = getStoryStatusProperty;
  if (memo) memo[chara_id] = status;
  return status;
}

function getProperty(this: StoryStatusData, loveLevelStatus: LoveLevelStatus): Property<Big> {
  const selfProperty = this.self_story.getProperty(loveLevelStatus);
  const shareProperties = this.share_stories.map(shareStory => shareStory.getProperty(loveLevelStatus));
  return plus([selfProperty, plus(shareProperties)]);
}

export async function getStoryStatusData(db: PCRDB, unit_id: number, memo?: StoryStatusMemo): Promise<StoryStatusData> {
  const self_story = await getStoryStatus(db, getCharaID(unit_id), memo);
  const share_stories = await Promise.all(self_story.share_chara_ids.map(id => getStoryStatus(db, id, memo)));
  return {
    unit_id,
    self_story,
    share_stories,
    getProperty,
  };
}
