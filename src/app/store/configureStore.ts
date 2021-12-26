import {
  createStore,
  applyMiddleware,
  compose,
  Store,
  ThunkAction,
  Action,
  ThunkDispatch,
} from '@reduxjs/toolkit';
// redux-thunk идет вместе с @redux/toolkit
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import type { RootState } from './reducers';

const configureStore = (initialState = {}): Store => {
  const enhancers = [];

  const middleware = [thunk];

  if (process.env.NODE_ENV !== 'production') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

  const store = createStore(rootReducer, initialState, composedEnhancers);

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./reducers', () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  return store;
};

export default configureStore;

export type AppThunkAction<T> = ThunkAction<T, RootState, unknown, Action<string>>;

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
