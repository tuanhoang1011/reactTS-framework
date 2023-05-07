import './index.scss';

import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import AppComponent from './app.component';
import LanguageEN from './assets/i18n/en.json';
import LanguageVN from './assets/i18n/vn.json';
import HTTPInterceptor from './core/services/interceptors/http-interceptor.service';
import ErrorBoundary from './core/services/log/global-error-handler.service';
import Store from './core/store/stores/store';
import { GlobalVariables } from './core/utils/global-variables.ultility';
import reportWebVitals from './reportWebVitals';

i18n.use(Backend)
    .use(initReactI18next)
    .init({
        interpolation: { escapeValue: false },
        fallbackLng: GlobalVariables.defaultLanguage, // default language
        lng: GlobalVariables.defaultLanguage, // use language
        resources: {
            en: {
                translation: LanguageEN
            },
            vn: {
                translation: LanguageVN
            }
        }
    });

const Root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
Root.render(
    // <React.StrictMode>
    <Provider store={Store}>
        <BrowserRouter>
            <ErrorBoundary>
                <HTTPInterceptor>
                    <AppComponent />
                </HTTPInterceptor>
            </ErrorBoundary>
        </BrowserRouter>
    </Provider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
