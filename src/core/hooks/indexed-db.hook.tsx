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
