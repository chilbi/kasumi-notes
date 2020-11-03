import { PCRDB } from '../db';

export interface RewardData {
  reward_id: number;
  reward_type: number;
  // reward_num: number;
  odds: number;
}

export interface EnemyRewardData {
  drop_reward_id: number;
  reward_data: RewardData[];
}

export async function getEnemyRewardData(db: PCRDB, drop_reward_id: number): Promise<EnemyRewardData> {
  const enemyRewardData = await db.transaction('enemy_reward_data', 'readonly').store.get(drop_reward_id);
  if (!enemyRewardData) throw new Error(`objectStore('enemy_reward_data').get(/*drop_reward_id*/${drop_reward_id}) => undefined`);
  const reward_data: RewardData[] = [];
  let i = 1;
  while (i <= 5) {
    const reward_id = enemyRewardData['reward_id_' + i as keyof typeof enemyRewardData];
    if (reward_id === 0) break;
    const reward_type = enemyRewardData['reward_type_' + i as keyof typeof enemyRewardData];
    if (reward_type === 4 || reward_id.toString()[0] === '3' || reward_id === 25001) {
      const odds = enemyRewardData['odds_' + i as keyof typeof enemyRewardData];
      reward_data.push({
        reward_id,
        reward_type,
        odds,
      });
    }
    i++;
  }
  return {
    drop_reward_id,
    reward_data,
  };
}
