import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BoostButton } from '../dist';

const App = () => {
  return (
    <div>
      <h1>Boost my cool Cat</h1>
      <BoostButton content="test" value={124_000} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
