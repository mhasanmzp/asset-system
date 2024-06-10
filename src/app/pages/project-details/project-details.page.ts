import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {
  segment: any = 'details';
  employeeId: any;
  projectId: any;
  userGroups: any = [];
  allCustomers: any = [];
  updateFlag: boolean = false;
  basic: FormGroup;
  htmlText = '<p>Testing</p>';
  hasFocus = false;
  subject: string;
  data: any = ['India', 'Sri Lanka'];
  allUsers: any = [];
  allProjectMembers: any = [];
  newProject: any = [];
  allEmployees: any = [];
  showReasonInput: boolean = false;


  atValues = [
    { id: 1, value: 'Fredrik Sundqvist', link: 'https://google.com' },
    { id: 2, value: 'Patrik Sjölin' },
  ];
  hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' },
  ];
  loading: HTMLIonLoadingElement;
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],

        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ font: [] }],
        [{ align: [] }],

        ['clean'],

        ['link'],
      ],
    },
    'emoji-toolbar': false,
    'emoji-textarea': false,
    'emoji-shortname': false,
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            return true;
          },
        },
      },
    },
  };
  plan: FormGroup;
  releases: any = [];
  releaseNumberData: any = [];
  allProjectsArray: any=[];
  constructor(
    public commonService: CommonService,
    public projectService: ProjectService,
    public authService: AuthService,
    public activated: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController
  ) {
    this.basic = this.formBuilder.group({
      projectName: ['', Validators.required],
      startDate: ['',Validators.required],
      estimatedHours: ['0',Validators.required],
      clientName: [''],
      projectStatus: ['', Validators.required],
      customerId: ['', Validators.required],
      projectStage: ['', Validators.required],
      projectType: ['', Validators.required],
      sendDailyStatus: [false],
      sendWeeklyStatus: [false],
      sendMonthlyStatus: [false],
      projectDescription: ['', Validators.required],
      // clientEmail: ['', Validators.pattern('[^ @]*@[^ @]*')],
      // clientPass: [''],
      architect: [''],
      design: [''],
      dbArchitect: [''],
      backendHrs: [''],
      frontendHrs: [''],
      projectManager: ['', Validators.required],
      serverHrs: [''],
      coordinationHrs: [''],
      releaseNumber: [''],
      replicateData:['',Validators.required],
      sourceProjectId:[''],

    });

    // 
    this.basic
      .get('replicateData')
      .valueChanges.subscribe((value) => {
        this.onChangeFeasibility(value);
      });
  }
  onChangeFeasibility(feasibilityValue: string) {
    console.log(feasibilityValue)
    if (feasibilityValue == 'Yes') {
      this.basic
        .get('sourceProjectId')
        .setValidators([Validators.required]);
      this.showReasonInput = true;
    } else {
      this.basic.get('sourceProjectId').clearValidators();
      this.showReasonInput = false;
    }
    this.basic.get('sourceProjectId').updateValueAndValidity();
  }
  ngOnInit() {
    this.projectId = this.activated.snapshot.params.id; 
    if (this.projectId != 'null') {
      this.getOneProject();
      this.updateFlag = true;
    } else {
      this.commonService.getEmployeeList().then((resp: any) => {
        this.allEmployees = resp;
      });
    }

    this.commonService.fetchAllUserGroups().then((resp) => {
      this.userGroups = resp;
    });

    this.commonService.fetchCustomers().then((resp: any) => {
      this.allCustomers = resp;
    });

    this.fetchEmployee();

  }

  // ankit code for release number

  fetchEmployee() {
    let formData = {
      organisationId: localStorage.getItem("organisationId")
    }
    this.projectService.fetchAllProjects(formData).then((resp: any) => {
      this.allProjectsArray = resp;
      console.log(this.allProjectsArray)
      
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }
  

  addRelease() {

    if (this.basic.value.releaseNumber > 0) {
      this.releases.push(this.basic.value.releaseNumber);

      this.basic.controls['releaseNumber'].setValue('');
    } else {
      this.commonService.showToast(
        'warning',
        'Release Number should be greater than 0'
      );
    }
  }

  removeRelease(code) {
    this.releases.splice(this.releases.indexOf(code), 1);
  }
  // ankit code for release number

  saveProject() {
    let rnData = Object.assign(this.basic.value);
    rnData.releaseNumber = this.releases;
    if (this.basic.valid) {
      this.commonService.presentLoading();
      let formData = Object.assign(this.basic.value, {
        members: this.allProjectMembers,
      });
      this.projectService.createProject(formData).then(
        (resp: any) => {
          this.commonService.loadingDismiss();
          this.segment = 'members';
          this.projectId = resp.projectId;
          this.commonService.showToast(
            'success',
            'Project Created! Add Members..'
          );
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
      this.commonService.showToast('error', 'Fill all required details..');
    }
  }

  updateProject() {
    let rnData = Object.assign(this.basic.value);
    rnData.releaseNumber = this.releases;

    if (this.basic.valid) {
      this.commonService.presentLoading();
      let formData = Object.assign(this.basic.value, {
        projectId: this.projectId,
      });
      formData.startDate = this.commonService.formatDate(formData.startDate);
      this.projectService.updateProject(formData).then(
        (resp: any) => {
          this.commonService.loadingDismiss();
          this.commonService.showToast('success', 'Project Updated!');
          this.router.navigate(['/projects']);
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
  }

  getProjectMembers() {
    let formData = {
      projectId: this.projectId,
    };
    this.projectService.getProjectMembers(formData).then((resp: any) => {
      this.allProjectMembers = resp;
      this.allUsers = resp;
    });
  }

  getOneProject() {
    let formData = {
      projectId: this.projectId,
    };
    this.getProjectMembers();
    this.commonService.presentLoading();  
    this.projectService.getOneProject(formData).then(
      (resp: any) => {
        resp.startDate = new DatePipe('en-US').transform(
          resp.startDate,
          'yyyy-MM-dd'
);
       
        console.log(resp);
        this.basic.patchValue(resp);

        this.releaseNumberData = resp.releaseNumber;
        this.commonService.loadingDismiss();
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

  checkInTeam(user) {
    let employee = this.allProjectMembers.filter(
      (r) => r.employeeId == user.employeeId
    );
    if (employee.length > 0) return false;
    else return true;
  }

  addEmployeeTeam(user) {
    this.allProjectMembers.push(user);
    if (this.projectId) {
      user.projectId = this.projectId;
      this.projectService.addProjectMember(user).then(
        (resp: any) => {
          user.id = resp.id;
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
  }

  removeProjectMember(user) {
    let index = this.allProjectMembers.indexOf(user);
    this.allProjectMembers.splice(index, 1);
    if (this.projectId) {
      user.projectId = this.projectId;
      this.projectService.removeProjectMember(user).then(
        (resp) => {},
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
  }

  searchEmployee(ev) {
    if (ev.target.value.length > 0) {
      this.commonService.searchEmployees(ev.target.value).then(
        (resp) => {
          this.allUsers = resp;
          let fieldData;
          for (let i = 0; i < this.allUsers.length; i++) {
            fieldData = this.allProjectMembers.filter(
              (res) => res.officialEmail == this.allUsers[i].officialEmail
            )[0];
            if (fieldData && fieldData.type)
              this.allUsers[i].type = fieldData.type;
            if (fieldData && fieldData.billable)
              this.allUsers[i].billable = fieldData.billable;
            if (fieldData && fieldData.hoursAssign)
              this.allUsers[i].hoursAssign = fieldData.hoursAssign;
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
    } else {
      this.allUsers = this.allProjectMembers;
    }
  }

  getEmployeesByIds(employeeIds) {
    this.commonService.getEmployeesByIds(employeeIds).then(
      (resp) => {
        this.allUsers = resp;
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

  onSelectionChanged = (event) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  };

  onContentChanged = (event) => {};

  onFocus = () => {};
  onBlur = () => {};

  selectRole(user) {
    let form = {
      memberId: user.id,
      type: user.type,
    };
    this.projectService.updateProjectMember(form).then(
      (resp) => {},
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

  selectBillable(user) {
    let form = {
      memberId: user.id,
      billable: user.billable,
    };
    this.projectService.updateProjectMember(form).then(
      (resp) => {},
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

  selectHours(user) {
    let form = {
      memberId: user.id,
      hoursAssign: user.hoursAssign,
    };
    this.projectService.updateProjectMember(form).then(
      (resp) => {},
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

  async presentLoadingWithOptions() {
    this.loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    return await this.loading.present();
  }
}
