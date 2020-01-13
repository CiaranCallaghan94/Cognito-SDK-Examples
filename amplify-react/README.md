# Cognito-SDK-Examples

### amplify-react
### Amplify SDK with React example


Usage:
- Download Example
- navigate to the amplify-react folder
- run 'npm install'
- then 'npm start'

[New components added]
![APP UI](./README_Images/UI.jpg?raw=true "Title")

To update the app to use your own Cognito resources, simply update the Auth object in the App.js:
Example:
 ~~~
// Auth: {
      // only for Federated Authentication - Amazon Cognito Identity Pool ID
      // identityPoolId: '',
      // - Amazon Cognito Region
      region: 'eu-west-1',
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
~~~

To use the Cognito react HOC instead, uncomment line 72 in App.js and comment out line 73:
Example:
 ~~~
export default withAuthenticator(App, false);
//export default App
~~~

To change the username and password for my sign in class, update the SignIn class and replace the hardcoded values.
Example:
 ~~~
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignIn = this.handleSignIn.bind(this);
  }
  async handleSignIn(){
     try {
		// Test Data
		var username = ""
		var password = ""
        const user = await Auth.signIn(username, password);
 ~~~
