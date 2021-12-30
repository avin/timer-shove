import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/root/App/App';
import './styles/index.scss';
import configureStore from './store/configureStore';
import { setUiSettingsValues } from './store/reducers/uiSettings';

(async () => {
  const store = configureStore();

  const timerSetupString = (await window.ipcRenderer.invoke('getStoreValue', 'timerSetupString')) || '20 minutes';
  store.dispatch(setUiSettingsValues({ timerSetupString }));

  ReactDOM.render(<App store={store} />, document.getElementById('root'));
})();
