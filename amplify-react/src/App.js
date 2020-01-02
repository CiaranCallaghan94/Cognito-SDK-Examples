import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import { Auth } from 'aws-amplify';

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

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Below are some examples of Cognito functionality written using Amplify SDK
          </p>
        </header>
        <SignOut/>
        <CurrentAuthenticatedUser/>
        <RetrieveCurrentSession/>
      </div>
    );
  }
}

export default withAuthenticator(App, false);

//  Functionality Components
// Global Sign Out
class SignOut extends React.Component {
  constructor(props) {
    super(props);

    this.handleGlobalSignOut = this.handleGlobalSignOut.bind(this);
  }
  handleGlobalSignOut(){
    Auth.signOut({ global: true })
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }

  render() {
    return (
    <div className="Amplify-component">
      <h4>Global Sign Out</h4>
      <button onClick={this.handleGlobalSignOut}>Sign Out</button>
    </div>
    );
  }
}

// Current Authenticated User
class CurrentAuthenticatedUser extends React.Component {
  constructor(props) {
    super(props);

    this.handleGetCurrentAuthenticatedUser = this.handleGetCurrentAuthenticatedUser.bind(this);
  }
  handleGetCurrentAuthenticatedUser(){
    Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => console.log(user))
    .catch(err => console.log(err));
  }

  render() {
    return (
    <div className="Amplify-component Amplify-component-light">
      <h4>Current Authenticated User</h4>
      <button onClick={this.handleGetCurrentAuthenticatedUser}>Check Console</button>
    </div>
    );
  }
}

// Retrieve Current Session
class RetrieveCurrentSession extends React.Component {
  constructor(props) {
    super(props);
    this.handleRetrieveCurrentSession = this.handleRetrieveCurrentSession.bind(this);
  }
  handleRetrieveCurrentSession(){
    Auth.currentSession()
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }

  render() {
    return (
    <div className="Amplify-component">
      <h4>Retrieve Current Session</h4>
      <button onClick={this.handleRetrieveCurrentSession}>Check Console</button>
    </div>
    );
  }
}