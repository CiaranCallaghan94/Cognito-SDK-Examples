import React from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

Amplify.configure({
  Auth: {
      // only for Federated Authentication - Amazon Cognito Identity Pool ID
      // identityPoolId: 'eu-west-1:f528caf6-04ca-46e0-ae06-03f0d14240a9',
      // - Amazon Cognito Region
      region: 'eu-west-1',
      // - Amazon Cognito User Pool ID
      userPoolId: 'eu-west-1_UxNvNpFcr',
      // - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '1rtmin31d9unkfpteemlj3ffdm',
      // - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false,
  }
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default withAuthenticator(App, true);
