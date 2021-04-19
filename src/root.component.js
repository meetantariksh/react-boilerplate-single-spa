/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from './utils/history';

// Import root app
import App from './containers/App';

// Import Language Provider
import LanguageProvider from './containers/LanguageProvider';

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);

export default function Root(props) {
    // Chunked polyfill for browsers without Intl support
    const [isIntlLoaded, setIntlLoadState] = useState(false);
    if (!window.Intl) {
        if (!isIntlLoaded) {
            new Promise((resolve) => {
                resolve(import('intl'));
            })
                .then(() =>
                    Promise.all([import('intl/locale-data/jsonp/en.js')]),
                )
                .then(function () {
                    setIntlLoadState(true);
                })
                .catch((err) => {
                    throw err;
                });
            return <div></div>;
        } else {
            return renderApplication(props, translationMessages);
        }
    } else {
        return renderApplication(props, translationMessages);
    }
}

function renderApplication(props, messages) {
    return (
        <Provider store={store}>
            <LanguageProvider messages={messages}>
                <ConnectedRouter history={history}>
                    <App />
                </ConnectedRouter>
            </LanguageProvider>
        </Provider>
    );
}
