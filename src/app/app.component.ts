import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private authService: AuthService){}
  ngOnInit() {}

  onSignUp(username: string, email: string, password: string,
    confirmation: string, first_name: string, last_name: string,
    address1: string, city: string, phone: string, zip: string) {
      this.authService.onSignUpWithEmail(username, email, password, confirmation, first_name, last_name, address1, city, phone, zip);
    }

  onSignIn(username: string, password: string) {
      this.authService.onSignInWithUsername(username, password);
    }

  onResetPassword(email: string) {
    this.authService.resetPassword(email);
  }

}
