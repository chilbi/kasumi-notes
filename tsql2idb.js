// @ts-check
const fs = require('fs');

/**
 * @typedef {{ fieldName: string; fieldType: string; }} Field
 * @typedef {{ indexName: string; indexFields: string[]; }} Index
 * @typedef {{ tableName: string; primaryKeys: string[]; fields: Field[]; indexes: Index[]; records: string[][]; }} SQLRawObj
 */

/**
 * @param {string} sqlRaw 
 * @returns {SQLRawObj}
 */
function getSqlRawObj(sqlRaw) {
  // CREATE TABLE 'tableName' ('field_1' INTEGER NOT NULL, 'field_2' TEXT NOT NULL, 'field_3' REAL NOT NULL, PRIMARY KEY('field_1','field_2'));
  // INSERT INTO `tableName` VALUES (/*field_1*/1, /*field_2*/"text123", /*field_3*/0.1);
  // CREATE INDEX 'indexName' on 'tableName'('field_2','field_3');
  let iFirstInsertInto = sqlRaw.indexOf('INSERT INTO');
  let iFirstCreateIndex = sqlRaw.indexOf('CREATE INDEX');
  let createTableLine = '';
  if (iFirstInsertInto > -1) createTableLine = sqlRaw.substring(0, iFirstInsertInto);
  else if (iFirstCreateIndex > -1) createTableLine = sqlRaw.substring(0, iFirstCreateIndex);
  else createTableLine = sqlRaw;
  
  /** @type {string} */
  const tableName = createTableLine.match(/(?<=CREATE TABLE ')[^']+/)[0];

  let iPrimaryKey = createTableLine.indexOf(', PRIMARY KEY');
  let primaryKeyLine = createTableLine.substr(iPrimaryKey);
  /** @param {string} str */
  let trimQuotes = str => str.substr(1, str.length - 2);

  /** @type string[] */
  const primaryKeys = primaryKeyLine.match(/'[^']+'/g).map(value => trimQuotes(value));

  let createTable = `CREATE TABLE '${tableName}' (`;
  let fieldDefineLine = createTableLine.substring(createTable.length, iPrimaryKey);
  let types = {
    'INTEGER': 'number',
    'REAL': 'number',
    'TEXT': 'string',
  };

  /** @type Field[] */
  const fields = fieldDefineLine.split(',').map(value => {
    const fieldDef = value.trim().split(' ');
    const fieldName = trimQuotes(fieldDef[0]);
    const fieldType = types[fieldDef[1]];
    return { fieldName, fieldType };
  });

  /** @type Index[] */
  const indexes = [];

  if (iFirstCreateIndex > -1) {
    let createIndex = 'CREATE INDEX ';
    let createIndexLines = sqlRaw.substr(iFirstCreateIndex + createIndex.length).split(createIndex);
    createIndexLines.forEach(createIndexLine => {
      const indexName = createIndexLine.match(/(?<=')\S+(?=' on)/)[0];
      const indexFields = createIndexLine.match(/(?<=\()[^)]+/)[0].split(',').map(v => trimQuotes(v.trim()));
      indexes.push({ indexName, indexFields });
    });
  }

  /** @type string[][] */
  const records = [];

  if (iFirstInsertInto > -1) {
    let insertIntoValue = `INSERT INTO \`${tableName}\` VALUES `;
    let insertIntoLines = iFirstCreateIndex > -1 ?
      sqlRaw.substring(iFirstInsertInto + insertIntoValue.length, iFirstCreateIndex).split(insertIntoValue) :
      sqlRaw.substr(iFirstInsertInto + insertIntoValue.length).split(insertIntoValue);
    insertIntoLines.forEach(insertIntoLine => {
      /** @type string[] */
      const record = [].concat(...(insertIntoLine.split('*/').map(v => v.split(', /*'))));
      record[0] = record[0].substr(3);
      let last = record.length - 1;
      record[last] = record[last].substring(0, record[last].length - 3);
      records.push(record.map(value => value[0] === '"' ? trimQuotes(value) : value));
    });
  }

  return {
    tableName,
    primaryKeys,
    fields,
    indexes,
    records,
  };
}

/**
 * @param {string} dir
 * @param {string[]} exclude
 * @param {string[]} [include]
 * @returns {SQLRawObj[]}
 */
