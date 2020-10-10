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

/**
 * @param {string[]} record 
 * @param {Field[]} fields 
 * @returns {string}
 */
function getRecordJSON(record, fields, quotes = '"') {
  let str = '{ ';
  let isKey = true;
  let tempKey = '';
  let len = record.length;
  for (let i = 0; i < len; i++) {
    if (isKey) {
      tempKey = record[i];
      str += `${quotes}${tempKey}${quotes}: `;
      isKey = false;
    } else {
      let value = record[i];
      if (getFieldType(fields, tempKey) === 'string') str += `${quotes}${value.replace(/\r/g, '').replace(/\n/g, '\\n')}${quotes}`;
      else str += value === '' ? 'undefined' : value;
      if (i < len - 1) str += ', ';
      isKey = true;
    }
  }
  str += ' }';
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
  // create += `      if (db.objectStoreNames.contains('${obj.tableName}'))\n`;
  // create += `        db.deleteObjectStore('${obj.tableName}');\n`;
  create += `      ${hasIndex ? 'const ' + lName + 'Store = ' : ''}db.createObjectStore('${obj.tableName}', {\n`;
  create += `        keyPath: ${getName(obj.primaryKeys)},\n`;
  create += '      });\n';
  if (hasIndex) {
    obj.indexes.forEach(index => {
      create += `      ${lName}Store.createIndex('${index.indexName}', ${getName(index.indexFields)});\n`;
    });
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
  // console.log(obj.primaryKeys, obj.fields);
  schema += `  '${obj.tableName}': {\n`;
  schema += `    key: ${getType(obj.primaryKeys, obj.fields)};\n`;
  // str += '    value: {\n';
  // sqlContentObject.fields.forEach(field => {
  //   str += `      '${field.fieldName}': ${field.fieldType};\n`;
  // });
  // str += '    };\n';
  schema += `    value: ${uName};\n`;
  if (obj.indexes.length > 0) {
    schema += '    indexes: {\n';
    obj.indexes.forEach(index => {
      schema += `      '${index.indexName}': ${getType(index.indexFields, obj.fields)};\n`;
    });
    schema += '    };\n';
  }
  schema += '  };\n';

  let dataJS = 'export default [\n';
  dataJS += obj.records.map(record => '  ' + getRecordJSON(record, obj.fields)).join(',\n');
  dataJS += '\n];\n';


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
  // dtsStr += 'export interface ImageData {\n'
  // dtsStr += '  url: string;\n';
  // dtsStr += '  data_url: string;\n';
  // dtsStr += '  last_visit: Date;\n';
  // dtsStr += '}\n\n';
  dtsStr += `export interface PCRDBSchema extends DBSchema {\n`;
  dtsStr += schemaStr;
  // dtsStr += "  'image_data': {\n";
  // dtsStr += '    key: string;\n';
  // dtsStr += '    value: ImageData;\n';
  // dtsStr += '    indexes: {\n';
  // dtsStr += "      'image_data_0_last_visit': Date;\n";
  // dtsStr += '    };\n';
  // dtsStr += '  };\n';
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
  jsStr += '      if (newVersion !== oldVersion) Array.from(db.objectStoreNames).forEach(name => db.deleteObjectStore(name));\n\n';
  jsStr += createStr;
  // jsStr += "      const imageDataStore = db.createObjectStore('image_data', {\n";
  // jsStr += "        keyPath: 'url',\n";
  // jsStr += '      });\n';
  // jsStr += "      imageDataStore.createIndex('image_data_0_last_visit', 'last_visit');\n\n"
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

function main() {
  const dbName = 'redive_master_db_diff-master';

  const sqlFilesDir = './' + dbName;

  const dbDir = './src/db';

  const dbVersion = getDBVersion(sqlFilesDir + '/!TruthVersion.txt');

  const excludeFiles = ['sqlite_stat1.sql', 'chara_e_ticket_data.sql'];

  const includeFiles = [
    'actual_unit_background.sql',
    'chara_story_status.sql',
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
    // 'item_data.sql'
    // 'clan_battle_period.sql',
    // 'clan_battle_map_data.sql',
    // 'clan_battle_2_map_data.sql',
    // 'clan_battle_boss_group.sql',
    // 'wave_group_data.sql',
    // 'resist_data.sql',
    // 'enemy_m_parts.sql',
    // 'enemy_parameter.sql',
    // 'unit_enemy_data.sql',
    // 'dungeon_area_data.sql',
    // 'quest_data.sql',
    // 'enemy_reward_data.sql',
    // 'campaign_schedule.sql',
    // 'campaign_freegacha.sql',
    // 'hatsune_schedule.sql',
    // 'hatsune_boss.sql',
    // 'hatsune_special_battle.sql',
    // 'tower_schedule.sql',
    // 'ailment_data.sql',
  ];

  const sqlRawObjs = getSqlRawObjs(sqlFilesDir, excludeFiles, includeFiles);

  const excludeUnitID = [106701/*ホマレ*/, 110201/*ミサキ（サマー）*/, 900103/*ヒヨリ（不明）*/, 906601/*イノリ（不明）*/];
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
      { fieldName: 'search_area_width', fieldType: 'number' },
      { fieldName: 'position', fieldType: 'number' },
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
      { fieldName: 'unique_equip_id', fieldType: 'number' },
      { fieldName: 'unique_enhance_level', fieldType: 'number' },
      { fieldName: 'skill_enhance_status', fieldType: "Record</*skill*/'ub' | 1 | 2 | 'ex', /*enhance_level*/number>" },
      { fieldName: 'equip_enhance_status', fieldType: 'Record</*equipment_id*/number, /*enhance_level*/number>' },
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
}

main();
