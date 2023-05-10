import { IDBPDatabase, openDB } from 'idb';

let dbPromise!: Promise<IDBPDatabase<object>>;
const idbName = process.env['REACT_APP_INDEXEDDB'] ?? '';

const useIndexedDB = () => {
    const createObjectStore = async (objStore: string) => {
        return (dbPromise = openDB<object>(idbName, 1, {
            upgrade(db) {
                db.createObjectStore(objStore);
            }
        }));
    };

    const deleteObjectStore = async (objStore: string) => {
        return (dbPromise = openDB<object>(idbName, 1, {
            upgrade(db) {
                db.deleteObjectStore(objStore);
            }
        }));
    };

    const getAll = async (objStore: string) => {
        return (await dbPromise).getAll(objStore);
    };

    const get = async (objStore: string, key: IDBKeyRange | IDBValidKey) => {
        return (await dbPromise).get(objStore, key);
    };

    const set = async (objStore: string, key: IDBKeyRange | IDBValidKey, val: any) => {
        return (await dbPromise).put(objStore, val, key);
    };

    const remove = async (objStore: string, key: IDBKeyRange | IDBValidKey) => {
        return (await dbPromise).delete(objStore, key);
    };

    const clear = async (objStore: string) => {
        return (await dbPromise).clear(objStore);
    };

    const keys = async (objStore: string) => {
        return (await dbPromise).getAllKeys(objStore);
    };

    const count = async (objStore: string) => {
        return (await dbPromise).count(objStore);
    };

    return { createObjectStore, deleteObjectStore, getAll, get, set, remove, clear, keys, count };
};

export default useIndexedDB;

export class IndexedDBService {
    dbPromise!: Promise<IDBPDatabase<object>>;
    idbName = process.env['REACT_APP_INDEXEDDB'] ?? '';

    private static instance?: IndexedDBService;

    constructor() {
        if (IndexedDBService.instance) return;
    }

    static getInstance() {
        try {
            if (!this.instance) {
                this.instance = new IndexedDBService();
            }

            return this.instance;
        } catch (error) {
            throw error;
        }
    }

    async createObjectStore(objStore: string) {
        // const a = indexedDB.open(this.idbName, 1);
        // a.onupgradeneeded = (event: any) => {
        //     const db = event?.target?.result;
        //     db.createObjectStore(objStore);
        //     console.log(db);
        // };
        // a.onsuccess = () => {
        //     console.log(a);
        // };

        return this.dbPromise;
    }

    async deleteObjectStore(objStore: string) {
        return (this.dbPromise = openDB<object>(this.idbName, 1, {
            upgrade(db) {
                db.deleteObjectStore(objStore);
            }
        }));
    }

    async getAll(objStore: string) {
        return (await this.dbPromise).getAll(objStore);
    }

    async get(objStore: string, key: IDBKeyRange | IDBValidKey) {
        return (await this.dbPromise).get(objStore, key);
    }

    async set(objStore: string, key: IDBKeyRange | IDBValidKey, val: any) {
        return (await this.dbPromise).put(objStore, val, key);
    }

    async delete(objStore: string, key: IDBKeyRange | IDBValidKey) {
        return (await this.dbPromise).delete(objStore, key);
    }

    async clear(objStore: string) {
        return (await this.dbPromise).clear(objStore);
    }

    async keys(objStore: string) {
        return (await this.dbPromise).getAllKeys(objStore);
    }

    async count(objStore: string) {
        return (await this.dbPromise).count(objStore);
    }
}