function getSqlRawObjs(dir, exclude, include) {
  /** @type {SQLRawObj[]} */
  const objs = [];

  const files = fs.readdirSync(dir);
  if (include) {
    files.forEach(fileName => {
      if (include.indexOf(fileName) > -1) {
        const content = fs.readFileSync(dir + '/' + fileName, { encoding: 'utf-8' });
        objs.push(getSqlRawObj(content));
      }
    });
  } else {
    files.forEach(fileName => {
      if (fileName.endsWith('.sql') && exclude.indexOf(fileName) < 0) {
        const content = fs.readFileSync(dir + '/' + fileName, { encoding: 'utf-8' });
        if (content.trim().length < 1) {
          console.log('null file: ' + fileName);
        } else if (content.indexOf('CREATE TABLE') < 0) {
          console.log('no CREATE TABLE: ' + fileName);
        } else {
          objs.push(getSqlRawObj(content));
        }
      }
    });
  }

  return objs;
}

/**
 * @param {string} str
 */
function lowerCamelCase(str) {
  return str.toLowerCase().replace(/_\w/g, s => s[1].toUpperCase());
}

/**
 * @param {string} str 
 */
function upperCamalCase(str) {
  return lowerCamelCase(str).replace(/\w/, s => s.toUpperCase());
}

/**
 * @param {Field[]} fields 
 * @param {string} fieldName 
 * @returns {string}
 */
function getFieldType(fields, fieldName) {
  for (let field of fields) {
    if (field.fieldName === fieldName) {
      return field.fieldType;
    }
  }
  return '';
}

/**
 * @param {string[]} keys
 * @param {Field[]} fields 
 * @returns {string}
 */
function getType(keys, fields) {
  if (keys.length > 1) {
    return '[' + keys.map(key => getFieldType(fields, key)).join(', ') + ']';
  } else {
    return getFieldType(fields, keys[0]);
  }
}

/**
 * @param {string[]} keys 
 * @returns {string}
 */
function getName(keys) {
  if (keys.length > 1) {
    return '[' + keys.map(key => `'${key}'`).join(', ') +']';
  } else {
    return `'${keys[0]}'`;
  }
}

/**
 * @param {string} path
 * @returns {string}
 */
function getDBVersion(path) {
  return fs.readFileSync(path, { encoding: 'utf-8' }).trim();
}

/**
 * @param {string} dir 
 */
function emptyDir(dir) {
  fs.readdirSync(dir).forEach(fileName => {
    let path = dir + '/' + fileName;
    if (fs.statSync(path).isDirectory()) emptyDir(path);
    else fs.unlinkSync(path);
  });
}

// /**
//  * @param {string[]} record 
//  * @param {Field[]} fields 
//  * @returns {string}
//  */
// function getRecordJSON(record, fields, quotes = '"') {
//   let str = '{ ';
//   let isKey = true;
//   let tempKey = '';
//   let len = record.length;
//   for (let i = 0; i < len; i++) {
//     if (isKey) {
//       tempKey = record[i];
//       str += `${quotes}${tempKey}${quotes}: `;
//       isKey = false;
//     } else {
//       let value = record[i];
//       if (getFieldType(fields, tempKey) === 'string') str += `${quotes}${value.replace(/\r/g, '').replace(/\n/g, '\\n')}${quotes}`;
//       else str += value === '' ? 'undefined' : value;
//       if (i < len - 1) str += ', ';
//       isKey = true;
//     }
//   }
//   str += ' }';
//   return str;
// }

/**
 * @param {string[]} record
 * @param {Field[]} fields
 * @returns {string}
 */
function getValues(record, fields) {
  let str = '';
  let i = 1;
  for (let field of fields) {
    let value = record[i];
    if (field.fieldType === 'string')
      str += `'${value.replace(/\r/g, '').replace(/\n/g, '\\n')}'`;
    else
      str += value === '' ? 'undefined' : value;
    str += ', ';
    i += 2;
  }
  str = str.substr(0, str.length - 2);
  return str;
}

/**
 * @param {SQLRawObj} obj
 * @returns {Record<'create' | 'insert' | 'schema' | 'dataJS' | 'dataDTS' | 'importJS' | 'importDTS', string>}
 */
