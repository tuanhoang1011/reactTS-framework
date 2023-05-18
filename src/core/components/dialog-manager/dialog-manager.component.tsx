import { Fragment, memo, useMemo } from 'react';

import useDialogManager from './dialog-manager.hook';

const DialogManagerComponent = () => {
    const dialogManagerHook = useDialogManager();

    return (
        <div className="dialog-manager-container">
            {useMemo(
                () =>
                    dialogManagerHook.dialogs!.map((dlg) => {
                        return <Fragment key={dlg.dialogId}>{dlg.component}</Fragment>;
                    }),
                [dialogManagerHook.dialogs]
            )}
        </div>
    );
};

export default memo(DialogManagerComponent);
