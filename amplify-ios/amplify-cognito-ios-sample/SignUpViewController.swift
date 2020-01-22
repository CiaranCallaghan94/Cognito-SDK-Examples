//
//  SignUpViewController.swift
//  Cognito6717147381
//
//  Created by Anjum, Zeeshan on 03/01/2020.
//  Copyright © 2020 Anjum, Zeeshan. All rights reserved.
//

import UIKit

class SignUpViewController: UIViewController {

    @IBOutlet weak var userNameTF: UITextField!
    @IBOutlet weak var passwordTF: UITextField!
    @IBOutlet weak var emailTF: UITextField!
    @IBOutlet weak var nameTF: UITextField!
    @IBOutlet weak var phoneTF: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    
    @IBAction func signUp(_ sender: Any) {
        if let userName = userNameTF.text, let password = passwordTF.text, let email = emailTF.text, let name = nameTF.text, let phone = phoneTF.text {
            self.resignFirstResponder()
            Cognito.signUpUser(with: userName,
                               password: password,
                               userAttributes: ["email":email, "name":name, "phone_number":phone]) {[weak self] (error) in
                                guard let self = self else {return}
                                
                                if error == nil {
                                    DispatchQueue.main.async {
                                        self.navigationController?.popViewController(animated: true)
                                    }
                                }
            }
        }
    }
}
