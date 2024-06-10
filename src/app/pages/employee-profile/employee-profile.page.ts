import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ChangePasswordPage } from 'src/app/modals/change-password/change-password.page';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.page.html',
  styleUrls: ['./employee-profile.page.scss'],
})
export class EmployeeProfilePage implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  segment: any = 'user';
  employeeId: any;
  id: any;
  userGroups: any = [];
  updateFlag: boolean = false;
  basic: FormGroup;
  employeeDetails: any = {};

  constructor(
    private commonService: CommonService,
    private activated: ActivatedRoute,
    private authService: AuthService,
    public modalController: ModalController,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.basic = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      designation: [''],
      gender: ['', Validators.required],
      phoneNo: ['', Validators.compose([
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ])],
      personalEmail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      spouseName: [''],
      fatherName: ['', Validators.required],
      emergencyContactNumber: ['', Validators.required],
      presentAddress: ['', Validators.required],
      permanentAddress: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.segment = 'user'
    this.id = this.authService.userId
    if (this.id != "null") {
      this.fetchEmployee();
      this.updateFlag = true;
    }

    this.commonService.fetchAllUserGroups().then(resp => {
      this.userGroups = resp;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }


  updateEmployee() {
    if (this.basic.valid) {
      this.commonService.presentLoading();
      let formData = Object.assign(this.basic.value, { employeeId: this.employeeId })
      if (this.croppedImage)
        formData.image = this.croppedImage;
      this.commonService.updateEmployee(formData).then((resp: any) => {
        this.commonService.loadingDismiss();
        this.modalController.dismiss();
        this.commonService.showToast("success", "Profile Updated!")
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    } else {
      this.commonService.showToast("error", "Please fill all required details!")
    }
  }

  fetchEmployee() {
    let formData = {
      employeeId: this.id
    }
    this.commonService.presentLoading();
    this.commonService.getOneEmployee(formData).then((resp: any) => {
      let user = resp[0];
      this.employeeDetails = user;
      this.basic.patchValue(user);
      this.commonService.loadingDismiss();
      this.employeeId = user.employeeId
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded(image: LoadedImage) {
  }

  cropperReady() {
  }

  loadImageFailed() {
  }


  async changePassword() {
    const popover = await this.modalController.create({
      component: ChangePasswordPage,
      cssClass: 'leave-modal',
      showBackdrop: true,
    });
    this.modalController.dismiss();
    await popover.present();
    popover.onDidDismiss().then(resp => {
    })

  }


}

