import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';

import { LogLevel, LogSubType, LogType } from '../constants/log.const';
import { LogContent, LogExceptionContent, LogRequest } from '../models/log.model';
import { useAppSelector } from '../store/stores/store';
import { GlobalVariables } from '../utils/global-variables.util';
import useIndexedDB from './indexed-db.hook';

const logDB = {
    ...GlobalVariables.logConfig,
    objectStore: process.env['REACT_APP_INDEXEDDB_OBJSTORE_LOG'] ?? '',
    maxBundleSize: GlobalVariables.logMaxBundleSize
};
let screenIdentifer = '';
let isCreatedStore = false;
let isPushingLog = false;
let pendingKey: IDBValidKey = '';

const useLog = () => {
    const { activeScreen, activeDialog } = useAppSelector((state) => state.global);
    const indexedDBHook = useIndexedDB();

    useEffect(() => {
        try {
            if (!isCreatedStore) {
                indexedDBHook.createObjectStore(logDB.objectStore);
                isCreatedStore = true;
            }
        } catch (error) {
            writeExceptionLog(error);
            throw error;
        }
    }, []);

    useEffect(() => {
        try {
            // set active screen/dialog for writing log
            screenIdentifer = activeDialog || activeScreen || '';
        } catch (error) {
            writeExceptionLog(error);
            throw error;
        }
    }, [activeDialog, activeScreen]);

    const pushingLogs = (): Promise<void> => {
        return new Promise(async (resolve) => {
            const finishPushingLogs = () => {
                isPushingLog = false;
                pendingKey = '';
                resolve();
            };

            try {
                // logs are pushing -> stop
                if (isPushingLog) {
                    resolve();
                    return;
                }

                isPushingLog = true;

                // don't get and push log bundles which are created from the start of calling pushingLogs until the end of pushingLogs
                let keys = (await indexedDBHook.keys(logDB.objectStore)) ?? [];
                keys = keys.filter((key) => key !== pendingKey);
                let totalLogs: LogRequest[] = [];

                for (let i = 0; i < keys.length; i++) {
                    const logs = ((await indexedDBHook.get(logDB.objectStore, keys[i])) as LogRequest[]) ?? [];
                    totalLogs = [...totalLogs, ...logs];
                }

                if (totalLogs.length === 0) {
                    finishPushingLogs();
                    return;
                }

                totalLogs.forEach((log: LogRequest) => {
                    // parse obj to string
                    log.errorContent = JSON.stringify(log.errorContent);
                });

                // remove later
                setTimeout(async () => {
                    for (let i = 0; i < keys.length; i++) {
                        await indexedDBHook.remove(logDB.objectStore, keys[i]);
                    }
                    finishPushingLogs();
                }, 3000);

                // check later
                // this.logAPIService.pushingLogs(totalLogs).subscribe({
                //     next: async (res) => {
                // for (let i = 0; i < keys.length; i++) {
                //     await indexedDBHook.remove(this.logDB.objectStore, keys[i]);
                // }
                // finishPushingLogs();
                //     },
                //     error: (err) => {
                //         if (err instanceof HttpErrorResponse) {
                //             this.msgService.error('MSG.APP_ERR0001');
                //             finishPushingLogs();
                //         }
                //     }
                // });
            } catch (error) {
                // this.msgService.error('MSG.APP_ERR0001');
                finishPushingLogs();
                writeExceptionLog(error);
                throw error;
            }
        });
    };

    const error = (type: string, log: LogContent) => {
        writeLog(LogLevel.Error, type, log);
    };

    const operation = (type: string, log: LogContent) => {
        writeLog(LogLevel.Operation, type, log);
    };

    const info = (type: string, log: LogContent) => {
        writeLog(LogLevel.Info, type, log);
    };

    const debug = (type: string, log: LogContent) => {
        writeLog(LogLevel.Debug, type, log);
    };

    const warn = (type: string, log: LogContent) => {
        writeLog(LogLevel.Warn, type, log);
    };

    const writeLog = async (level: string, type: string, log: LogContent) => {
        try {
            if (!log || !logDB.levels?.includes(level)) {
                return Promise.resolve();
            }

            const today = new Date();
            let key: IDBValidKey = '';

            /**
             * in case system is pushing logs
             * always add new logs into newest created bundle
             * -> this bundle will be ignore in pushing logs processing
             */
            if (isPushingLog) {
                key = pendingKey || `bundle-${today.toISOString()}`;
                pendingKey = key;
            } else {
                const keys = await indexedDBHook.keys(logDB.objectStore);

                if (isEmpty(keys)) {
                    key = `bundle-${today.toISOString()}`;
                } else {
                    /**
                     * system may have multiple log bundles but only first bundle has most log
                     * -> always get first bundle in order to compare with logMaxBundleSize
                     */
                    key = keys.shift()!;
                }
            }

            const newLog: LogRequest = {
                level: level,
                type: type,
                subType: log.subType,
                date: format(today, logDB.dateFormat ?? 'yyyyMMdd hh:mm:ss'),
                accountID: 'GUEST', // or ID of logged in account
                identifier: log.identifier,
                screen: screenIdentifer,
                destinationScreen: log.destinationScreen || undefined,
                apiName: log.apiName || undefined,
                errorContent: log.errorContent || undefined
            };
            let logBundle: LogRequest[] = [];
            logBundle = ((await indexedDBHook.get(logDB.objectStore, key)) as LogRequest[]) ?? [];
            logBundle.push(newLog);

            await indexedDBHook.set(logDB.objectStore, key, logBundle);

            // logBundle is always first bundle which has most logs -> use it to compare with logMaxBundleSize
            if (logBundle.length >= logDB.maxBundleSize) {
                pushingLogs();
            }
        } catch (error) {
            writeExceptionLog(error);
            throw error;
        }
    };

    const writeExceptionLog = (err: Error | unknown) => {
        if (error instanceof Error) {
            error(LogType.Error, {
                subType: LogSubType.Exception,
                errorContent: {
                    message: error.message
                } as LogExceptionContent
            } as LogContent);
        }
        console.error(error);
    };

    return { pushingLogs, error, operation, info, debug, warn };
};

export default useLog;
