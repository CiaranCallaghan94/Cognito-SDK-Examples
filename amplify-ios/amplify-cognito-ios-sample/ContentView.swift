//
//  ContentView.swift
//  amplify-cognito-ios-sample
//
//  Created by Valdivieso Gutierrez, Pedro Luis on 1/7/20.
//  Copyright © 2020 Amazon Web Services. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    @State private var showDetails = false

    var body: some View {
        
        NavigationView {
            
            VStack(spacing: 50) {
                
                Button(action: {
                    Cognito.signIn()
                }) {
                    Text("Sign in")
                }
                
                Button(action: {
                    Cognito.signIn()
                }) {
                    Text("Hosted UI")
                }
                
                Button(action: {
                    Cognito.signIn()
                }) {
                    Text("Built-in UI")
                }
                
                Button(action: {
                    Cognito.signOut()
                }) {
                    Text("Global sign out")
                }
                
                Button(action: {
                    Cognito.getUsername()
                }) {
                    Text("Username")
                }
                
                Button(action: {
                    Cognito.getTokens()
                }) {
                    Text("Tokens")
                }
                
            }.navigationBarTitle(Text("Cognito Amplify SDK"))
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
