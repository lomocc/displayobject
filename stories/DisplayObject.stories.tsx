import { Meta } from '@storybook/react';
import React, { Component, useState } from 'react';
import DisplayObject from '../src';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <h1>Hello CodeSandbox {count}</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        increase
      </button>
    </div>
  );
}

const meta: Meta = {
  title: 'Welcome',
  // component: Thing,
  // argTypes: {
  //   children: {
  //     control: {
  //       type: 'text',
  //     },
  //   },
  // },
  // parameters: {
  //   controls: { expanded: true },
  // },
};

export default meta;

class Template extends Component {
  componentDidMount() {
    const displayObject = new DisplayObject((<App />));
    displayObject.startup(document.getElementById('root'));

    let child2 = new DisplayObject(
      (
        <div className="App">
          <h1>DispalyObject2</h1>
          <h2>DispalyObject2 DispalyObject2 DispalyObject2!</h2>
        </div>
      )
    );

    let child1 = new DisplayObject(
      (
        <div className="App">
          <button
            onClick={() => {
              displayObject.addChild(child2);
            }}
          >
            add
          </button>
          <button
            onClick={() => {
              displayObject.removeChild(child2);
            }}
          >
            remove
          </button>
        </div>
      )
    );
    displayObject.addChild(child1);
  }
  render() {
    return null;
  }
}

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = () => <Template />;

Default.args = {};
