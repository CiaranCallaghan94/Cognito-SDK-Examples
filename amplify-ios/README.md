# Cognito-SDK-Examples

### Amplify SDK with iOS example

Usage:
- Download/clone the example
- Install dependencies with Pod: `pod install`
- Open the .xcworkspace file in Xcode
- Run the app
- Profit!

Please note that `myapp://` is setup by default for the hosted UI callback URL in the Info.plist file. Edit this value as necessary.

![APP UI](./README_Images/UI.png?raw=true "UI")

To update the app to use your own Cognito resources, simply update the awsconfiguration.json:
~~~
{
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
            "AppClientSecret": "APP_CLIENT_SECRET_FROM_COGNITO_USER_POOL",
            "Region": "REGION_FROM_COGNITO_USER_POOL"
        }
    },
    "Auth": {
        "Default": {
            "OAuth": {
                "WebDomain": "WEB_DOMAIN_COGNITO_USER_POOL_WITHOUT_HTTPS",
                "AppClientId": "APP_CLIENT_ID_FROM_COGNITO_USER_POOL",
                "AppClientSecret": "APP_CLIENT_SECRET_FROM_COGNITO_USER_POOL",
                "SignInRedirectURI": "SIGN_IN_REDIRECT_URI",
                "SignOutRedirectURI": "SIGN_OUT_REDIRECT_URI",
                "Scopes": ["openid", "email"]
            }
        }
    }
}
~~~
