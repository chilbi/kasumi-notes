import { IDBPDatabase, StoreNames, IDBPTransaction, IDBPObjectStore } from 'idb';
import { PCRDBSchema } from './data';

export { PCRDBSchema } from './data';

export type PCRDB = IDBPDatabase<PCRDBSchema>;

export type PCRStoreNames = StoreNames<PCRDBSchema>;

export type PCRTransaction<TNames extends PCRStoreNames[]> = IDBPTransaction<PCRDBSchema, TNames>;

export type PCRStore<TNames extends PCRStoreNames[], TName extends PCRStoreNames> = IDBPObjectStore<PCRDBSchema, TNames, TName>;

export type PCRStoreValue<TName extends PCRStoreNames> = PCRDBSchema[TName]['value'];

interface Options {
  onInserted?: (db: PCRDB) => void;
  onProgress?: (count: number, total: number) => void;
}

export default function openPCRDB(options?: Options): Promise<PCRDB>;