function getStr(obj) {
  const lName = lowerCamelCase(obj.tableName);
  const uName = upperCamalCase(obj.tableName);
  const hasIndex = obj.indexes.length > 0;
  const hasRecord = obj.records.length > 0;

  let create = '';
  const requireCheck = ['image_data', 'chara_data', 'user_profile'].indexOf(obj.tableName) > -1;
  const space = requireCheck ? '  ' : '';
  if (requireCheck) {
    create += `      if (!db.objectStoreNames.contains('${obj.tableName}')) {\n`;
  }
  create += `${space}      ${hasIndex ? 'const ' + lName + 'Store = ' : ''}db.createObjectStore('${obj.tableName}', {\n`;
  create += `${space}        keyPath: ${getName(obj.primaryKeys)},\n`;
  create += `${space}      });\n`;
  if (hasIndex) {
    obj.indexes.forEach(index => {
      create += `${space}      ${lName}Store.createIndex('${index.indexName}', ${getName(index.indexFields)});\n`;
    });
  }
  if (requireCheck) {
    create += '      }\n';
  }
  create += '\n';

  let insert = '';
  if (hasRecord) {
    insert += '  insertTasks = [];\n';
    insert += `  const ${lName}Transaction = db.transaction('${obj.tableName}', 'readwrite');\n`;
    insert += `  ${lName}.forEach(record => insertTasks.push(${lName}Transaction.store.add(record)));\n`;
    insert += `  insertTasks.push(${lName}Transaction.done);\n`;
    insert += '  await Promise.all(insertTasks);\n';
    insert += `  onProgress(${obj.records.length}, $total);\n\n`;
  }

  let schema = '';
  schema += `  '${obj.tableName}': {\n`;
  schema += `    key: ${getType(obj.primaryKeys, obj.fields)};\n`;
  schema += `    value: ${uName};\n`;
  if (obj.indexes.length > 0) {
    schema += '    indexes: {\n';
    obj.indexes.forEach(index => {
      schema += `      '${index.indexName}': ${getType(index.indexFields, obj.fields)};\n`;
    });
    schema += '    };\n';
  }
  schema += '  };\n';

  let dataJS = '';
  if (obj.records.length > 0) {
    const argsStr = obj.fields.map(field => field.fieldName).join(', ');
    dataJS += 'export default (() => {\n';
    dataJS += `  const c = (${argsStr}) =>\n`;
    dataJS += `    ({ ${argsStr} });\n`;
    dataJS += '  return [\n';
    dataJS += obj.records.map(record => `    c(${getValues(record, obj.fields)})`).join(',\n');
    dataJS += '\n  ];\n';
    dataJS += '})();\n';
  } else {
    dataJS += '// eslint-disable-next-line import/no-anonymous-default-export\n';
    dataJS += 'export default [];\n';
  }

  let dataDTS = `export interface ${uName} {\n`;
  obj.fields.forEach(field => {
    dataDTS += `  ${field.fieldName}: ${field.fieldType};\n`;
  });
  dataDTS += '}\n\n';
  dataDTS += `declare const data: ${uName}[];\n`;
  dataDTS += 'export default data;\n';

  let importJS = '';
  if (hasRecord) importJS += `import ${lName} from './${obj.tableName}';\n`;

  let importDTS = `import { ${uName} } from './${obj.tableName}';\n`;

  return {
    create,
    insert,
    schema,
    dataJS,
    dataDTS,
    importJS,
    importDTS,
  };
}

/**
 * @param {SQLRawObj[]} objs 
 * @param {string} dataDir 
 * @returns {string}
 */
function writeData(objs, dataDir) {
  if (fs.existsSync(dataDir)) emptyDir(dataDir);
  else fs.mkdirSync(dataDir);

  let createStr = '';
  let insertStr = '';
  let schemaStr = '';
  let importJSStr = '';
  let importDTSStr = '';
  let total = 0;

  objs.forEach(obj => {
    const str = getStr(obj);
    createStr += str.create;
    insertStr += str.insert;
    schemaStr += str.schema;
    importJSStr += str.importJS;
    importDTSStr += str.importDTS;
    total += obj.records.length;
    fs.writeFileSync(dataDir + obj.tableName + '.js', str.dataJS, { encoding: 'utf-8' });
    fs.writeFileSync(dataDir + obj.tableName + '.d.ts', str.dataDTS, { encoding: 'utf-8' });
  });

  let jsStr = '// @ts-check\n';
  jsStr += importJSStr;
  jsStr += '\n';
  jsStr += '/**\n';
  jsStr += " * @param {import('..').PCRDB} db \n";
  jsStr += ' * @param {(count: number, total: number) => void} [onProgress] \n';
  jsStr += ' * @returns {Promise<void>}\n';
  jsStr += ' */\n';
  jsStr += 'export async function insert(db, onProgress = () => null) {\n';
  jsStr += '  /** @type Promise<any>[] */\n'
  jsStr += '  let insertTasks;\n\n';
  jsStr += insertStr.replace(/\$total/g, total.toString());
  jsStr += '}\n';
  fs.writeFileSync(dataDir + 'index.js', jsStr, { encoding: 'utf-8' });

  let dtsStr = "import { DBSchema } from 'idb';\n";
  dtsStr += "import { PCRDB } from '..';\n";
  dtsStr += importDTSStr + '\n';
  dtsStr += `export interface PCRDBSchema extends DBSchema {\n`;
  dtsStr += schemaStr;
  dtsStr += '}\n\n';
  dtsStr += "export async function insert(db: PCRDB, onProgress?: (count: number, total: number) => void): Promise<void>;\n";
  fs.writeFileSync(dataDir + 'index.d.ts', dtsStr, { encoding: 'utf-8' });

  return createStr;
}

