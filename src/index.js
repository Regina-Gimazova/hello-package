import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppComponent from './AppComponent';
import registerServiceWorker from './registerServiceWorker';

const useNativeWebRTC   = getUrlParameterByName("useNativeWebRTC", true);

loadRemoteVidyoClientLib(useNativeWebRTC, false);

ReactDOM.render(<AppComponent/>, document.getElementById('root'));

registerServiceWorker();

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
