import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, IonInput, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import * as Rx from "rxjs";
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  error: any;
  form: any;
  errorMessage: any;
  organisationId: any;

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
    });

    this.commonService.getOrganisation(localStorage.getItem('organisationId')).then((resp: any) => {
      let keys = Object.keys(resp);
      keys.forEach(key => {
        if (key != 'organisationCode')
          this.form.controls[key].setValue(resp[key]);
      })
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  update() {
    if (this.form.valid) {
      let formData = Object.assign(this.form.value, { organisationCode: localStorage.getItem('organisationId') });
      this.commonService.updateOrganisation(formData,).then((resp: any) => {
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    }
  }

}