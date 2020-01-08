# Cognito-SDK-Examples

### Amplify SDK with Android example


Usage:
- Download Example
- import it in your Android Studio using the option "Open an existing Android Studio project"

![APP UI](./README_Images/UI.png?raw=true "Title")

To update the app to use your own Cognito resources, simply update the awsconfiguration.json:
 ~~~
    "IdentityManager": {
        "Default": {}
    },
    "CredentialsProvider": {
        "CognitoIdentity": {
            "Default": {
                "PoolId": "ID_FROM_COGNITO_IDENTITY_POOL",
                "Region": "REGION_FROM_COGNITO_IDENTITY_POOL"
            }
        }
    },
    "CognitoUserPool": {
        "Default": {
            "PoolId": "ID_FROM_COGNITO_USER_POOL",
            "AppClientId": "APP_CLIENT_ID_FROM_COGNITO_USER_POOL",
            "Region": "REGION_FROM_COGNITO_USER_POOL"
        }
    },
  "Auth": {
  "Default": {
    "OAuth": {
      "WebDomain": "DOMAIN_NAME_FROM_COGNITO_USER_POOL",
      "SignInRedirectURI": "cognitoexample://www.example.com/mainactivity",
      "SignOutRedirectURI": "cognitoexample://www.example.com/mainactivity",
      "AppClientId": "APP_CLIENT_ID_FROM_COGNITO_USER_POOL",
      "Scopes": ["openid", "email", "aws.cognito.signin.user.admin"]
      }
    }
  }
}
~~~

To setup a valid user, modify the file strings.xml:
 ~~~
<resources>
    <string name="app_name">Amplify-Cognito-SDK</string>
    <string name="username">UPDATE_HERE</string>
    <string name="password">UPDATE_HERE</string>
</resources>
 ~~~
