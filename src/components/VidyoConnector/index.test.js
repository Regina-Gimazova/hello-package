import React from 'react';
import ReactDOM from 'react-dom';
import VidyoConnector from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<VidyoConnector />, div);
  ReactDOM.unmountComponentAtNode(div);
});
