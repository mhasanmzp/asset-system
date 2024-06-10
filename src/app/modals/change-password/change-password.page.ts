import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  passwordForm: FormGroup;
  oldPassword: any;
  newPassword: any;
  confirmPassword: any;
  employeeId: any;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  strongPassword = false;

  constructor(public fb: FormBuilder,
    public commonService: CommonService,
    public modalController: ModalController,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.employeeId = this.authService.userId;
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  close() {
    this.modalController.dismiss();
  }


  submit() {
    if (!this.passwordForm.invalid || this.strongPassword == true) {
      if (this.passwordForm.value.newPassword == this.passwordForm.value.confirmPassword) {
        let form = {
          employeeId: this.employeeId,
          oldpassword: this.passwordForm.value.oldPassword,
          password: this.passwordForm.value.newPassword
        }
        this.authService.changePassword(form).then((res: any) => {
          if (res.msg) {
            this.commonService.showToast('success', res.msg)
            this.commonService.loadingDismiss();
            this.modalController.dismiss();
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/login'])
          }
          else {
            this.commonService.showToast('error', res.msg)
          }
        }, error => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
        })
      } else {
        this.commonService.showToast("error", "'Confirm password' is not same as 'New password'")
      }
    } else {
      this.commonService.showToast('error', 'Invalid password')
    }
  }

  /**  show and hide password, Ritika - 07/02/2023 */
  showHidePassword(data) {
    let password;
    if (data == 'old') {
      password = document.querySelector('#OldPassword');
      this.showOldPassword = !this.showOldPassword
    } else if (data == 'new') {
      password = document.querySelector('#NewPassword');
      this.showNewPassword = !this.showNewPassword
    } else {
      password = document.querySelector('#ConfirmPassword');
      this.showConfirmPassword = !this.showConfirmPassword
    }

    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
  }

  validatePassword(event) {
    let password = event.target.value;

    if (password.length === 0) {
      document.getElementById("msg").innerHTML = "";
      return;
    }

    var matchedCase = new Array();
    matchedCase.push("[$@$!%*#?&]");
    matchedCase.push("[A-Z]");
    matchedCase.push("[0-9]");
    matchedCase.push("[a-z]");

    var ctr = 0;
    for (var i = 0; i < matchedCase.length; i++) {
      if (new RegExp(matchedCase[i]).test(password)) {
        ctr++;
      }
    }

    var color = "";
    var strength = "";
    switch (ctr) {
      case 0:
      case 1:
      case 2:
        strength = "Very Weak Password";
        color = "red";
        break;
      case 3:
        strength = "Medium Password";
        color = "orange";
        break;
      case 4:
        strength = "Strong Password";
        color = "green";
        break;
    }
    document.getElementById("msg").innerHTML = strength + `<br><span style="color:#fff">Please use UpperCase, Lowercase, Number & Special Character for creating password</span>`;
    document.getElementById("msg").style.color = color;
    document.getElementById("msg").style.fontSize = '12px';
  }

}