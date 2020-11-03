import { PCRDB } from '../db';
import { getEnemyRewardData, EnemyRewardData } from './enemy_reward_data';

export interface EnemyDropData {
  enemy_id: number;
  drop_gold: number;
  drop_reward?: EnemyRewardData;
}

export interface WaveGroupData {
  wave_group_id: number;
  enemy_drop_data: EnemyDropData[]; // 1-5
}

export async function getWaveGroupData(db: PCRDB, wave_group_id: number): Promise<WaveGroupData> {
  const waveGroupData = await db.transaction('wave_group_data', 'readonly').store.get(wave_group_id);
  if (!waveGroupData) throw new Error(`objectStore('wave_group_data').get(/*wave_group_id*/${wave_group_id}) => undefined`);
  const promiseArr: (EnemyDropData | Promise<EnemyDropData>)[] = [];
  let i = 1;
  while (i <= 5) {
    const enemy_id = waveGroupData['enemy_id_' + i as keyof typeof waveGroupData];
    if (enemy_id === 0) break;
    const drop_gold = waveGroupData['drop_gold_' + i as keyof typeof waveGroupData];
    const drop_reward_id = waveGroupData['drop_reward_id_' + i as keyof typeof waveGroupData];
    if (drop_reward_id === 0) {
      promiseArr.push({
        enemy_id,
        drop_gold,
      });
    } else {
      promiseArr.push(getEnemyRewardData(db, drop_reward_id).then(drop_reward => {
        return {
          enemy_id,
          drop_gold,
          drop_reward
        };
      }));
    }
    i++;
  }
  const enemy_drop_data = await Promise.all(promiseArr);
  return {
    wave_group_id,
    enemy_drop_data,
  };
}
