import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import {OwnerStart} from './containers/OwnerStart'
import { Route } from 'react-router-dom';
import './css/tailwind.css';
import Calendar from './containers/Calendar';


ReactDOM.render(

    <BrowserRouter>
        <div>
            <Route exact path="/" component={OwnerStart}/>
            <Route path="/group/:group_str_id" component={Calendar}/>
        </div>
    </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();