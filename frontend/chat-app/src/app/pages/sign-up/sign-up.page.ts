import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  @ViewChild('passwordInput') passwordInput:HTMLIonInputElement;
  @ViewChild('confirmPasswordInput') confirmPasswordInput:HTMLIonInputElement;
  passwordInputType = 'password';
  password: string;
  confirmPassword: string;
  
  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

  toggleInputType(prevType: string) {
    const type = prevType === "password" ? "text" : "password";
    this.confirmPasswordInput.type=type
    this.passwordInput.type = type;
     this.passwordInputType = type;
  }
  signUp() {
    // this.authService.signUp()
  }
}
