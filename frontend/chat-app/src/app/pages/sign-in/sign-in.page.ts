import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISignInForm } from 'src/app/interfaces/forms.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  @ViewChild('passwordInput') passwordInput: HTMLIonInputElement;
  passwordInputType = 'password';
  signInForm: FormGroup<ISignInForm>;
  isSending: boolean;
  errorResult: any;
  result: any;
  infoMessage: string;
  errorMessage: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private location: Location
  ) {
    this.signInForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],

      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  toggleInputType(prevType: string) {
    const type = prevType === 'password' ? 'text' : 'password';
    this.passwordInputType = type;
    this.passwordInput.type = type;
  }
  signIn(event: Event) {
    const username_or_email = this.signInForm.get('usernameOrEmail').value;
    const password = this.signInForm.get('password').value;

    this.errorResult = null;
    this.isSending = true;
    this.authService.signIn({ username_or_email, password }).subscribe(
      (res) => {
        this.result = res;
        this.isSending = false;
        this.infoMessage = 'Sign in successful';
        setTimeout(() => {
          this.location.historyGo(-1);
        }, 2500);
      },
      (error) => {
        this.isSending = false;
        this.errorMessage = error;
        console.log(error);
      }
    );
  }
}
