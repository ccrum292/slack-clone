import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './store/store';
import CssBaseline from '@material-ui/core/CssBaseline';

ReactDOM.render(
  <BrowserRouter>
    <StoreProvider>
      <CssBaseline/>
      <App />
    </StoreProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
