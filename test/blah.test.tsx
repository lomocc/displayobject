import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as DisplayObject } from '../stories/DisplayObject.stories';

describe('DisplayObject', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DisplayObject />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
