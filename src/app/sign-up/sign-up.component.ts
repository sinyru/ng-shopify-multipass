import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSignUp(username: string, email: string, password: string,
    confirmation: string, first_name: string, last_name: string,
    address1: string, city: string, phone: string, zip: string) {
      this.authService.onSignUpWithEmail(username, email, password, confirmation, first_name, last_name, address1, city, phone, zip);
    }

}
