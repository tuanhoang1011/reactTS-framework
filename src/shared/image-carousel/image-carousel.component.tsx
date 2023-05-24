import './image-carousel.component.scss';

import { Carousel } from 'primereact/carousel';
import { memo } from 'react';

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
    className?: string;
    contentClass?: string;
    indicatorsContentClass?: string;
    responsiveOptions: any[];
}

const ImageCarouselComponent = (props: Props) => {
    const generateItemsTemplate = (img: ImageItem) => {
        return (
            <ImageViewComponent
                src={img.src}
                alt={img.alt}
                className={img.className}
                width={img.width}
                height={img.height}
                previewMode={false}
            />
        );
    };

    return (
        <Carousel
            value={props.images}
            numVisible={props.numVisible}
            numScroll={props.numScroll}
            circular={props.circular}
            page={props.page}
            showIndicators={props.showIndicators}
            showNavigators={props.showNavigators}
            containerClassName={props.className}
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
