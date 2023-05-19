import { Fragment, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import useDialogManager from '../../../core/components/dialog-manager/dialog-manager.hook';
import withBaseComponent from '../../../shared/base-component/base.component';
import ButtonComponent from '../../../shared/button/button.component';
import DialogComponent from '../../../shared/dialog/dialog.component';

interface Props {
    dialogId: string;
    propA?: string;
    propB?: number;
    propC?: any;
    clickFunc1?: () => void;
    clickFunc2?: () => void;
}

const DialogAComponent = (props: Props) => {
    const dialogManagerHook = useDialogManager();
    const { t } = useTranslation();

    const close = () => {
        props.clickFunc1!();
        console.log(`Close ${props.dialogId}`);
        dialogManagerHook.close(props.dialogId);
    };

    const clickAction = (action: string) =>
        useCallback(() => {
            props.clickFunc2!();
            alert(`Click action: ${t(action)}`);
        }, []);

    return (
        <DialogComponent
            dialogId={props.dialogId}
            headerTitle={props.dialogId}
            className="dialogA-class"
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

            <Fragment key="footer">
                <ButtonComponent
                    content="Button A"
                    className="btn-secondary"
                    onClickAction={clickAction('Button A')}
                ></ButtonComponent>
                <ButtonComponent
                    content="Button B"
                    className="btn-primary"
                    onClickAction={clickAction('Button B')}
                ></ButtonComponent>
            </Fragment>
        </DialogComponent>
    );
};

export default withBaseComponent<Props>(memo(DialogAComponent))({ activeDialog: 'Dialog A - Screen' });
