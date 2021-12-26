import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/root/App/App';
import './styles/index.scss';
import configureStore from './store/configureStore';

const store = configureStore();

ReactDOM.render(<App store={store} />, document.getElementById('root'));
