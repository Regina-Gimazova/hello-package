import React, { Component } from 'react';
import Api from "../../service/api";
import './VidyoConnector.css';
import Toolbar from '../Toolbar';

class VidyoConnector extends Component {
  constructor(props) {
    super(props);
    this.state = {
        host: 'prod.vidyo.io',
        token: '',
        displayName: '',
        resourceId: '',
        /* local devices */
        microphones:            {},
        speakers:               {},
        cameras:                {},
        /* screen sharing */
        screenShares:           {},
        isSharing:              false,
        /* toolbar props */
        buttonsAvailable:       false,
        participantStatus:      '',
        connectionStatus:       '',
        clientVersion:          '',
        screenShareButtonState: true,
        microphoneButtonState:  true,
        joinLeaveButtonState:   true,
        cameraButtonState:      true,
    };

    this.vidyoConnector = null;
    this.readyEventListener();
    this.getToken();
  }

  componentDidMount() {
      this.setState({resourceId: localStorage.getItem('resourceId')});
      this.setState({displayName: localStorage.getItem('displayName')})
  }

  getToken = () => {
    Api.getPendingCallsList()
      .then(data => {
          this.setState({
              token: data.meta.support_token,
          })
      })
      .catch(error => {
        console.log('Get Token failed')
      })
  };

  createVidyoConnector(VC) {
    VC.CreateVidyoConnector({
        viewId:             this.props.viewId,
        viewStyle:          this.props.viewStyle,
        remoteParticipants: this.props.remoteParticipants,
        logFileFilter:      this.props.logFileFilter,
        logFileName:        this.props.logFileName,
        userData:           this.props.userData
    }).then((vidyoConnector) => {

        this.initialize(vidyoConnector);

    }).catch(() => {
        console.error("CreateVidyoConnector Failed");
    });
  }

  initialize(vidyoConnector) {
    this.vidyoConnector = vidyoConnector;
    this.setState({ connectionStatus: 'Initializing...' });

    this.vidyoConnector.GetVersion().then((version) => {
        this.setState({ clientVersion: `v${version}` });
    }).catch(() => {
        // GetVersion failed
    });

    this.registerDeviceListeners();
    // handleDeviceChange(vidyoConnector, cameras, microphones, speakers);
    // registerAdvancedSettingsListeners(vidyoConnector);
    // handleAdvancedSettingsChange(vidyoConnector);
    this.handleParticipantChange();
    this.handleSharing();
    this.setState({ buttonsAvailable: true,
                    connectionStatus: 'Ready to connect' });
  }

  registerDeviceListeners() {
    let cameras     = this.state.cameras;
    let microphones = this.state.microphones;
    let speakers    = this.state.speakers;

    this.vidyoConnector.RegisterLocalCameraEventListener({
        onAdded:        (localCamera) => {
                            cameras[localCamera.id] = localCamera;
                        },
        onRemoved:      (localCamera) => {
                            delete cameras[localCamera.id];
                        },
        onSelected:     (localCamera) => {
                            // Camera was selected
                        },
        onStateUpdated: (localCamera, state) => {
                            // Camera state was updated
                        }
    }).then(() => {
        // RegisterLocalCameraEventListener Success
    })
    .catch(() => {
        // RegisterLocalCameraEventListener Failed
    });

    this.vidyoConnector.RegisterLocalMicrophoneEventListener({
        onAdded:        (localMicrophone) => {
                            microphones[localMicrophone.id] = localMicrophone;
                        },
        onRemoved:      (localMicrophone) => {
                            delete microphones[localMicrophone.id];
                        },
        onSelected:     (localMicrophone) => {
                            // Microphone was selected
                        },
        onStateUpdated: (localMicrophone, state) => {
                            // Microphone state was updated
                        }
    }).then(() => {
        // RegisterLocalMicrophoneEventListener Success
    }).catch(() => {
        // RegisterLocalMicrophoneEventListener Failed
    });

    this.vidyoConnector.RegisterLocalSpeakerEventListener({
        onAdded:        (localSpeaker) => {
                            speakers[localSpeaker.id] = localSpeaker;
                        },
        onRemoved:      (localSpeaker) => {
                            delete speakers[localSpeaker.id];
                        },
        onSelected:     (localSpeaker) => {
                            // Speaker was selected
                        },
        onStateUpdated: (localSpeaker, state) => {
                            // Speaker state was updated
                        }
    }).then(() => {
        // RegisterLocalSpeakerEventListener Success
    }).catch(() => {
        // RegisterLocalSpeakerEventListener Failed
    });

    this.setState({ cameras, microphones, speakers });
  }

  handleParticipantChange() {
    let getParticipantName = (participant, cb) => {
        participant.GetName().then( name => cb(name) );
    };
    this.vidyoConnector.RegisterParticipantEventListener({
        onJoined:           (participant) => {
                                getParticipantName(participant, (name) => {
                                    this.setState({ participantStatus: `${ name } Joined`});
                                });
                            },
        onLeft:             (participant) => {
                                getParticipantName(participant, (name) => {
                                    this.setState({ participantStatus: `${ name } Left`});
                                });
                            },
        onDynamicChanged:   (participants, cameras) => {
                                    // Order of participants changed
                            },
        onLoudestChanged:   (participant, audioOnly) => {
                                getParticipantName(participant, (name) => {
                                    this.setState({ participantStatus: `${ name } Speaking`});
                                })
                            }
    }).then(() => {
        // RegisterParticipantEventListener Success
    }).catch(() => {
        // RegisterParticipantEventListener Failed
    });
  }

