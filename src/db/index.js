// @ts-check
import { openDB } from 'idb';

/**
 * @param {{ onInserted?: (db: import('.').PCRDB) => void; onProgress?: (count: number, total: number) => void; }} [options] 
 * @returns {Promise<import('.').PCRDB>}
 */
export default function openPCRDB(options = {}) {
  return openDB('pcr', 10026800, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (newVersion !== oldVersion) {
        if (db.objectStoreNames.length > 0) {
          Array.from(db.objectStoreNames).forEach(name => {
            if (['image_data', 'chara_data', 'user_profile'].indexOf(name) < 0) {
              db.deleteObjectStore(name);
            }
          });
        }
      }

      db.createObjectStore('actual_unit_background', {
        keyPath: 'unit_id',
      });

      const charaStoryStatusStore = db.createObjectStore('chara_story_status', {
        keyPath: ['chara_id', 'story_id'],
      });
      charaStoryStatusStore.createIndex('chara_story_status_0_chara_id', 'chara_id');

      db.createObjectStore('enemy_reward_data', {
        keyPath: 'drop_reward_id',
      });

      db.createObjectStore('equipment_craft', {
        keyPath: 'equipment_id',
      });

      db.createObjectStore('equipment_data', {
        keyPath: 'equipment_id',
      });

      db.createObjectStore('equipment_enhance_rate', {
        keyPath: 'equipment_id',
      });

      db.createObjectStore('quest_data', {
        keyPath: 'quest_id',
      });

      db.createObjectStore('skill_action', {
        keyPath: 'action_id',
      });

      db.createObjectStore('skill_data', {
        keyPath: 'skill_id',
      });

      db.createObjectStore('unique_equipment_data', {
        keyPath: 'equipment_id',
      });

      db.createObjectStore('unique_equipment_enhance_rate', {
        keyPath: 'equipment_id',
      });

      const unitAttackPatternStore = db.createObjectStore('unit_attack_pattern', {
        keyPath: 'pattern_id',
      });
      unitAttackPatternStore.createIndex('unit_attack_pattern_0_unit_id', 'unit_id');

      db.createObjectStore('unit_data', {
        keyPath: 'unit_id',
      });

      db.createObjectStore('unit_profile', {
        keyPath: 'unit_id',
      });

      const unitPromotionStore = db.createObjectStore('unit_promotion', {
        keyPath: ['unit_id', 'promotion_level'],
      });
      unitPromotionStore.createIndex('unit_promotion_0_unit_id', 'unit_id');

      db.createObjectStore('unit_promotion_status', {
        keyPath: ['unit_id', 'promotion_level'],
      });

      const unitRarityStore = db.createObjectStore('unit_rarity', {
        keyPath: ['unit_id', 'rarity'],
      });
      unitRarityStore.createIndex('unit_rarity_0_unit_id', 'unit_id');
      unitRarityStore.createIndex('unit_rarity_0_unit_material_id', 'unit_material_id');

      db.createObjectStore('unit_skill_data', {
        keyPath: 'unit_id',
      });

      db.createObjectStore('unit_unique_equip', {
        keyPath: 'unit_id',
      });

      db.createObjectStore('wave_group_data', {
        keyPath: 'wave_group_id',
      });

      if (!db.objectStoreNames.contains('image_data')) {
        const imageDataStore = db.createObjectStore('image_data', {
          keyPath: 'url',
        });
        imageDataStore.createIndex('image_data_0_last_visit', 'last_visit');
      }

      if (!db.objectStoreNames.contains('chara_data')) {
        db.createObjectStore('chara_data', {
          keyPath: 'unit_id',
        });
      }

      if (!db.objectStoreNames.contains('user_profile')) {
        const userProfileStore = db.createObjectStore('user_profile', {
          keyPath: ['user_name', 'unit_id'],
        });
        userProfileStore.createIndex('user_profile_0_user_name', 'user_name');
      }

      transaction.done.then(async () => {
        const data = await import(/* webpackChunkName: "data" */ './data');
        await data.insert(db, options.onProgress);
        if (options.onInserted) options.onInserted(db);
      });
    },
  });
}
