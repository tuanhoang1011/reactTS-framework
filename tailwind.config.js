import { createThemes } from 'tw-colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    safelist: [
        {
            pattern: /grid-(cols|rows)/
        },
        {
            pattern: /gap/
        },
        {
            pattern: /col-span/
        },
        {
            pattern: /row-span/
        },
        {
            pattern: /text-(left|right)/
        },
        {
            pattern: /w-(1\/2|full)/
        }
    ],
    // darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontSize: {
                'fs-default': '16px',
                'fs-msg': '14px'
            },

            minWidth: {
                support: '1200px',
                'sidebar-expand': '220px',
                'sidebar-collapse': '60px',
                'icon-btn': '40px'
            },

            maxWidth: {
                support: '1200px',
                'sidebar-expand': '220px',
                'sidebar-collapse': '60px',
                'icon-btn': '40px'
            },

            width: (theme) => ({
                min: theme('minWidth.support'),
                max: theme('maxWidth.support'),
                'icon-btn': '40px'
            }),

            minHeight: {
                'icon-btn': '40px'
            },

            maxHeight: {
                'icon-btn': '40px'
            },

            height: {
                header: '48px',
                sidebar: 'calc(100vh - 48px)', // minus header height
                'icon-btn': '40px'
            },

            opacity: {
                disable: '0.4',
                hover: '0.6',
                active: '0.8'
            },

            borderRadius: {
                default: '10px'
            },

            boxShadow: {
                errpage: '5px 5px 30px 20px'
            }
        }
    },
    variants: {
        backgroundColor: ['responsive', 'hover', 'focus', 'focus-visible', 'checked', 'active'],
        boxShadow: ['responsive', 'hover', 'focus', 'focus-visible'],
        boxShadowOutline: ['responsive', 'hover', 'focus', 'checked', 'active'],
        borderColor: ['responsive', 'hover', 'focus', 'focus-visible', 'checked', 'active'],
        borderWidth: ['responsive', 'hover'],
        cursor: ['responsive', 'disabled'],
        opacity: ['responsive', 'hover', 'focus', 'disabled'],
        textColor: ['responsive', 'hover', 'focus', 'focus-visible'],
        fill: ['hover', 'focus']
    },
    plugins: [
        createThemes({
            light: {
                // common
                'bg-primary': '#000',
                'bg-secondary': '#1e222d',
                primary: '#1ea97c',
                secondary: '#a0a3ad',
                danger: '#F23645',
                border: '#50535e',
                hyperlink: '#1ea97c',

                // loading
                mask: '#1e222dcc',
                'loading-gradient-fr': '#00f0fc',
                'loading-gradient-to': '#bcfd02',

                // text
                'txt-default': '#C8CCD8',
                'txt-title': '#f2f2f2',
                'txt-btn': '#fff',

                // header
                'header-menu': '#707070',
                'header-submenu': '#707070',

                // sidebar
                'sidebar-menu': '#707070',
                'sidebar-submenu': '#707070',

                // footer
                'footer-menu': '#707070',
                'footer-submenu': '#707070',

                // dialog
                'dialog-header': '#707070',
                'dialog-content': '#707070',

                // button
                'btn-primary': '#1ea97c',
                'btn-secondary': '#1ea97c',
                'btn-danger': '#F23645',
                'btn-icon': '#1e222d',

                // message
                success: '#1ea97c',
                warn: '#cc8925',
                error: '#FC6161',
                info: '#696cff',
                confirm: '#50535e',

                // scrollbar
                scrollbar: '#50535e',
                'scrollbar-hover': '#465268'
            },
            dark: {
                // common
                'bg-primary': '#000',
                'bg-secondary': '#1e222d',
                primary: '#149eca',
                secondary: '#a0a3ad',
                danger: '#F23645',
                border: '#50535e',
                hyperlink: '#149eca',

                // loading
                mask: '#1e222dcc',
                'loading-gradient-fr': '#149eca',
                'loading-gradient-to': '#c56dba',

                // text
                'txt-default': '#C8CCD8',
                'txt-title': '#f2f2f2',
                'txt-btn': '#fff',

                // header
                'header-menu': '#707070',
                'header-submenu': '#707070',

                // sidebar
                'sidebar-menu': '#707070',
                'sidebar-submenu': '#707070',

                // footer
                'footer-menu': '#707070',
                'footer-submenu': '#707070',

                // dialog
                'dialog-header': '#707070',
                'dialog-content': '#707070',

                // button
                'btn-primary': '#149eca',
                'btn-secondary': '#149eca',
                'btn-danger': '#F23645',
                'btn-icon': '#1e222d',

                // message
                success: '#149eca',
                warn: '#cc8925',
                error: '#FC6161',
                info: '#696cff',
                confirm: '#50535e',

                // scrollbar
                scrollbar: '#50535e',
                'scrollbar-hover': '#465268'
            }
        })
    ]
};
