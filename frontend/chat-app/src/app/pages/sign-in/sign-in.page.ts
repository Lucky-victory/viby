import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  @ViewChild('passwordInput') passwordInput: HTMLIonInputElement;
  passwordInputType='password'
  constructor() { }

  ngOnInit() {
  }

  toggleInputType(prevType: string) {
    const type = prevType === "password" ? "text" : "password";
    this.passwordInputType = type;
   this.passwordInput.type = type;
  }
}
