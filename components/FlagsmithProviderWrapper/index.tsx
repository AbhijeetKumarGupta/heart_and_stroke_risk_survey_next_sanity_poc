'use client';

import { FlagsmithProvider } from 'flagsmith/react';
import flagsmith from 'flagsmith/isomorphic';
import { JSXElementConstructor, ReactElement } from 'react';

export function FlagsmithProviderWrapper(
    { flagsmithState, children }: 
    { 
        flagsmithState: any, 
        children: ReactElement<any, string | 
        JSXElementConstructor<any>> 
    }
) {
  return (
    <FlagsmithProvider
      serverState={flagsmithState}
      options={{
        environmentID: process.env.FLAGSMITH_ENVIRONMENT_ID,
      }}
      flagsmith={flagsmith}
    >
      {children}
    </FlagsmithProvider>
  );
}
