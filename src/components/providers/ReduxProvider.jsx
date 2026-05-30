'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

/**
 * Provider component to wrap the Next.js application with Redux Store.
 */
export default function ReduxProvider({ children }) {
 return <Provider store={store}>{children}</Provider>;
}
