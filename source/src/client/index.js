import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { JourneyComponent, JourneyProvider } from 'react-journey';

ReactDOM.render(
<JourneyProvider Component={JourneyComponent}>
    <App style={{padding : '0px'}} />
</JourneyProvider>
, document.getElementById('root'));