/**
 * @param {string} dbDir
 * @param {string} dbName 
 * @param {string} dbVersion 
 * @param {string} createStr
 */
function writeOpenDB(dbDir, dbName, dbVersion, createStr) {
  let jsStr = '// @ts-check\n';
  jsStr += "import { openDB } from 'idb';\n\n";
  jsStr += '/**\n';
  jsStr += " * @param {{ onInserted?: (db: import('.').PCRDB) => void; onProgress?: (count: number, total: number) => void; }} [options] \n";
  jsStr += " * @returns {Promise<import('.').PCRDB>}\n";
  jsStr += ' */\n';
  jsStr += 'export default function openPCRDB(options = {}) {\n';
  jsStr += `  return openDB('${dbName}', ${dbVersion}, {\n`;
  jsStr += '    upgrade(db, oldVersion, newVersion, transaction) {\n';
  jsStr += '      if (newVersion !== oldVersion) {\n';
  jsStr += '        if (db.objectStoreNames.length > 0) {\n';
  jsStr += '          Array.from(db.objectStoreNames).forEach(name => {\n';
  jsStr += "            if (['image_data', 'chara_data', 'user_profile'].indexOf(name) < 0) {\n";
  jsStr += '              db.deleteObjectStore(name);\n';
  jsStr += '            }\n';
  jsStr += '          });\n';
  jsStr += '        }\n';
  jsStr += '      }\n\n';
  jsStr += createStr;
  jsStr += '      transaction.done.then(async () => {\n';
  jsStr += `        const data = await import(/* webpackChunkName: "data" */ './data');\n`;
  jsStr += '        await data.insert(db, options.onProgress);\n';
  jsStr += '        if (options.onInserted) options.onInserted(db);\n';
  jsStr += '      });\n';
  jsStr += '    },\n';
  jsStr += '  });\n'
  jsStr += '}\n';
  fs.writeFileSync(dbDir + '/index.js', jsStr, { encoding: 'utf-8' });

  let dtsStr = "import { IDBPDatabase, StoreNames, IDBPTransaction, IDBPObjectStore } from 'idb';\n";
  dtsStr += "import { PCRDBSchema } from './data';\n\n";
  dtsStr += "export { PCRDBSchema } from './data';\n\n";
  dtsStr += 'export type PCRDB = IDBPDatabase<PCRDBSchema>;\n\n';
  dtsStr += 'export type PCRStoreNames = StoreNames<PCRDBSchema>;\n\n'
  dtsStr += 'export type PCRTransaction<TNames extends PCRStoreNames[]> = IDBPTransaction<PCRDBSchema, TNames>;\n\n';
  dtsStr += 'export type PCRStore<TNames extends PCRStoreNames[], TName extends PCRStoreNames> = IDBPObjectStore<PCRDBSchema, TNames, TName>;\n\n';
  dtsStr += "export type PCRStoreValue<TName extends PCRStoreNames> = PCRDBSchema[TName]['value'];\n\n";
  dtsStr += 'interface Options {\n';
  dtsStr += '  onInserted?: (db: PCRDB) => void;\n';
  dtsStr += '  onProgress?: (count: number, total: number) => void;\n';
  dtsStr += '}\n\n';
  dtsStr += "export default function openPCRDB(options?: Options): Promise<PCRDB>;\n";
  fs.writeFileSync(dbDir + 'index.d.ts', dtsStr, { encoding: 'utf-8' });
}

/**
 * @param {string} sqlFilesDir
 * @param {SQLRawObj[]} sqlRawObjs
 */
