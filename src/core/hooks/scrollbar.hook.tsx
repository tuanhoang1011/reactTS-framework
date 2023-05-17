import { useEventListener } from 'primereact/hooks';
import { useEffect, useRef } from 'react';

import { GlobalVariables } from '../utils/global-variables.util';

interface Props {
    hasOffsetTop?: boolean;
    hasUpdateSize?: boolean;
    offsetBottom?: number;
    scrollHeight?: string;
    isDialog?: boolean;
    scrollHeightChange?: (height: string) => void;
    scrollToBottomEl?: (ended: boolean) => void;
}

const useScrollbarDialog = <T,>() => {
    const ref = useRef<T>(null);
    const [bindResize, unbindResize] = useEventListener({
        type: 'resize',
        listener: () => {
            setTimeout(() => {
                const el = ref.current as any;
                const dialogWidth = el.children[0].children[0].children[0].clientWidth;
                const bodyWidth = document.body.clientWidth;
                const width = dialogWidth > bodyWidth ? bodyWidth : dialogWidth;
                el.children[0].children[0].children[1].style.width = `${width}px`;
            }, 200);
        }
    });

    useEffect(() => {
        bindResize();

        return () => {
            unbindResize();
        };
    }, []);

    return [ref];
};

const useScrollbarTable = <T,>(
    props: Props = {
        hasOffsetTop: true,
        hasUpdateSize: true,
        offsetBottom: 0,
        scrollHeight: '',
        isDialog: false,
        scrollHeightChange: (height: string) => {}
    }
) => {
    const ref = useRef<T>(null);
    const [bindResize, unbindResize] = useEventListener({
        type: 'resize',
        listener: () => {
            updateWidthHeight();
        }
    });

    useEffect(() => {
        updateWidthHeight();
        bindResize();

        return () => {
            unbindResize();
        };
    }, []);

    useEffect(() => {
        updateWidthHeight();
    }, [props.hasUpdateSize]);

    const updateWidthHeight = () => {
        setTimeout(() => {
            const el = ref.current as any;
            const offsetTop = el.offsetTop;

            if (props.hasOffsetTop && !offsetTop) return;

            const rootHeight = window.innerHeight;
            const finalHeight = `${props.isDialog ? GlobalVariables.standardSize.heightDialog : rootHeight}px`;

            // add more height under table
            const remainHeight = `${offsetTop + props.offsetBottom}px`;
            props.scrollHeight = `calc(${finalHeight} - ${remainHeight})`;
            props.scrollHeightChange!(props.scrollHeight);
        }, 200);
    };

    return [ref];
};

const useScrollbarToBottomTable = <T,>(
    props: Props = {
        scrollToBottomEl: (ended: boolean) => {}
    }
) => {
    const ref = useRef<T>(null);
    const [bindScroll, unbindScroll] = useEventListener({
        type: 'scroll',
        target: ref.current as any,
        listener: (e) => {
            const { offsetHeight, scrollTop, scrollHeight } = e.target as any;
            props.scrollToBottomEl!(scrollTop + offsetHeight === scrollHeight);
        }
    });

    useEffect(() => {
        bindScroll();

        return () => {
            unbindScroll();
        };
    }, []);

    return [ref];
};

const useScrollbarDiv = <T,>(
    props: Props = {
        hasOffsetTop: true
    }
) => {
    const ref = useRef<T>(null);
    const [bindResize, unbindResize] = useEventListener({
        type: 'resize',
        listener: () => {
            updateWidthHeight();
        }
    });

    useEffect(() => {
        updateWidthHeight();
        bindResize();

        return () => {
            unbindResize();
        };
    }, []);

    const updateWidthHeight = () => {
        setTimeout(() => {
            const el = ref.current as any;
            let offsetTop = el.offsetTop;

            if (props.hasOffsetTop && !offsetTop) return;

            offsetTop = `${offsetTop}px`;
            const rootHeight = window.innerHeight;
            el.style.maxHeight = `calc(${rootHeight}px - ${offsetTop})`;
        }, 200);
    };

    return [ref];
};

export { useScrollbarDialog, useScrollbarTable, useScrollbarToBottomTable, useScrollbarDiv };
