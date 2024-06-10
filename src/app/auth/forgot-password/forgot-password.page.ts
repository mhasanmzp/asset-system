import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { NavController, Platform, IonInput, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import * as Rx from "rxjs";
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form: FormGroup;
  formPassword: FormGroup;
  userId: any;
  email: any;
  password: any;
  officialEmail: any;
  display: boolean;
  otp: boolean = false;
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '40px',
      'height': '60px',
      'color': 'black',
      'font-size': '20px'
    }
  };

  formInput = ['input1', 'input2', 'input3', 'input4'];
  @ViewChildren('formRow') rows: any;
  formOTP: FormGroup;
  olength: boolean = false;
  smsCode: any;
  displayOtp: any;
  verifyOtp: boolean = false;

  constructor(public fb: FormBuilder,
    public commonService: CommonService,
    private navController: NavController,
    private menuController: MenuController,
    private platform: Platform,
    private authService: AuthService,
    private router: Router) {

    this.formOTP = this.toFormGroup(this.formInput);
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
    });
    this.formPassword = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
  }

  submit() {
    if (this.form.invalid) {
      this.commonService.showToast('error', 'Please fill details')
    } else {
      let formdata = {
        officialEmail: this.form.value.email,
      }
      this.authService.matchOtp(formdata).then((res: any) => {
        if (res) {
          this.otp = true;
          this.displayOtp = res.resp.otp
        }
      },error=>{
        this.commonService.showToast('error', error.error)
     })
    }
  }

  submitOTP() {
    if (this.olength == true) {
      if (this.smsCode == this.displayOtp) {
        this.verifyOtp = true
      }
      else {
        this.commonService.showToast('error', "Please enter correct OTP")
      }
    }
  }

  toFormGroup(elements) {
    const group: any = {};
    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  keyUpEvent(event, index) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    }
  }

  onOtpChange(ev) {
    this.smsCode = ev;
    if (ev.length == 4) {
      this.olength = true;
    }
    else {
      this.olength = false;
    }
  }
  submitPassword() {
    if (!this.formPassword.invalid) {
      if (this.formPassword.value.newPassword == this.formPassword.value.confirmPassword) {
        let form = {
          officialEmail: this.form.value.email,
          password: this.formPassword.value.confirmPassword
        }
        this.authService.forgotPassword(form).then((res: any) => {
          if (res.code) {
            this.commonService.showToast('success', res.msg)
            this.router.navigate(['/login'])
          }
          else {
            this.commonService.showToast('error', res.msg)
          }
        },error=>{
          this.commonService.showToast('error', error.error)
       })
      }
      else {
        this.commonService.showToast('error', "Please enter correct Password")
      }
    }
    else {
      this.commonService.showToast('error', "Please enter password")
    }
  }

  validatePassword(event){
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
  document.getElementById("msg").innerHTML = strength + `<br><span style="color:#fff">Please use UpperCase, Lowercase, Number & Special Character for password</span>`;
  document.getElementById("msg").style.color = color;
  document.getElementById("msg").style.fontSize = '12px';
  }

}
