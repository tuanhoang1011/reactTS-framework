import { CanvasOptions } from '../models/common.model';
import { GlobalVariables } from '../utils/global-variables.util';

const useCanvas = () => {
    const toCanvas = async (element: HTMLElement, options: CanvasOptions = {}): Promise<HTMLCanvasElement> => {
        const { width, height } = getImageSize(element, options);
        options.width = width;
        options.height = height;

        const svg = await nodeToDataURL(element, options);
        const img = await createImage(svg);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        const ratio = options.pixelRatio;
        const canvasWidth = width;
        const canvasHeight = height;

        canvas.width = canvasWidth * ratio!;
        canvas.height = canvasHeight * ratio!;

        if (GlobalVariables.isMobile) {
            const totalSize = canvas.width * canvas.height;
            const totalLimitIOS = 16 * 1024 * 1024;

            if (totalSize > totalLimitIOS) {
                options.pixelRatio = Math.sqrt(totalLimitIOS / (canvasWidth * canvasHeight));
                canvas.width = canvasWidth * options.pixelRatio!;
                canvas.height = canvasHeight * options.pixelRatio!;
            }
        } else {
            checkCanvasDimensions(canvas);
        }

        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;

        context.scale(options.pixelRatio!, options.pixelRatio!);

        context.drawImage(img, 0, 0, canvasWidth, canvasHeight);

        return canvas;
    };

    const checkCanvasDimensions = (canvas: HTMLCanvasElement): void => {
        const canvasDimensionLimit = 16384;

        if (canvas.width > canvasDimensionLimit || canvas.height > canvasDimensionLimit) {
            if (canvas.width > canvasDimensionLimit && canvas.height > canvasDimensionLimit) {
                if (canvas.width > canvas.height) {
                    canvas.height = (canvas.height * canvasDimensionLimit) / canvas.width;
                    canvas.width = canvasDimensionLimit;
                } else {
                    canvas.width *= canvasDimensionLimit / canvas.height;
                    canvas.height = canvasDimensionLimit;
                }
            } else if (canvas.width > canvasDimensionLimit) {
                canvas.height *= canvasDimensionLimit / canvas.width;
                canvas.width = canvasDimensionLimit;
            } else {
                canvas.width *= canvasDimensionLimit / canvas.height;
                canvas.height = canvasDimensionLimit;
            }
        }
    };

    const createImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.crossOrigin = 'anonymous';
            img.decoding = 'sync';
            img.src = url;
        });
    };

    const getImageSize = (
        targetNode: HTMLElement,
        options: CanvasOptions = {}
    ): {
        width: number;
        height: number;
    } => {
        let width: number = options.width || getNodeWidth(targetNode);
        if (options.increaseWidth) {
            width += options.increaseWidth;
        }

        let height: number = options.height || getNodeHeight(targetNode);
        if (options.increaseHeight) {
            height += options.increaseHeight;
        }

        return { width, height };
    };

    const getNodeWidth = (node: HTMLElement): number => {
        const leftBorder = px(node, 'border-left-width');
        const rightBorder = px(node, 'border-right-width');

        return node.offsetWidth + leftBorder + rightBorder;
    };

    const getNodeHeight = (node: HTMLElement): number => {
        const topBorder = px(node, 'border-top-width');
        const bottomBorder = px(node, 'border-bottom-width');
        const topMargin = px(node, 'margin-top');
        const bottomMargin = px(node, 'margin-bottom');

        return node.offsetHeight + topBorder + bottomBorder + topMargin + bottomMargin;
    };

    const px = (node: HTMLElement, styleProperty: string): number => {
        const win = node.ownerDocument.defaultView || window;
        const val = win.getComputedStyle(node).getPropertyValue(styleProperty);

        return val ? parseFloat(val.replace('px', '')) : 0;
    };

    const serializeBody = (node: HTMLElement): string => {
        return node.innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '');
    };

    const combineToSvg = async (node: HTMLElement, options: CanvasOptions): Promise<string> => {
        const newNode = await setNodeStyle(node, undefined, true);
        const documentBody = serializeBody(newNode);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('height', options.height!.toString());
        svg.setAttribute('width', options.width!.toString());

        const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        foreignObject.removeAttribute('xmlns');
        foreignObject.setAttribute('x', '0');
        foreignObject.setAttribute('y', '0');
        foreignObject.setAttribute('height', '100%');
        foreignObject.setAttribute('width', '100%');

        const innerHtml = document.createElement('div');
        innerHtml.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        innerHtml.setAttribute('class', newNode.className);
        innerHtml.setAttribute('style', newNode.getAttribute('style')!);

        // additional namespace for rendering
        innerHtml.innerHTML = documentBody;

        foreignObject.appendChild(innerHtml);

        svg.appendChild(foreignObject);

        const svgString = new XMLSerializer().serializeToString(svg);

        return svgString;
    };

    const nodeToDataURL = async (element: HTMLElement, options: CanvasOptions): Promise<string> => {
        const svg = await combineToSvg(element, options);

        // Build base64 data url
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    };

    const setNodeStyle = async (
        node: HTMLElement,
        duplicateNode?: HTMLElement,
        isRoot = false
    ): Promise<HTMLElement> => {
        if (isRoot) {
            duplicateNode = node.cloneNode(true) as HTMLElement;
        }

        const setProperties = async (element: HTMLElement) => {
            if (element instanceof HTMLImageElement) {
                (duplicateNode as HTMLImageElement).src = await imageToBase64(element.src);
            }

            const styles = getComputedStyle(element);
            let hasIndex = false;
            let styleString = '';
            for (const key in styles) {
                let keyValue = '';
                if (typeof +key === 'number' && !isNaN(+key)) {
                    keyValue = styles[key];
                    hasIndex = true;
                } else {
                    if (hasIndex) {
                        return;
                    }

                    keyValue = (key.split('') || []).reduce((newKey, k) => {
                        if (k === k.toUpperCase()) {
                            k = `-${k.toLowerCase()}`;
                        }

                        newKey += k;

                        return newKey;
                    }, '');
                }

                const value = styles.getPropertyValue(keyValue);
                if (value) {
                    if (keyValue === 'background-image' && value.includes('url')) {
                        const url = value.replace('url("', '').replace('")', '');
                        const base64Img = await imageToBase64(url);

                        duplicateNode!.style.setProperty(keyValue, `url("${base64Img}")`);
                        styleString += `${keyValue}: "url("${base64Img}")";`;
                    } else {
                        duplicateNode!.style.setProperty(keyValue, value);
                        styleString += `${keyValue}: ${value};`;
                    }
                }
            }

            duplicateNode!.setAttribute('style', styleString);
        };

        const children = Array.from(node.children) as HTMLElement[];

        const promises = children.reduce((promise: any, item, index) => {
            promise.push(
                new Promise<void>(async (resolve) => {
                    const style = getComputedStyle(item as HTMLElement);
                    const duplicatedItem = duplicateNode?.children[index] as HTMLElement;

                    if (style.display !== 'none' && style.opacity !== '0') {
                        await setNodeStyle(item, duplicatedItem);
                    } else {
                        duplicatedItem.style.display = 'none';
                    }

                    resolve();
                })
            );

            return promise;
        }, []);

        await Promise.all(promises);

        await setProperties(node);

        return duplicateNode!;
    };

    const imageToBase64 = (url: string): Promise<string> => {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        });
    };

    return { toCanvas };
};

export default useCanvas;