function writeMaxUserProfile(sqlFilesDir, sqlRawObjs) {
  const experienceTeamRaw = fs.readFileSync(sqlFilesDir + '/experience_team.sql', { encoding: 'utf-8' });
  const experienceTeamObj = getSqlRawObj(experienceTeamRaw);
  const maxLevel = experienceTeamObj.records.length - 1;

  const unitPromotionObj = sqlRawObjs.find(obj => obj.tableName === 'unit_promotion');
  let maxPromotionLevel = 0;
  for (let record of unitPromotionObj.records) {
    const idIdx = record.indexOf('unit_id');
    if (record[idIdx + 1] === '100101') maxPromotionLevel += 1;
    else break;
  }

  const uniqueEquipmentEnhanceDataRaw = fs.readFileSync(sqlFilesDir + '/unique_equipment_enhance_data.sql', { encoding: 'utf-8' });
  const uniqueEquipmentEnhanceDataObj = getSqlRawObj(uniqueEquipmentEnhanceDataRaw);
  const maxUniqueEnhanceLevel = uniqueEquipmentEnhanceDataObj.records.length + 1;

  let maxArea;
  const questDataObj = sqlRawObjs.find(obj => obj.tableName === 'quest_data');
  for (let record of questDataObj.records) {
    const areaIDIdx = record.indexOf('area_id');
    const areaID = record[areaIDIdx + 1];
    if (parseInt(areaID) > 12000) break;
    maxArea = areaID.substr(-2);
  }

  const unitProfileObj = sqlRawObjs.find(obj => obj.tableName === 'unit_profile');
  const maxChara = unitProfileObj.records.length;

  const equipRateObj = sqlRawObjs.find(obj => obj.tableName === 'equipment_enhance_rate');
  let equipGenre = [];
  const genreSet = new Set();
  for (let record of equipRateObj.records) {
    const equipIDIdx = record.indexOf('equipment_id');
    const equipID = record[equipIDIdx + 1];
    const genreID = equipID.substr(3, 2);
    const descIdx = record.indexOf('description');
    const desc = record[descIdx + 1];
    if (!genreSet.has(genreID)) {
      genreSet.add(genreID);
      equipGenre.push([genreID, desc]);
    }
  }
  equipGenre = equipGenre.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  let genreStr = '';
  for (let item of equipGenre) {
    genreStr += `  ['${item[0]}', '${item[1]}'],\n`;
  }
  genreStr = genreStr.substr(0, genreStr.length - 2);

  let str = '';
  str += "import { PCRStoreValue } from '../db';\n\n";
  str += 'export const nullID = 999999;\n\n';
  str += `export const maxArea = ${parseInt(maxArea)};\n\n`;
  str += `export const maxChara = ${maxChara};\n\n`;
  str += `export const equipGenre: [string, string][] = [\n`;
  str += genreStr + '\n';
  str += `];\n\n`;
  str += "const maxUserProfile: PCRStoreValue<'user_profile'> = {\n";
  str += "  user_name: 'MAX',\n";
  str += '  unit_id: undefined as any,\n';
  str += `  level: ${maxLevel},\n`;
  str += '  rarity: 5,\n';
  str += `  promotion_level: ${maxPromotionLevel},\n`;
  str += `  unique_enhance_level: ${maxUniqueEnhanceLevel},\n`;
  str += `  skill_enhance_status: { ub: ${maxLevel}, 1: ${maxLevel}, 2: ${maxLevel}, ex: ${maxLevel} },\n`;
  str += '  equip_enhance_status: {},\n';
  str += '  love_level_status: {},\n';
  str += '};\n\n';
  str += 'export default maxUserProfile;\n';

  fs.writeFileSync('./src/DBHelper/maxUserProfile.ts', str, { encoding: 'utf-8' });
}

