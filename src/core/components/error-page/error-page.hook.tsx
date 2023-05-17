import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router';

import { AppRoutes } from '../../constants/router.const';
import { setPropsGlobal } from '../../store/reducers/global.reducer';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { isNullOrUndefined } from '../../utils/common-func.util';

export const useErrorPage = () => {
    const errorPage = useAppSelector((state) => state.global.errorPage);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const setErrorPage = (code?: HttpStatusCode) => {
        dispatch(
            setPropsGlobal({
                errorPage: code
            })
        );

        if (!isNullOrUndefined(code)) {
            navigate(`/${AppRoutes.Error}/${code}`);
        }
    };

    return { errorPage, setErrorPage };
};
