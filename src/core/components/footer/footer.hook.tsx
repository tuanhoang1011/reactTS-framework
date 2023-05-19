import useCommonFunc from '../../hooks/common-func.hook';
import useHttpBase from '../../hooks/http-base.hook';
import { MenuItem } from '../../models/item.model';

const root = '../json/';
const footerJSON = `${root}items/footer.json`;

const useFooter = () => {
    const commonFuncHook = useCommonFunc();
    const httpBaseHook = useHttpBase();

    const getNavMenu = async () => {
        try {
            return (await httpBaseHook.getLocalFile<{ menu: MenuItem[] }>(footerJSON)).menu;
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return {
        getNavMenu
    };
};

export default useFooter;
