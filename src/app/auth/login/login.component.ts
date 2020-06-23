import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;
  loginInProcess = false;
  fromUrl: string;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    this.validateForm.controls.userName.markAsDirty();
    this.validateForm.controls.password.markAsDirty();
    this.validateForm.controls.remember.markAsDirty();
    this.validateForm.controls.userName.updateValueAndValidity();
    this.validateForm.controls.password.updateValueAndValidity();
    this.validateForm.controls.remember.updateValueAndValidity();

    // this.router.navigate(['/pages/folder']);

    if (!this.validateForm.valid) {
      // this.alertCtrl.create({
      //   header: '登录失败',
      //   message: this.isSmsLogin ? '手机号或验证码不正确' : '手机号或密码不正确',
      //   buttons: ['确定']
      // }).then(alert => {
      //   alert.present();
      // });
      console.log('not valid');
      return;
    }

    this.loginInProcess = true;
    this.loginError = false;
    this.authService.login({
      username: this.validateForm.value.userName,
      password: this.validateForm.value.password
    }).subscribe(() => {
      this.loginInProcess = false;
      if (this.fromUrl) {
        this.router.navigate([this.fromUrl]);
      } else {
        this.router.navigate(['/pages/folder']);
      }
    }, error => {
      console.log(error);
      this.loginInProcess = false;
      this.loginError = true;
      if (error.status === 404 || error.status === 400) {
        // this.alertCtrl.create({
        //   header: '登录失败',
        //   message: error.error.message,
        //   buttons: ['确定']
        // }).then(alert => {
        //   alert.present();
        // }).finally(() => {
        //   this.loginInProcess = false;
        // });
      }
    });
  }
}
