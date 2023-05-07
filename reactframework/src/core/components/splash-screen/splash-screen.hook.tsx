import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setProps } from './splash-screen.reducer';

const useSplashScreen = () => {
    const isOn = useAppSelector((state) => state.splashScreen.isOn);
    const dispatch = useAppDispatch();

    const show = () => {
        try {
            dispatch(setProps({ isOn: true }));
        } catch (error) {
            throw error;
        }
    };

    const hide = () => {
        try {
            dispatch(setProps({ isOn: false }));
        } catch (error) {
            throw error;
        }
    };

    return {
        isOn,
        show,
        hide
    };
};

export default useSplashScreen;
