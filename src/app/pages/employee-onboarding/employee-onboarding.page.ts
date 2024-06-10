import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-employee-onboarding',
  templateUrl: './employee-onboarding.page.html',
  styleUrls: ['./employee-onboarding.page.scss'],
})
export class EmployeeOnboardingPage implements OnInit {
  userOnboarded: boolean = false;
  segment: any = 'user';
  employeeId: any;
  id: any;
  userGroups: any = [];
  updateFlag: boolean = false;
  basic: FormGroup;
  company: FormGroup;
  contractor: FormGroup;
  myFiles: string[] = [];
  userId: any;
  myFileInput: ElementRef;
  files: File;
  organisationId: any;
  projectId: any;
  data = false;
  allDocs: any;
  responseLength: any;
  employeeActive: boolean;
  contract: boolean = false;

  constructor(
    private commonService: CommonService,
    private activated: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.form();
  }
  handleOnboardingCompletion() {
    this.userOnboarded = true;
  }

  form() {
    this.basic = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      designation: [''],
      gender: ['', Validators.required],
      phoneNo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d{10}$/),
        ]),
      ],
      // personalEmail: ['', Validators.compose([
      //   Validators.required,
      //   Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      // ])],
      // spouseName: [''],
      fatherName: ['', Validators.required],
      constHour: ['0', Validators.required],
      hoursDay: ['0', Validators.required],
      emergencyContactNumber: ['', Validators.required],
      presentAddress: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      employeeType: ['', Validators.required],
    });

    this.company = this.formBuilder.group({
      biometricId: ['', Validators.required],
      basicSalary: ['0', Validators.required],
      companyBranch: ['', Validators.required],
      totalSalary: ['0', Validators.required],
      officialEmail: ['', Validators.required],
      password: [''],
      DOJ: [this.commonService.formatDate(new Date()), Validators.required],
      userGroup: ['', Validators.required],
      // userGroup: [[]],
    });

    this.contractor = this.formBuilder.group({
      taxTerm: ['', Validators.required],
      positionName: ['', Validators.required],
      fedID: ['', Validators.required],
      corporationName: ['', Validators.required],
      DOJ: [this.commonService.formatDate(new Date()), Validators.required],
      pocName: [''],
      companyName: [''],
      clientName: [''],
      officialEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    
    this.userId = localStorage.getItem('userId');

    this.userId = JSON.parse(localStorage.getItem('userId'));
    this.employeeId = this.authService.userId;
    this.segment = 'user';
    this.id = this.activated.snapshot.params.id;
    if (this.id != 'null') {
      this.fetchEmployee();
      this.updateFlag = true;
    }

    this.commonService.fetchAllUserGroups().then(
      (resp) => {
        this.userGroups = resp;
        console.log(this.userGroups)
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
    this.getDocs();

    // phone number  and  emergency contact no should be same
    this.basic.get('phoneNo').valueChanges.subscribe((value) => {
      this.basic.get('emergencyContactNumber').setValue(value);
    });

    // present address and permanent address should be same
    this.basic.get('presentAddress').valueChanges.subscribe((value) => {
      this.basic.get('permanentAddress').setValue(value);
    });
  }

  register() {
    // this.commonService.presentLoading();

    if (this.basic.valid && (this.company.valid || this.contractor.valid)) {
      // this.commonService.presentLoading();
      let formData;
      if (this.contract) {
        formData = Object.assign(this.contractor.value, this.basic.value);
      } else {
        formData = Object.assign(this.company.value, this.basic.value);
      }
      this.commonService.registerEmployee(formData).then(
        (resp: any) => {
          if (resp.employeeId) {
            this.data = false;
            // this.fetchEmployee();

            this.commonService.loadingDismiss();
          } else {

            this.router.navigate(['/employee-list']);
            this.commonService.loadingDismiss();
          }
          this.commonService.loadingDismiss();
          this.commonService.showToast('success', 'Employee Onboarded!');

          this.router.navigate(['/employee-list']);
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.commonService.loadingDismiss();

            this.router.navigateByUrl('/login');
          }
        }
      );
    } else {
      this.commonService.showToast(
        'error',
        'Please fill all required details!'
      );
      this.commonService.loadingDismiss();
    }
    this.commonService.loadingDismiss();
  }

  selectEmployeeType(event) {
    if (event.target.value == 5) {
      this.contract = true;
    } else {
      this.contract = false;
    }
  }

  updateEmployee() {

    if (this.basic.valid && (this.company.valid || this.contractor.valid)) {
      this.commonService.presentLoading();
      let formData;
      if (this.contract) {
        formData = Object.assign(this.basic.value, this.contractor.value, {
          employeeId: this.employeeId,
        });
      } else {
        formData = Object.assign(this.basic.value, this.company.value, {
          employeeId: this.employeeId,
        });
      }

      // restrict to update the password
      if (this.updateFlag = true) {
        delete formData.password;
      }

      this.commonService.updateEmployee(formData).then(
        (resp: any) => {
          this.commonService.showToast('success', 'Employee Updated!');
          this.router.navigate(['/employee-list']);
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
          }
        }
      );
    } else {
      this.commonService.showToast(
        'error',
        'Please fill all required details!'
      );
    }
  }

  updateStatus(data) {
    this.commonService
      .updateEmployeeStatus({ isActive: +data, employeeId: this.employeeId })
      .then(
        (res: any) => {
          if (res.msg) {
            this.commonService.showToast('success', res.msg);
          } else {
            this.commonService.showToast('error', res.msg);
          }
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
          }
        }
      );
  }

  fetchEmployee() {
    let formData = {
      employeeId: this.id,
    };
    this.commonService.presentLoading();
    this.commonService.getOneEmployee(formData).then(
      (resp: any) => {
        let user = resp[0];
        this.basic.patchValue(user);
        this.company.patchValue(user);
        this.contractor.patchValue(user);
        if (user.employeeType == '5') {
          this.contract = true;
        } else {
          this.contract = false;
        }
        this.employeeId = user.employeeId;
        this.employeeActive = user.isActive;
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  nextTab() {
    if (this.basic.valid && this.contract == false) this.segment = 'card';
    else if (this.basic.valid && this.contract == true)
      this.segment = 'contract';
    else
      this.commonService.showToast(
        'error',
        'Please fill all mandatory fields!'
      );
  }

  previousTab() {
    this.segment = 'user';
  }

  handleFileSelect(file: any) {
    this.files = file.target.files[0];
    this.uploadFile();
  }

  uploadFile(): void {
    if (this.files) {
      let ExcelSheetdata = new FormData();
      let files = this.files;
      let employeeId = this.employeeId;
      ExcelSheetdata.append('files', files);
      ExcelSheetdata.append('employeeId', employeeId);
      this.commonService.UploadDocs(ExcelSheetdata).then(
        (res) => {
          this.commonService.showToast('success', 'File Uploaded');
          this.getDocs();
        },
        (error: any) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
          }
        }
      );
    } else {
      this.commonService.showToast('error', 'Something went wrong');
    }
  }

  getDocs() {
    this.commonService.presentLoading();
    this.commonService.getAllDocs({ employeeId: this.id }).then(
      (res: any) => {
        this.allDocs = res;
        this.responseLength = res.length;
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  openDocument(document) {
    let url = this.authService['apiUrl'] + 'documents/' + document.filename;
    window.open(url, '_blank');
  }
}
