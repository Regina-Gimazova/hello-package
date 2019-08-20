import Api from './data/api';
import VidyoConnector from './components/VidyoConnector';
import PendingCallsList from './components/pendingCallsList'
import React, { Component } from 'react';

const host              = getUrlParameterByName("host", "prod.vidyo.io");
const token             = getUrlParameterByName("token");
const resourceId        = getUrlParameterByName("resourceId", "demoRoom");
const displayName       = getUrlParameterByName("displayName", "Guest");

const viewId                = "renderer";
const viewStyle             = "VIDYO_CONNECTORVIEWSTYLE_Default";
const remoteParticipants    = 8;
const logFileFilter         = "warning all@VidyoConnector info@VidyoClient";
const logFileName           = "";
const userData              = "";

class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {isOnCall: true};
  }

  componentDidMount() {
    this.loadCustomerList();
  }

  render() {
    if (this.state.isOnCall) {
      return (
        <VidyoConnector
                  host        = { host }
                  token       = { token }
                  resourceId  = { resourceId }
                  displayName = { displayName }
                  viewId             = { viewId }
                  viewStyle          = { viewStyle }
                  remoteParticipants = { remoteParticipants }
                  logFileFilter      = { logFileFilter }
                  logFileName        = { logFileName }
                  userData           = { userData }
                  onCallEnded        = { this.onCallEnded }
              />
      );
    }
    return (
      <PendingCallsList
        onItemClicked = { this.onItemClicked }
        callsList = { this.state.list }
      />
    );
  }

  onItemClicked(item) {
    // set state to on call
  }

  onCallEnded() {
    // setState to noCall
    // load loadCustomerList
  }

  loadCustomerList() {
    Api.getPendingCallsList()
      .then(list => {
        // set list to state
      })
      .catch(error => {
        //TODO onError
      })
  }
}

function getUrlParameterByName(name, _default = '') {
    let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return (match && decodeURIComponent(match[1].replace(/\+/g, ' '))) || _default;
}

export default AppComponent;
