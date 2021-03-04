import React from 'react';
import {hydrate} from 'react-dom';

import {App, AppProps} from './App';

const hydrateProps = (window as any).__APP_PROPS__ as AppProps;
if (!hydrateProps) {
    throw new Error('Hydration failed');
}

hydrate(<App {...hydrateProps} />, document.getElementById('root'));
