//
//  ConfirmUserViewController.swift
//  Cognito6717147381
//
//  Created by Anjum, Zeeshan on 09/01/2020.
//  Copyright © 2020 Anjum, Zeeshan. All rights reserved.
//

import UIKit
import AWSMobileClient

class ConfirmUserViewController: UIViewController {

    @IBOutlet weak var userNameTF: UITextField!
    @IBOutlet weak var confirmationCodeTF: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    

    @IBAction func confirmUser(_ sender: Any) {
        if let username = userNameTF.text, let code = confirmationCodeTF.text {
            resignFirstResponder()
            Cognito.confirmUser(username: username, confirmationCode: code) {[weak self] (error) in
                guard let self = self else {return}
                
                if error == nil {
                    DispatchQueue.main.async {
                        self.navigationController?.popViewController(animated: true)
                    }
                }
            }
        }
    }

    @IBAction func resendConfirmationCode(_sender: Any) {
        if let username = userNameTF.text {
            resignFirstResponder()
            Cognito.resendConfirmationCode(username: username) {[weak self] (error) in
                guard let self = self else {return}
                
                if error == nil {
                    DispatchQueue.main.async {
                        self.confirmationCodeTF.becomeFirstResponder()
                    }
                }
            }
        }
    }
    
}
