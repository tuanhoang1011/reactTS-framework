import { LogSubType, LogType } from '../constants/log.const';
import { LogContent, LogExceptionContent } from '../models/log.model';
import useLog from './log.hook';

const useCommonFunc = () => {
    const logHook = useLog();

    const handleError = (error: Error | unknown) => {
        if (error instanceof Error) {
            logHook?.error(LogType.Error, {
                subType: LogSubType.Exception,
                errorContent: {
                    message: error.message
                } as LogExceptionContent
            } as LogContent);
        }
        console.error(error);
        throw error;
    };

    return {
        handleError
    };
};

export default useCommonFunc;
