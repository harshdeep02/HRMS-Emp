import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Redux Provider ko import karein
import { BrowserRouter } from 'react-router-dom'; // Ise import karein

import App from './App.jsx';
// import './styles/index.scss';
import store from '../src/Redux/Store';
// import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
