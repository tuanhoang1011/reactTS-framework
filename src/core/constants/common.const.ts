import * as wjPdf from '@grapecity/wijmo.pdf';
import { endOfDay, startOfDay } from 'date-fns';

export const CommonConstant = Object.freeze({
    WebSite: 'Tnet',
    NA: 'N/A',

    Language: {
        English: { value: 0, label: 'English', sortLabel: 'en' },
        Vietnamese: { value: 1, label: 'Tiếng Việt', sortLabel: 'vn' }
    },

    Theme: {
        Light: { value: 0, label: 'light' },
        Dark: { value: 1, label: 'dark' }
    },

    Gender: {
        Male: { value: 0, label: 'LBL_0001' },
        Female: { value: 1, label: 'LBL_0002' },
        Undefined: { value: 2, label: 'N/A' }
    },

    ActiveStatus: {
        Active: { value: 0, label: 'LBL_0003' },
        InActive: { value: 1, label: 'LBL_0004' }
    },

    DefaultDate: new Date(1920, 1, 1, 0, 0, 0, 0),

    ImageRatio: {
        Square: { ratio: 1 / 1, width: 1, height: 1 },
        Thumbnail: { ratio: 300 / 200, width: 300, height: 200 },
        Preview: { ratio: 800 / 600, width: 800, height: 600 }
    },

    PDFCommon: {
        PageSetting: {
            Default: {
                layout: wjPdf.PdfPageOrientation.Portrait,
                size: wjPdf.PdfPageSize.A4,
                margins: {
                    top: 20,
                    bottom: 20,
                    left: 50,
                    right: 50
                }
            }
        },
        Footer: {
            declarative: {
                text: '\t&[Page]/&[Pages]',
                brush: '#8A9999',
                font: new wjPdf.PdfFont('times', 10, 'normal', '500')
            }
        },
        ClassCSS: {
            NoPDF: 'no-pdf'
        }
    },

    CalendarConstant: {
        MinDate: startOfDay(new Date(1900, 0, 1)),
        MaxDate: endOfDay(new Date(2099, 11, 31)),
        MinYear: 1900,
        MaxYear: 2099,
        MinMonth: 1,
        MaxMonth: 12,
        MinDay: 1,
        MaxDay: 31
    }
});
