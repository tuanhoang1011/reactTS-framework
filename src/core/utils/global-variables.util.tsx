import { CommonConstant } from '../constants/common.const';

export class GlobalVariables {
    // map to value in config files
    static messageLifeTimeMilSecond = 3000;
    static version = '';
    static defaultTheme = CommonConstant.Theme.Light.label;
    static logMaxBundleSize = 500;
    static requestHTTPTimeoutMilSecond = 60000;
    static autoSignOutIntervalMilSecond = 2000;
    static autoSignOutDurationMinute = 15;
    static splashScreenDurationMilSecond = 2000;
    static imageCarouselNumVisible = 5;
    static wsConfig = {
        reconnectInterval: 2000, // 2s
        reconnectAttempts: 10 // 10 times
    };

    // other
    static defaultLanguage = CommonConstant.Language.English.sortLabel;
    static language = CommonConstant.Language.English.sortLabel;
    static theme = CommonConstant.Theme.Light.label;
    static pendingAutoSignOut = false;
    static logConfig = {
        levels: ['All', 'Error', 'Operation', 'Info', 'Warn', 'Debug', 'Off'],
        dateFormat: 'yyyyMMdd hh:mm:ss',
        defaultUsername: 'GUEST'
    };
    static standardSize = {
        heightDialog: 590,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536
    };
    static isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    static isMac = /Mac/i.test(navigator.userAgent);
    static isOldEdge = /(Edge\/)/i.test(navigator.userAgent);
    static isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    static isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    static isFirefox = /firefox/i.test(navigator.userAgent);
}
