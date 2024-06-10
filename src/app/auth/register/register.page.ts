import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, IonInput, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import * as Rx from "rxjs";
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  error: any;
  form: any;
  errorMessage: any;
  userId: any;

  constructor(
    public fb: FormBuilder,
    public commonService: CommonService,
    private navController: NavController,
    private menuController: MenuController,
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      organisationName: ['', Validators.required],
      organisationGST: ['', Validators.required],
      organisationPAN: ['', Validators.required],
      organisationEmail: ['', Validators.required],
      organisationBranch: ['', Validators.required],
      organisationPhone: ['', Validators.required],
      organisationAddress: ['', Validators.required],
      NumberofEmployee: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
  }

  login() {
   

  }

  register() {
    if (this.form.valid) {
      let formData = this.form.value;
      console.log("formData", formData)
      if (formData.password == formData.confirmPassword) {
        this.commonService.createOrg(formData).then((resp: any) => {
          this.commonService.showToast("success", "Welcome aboard! Login to Continue.")
          this.router.navigate(['/login'])
          console.log("resp", resp)
        }, error => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
        })
      } else {
        this.commonService.showToast('error', "Password and Confirm Password don't match!")
      }
    }
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
    document.getElementById("msg").innerHTML = strength + `<br><span style="color:#fff">Please use UpperCase, Lowercase, Number & Special Character for password</span>`;
    document.getElementById("msg").style.color = color;
    document.getElementById("msg").style.fontSize = '12px';
  }
}