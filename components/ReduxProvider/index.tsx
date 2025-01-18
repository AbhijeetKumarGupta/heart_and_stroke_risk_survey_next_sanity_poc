'use client';

import { JSXElementConstructor, ReactElement } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from "@/src/store/store";

export function ReduxProvider(
    { children }:
        {
            children: ReactElement<any, string |
                JSXElementConstructor<any>>
        }
) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
