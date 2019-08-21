import React from 'react';
import { Route, Switch } from 'react-router-dom';
import StartPage from './pages/StartPage';
import CallPage from './pages/CallPage';

const App = () => (
    <div>
        <Switch>
            <Route path="/" component={StartPage} exact/>
            <Route path="/call" component={CallPage} exact />
        </Switch>
    </div>
);

export default App;
