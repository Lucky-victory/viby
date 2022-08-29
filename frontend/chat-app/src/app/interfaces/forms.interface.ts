import { FormControl } from '@angular/forms';

export interface ISignInForm {
  usernameOrEmail: FormControl;
  password: FormControl;
}
export interface ISignUpForm {
  email: FormControl;
  password: FormControl;
  username: FormControl;
  fullname: FormControl;
  confirmPassword: FormControl;
}
