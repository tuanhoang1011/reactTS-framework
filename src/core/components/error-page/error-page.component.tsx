import './error-page.component.scss';

import { HttpStatusCode } from 'axios';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import withBaseComponent from '../../../shared/base-component/base.component';
import ButtonComponent from '../../../shared/button/button.component';
import { LogActiveScreen } from '../../constants/log.const';
import { AppRoutes } from '../../constants/router.const';
import useCommonFunc from '../../hooks/common-func.hook';
import { ErrorPage } from '../../models/common.model';
import { isNullOrUndefined } from '../../utils/common-func.util';
import { useErrorPage } from './error-page.hook';

const ErrorPageComponent = () => {
    const errorPageHook = useErrorPage();
    const commonFuncHook = useCommonFunc();
    const paramsHook = useParams();

    const [error, setError] = useState({
        code: undefined!,
        title: '',
        msg: '',
        isShowBackBtn: false,
        isShowHomeBtn: false
    } as ErrorPage);

    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        snapshotError();

        return () => {
            errorPageHook.setErrorPage(undefined);
        };
    }, []);

    const back = () => {
        navigate(-1);
    };

    const goHome = () => {
        navigate(`/${AppRoutes.Public}`);
    };

    const snapshotError = () => {
        try {
            const errCode = paramsHook['code'];
            let error: ErrorPage;

            if (!isNullOrUndefined(errCode)) {
                error = {
                    code: +errCode!,
                    title: `ERRPAGE.${errCode}.TITLE`,
                    msg: `ERRPAGE.${errCode}.MSG`
                };

                switch (+errCode!) {
                    case HttpStatusCode.BadRequest:
                        error = {
                            ...error,
                            isShowBackBtn: true,
                            isShowHomeBtn: false
                        };
                        break;

                    case HttpStatusCode.Forbidden:
                        error = {
                            ...error,
                            isShowBackBtn: true,
                            isShowHomeBtn: true
                        };
                        break;

                    case HttpStatusCode.InternalServerError:
                        error = {
                            ...error,
                            isShowBackBtn: false,
                            isShowHomeBtn: false
                        };
                        break;

                    case HttpStatusCode.NotFound:
                    default:
                        error = {
                            ...error,
                            code: HttpStatusCode.NotFound,
                            title: `ERRPAGE.${HttpStatusCode.NotFound}.TITLE`,
                            msg: `ERRPAGE.${HttpStatusCode.NotFound}.MSG`,
                            isShowBackBtn: true,
                            isShowHomeBtn: true
                        };
                        break;
                }
            } else {
                error = {
                    code: HttpStatusCode.NotFound,
                    title: `ERRPAGE.${HttpStatusCode.NotFound}.TITLE`,
                    msg: `ERRPAGE.${HttpStatusCode.NotFound}.MSG`,
                    isShowBackBtn: true,
                    isShowHomeBtn: true
                };
            }

            setError(error);
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return (
        <>
            {error.code && (
                <div className="errpage-container animation-zoom-in">
                    <div className="errpage-child-1">
                        <h1 className="errpage-code">{error.code}</h1>
                        <div className="errpage-content">
                            <h3 className="errpage-title">{t(error.title)}</h3>
                            <h6 className="errpage-msg">{t(error.msg)}</h6>
                            <div className="errpage-btn">
                                {error.isShowBackBtn && (
                                    <ButtonComponent
                                        content="BTN_0005"
                                        styleClass="btn-secondary"
                                        onClickAction={() => back()}
                                    />
                                )}

                                {error.isShowHomeBtn && (
                                    <ButtonComponent
                                        content="BTN_0006"
                                        styleClass="btn-primary"
                                        onClickAction={() => goHome()}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default withBaseComponent(memo(ErrorPageComponent))({ activeScreen: LogActiveScreen.ErrorPage });
