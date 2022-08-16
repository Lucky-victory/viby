import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
@ViewChild('passwordInput') passwordInput:HTMLIonInputElement;
  constructor() { }

  ngOnInit() {
  }

  toggleInputType(prevType: string) {
    const type = prevType === "password" ? "text" : "password";
    
   this.passwordInput.type = type;
  }
}
