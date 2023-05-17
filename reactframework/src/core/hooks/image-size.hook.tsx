import { useEventListener } from 'primereact/hooks';
import { useEffect, useRef } from 'react';

import { CommonConstant } from '../constants/common.const';

interface Props {
    imgRatio?: number;
}

const useImageSize = <T,>(props: Props = { imgRatio: CommonConstant.ImageRatio.Thumbnail.ratio }) => {
    const ref = useRef<T>(null);
    const [bindResize, unbindResize] = useEventListener({
        type: 'resize',
        listener: () => {
            setImageSize();
        }
    });

    useEffect(() => {
        setImageSize();
        bindResize();

        return () => {
            unbindResize();
        };
    });

    const setImageSize = () => {
        setTimeout(() => {
            const el = ref.current as any;

            if (el) {
                const height = el.offsetWidth / props.imgRatio!;
                el.style.height = `${height}px`;
            }
        }, 200);
    };

    return [ref];
};

export default useImageSize;
