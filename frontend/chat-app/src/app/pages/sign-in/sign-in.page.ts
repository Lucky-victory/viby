import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISignInForm } from 'src/app/interfaces/forms.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Location } from '@angular/common';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Router } from '@angular/router';
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
  errorMessage: string;
  private redirectTimeout = 3000;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService
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
    this.errorMessage = '';
    this.isSending = true;
    this.authService.signIn({ username_or_email, password }).subscribe(
      (res) => {
        this.isSending = false;
        this.utilsService.showToast({
          message: 'Sign in successful',
        });
        this.utilsService.showLoader({
          message: 'Redirecting to home',
          duration: 2000,
        });
        this.resetPassword();
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, this.redirectTimeout);
      },
      (error) => {
        this.isSending = false;
        this.errorMessage = error;
        this.resetPassword();
      }
    );
  }
  private resetPassword() {
    this.signInForm.reset({
      password: '',
    });
  }
}
