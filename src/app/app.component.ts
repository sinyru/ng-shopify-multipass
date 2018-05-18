import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private http:HttpClient){}
  ngOnInit() {
    console.log("this is the url");
  }

  onSignUp(username, email, password, confirmation, first_name, last_name, address1, city, phone, zip) {
    const signUpData = {
      "identifier": username,
      "email": email,
      "password": password,
      "password_confirmation": confirmation
    }
    this.http.post(environment.signUpDatabase, {credentials: signUpData})
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
                                        default: true
                                        }]};
      const token = multipassify.encode(customerData);
      const url = multipassify.generateUrl(customerData, "myshippingtest.myshopify.com");
      window.location.href = url;
    });
  }

  onSignIn(username, password) {
    this.http.get(environment.usersDatabase)
    .subscribe((data:any)=>{
        data.users.find((x)=>{
          if (x.identifier === username) {
            const signInData = {
              "email": x.email,
              "password": password,
              "password_confirmation": password
            }
            this.http.post(environment.signInDatabase, {credentials: signInData}).toPromise()
            .then(()=>{
              const Multipassify = require('multipassify');
              const multipassify = new Multipassify(environment.multipassSecret);
              const customerData = {email: x.email};
              const token = multipassify.encode(customerData);
              const url = multipassify.generateUrl(customerData, "myshippingtest.myshopify.com");
              window.location.href = url;
            });
          }
        })
    });

  }
}
