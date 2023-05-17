import { Fragment, memo } from 'react';
import { useTranslation } from 'react-i18next';

import useDialogManager from '../../../core/components/dialog-manager/dialog-manager.hook';
import withBaseComponent from '../../../shared/base-component/base.component';
import DialogComponent from '../../../shared/dialog/dialog.component';

interface Props {
    dialogId: string;
    propA?: string;
    propB?: number;
    propC?: any;
}

const DialogBComponent = (props: Props) => {
    const dialogManagerHook = useDialogManager();
    const { t } = useTranslation();

    const close = () => {
        console.log(`Close ${props.dialogId}`);
        dialogManagerHook.close(props.dialogId);
    };

    return (
        <DialogComponent
            dialogId={props.dialogId}
            headerTitle={props.dialogId}
            styleClass="dialogB-class"
            modal={false}
            maximizable={true}
            onHide={() => close()}
        >
            <Fragment key="content">
                <div className="term-manual-main">
                    <div className="tm-file">
                        <div className="tm-f-text1">{t(props.propA ?? '')}</div>
                        <div className="tm-f-text1">{props.propB}</div>
                        <div className="tm-f-text1">{props.propC?.a}</div>
                        <div className="tm-f-text1">{props.propC?.c}</div>
                    </div>
                </div>
            </Fragment>
        </DialogComponent>
    );
};

export default withBaseComponent<Props>(memo(DialogBComponent))({ activeDialog: 'Dialog B - Screen' });