function main() {
  const dbName = 'pcr';

  const sqlFilesDir = './redive_master_db_diff-master';

  const dbDir = './src/db';

  const dbVersion = getDBVersion(sqlFilesDir + '/!TruthVersion.txt');

  const excludeFiles = ['sqlite_stat1.sql', 'chara_e_ticket_data.sql'];

  const includeFiles = [
    'actual_unit_background.sql',
    'chara_story_status.sql',
    'equipment_craft.sql',
    'equipment_data.sql',
    // 'equipment_enhance_data.sql',
    'equipment_enhance_rate.sql',
    'unique_equipment_data.sql',
    // 'unique_equipment_craft.sql',
    // 'unique_equipment_enhance_data.sql',
    'unique_equipment_enhance_rate.sql',
    // 'unique_equipment_rankup.sql',
    'unit_unique_equip.sql',
    'unit_data.sql',
    'unit_profile.sql',
    'unit_promotion_status.sql',
    'unit_promotion.sql',
    'unit_rarity.sql',
    // 'unit_status_coefficient.sql',
    'unit_attack_pattern.sql',
    'unit_skill_data.sql',
    'skill_data.sql',
    'skill_action.sql',
    // 'skill_cost.sql',
    // 'unlock_rarity_6.sql',
    // 'experience_team.sql',
    // 'guild.sql',
    // 'item_data.sql',
    // 'clan_battle_period.sql',
    // 'clan_battle_map_data.sql',
    // 'clan_battle_2_map_data.sql',
    // 'clan_battle_boss_group.sql',
    'wave_group_data.sql',
    // 'resist_data.sql',
    // 'enemy_m_parts.sql',
    // 'enemy_parameter.sql',
    // 'unit_enemy_data.sql',
    // 'dungeon_area_data.sql',
    'quest_data.sql',
    'enemy_reward_data.sql',
    // 'campaign_schedule.sql',
    // 'campaign_freegacha.sql',
    // 'hatsune_schedule.sql',
    // 'hatsune_boss.sql',
    // 'hatsune_special_battle.sql',
    // 'tower_schedule.sql',
    // 'ailment_data.sql',
  ];

  const sqlRawObjs = getSqlRawObjs(sqlFilesDir, excludeFiles, includeFiles);

  /** @type {(tableName: string, fields: string[]) => void} */
  const delField = (tableName, fields) => {
    const rawObj = sqlRawObjs.find(obj => obj.tableName === tableName);
    rawObj.fields = rawObj.fields.filter(field => !fields.includes(field.fieldName));
    const excludeIdx = [];
    const item0 = rawObj.records[0];
    fields.forEach(field => {
      const i = item0.findIndex(value => value === field);
      excludeIdx.push(i, i + 1);
    });
    rawObj.records = rawObj.records.map(record => record.filter((_, i) => !excludeIdx.includes(i)));
  };

  /** @type {{ tableName: string, fields: string[] }[]} */
  const delArr = [
    { tableName: 'actual_unit_background', fields: ['bg_id', 'face_type'] },
    { tableName: 'enemy_reward_data', fields: ['drop_count', ...Array.from(Array(5)).map((_, i) => `reward_num_${i + 1}`)] },
    { tableName: 'equipment_craft', fields: ['crafted_cost'] },
    { tableName: 'equipment_data', fields: ['equipment_enhance_point', 'sale_price', 'require_level', 'enable_donation', 'display_item', 'item_type'] },
    { tableName: 'equipment_enhance_rate', fields: ['equipment_name'] },
    {
      tableName: 'quest_data', fields: ['limit_team_level', 'position_x', 'position_y', 'icon_id', 'stamina', 'stamina_start',
        'team_exp', 'unit_exp', 'love', 'limit_time', 'daily_limit', 'clear_reward_group', 'rank_reward_group',
        'background_1', 'wave_bgm_sheet_id_1', 'wave_bgm_que_id_1', 'story_id_wavestart_1', 'story_id_waveend_1',
        'background_2', 'wave_bgm_sheet_id_2', 'wave_bgm_que_id_2', 'story_id_wavestart_2', 'story_id_waveend_2',
        'background_3', 'wave_bgm_sheet_id_3', 'wave_bgm_que_id_3', 'story_id_wavestart_3', 'story_id_waveend_3',
        'enemy_image_1', 'enemy_image_2', 'enemy_image_3', 'enemy_image_4', 'enemy_image_5',
        'quest_detail_bg_id', 'quest_detail_bg_position', 'start_time', 'end_time', 'lv_reward_flag', 'add_treasure_num']
    },
    { tableName: 'skill_action', fields: ['level_up_disp'] },
    { tableName: 'skill_data', fields: ['skill_type', 'skill_area_width', ...Array.from(Array(7)).map((_, i) => `depend_action_${i + 1}`)] },
    { tableName: 'unique_equipment_data', fields: ['promotion_level', 'craft_flg', 'equipment_enhance_point', 'sale_price', 'require_level'] },
    { tableName: 'unique_equipment_enhance_rate', fields: ['equipment_name', 'description', 'promotion_level'] },
    { tableName: 'unit_data', fields: ['prefab_id', 'is_limited', 'motion_type', 'se_type', 'cutin_1', 'cutin_2', 'cutin1_star6', 'guild_id', 'cutin2_star6', 'exskill_display', 'only_disp_owned', 'start_time', 'end_time'] },
    { tableName: 'unit_profile', fields: ['voice_id'] },
    { tableName: 'unit_rarity', fields: ['consume_num', 'consume_gold'] },
    { tableName: 'wave_group_data', fields: ['id', 'odds'] }
  ];

  // 删除不必要的字段
  delArr.forEach(item => delField(item.tableName, item.fields));

  // 删除シェフィmain1+
  const skillDataObj = sqlRawObjs.find(obj => obj.tableName === 'unit_skill_data');
  const [targetIndex, main1EvIndex] = (() => {
    const temp = skillDataObj.records[0];
    const idIdx = temp.indexOf('unit_id') + 1;
    const main1EvIdx = temp.indexOf('main_skill_evolution_1') + 1;
    const targetIdx = skillDataObj.records.findIndex(record => record[idIdx] === '106401');
    return [targetIdx, main1EvIdx];
  })();
  skillDataObj.records[targetIndex][main1EvIndex] = '0'; 

  const waveGroupObj = sqlRawObjs.find(obj => obj.tableName === 'wave_group_data');
  waveGroupObj.primaryKeys = ['wave_group_id'];
  const newWGRecords = [];
  for (let record of waveGroupObj.records) {
    const idIdx = record.indexOf('wave_group_id');
    const idVal = record[idIdx + 1];
    if (idVal !== '210010013') {
      newWGRecords.push(record);
    }
  }
  waveGroupObj.records = newWGRecords;

  const excludeUnitID = [106701/*ホマレ*/, 110201/*ミサキ（サマー）*/, 900103/*ヒヨリ（不明）*/, 906601/*イノリ（不明）*/, 115901/*マコト（シンデレラ）*/, 116001/*マホ（シンデレラ）*/];
  const unitProfileObj = sqlRawObjs.find(obj => obj.tableName === 'unit_profile');
  const newUPRecords = [];
  for (let record of unitProfileObj.records) {
    const idIdx = record.indexOf('unit_id');
    const idVal = record[idIdx + 1];
    if (excludeUnitID.indexOf(parseInt(idVal)) < 0) {
      newUPRecords.push(record);
    }
  }
  unitProfileObj.records = newUPRecords;

  const actualUnitObj = sqlRawObjs.find(obj => obj.tableName === 'actual_unit_background');
  const newAURecords = [];
  for (let record of actualUnitObj.records) {
    const idIdx = record.indexOf('unit_id');
    record[idIdx + 1] = record[idIdx + 1].substr(0, 4) + '01';
    newAURecords.push(record);
  }
  actualUnitObj.records = newAURecords;

  const storyDetailRaw = fs.readFileSync(sqlFilesDir + '/story_detail.sql', { encoding: 'utf-8' });
  const storyDetailObj = getSqlRawObj(storyDetailRaw);
  const charaStoryStatusObj = sqlRawObjs.find(obj => obj.tableName === 'chara_story_status');
  charaStoryStatusObj.primaryKeys = ['chara_id', 'story_id'];
  charaStoryStatusObj.fields.unshift({ fieldName: 'chara_id', fieldType: 'number' });
  const unlockIndex = charaStoryStatusObj.fields.findIndex(value => value.fieldName === 'unlock_story_name');
  charaStoryStatusObj.fields[unlockIndex].fieldName = 'chara_type';
  charaStoryStatusObj.fields.splice(unlockIndex + 1, 0,
    { fieldName: 'title', fieldType: 'string' },
    { fieldName: 'sub_title', fieldType: 'string' }
  );
  charaStoryStatusObj.indexes.push({ indexName: 'chara_story_status_0_chara_id', indexFields: ['chara_id'] });
  /** @type {string[][]} */
  const newCSRecords = [];
  /** @type {(storyID: string) => string} */
  const getSubTitle = (storyID) => {
    const record = storyDetailObj.records.find(val => val.indexOf(storyID) > -1);
    const subTitleIdx = record.indexOf('sub_title');
    return record[subTitleIdx + 1];
  };
  /** @type {(record: string[], key: string, value: string) => void} */
  const setRecordValue = (record, key, value) => {
    record[record.indexOf(key) + 1] = value;
  };
  for (let record of charaStoryStatusObj.records) {
    const newRecord = [...record];
    const idKeyIdx = newRecord.indexOf('story_id');
    const idVal = newRecord[idKeyIdx + 1];
    const charaID = idVal.substr(0, 4);
    const storyID = parseInt(idVal.substr(4)).toString();
    newRecord[idKeyIdx + 1] = storyID;
    newRecord.splice(idKeyIdx, 0, 'chara_id', charaID);
    const unlockIdx = newRecord.indexOf('unlock_story_name');
    const unlockVal = newRecord[unlockIdx + 1];
    const charaName = unlockVal.match(/^(\S+)のエピソード/)[1];
    const title = unlockVal.match(/第\d+話$/)[0];
    const subTitle = getSubTitle(idVal);
    const typeMatch = charaName.match(/（(\S+)）/);
    const charaType = typeMatch ? typeMatch[1] : 'ノーマル';
    newRecord[unlockIdx] = 'chara_type';
    newRecord[unlockIdx + 1] = charaType;
    newRecord.splice(unlockIdx + 2, 0, 'title', title, 'sub_title', subTitle);
    if (storyID === '2') {
      const story1 = [...newRecord];
      setRecordValue(story1, 'story_id', '1');
      setRecordValue(story1, 'title', '第1話');
      setRecordValue(story1, 'sub_title', getSubTitle(charaID + '001'));
      let i = 1;
      while (i <= 5) {
        setRecordValue(story1, 'status_type_' + i, '0');
        setRecordValue(story1, 'status_rate_' + i, '0');
        i++;
      }
      newCSRecords.push(story1);
    }
    newCSRecords.push(newRecord);
  }
  charaStoryStatusObj.records = newCSRecords;

  const unitAttackPatternObj = sqlRawObjs.find(obj => obj.tableName === 'unit_attack_pattern');
  unitAttackPatternObj.indexes.push({ indexName: 'unit_attack_pattern_0_unit_id', indexFields: ['unit_id'] });

  sqlRawObjs.push({
    tableName: 'image_data',
    primaryKeys: ['url'],
    fields: [
      { fieldName: 'url', fieldType: 'string' },
      { fieldName: 'data_url', fieldType: 'string' },
      { fieldName: 'last_visit', fieldType: 'Date' }
    ],
    indexes: [
      { indexName: 'image_data_0_last_visit', indexFields: ['last_visit'] }
    ],
    records: [],
  });

  sqlRawObjs.push({
    tableName: 'chara_data',
    primaryKeys: ['unit_id'],
    fields: [
      { fieldName: 'unit_id', fieldType: 'number' },
      { fieldName: 'unit_name', fieldType: 'string' },
      { fieldName: 'kana', fieldType: 'string' },
      { fieldName: 'actual_name', fieldType: 'string' },
      { fieldName: 'min_rarity', fieldType: 'number' },
      { fieldName: 'max_rarity', fieldType: 'number' },
      { fieldName: 'unique_equip_id', fieldType: 'number' },
      { fieldName: 'search_area_width', fieldType: 'number' },
      { fieldName: 'atk_type', fieldType: 'number' },
      { fieldName: 'normal_atk_cast_time', fieldType: 'number' },
      { fieldName: 'comment', fieldType: 'string' },
    ],
    indexes: [],
    records: [],
  });

  sqlRawObjs.push({
    tableName: 'user_profile',
    primaryKeys: ['user_name', 'unit_id'],
    fields: [
      { fieldName: 'user_name', fieldType: 'string' },
      { fieldName: 'unit_id', fieldType: 'number' },
      { fieldName: 'level', fieldType: 'number' },
      { fieldName: 'rarity', fieldType: 'number' },
      { fieldName: 'promotion_level', fieldType: 'number' },
      { fieldName: 'unique_enhance_level', fieldType: 'number' },
      { fieldName: 'skill_enhance_status', fieldType: "Record</*skill*/'ub' | 1 | 2 | 'ex', /*enhance_level*/number>" },
      { fieldName: 'equip_enhance_status', fieldType: 'Record</*0-5*/number, /*enhance_level*/number>' },
      { fieldName: 'love_level_status', fieldType: 'Record</*chara_id*/number, /*love_level*/number>' },
    ],
    indexes: [
      { indexName: 'user_profile_0_user_name', indexFields: ['user_name'] }
    ],
    records: [],
  });

  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);
  const createStr = writeData(sqlRawObjs, dbDir + '/data/');
  writeOpenDB(dbDir + '/', dbName, dbVersion, createStr);
  writeMaxUserProfile(sqlFilesDir, sqlRawObjs);
}

main();
