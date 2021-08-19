import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import {HashRouter, Switch, Route} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <HashRouter basename={process.env.PUBLIC_URL}>
      <Switch>
          <Route exact path='/' component={App}/>
          <Route path='/link/:code' component={App}/>
      </Switch>
  </HashRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
