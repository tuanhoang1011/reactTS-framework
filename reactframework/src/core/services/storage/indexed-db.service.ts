import { IDBPDatabase, openDB } from 'idb';

export class IndexedDBService {
    dbPromise!: Promise<IDBPDatabase<object>>;
    indexedDBName = process.env['REACT_APP_INDEXEDDB'] ?? '';

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
        return (this.dbPromise = openDB<object>(this.indexedDBName, 1, {
            upgrade(db) {
                db.createObjectStore(objStore);
            }
        }));
    }

    async deleteObjectStore(objStore: string) {
        return (this.dbPromise = openDB<object>(this.indexedDBName, 1, {
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