  connectToConference() {
    let connectorDisconnected = (connectionStatus) => {
        this.setState({ joinLeaveButtonState: true,
                        connectionStatus });
    };

    this.vidyoConnector.Connect({

        host:         this.state.host,
        token:        this.state.token,
        displayName:  this.state.displayName,
        resourceId:   this.state.resourceId,

        onSuccess:      () => {
                            this.setState({ connectionStatus:   "Connected" });
                        },
        onFailure:      (reason) => {
                            connectorDisconnected("Failed");
                        },
        onDisconnected: (reason) => {
                            connectorDisconnected("Disconnected");
                        }
    }).then((status) => {
        if (status) {
        } else {
            connectorDisconnected("Failed");
        }
    }).catch((error) => {
        console.log(error)
        connectorDisconnected("Failed");
    });
  }

  handleSharing() {
    let screenShares = {};

    this.vidyoConnector.RegisterLocalWindowShareEventListener({
        onAdded:        (localWindowShare) => {
                            if (localWindowShare.name !== "") {
                                screenShares[localWindowShare.id] = localWindowShare;
                            }
                        },
        onRemoved:      (localWindowShare) => {
                            delete screenShares[localWindowShare.id];
                        },
        onSelected:     (localWindowShare) => {
                            if (localWindowShare) {
                                this.setState({ isSharing: true,
                                                screenShareButtonState: false });
                            } else {
                                this.setState({ isSharing: false,
                                                screenShareButtonState: true });
                            }
                        },
        onStateUpdated: (localWindowShare, state) => {
                            //  localWindowShare state was updated
                        }
    }).then(() => {
        //  RegisterLocalWindowShareEventListener Success
    }).catch(() => {
        //  RegisterLocalWindowShareEventListener Failed
    });

    this.setState({ screenShares });
  }

  cameraButtonOnClick(cameraButtonState) {
    this.setState({ cameraButtonState });
    if (this.vidyoConnector) {
        this.vidyoConnector.SetCameraPrivacy({
            privacy: this.state.cameraButtonState
        }).then(() => {
            // SetCameraPrivacy Success
        }).catch(() => {
            // SetCameraPrivacy Failed
        });
    }
  }

  joinLeaveButtonOnClick(joinLeaveButtonState) {
    this.setState({ joinLeaveButtonState });

    if (this.vidyoConnector) {
        if(this.state.joinLeaveButtonState) {
            this.connectToConference(this.vidyoConnector);
        } else {
            this.setState({ connectionStatus: "Disconnecting..." });
            this.vidyoConnector.Disconnect().then(() => {
                // Disconnect Success
            }).catch(() => {
                // Disconnect Failure
            });
        }
    }
  }

  returnToRoomListOnClick() {
      this.setState({connectionStatus: "Disconnecting..."});
      if (this.state.cameraButtonState) {
        this.cameraButtonOnClick(!this.state.cameraButtonState);
      }
      if (this.state.microphoneButtonState) {
        this.microphoneButtonOnClick(!this.state.microphoneButtonState);
      }
      if (this.vidyoConnector) {
          this.vidyoConnector.Disconnect().then(() => {
              // Disconnect Success
          }).catch(() => {
              // Disconnect Failure
          });
      }
  }

  microphoneButtonOnClick(microphoneButtonState) {
    this.setState({ microphoneButtonState });

    if (this.vidyoConnector) {
        this.vidyoConnector.SetMicrophonePrivacy({
            privacy: this.state.microphoneButtonState
        }).then(() => {
            // SetMicrophonePrivacy Success
        }).catch(() => {
            // SetMicrophonePrivacy Failed
        });
    }
  }

  readyEventListener() {
    if (window.LATEST_EVENT) {
      this.createVidyoConnector(window.LATEST_EVENT.detail);
    } else {
      document.addEventListener('vidyoclient:ready', (e) => {
        this.createVidyoConnector(e.detail);
      });
    }
  }

  render() {
    return (
      <div className="vidyo-connector">
        <div id={ this.props.viewId } className="renderer pluginOverlay rendererFullScreen"></div>
        <Toolbar
            clientVersion            = { this.state.clientVersion }
            connectionStatus         = { this.state.connectionStatus }
            participantStatus        = { this.state.participantStatus }

            buttonsAvailable         = { this.state.buttonsAvailable }
            cameraButtonState        = { this.state.cameraButtonState }
            joinLeaveButtonState     = { this.state.joinLeaveButtonState }
            microphoneButtonState    = { this.state.microphoneButtonState }
            screenShareButtonState   = { this.state.screenShareButtonState }

            cameraButtonOnClick      = { this.cameraButtonOnClick.bind(this) }
            joinLeaveButtonOnClick   = { this.joinLeaveButtonOnClick.bind(this) }
            microphoneButtonOnClick  = { this.microphoneButtonOnClick.bind(this) }
            returnToRoomListOnClick  = { this.returnToRoomListOnClick.bind(this)}
        />
      </div>
    );
  }
}

export default VidyoConnector;
