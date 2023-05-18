import useCommonFunc from '../../hooks/common-func.hook';
import { DialogInfo } from '../../models/common.model';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setPropsDialogManager } from './dialog-manager.reducer';

const useDialogManager = () => {
    const { dialogs } = useAppSelector((state) => state.dialogManager);
    const commonFuncHook = useCommonFunc();
    const dispatch = useAppDispatch();

    const open = (dialogInfo: DialogInfo) => {
        try {
            const isExisted = dialogs!.find((dlg) => dlg.dialogId === dialogInfo.dialogId);

            if (!isExisted) {
                // add new dialog to array
                dispatch(
                    setPropsDialogManager({
                        dialogs: [...dialogs!, dialogInfo]
                    })
                );
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const close = (dialogId: string) => {
        try {
            // remove dialog from array
            const closedDialog = dialogs!.find((dlg) => dlg.dialogId === dialogId);
            if (closedDialog) {
                dispatch(
                    setPropsDialogManager({
                        dialogs: dialogs!.filter((dlg) => dlg.dialogId !== dialogId)
                    })
                );
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return {
        open,
        close,
        dialogs
    };
};

export default useDialogManager;
