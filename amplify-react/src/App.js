import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import { Auth, Hub} from 'aws-amplify';

window.LOG_LEVEL = 'DEBUG';

Amplify.configure({
  Auth: {
      // only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: '',
      // - Amazon Cognito Region
      region: '',
      // - Amazon Cognito User Pool ID
      userPoolId: '',
      // - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '',
      // - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false,

  // OPTIONAL - Hosted UI configuration
    oauth: {
    domain: '',
    scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: '',
    redirectSignOut: '',
    responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  }
});

class App extends React.Component {

  constructor(props) {
    super(props);
    Hub.listen('auth', (data) => {
    console.log(data);
        switch (data.payload.event) {
            case 'signIn':
                alert("Signed in");
                break;
            case 'signIn_failure':
                alert("Sign in failure");
                break;
      case  'signOut':
        alert("Sign Out");
                break;
            default:
                break;
        }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Below are some examples of Cognito functionality written using Amplify SDK
          </p>
        </header>
        <SignIn/>
        <OauthSignIn/>
        <SignOut/>
        <CurrentAuthenticatedUser/>
        <RetrieveCurrentSession/>
        <CurrentUserCredentials/>
        <CurrentCredentials/>
        <SocialLogins/>
      </div>
    );
  }
}

//export default withAuthenticator(App, false);
export default App

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
    <div className="Amplify-component">
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

class OauthSignIn extends React.Component {
  constructor(props) {
    super(props);
    this.handleFederatedSignIn = this.handleFederatedSignIn.bind(this);
  }
  handleFederatedSignIn(){
    Auth.federatedSignIn()
  }

  render() {
    return (
    <div className="Amplify-component">
      <h4>HostedUI Sign In</h4>
      <button onClick={this.handleFederatedSignIn}>Go to</button>
    </div>
    );
  }
}

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignIn = this.handleSignIn.bind(this);
  }
  async handleSignIn(){
     try {
    // Test Data
    var username = "ticker"
    var password = "Ticker123!@£"
        const user = await Auth.signIn(username, password);
        if (user.challengeName === 'SMS_MFA' ||
            user.challengeName === 'SOFTWARE_TOKEN_MFA') {
            // You need to get the code from the UI inputs
            // and then trigger the following function with a button click
           // const code = getCodeFromUserInput();
           // If MFA is enabled, sign-in should be confirmed with the confirmation code
           // const loggedUser = await Auth.confirmSignIn(
           //    user,   // Return object from Auth.signIn()
           //     code,   // Confirmation code
           //     mfaType // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
           // );
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            // const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
            // You need to get the new password and required attributes from the UI inputs
            // and then trigger the following function with a button click
            // For example, the email and phone_number are required attributes
            // const {username, email, phone_number} = getInfoFromUserInput();
            // const loggedUser = await Auth.completeNewPassword(
            //    user,              // the Cognito User Object
            //    newPassword,       // the new password
                // OPTIONAL, the required attributes
            //    {
            //        email,
            //        phone_number,
            //    }
            //);
        } else if (user.challengeName === 'MFA_SETUP') {
            // This happens when the MFA method is TOTP
            // The user needs to setup the TOTP before using it
            // More info please check the Enabling MFA part
            Auth.setupTOTP(user);
        } else {
            // The user directly signs in
            console.log(user);
        }
    } catch (err) {
        if (err.code === 'UserNotConfirmedException') {
            // The error happens if the user didn't finish the confirmation step when signing up
            // In this case you need to resend the code and confirm the user
            // About how to resend the code and confirm the user, please check the signUp part
        } else if (err.code === 'PasswordResetRequiredException') {
            // The error happens when the password is reset in the Cognito console
            // In this case you need to call forgotPassword to reset the password
            // Please check the Forgot Password part.
        } else if (err.code === 'NotAuthorizedException') {
            // The error happens when the incorrect password is provided
        } else if (err.code === 'UserNotFoundException') {
            // The error happens when the supplied username/email does not exist in the Cognito user pool
        } else {
            console.log(err);
        }
    }
  }

  render() {
    return (
    <div className="Amplify-component">
      <h4>Sign In as testUser</h4>
      <button onClick={this.handleSignIn}>Sign In</button>
    </div>
    );
  }
}

class CurrentUserCredentials extends React.Component {
  constructor(props) {
    super(props);
    this.handleCurrentUserCredentials = this.handleCurrentUserCredentials.bind(this);
  }
  handleCurrentUserCredentials(){
    Auth.currentUserCredentials()
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }

  render() {
    return (
    <div className="Amplify-component">
      <h4>Current User Credentials</h4>
      <button onClick={this.handleCurrentUserCredentials}>Check Console</button>
    </div>
    );
  }
}
class CurrentCredentials extends React.Component {
  constructor(props) {
    super(props);
    this.handleCurrentCredentials = this.handleCurrentCredentials.bind(this);
  }
  handleCurrentCredentials(){
    Auth.currentCredentials()
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }

  render() {
    return (
    <div className="Amplify-component">
      <h4>Current Credentials</h4>
      <button onClick={this.handleCurrentCredentials}>Check Console</button>
    </div>
    );
  }
}

////////SOCIAL
class SocialLogins extends React.Component {
  constructor(props) {
    super(props);
    this.handleRetrieveCurrentSession = this.handleRetrieveCurrentSession.bind(this);
  }
  handleRetrieveCurrentSession(){
    Auth.currentSession()
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }

  googleLogin() {
    Auth.federatedSignIn({provider: 'Google'}).then(() => 
      Auth.currentSession()
    )
  }

  facebookLogin() {
    Auth.federatedSignIn({provider: 'Facebook'}).then(() => 
      Auth.currentSession()
    )
  }

  appleLogin() {
    Auth.federatedSignIn({provider: 'SignInWithApple'}).then(() => 
      Auth.currentSession()
    )
  }

  amazonLogin() {
    Auth.federatedSignIn({provider: 'LoginWithAmazon'}).then(() => 
      Auth.currentSession()
    )
  }

  render() {
    return (
    <div className="Amplify-component">
      <h4>Social Logins</h4>
      <button onClick={this.googleLogin}>Google</button>
      <button onClick={this.facebookLogin}>Facebook</button>
      <button onClick={this.appleLogin}>Apple</button>
      <button onClick={this.amazonLogin}>Amazon</button>
    </div>
    );
  }
}
//////

// New Component
/*
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
*/
