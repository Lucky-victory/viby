import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  @ViewChild('passwordInput') passwordInput:HTMLIonInputElement;
  @ViewChild('confirmPasswordInput') confirmPasswordInput:HTMLIonInputElement;
  
  constructor() { }

  ngOnInit() {
  }

  toggleInputType(prevType: string) {
    const type = prevType === "password" ? "text" : "password";
    this.confirmPasswordInput.type=type
   this.passwordInput.type = type;
  }
}
