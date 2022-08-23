import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ISignUpForm } from 'src/app/interfaces/forms.interface';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  @ViewChild('passwordInput') passwordInput: HTMLIonInputElement;
  @ViewChild('confirmPasswordInput') confirmPasswordInput: HTMLIonInputElement;
  passwordInputType = 'password';
  password: string;
  confirmPassword: string;
  signUpForm: FormGroup<ISignUpForm>;
  isSending: boolean;
  errorMessage: string;
  errorResult: any;
  infoMessage: string;
  isText: boolean;
  isPasswordMatch: boolean;
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private authService: AuthService
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/
          ),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(/^[a-zA-Z0-9_-]*$/),
        ],
      ],
    });
  }

  ngOnInit() {
    // this.isValid=this.signUpForm.valid;
  }

  toggleInputType(prevType: string) {
    const type = prevType === 'password' ? 'text' : 'password';
    this.confirmPasswordInput.type = type;
    this.passwordInput.type = type;
    this.passwordInputType = type;
  }
  matchPassword(password, confirmPassword) {
    if (password !== confirmPassword) this.isPasswordMatch = false;
    else this.isPasswordMatch = true;
  }
  signUp(event: Event) {
    event.preventDefault();
    const fullname = this.signUpForm.get('fullname').value;
    const username = this.signUpForm.get('username').value;
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const confirmPassword = this.signUpForm.get('confirmPassword').value;
    this.matchPassword(password, confirmPassword);
    if (!this.isPasswordMatch) {
      this.errorMessage = 'password does not match';
      return;
    }
    this.errorMessage = '';
    this.isSending = true;
    this.authService
      .signUp({
        fullname,
        email,
        password,
        username,
      })
      .subscribe(
        () => {
          this.isSending = false;
          this.infoMessage = 'Sign up successful';
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
    this.signUpForm.reset({ password: '', confirmPassword: '' });
  }
}
