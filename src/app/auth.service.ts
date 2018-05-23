import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private http:HttpClient,
    private spinnerService: Ng4LoadingSpinnerService) { }
    signInMessage: string = '';
    signUpMessage: string = '';
    resetPasswordMessage: string = 'We will send you an email to reset your password.';
    isEmailValid: boolean = false;
    resetPasswordFailEmail: string = '';

  onSignUpWithEmail(username, email, password, confirmation, first_name, last_name, address1, city, phone, zip) {
    const signUpData = {
      "identifier": username,
      "email": email
    }
    this.spinnerService.show();
    this.http.post(environment.usersDatabase, {username: signUpData})
    .toPromise().then(()=>{
      const Multipassify = require('multipassify');
      const multipassify = new Multipassify(environment.multipassSecret);
      const customerData = {email: email, first_name: first_name, last_name: last_name,
                            multipass_identifier: username, return_to:"https://myshippingtest.myshopify.com/account/",
                            addresses: [{address1: address1,
                                        city: city,
                                        first_name: first_name,
                                        last_name: last_name,
                                        phone: phone,
                                        zip: zip,
                                        default: true,
                                        }]};
      const token = multipassify.encode(customerData);
      const url = multipassify.generateUrl(customerData, "myshippingtest.myshopify.com");
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        window.top.location.href = url;
      });
    })
    .catch((error)=>{
      this.signUpMessage = 'Please fill in all blanks.';
      this.spinnerService.hide();
    });
  }

  onSignInWithUsername(username, password) {
    this.spinnerService.show();
    this.http.get(environment.usersDatabase)
    .subscribe((data:any)=>{
        data.find((x)=>{
          if (x.identifier === username) {
            const signInData = {
              "email": x.email,
              "password": password
            }
            const Multipassify = require('multipassify');
            const multipassify = new Multipassify(environment.multipassSecret);
            const customerData = {email: x.email};
            const token = multipassify.encode(customerData);
            const url = multipassify.generateUrl(customerData, "myshippingtest.myshopify.com");
            return this.afAuth.auth.signInWithEmailAndPassword(x.email, password)
            .then(()=>{
              window.top.location.href = url;
            });
          } else {
            this.signInMessage = 'Invalid username or password.';
            this.spinnerService.hide();
          }
        })
    });
  }

  resetPassword(email: string) {
    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(email)
      .then(() => {
        this.isEmailValid = true;
        this.resetPasswordMessage = 'Instructions has been sent to the submitted email.';
        this.resetPasswordFailEmail = '';
      })
      .catch((error) => {
        this.resetPasswordMessage = '';
        this.resetPasswordFailEmail = 'The email you have submitted is invalid or can\'t found in the database.';
      })
  }

}
