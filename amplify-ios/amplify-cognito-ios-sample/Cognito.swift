//
//  SignIn.swift
//  amplify-cognito-ios-sample
//
//  Created by Valdivieso Gutierrez, Pedro Luis on 1/7/20.
//  Copyright © 2020 Amazon Web Services. All rights reserved.
//

import Foundation
import UIKit
import AWSMobileClient

typealias CognitoCompletionBlock = (Error?) -> Void

class Cognito {
    class func signUpUser(with username: String, password: String, userAttributes: [String: String]?, _ completionHandler: @escaping CognitoCompletionBlock) {
        AWSMobileClient.default().signUp(username: username,
                                                password: password, userAttributes: userAttributes!) { (signUpResult, error) in
                                                    if let error = error  {
                                                        print(error)
                                                    } else {
                                                        print("Successfully Signed up")
                                                    }
                                                    completionHandler(error)
        }
    }
    
    class func confirmUser(username: String, confirmationCode: String, _ completionHandler: @escaping CognitoCompletionBlock) {
        AWSMobileClient.default().confirmSignUp(username: username, confirmationCode: confirmationCode) { (signUpResult, error) in
            if let error = error  {
                print(error)
            } else {
                print("Successfully confirmed user")
            }
            completionHandler(error)
        }
    }
    
    class func resendConfirmationCode(username: String, _ completionHandler: @escaping CognitoCompletionBlock) {
        AWSMobileClient.default().resendSignUpCode(username: username) { (signUpResult, error) in
            if let error = error  {
                print("Failed sending confirmation code again")
                print(error)
            } else {
                print("Resent confirmtion code")
            }
        }
    }
    
    class func signIn(with username: String, password: String, _ completionHandler: @escaping CognitoCompletionBlock) {
        Cognito.initialize { (error) in
            if error == nil {
                AWSMobileClient.default().signIn(username: username, password: password) { (signInResult, error) in
                    if let error = error  {
                        print("\(error.localizedDescription)")
                        completionHandler(error)
                    } else if let signInResult = signInResult {
                        switch (signInResult.signInState) {
                        case .signedIn:
                            print("User is signed in.")
                        case .smsMFA:
                            print("SMS message sent to \(signInResult.codeDetails!.destination!)")
                        default:
                            print("Sign In needs info which is not yet supported.")
                        }
                        
                        completionHandler(nil)
                    }
                }
            }
        }
    }
    
    class func showBuiltInUi(navigationController: UINavigationController) {
        Cognito.initialize { (error) in
            if error == nil {
                AWSMobileClient.default().showSignIn(navigationController: navigationController, { (signInState, error) in
                    if let signInState = signInState {
                        print("Sign in flow completed: \(signInState)")
                    } else if let error = error {
                        print("error logging in: \(error.localizedDescription)")
                    }
                })
            }
        }
    }
    
    class func showHostedUI(navigationController: UINavigationController, completionHandler: @escaping CognitoCompletionBlock) {
        let hostedUIOptions = HostedUIOptions(scopes: ["openid", "email"])

        // Present the Hosted UI sign in.
        AWSMobileClient.default().showSignIn(navigationController: navigationController, hostedUIOptions: hostedUIOptions) { (userState, error) in
            if let error = error as? AWSMobileClientError {
                print(error.localizedDescription)
            }
            if let userState = userState {
                print("Status: \(userState.rawValue)")
                switch userState {
                case .signedIn:
                    completionHandler(nil)
                default:
                    print("User not signed in")
                }
            }
        }
    }
    
    class func signOut(_ completionHandler: @escaping CognitoCompletionBlock) {
        Cognito.initialize { (error) in
            if error == nil {
                AWSMobileClient.default().signOut(options: SignOutOptions(signOutGlobally: true)) { (error) in
                    if error != nil {
                        print("Error: \(error.debugDescription)")
                    }
                    completionHandler(error)
                }
            } else {
                completionHandler(error)
            }
        }
    }
    
    class func getUsername(_ completion: ((_ username: String?) -> Void)?) {
        Cognito.initialize { (error) in
            if error == nil {
                if let username = AWSMobileClient.default().username {
                    print("Loggedin user: " + username)
                    completion?(username)
                } else {
                    completion?(nil)
                }
            } else {
                completion?(nil)
            }
        }
    }
    
    class func getTokens() {
        Cognito.initialize { (error) in
            if error == nil {
                AWSMobileClient.default().getTokens { (tokens, error) in
                    if let error = error {
                        print("Error getting tokens \(error.localizedDescription)")
                    } else if let tokens = tokens {
                        if let idToken = tokens.idToken {
                            print(idToken.tokenString!)
                        }
                        
                        if let accessToken = tokens.accessToken {
                            print(accessToken.tokenString!)
                        }
                        
                        if let refreshToken = tokens.idToken {
                            print(refreshToken.tokenString!)
                        }
                    }
                }
            }
        }
    }
}


//MARK: Helpers
extension Cognito {
    class func initialize(_ completionHandler: @escaping CognitoCompletionBlock) {
        AWSMobileClient.default().initialize { (userState, error) in
            if let userState = userState {
                print("UserState: \(userState.rawValue)")
                completionHandler(nil)
            } else {
                completionHandler(error)
            }
        }
    }
}
