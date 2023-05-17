import './image-carousel.component.scss';

import { Carousel } from 'primereact/carousel';
import { memo, useRef } from 'react';

import { CommonProps } from '../../core/models/common-props.model';
import { ImageItem } from '../../core/models/item.model';
import { GlobalVariables } from '../../core/utils/global-variables.util';
import ImageViewComponent from '../image-view/image-view.component';

interface Props extends CommonProps {
    images: ImageItem[];
    circular: boolean;
    numScroll: number;
    numVisible: number;
    page: number;
    showIndicators: boolean;
    showNavigators: boolean;
    styleClass?: string;
    contentClass?: string;
    indicatorsContentClass?: string;
    responsiveOptions: any[];
}

const ImageCarouselComponent = (props: Props) => {
    const ref = useRef<Carousel>(null);

    const previewImage = (isTurnOn: boolean) => {
        const itemContainer = ref.current?.getElement().getElementsByClassName('p-carousel-items-container');
        // remove transform style to view image at preview mode
        setTimeout(() => {
            if (itemContainer) (itemContainer[0] as HTMLElement).style.transform = '';
        }, 0);
    };

    const generateItemsTemplate = (img: ImageItem) => {
        return (
            <ImageViewComponent
                src={img.src}
                alt={img.alt}
                styleClass={img.styleClass}
                transformMode={img.transformMode}
                width={img.width}
                height={img.height}
                onClickImageView={($event) => previewImage($event)}
            />
        );
    };

    return (
        <Carousel
            ref={ref}
            value={props.images}
            numVisible={props.numVisible}
            numScroll={props.numScroll}
            circular={props.circular}
            page={props.page}
            showIndicators={props.showIndicators}
            showNavigators={props.showNavigators}
            containerClassName={props.styleClass}
            contentClassName={props.contentClass}
            indicatorsContentClassName={props.indicatorsContentClass}
            responsiveOptions={props.responsiveOptions}
            itemTemplate={generateItemsTemplate}
        />
    );
};

ImageCarouselComponent.defaultProps = {
    images: [],
    circular: false,
    numScroll: 1,
    numVisible: GlobalVariables.imageCarouselNumVisible,
    page: 1,
    showIndicators: true,
    showNavigators: true,
    responsiveOptions: [
        {
            breakpoint: '1400px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '1220px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '1100px',
            numVisible: 1,
            numScroll: 1
        }
    ]
};

export default memo(ImageCarouselComponent);
