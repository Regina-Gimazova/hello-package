import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import * as registerServiceWorker from './registerServiceWorker';
import './index.css';
import App from './App';

const useNativeWebRTC = getUrlParameterByName("useNativeWebRTC", true);

loadRemoteVidyoClientLib(useNativeWebRTC, false);

function loadRemoteVidyoClientLib(useNativeWebRTC = false, plugin = false) {
    let script  = document.createElement('script');
    script.type = 'text/javascript';
    script.src  = `https://static.vidyo.io/latest/javascript/VidyoClient/VidyoClient.js?onload=onVidyoClientLoaded&useNativeWebRTC=${useNativeWebRTC}&plugin=${plugin}&webrtcLogLevel=info`;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function getUrlParameterByName(name, _default = '') {
    let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return (match && decodeURIComponent(match[1].replace(/\+/g, ' '))) || _default;
}


ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root'),
);

registerServiceWorker.unregister();
