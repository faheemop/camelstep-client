// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './i18next';
import * as Sentry from '@sentry/react';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import { API_ROOT, SENTRY_DSN, SENTRY_ENV } from './config';
import { initializeGuestSession } from './helpers/initializeGuestSession';

import './assets/styles/index.scss';

Sentry.init({
  environment: SENTRY_ENV,
  dsn: SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', API_ROOT],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const startApp = async () => {
  try {
    await initializeGuestSession();
    const root = createRoot(document.getElementById('root'));
    root.render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  } catch (error) {
    console.error('Failed to init guest session:', error);
  }
};

startApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
