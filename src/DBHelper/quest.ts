import { PCRDB, PCRStoreValue } from '../db';
import { getWaveGroupData, WaveGroupData } from './wave_group';
import { RewardData } from './enemy_reward_data';
import { mapQuestType, QuestType } from './helper';

export interface DropData {
  drop_gold: number;
  drop_reward: RewardData[];
}

export interface QuestData {
  quest_id: number;
  area_id: number;
  quest_name: string;
  icon_id: number;
  // enemy_images: number[]; // 1-5
  // reward_images: number[]; // 1-5
  // wave_group_data: WaveGroupData[]; // 1-3
  drop_data: DropData;
}

export async function getQuestData(db: PCRDB, quest_id: number): Promise<QuestData>;
export async function getQuestData(db: PCRDB, questData: PCRStoreValue<'quest_data'>): Promise<QuestData>
export async function getQuestData(db: PCRDB, questArg: number | PCRStoreValue<'quest_data'>): Promise<QuestData> {
  let questData;
  if (typeof questArg === 'number') {
    questData = await db.transaction('quest_data', 'readonly').store.get(questArg);
    if (!questData) throw new Error(`objectStore('quest_data').get(/*quest_id*/${questArg}) => undefined`);
  } else {
    questData = questArg;
  }
  let i: number;
  // const enemy_images: number[] = [];
  // i = 1;
  // while (i <= 5) {
  //   const enemy_image = questData['enemy_image_' + i as keyof typeof questData] as number;
  //   if (enemy_image === 0) break;
  //   enemy_images.push(enemy_image);
  //   i++;
  // }
  const reward_images: number[] = [];
  i = 1;
  while (i <= 5) {
    const reward_image = questData['reward_image_' + i as keyof typeof questData] as number;
    if (reward_image === 0) break;
    reward_images.push(reward_image);
    i++;
  }
  const promiseArr: Promise<WaveGroupData>[] = [];
  i = 1;
  while (i <= 3) {
    const wave_group_id = questData['wave_group_id_' + i as keyof typeof questData] as number;
    if (wave_group_id === 0) break;
    promiseArr.push(getWaveGroupData(db, wave_group_id));
    i++;
  }
  const wave_group_data = await Promise.all(promiseArr);
  let drop_gold = 0;
  let _drop_reward: RewardData[] = [];
  for (let wave of wave_group_data) {
    for (let drop of wave.enemy_drop_data) {
      drop_gold += drop.drop_gold;
      if (drop.drop_reward) {
        _drop_reward.push(...drop.drop_reward.reward_data);
      }
    }
  }
  const drop_reward: RewardData[] = [];
  for (let reward_image of reward_images) {
    const idx = _drop_reward.findIndex(value => value.reward_id === reward_image);
    if (idx > -1) {
      drop_reward.push(_drop_reward.splice(idx, 1)[0]);
    }
  }
  drop_reward.push(..._drop_reward/*.sort((a, b) => b.odds - a.odds)*/);

  const drop_data = {
    drop_gold,
    drop_reward,
  };

  return {
    quest_id: questData.quest_id,
    area_id: questData.area_id,
    quest_name: questData.quest_name,
    icon_id: questData.icon_id,
    drop_data,
  };
}

export async function getQuestList(db: PCRDB, type?: QuestType): Promise<QuestData[]> {
  let keyRange;
  if (type) {
    const range = mapQuestType(type);
    keyRange = IDBKeyRange.bound(range[0], range[1], true, true);
  }
  return db.transaction('quest_data', 'readonly').store.getAll(keyRange).then(questDataList => {
    const promiseArr = [];
    for (let questData of questDataList) {
      promiseArr.push(getQuestData(db, questData));
    }
    return Promise.all(promiseArr);
  });
}
