import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  LoadingController,
} from '@ionic/angular';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Router,
  NavigationExtras,
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';
import * as Rx from 'rxjs';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Toastr from 'toastr2';
import { resolve } from 'dns';
import { rejects } from 'assert';
// import { resolve } from 'dns';

@Injectable({
  providedIn: 'root',
})
export class CommonService implements HttpInterceptor {
  private reportFormData: any;
  // Ankit Code
  ticket = new Subject();
  // conveyance = new Subject();
  // End of Ankit Code

  [x: string]: any;
  // apiUrl1: any = 'https://6b66-203-92-37-218.ngrok-free.app/';
  apiUrl: any = 'https://api.hr.timesofpeople.com';
  // apiUrl: any = 'http://localhost:3000/';
  // apiUrl: any = 'http://159.223.177.89:3000/';

  loading: any;
  loading1: any;
  currentUrl: any;
  employeeId: any = localStorage.getItem('userId');
  notificationUpdated = new Rx.BehaviorSubject(false);
  routeUrl: any;
  public appPages = [
    {
      title: 'Dashboard',
      url: 'dashboard',
      icon: 'bar-chart',
      permission: 'Dashboard',
    },
    {
      title: 'Employee List',
      url: 'employee-list',
      icon: 'people',
      permission: 'EmployeeList',
    },
    {
      title: 'Employee List',
      url: 'employee-onboarding',
      icon: 'people',
      permission: 'EmployeeList',
    },
    {
      title: 'Attendance',
      url: 'attendance',
      icon: 'document',
      permission: 'Attendance',
    },
    {
      title: 'Performance',
      url: 'performance',
      icon: 'trending-up',
      permission: 'Performance',
    },
    {
      title: 'My attendance',
      url: 'user-attendance',
      icon: 'document',
      permission: 'UserAttendance',
    },
    { title: 'My Tasks', url: 'tasks', icon: 'list', permission: 'Tasks' },
    {
      title: 'View All DSRs',
      url: 'view-all-dsr',
      icon: 'eye',
      permission: 'ViewAllDSR',
    },
    {
      title: 'Projects',
      url: 'projects',
      icon: 'grid',
      permission: 'Projects',
    },
    {
      title: 'Project Management',
      url: 'project-manage',
      permission: 'Dashboard',
    },
    // { title: "Minutes of Meeting", url: 'mom', icon: 'recording' },
    {
      title: 'Teams',
      url: 'teams',
      icon: 'people-circle',
      permission: 'Teams',
    },
    {
      title: 'My Leaves',
      url: 'leaves',
      icon: 'calendar',
      permission: 'Leaves',
    },
    {
      title: 'View All Leaves',
      url: 'view-all-leave',
      icon: 'calendar',
      permission: 'ViewAllLeave',
    },
    {
      title: 'View All Logs',
      url: 'view-log',
      icon: 'document',
      permission: 'ViewAllLog',
    },
    {
      title: 'Leave Report',
      url: 'all-user-leave-admin',
      icon: 'calendar',
      permission: 'LeaveReport',
    },
    {
      title: 'Expenses',
      url: 'expenses',
      icon: 'cash',
      permission: 'Expenses',
    },
    {
      title: 'ATS/CV Pool',
      url: 'ats',
      icon: 'file-tray-full',
      permission: 'ATSCVPool',
    },
    {
      title: 'Inventory',
      url: 'inventory',
      icon: 'information-circle',
      permission: 'Inventory',
    },
    {
      title: 'Grievance',
      url: 'tickets',
      icon: 'information-circle',
      permission: 'Tickets',
    },
    {
      title: 'User Groups',
      url: 'user-groups',
      icon: 'albums',
      permission: 'UserGroups',
    },
    {
      title: 'Project Details',
      url: 'project-details',
      permission: 'Projects',
    },
    {
      url: 'ticket-form',
      permission: 'UserTickets',
    },
    {
      url: 'raise-ticket',
      permission: 'UserTickets',
    },
    {
      url: 'release-feature',
      permission: 'ReleaseFeature',
    },
    {
      url: 'emp-self-evaluation/:id/:status',
      permission: 'MyAppraisal',
    },
    {
      title: 'iRACE',
      url: 'process-flow',
      icon: 'git-network',
      permission: 'iRACE',
    },
    {
      title: 'Project Dashboard',
      url: 'project-dashboard',
      icon: 'albums',
      permission: 'ProjectDashboard',
    },
    {
      title: 'Monthly Attendance',
      url: 'month-attendance',
      icon: 'people',
      permission: 'MonthlyAttendance',
    },
    {
      title: 'Employee Cost',
      url: 'employee-cost',
      icon: 'wallet',
      permission: 'EmployeeCost',
    },
    {
      title: 'Open Positions',
      url: 'open-positions',
      icon: 'add',
      permission: 'openPositions',
    },
    {
      title: 'Quality Assurance',
      url: 'quality-assurance',
      icon: 'documents',
      permission: 'QualityAssurance',
    },

    {
      title: 'Lead Generate',
      url: 'leadgenerate',
      icon: 'wallet',
      permission: 'LeadGeneration',
    },

    {
      title: 'Lead Admin',
      url: 'lead-admin',
      icon: 'documents',
      permission: 'LeadAdmin',
    },
    {
      title: 'Release Number',
      url: 'release-number-task',
      icon: 'megaphone',
      permission: 'ReleaseFeature',
    },
    // { title: 'View All KRA', url: 'view-all-kra', icon: 'eye', permission: 'ViewAllKRA'},
    // { title: 'Profile', url: 'profile', icon: 'person' },
    // { title: 'Settings', url: 'settings', icon: 'settings' },
  ];
  token: any = localStorage.getItem('token');
  header: any;
  jwt_token: any = localStorage.getItem('jwt_token');
  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
    public authService: AuthService,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public modalCtrl: ModalController,
    public router: Router
  ) {
    this.apiUrl = this.authService.apiUrl;
    this.header = new HttpHeaders().set(
      'jwt_token',
      localStorage.getItem('jwt_token')
    );
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.getUrl()).pipe(
      switchMap((currentRoute: any) => {
        this.currentUrl = '';
        let apiEndPoint = request.url.split('/');
        let url = currentRoute.split('/')[1];
        this.employeeId = localStorage.getItem('userId');
        if (url) {
          let permission = this.appPages.filter((el) => el.url == url)[0];
          if (permission) {
            this.currentUrl = this.appPages.filter((el) => el.url == url)[0][
              'permission'
            ];
          }
        }
        if (
          this.currentUrl &&
          apiEndPoint[apiEndPoint.length - 1] != 'employeeFilesUpload' &&
          apiEndPoint[apiEndPoint.length - 1] != 'createStoryTask' && apiEndPoint[apiEndPoint.length - 1]!="uploadProfileImage"
        ) {
          let formData = {
            permissionName: this.currentUrl,
            employeeIdMiddleware: this.employeeId,
          };
          const req = request.clone({
            body: { ...request.body, ...formData },
            headers: request.headers.set(
              'Jwt_token',
              localStorage.getItem('jwt_token')
            ),
          });
          return next.handle(req);
        } else if (
          request.url.includes('/login') ||
          request.url.includes('/forgotPassword') ||
          request.url.includes('/sentOtp') ||
          request.url == 'https://api.quotable.io/random'
        ) {
          return next.handle(request);
        } else {
          const req = request.clone({
            headers: request.headers.set(
              'Jwt_token',
              localStorage.getItem('jwt_token')
            ),
          });
          return next.handle(req);
        }
      })
    );
  }

  getUrl() {
    return new Promise((resolve, reject) => {
      let url;
      setTimeout(() => {
        url = this.router.url;
        resolve(url);
      }, 2000);
    });
  }

  showToast(action: any, message: any) {
    this.toastr = new Toastr();
    this.toastr.options.closeDuration = 1000;
    this.toastr.options.progressBar = true;
    this.toastr.options.positionClass = 'toast-bottom-right';
    this.toastr[action](message, action + '!', { timeOut: 3000 });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'circles',
      duration: 4000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    return await this.loading.present();
  }

  async presentLoading1() {
    this.loading1 = await this.loadingController.create({
      spinner: 'circles',
      // duration: 3000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    return await this.loading1.present();
  }

  async presentLoading2() {
    this.loading2 = await this.loadingController.create({
      spinner: 'circles',
      // duration: 3000,
      message: 'Fetching Data...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    return await this.loading2.present();
  }

  loadingDismiss() {
    this.loading.dismiss();
  }
  loadingDismiss1() {
    this.loading1.dismiss();
  }

  loadingDismiss2() {
    this.loading2.dismiss();
  }

  registerEmployee(formData) {
    return new Promise((resolve, reject) => {
      formData.organisationId = this.authService.organisationId;
      this.http.post(this.apiUrl + 'employeeOnboarding', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getUniqueAfterMerge(arr1, arr2) {
    // merge two arrays
    let arr = arr1.concat(arr2);
    let uniqueArr = [];

    // loop through array
    for (let i of arr) {
      if (uniqueArr.indexOf(i) === -1) {
        uniqueArr.push(i);
      }
    }
  }

  ////Create organisation api

  createOrg(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'createOrganisation', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  login(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'login', formData, { observe: 'response' })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getOrganisation(organisationId) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getOrganisation', { organisationId })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateOrganisation(organisationData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'updateOrganisationDetails', organisationData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateProfileImage(organisationData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'uploadProfileImage', organisationData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateEmployee(formData) {
    return new Promise((resolve, reject) => {
      formData.organisationId = this.authService.organisationId;
      this.http.post(this.apiUrl + 'updateEmployeeDetails', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateEmployeeStatus(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateEmployeeDetails', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getEmployeeList() {
    return new Promise((resolve, reject) => {
      let formData = {};
      formData['organisationId'] = this.authService.organisationId;
      this.http.post(this.apiUrl + 'getAllEmployee', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getEmployeeAttendence(formData) {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      formData['organisationId'] = organisationId;
      this.http
        .post(this.apiUrl + 'viewEmployeesAttendance', formData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUserAttendance(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'viewUserAttendance', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getOneEmployee(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getoneEmployee', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getMonthlySalary(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getMonthlySalary', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  generateSalaries(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'generateSalaries', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  createTeam(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'createTeam', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  fetchAllTeams() {
    return new Promise((resolve, reject) => {
      // paramsData.organisationId = this.authService.organisationId;
      this.http
        .post(this.apiUrl + 'fetchTeams', {
          organisationId: this.authService.organisationId,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchAllUserGroups() {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'fetchAllUserGroups', {
          organisationId: localStorage.getItem('organisationId'),
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchTeamColumns(teamId) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'fetchTeamColumns', { teamId }).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateTeam(paramsData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateTeam', paramsData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteTeam(team) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'deleteTeam', team).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateUserGroup(paramsData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateUserGroup', paramsData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteUserGroup(group) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'deleteUserGroup', group).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  searchEmployees(searchTerm) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'searchEmployees', { searchTerm }).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getEmployeesByIds(employeeIds) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getEmployeesByIds', { employeeIds })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  createTeamColumn(paramsData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'createTeamColumn', paramsData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteTeamColumn(columnId) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'deleteTeamColumn', { columnId }).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getUserTeams() {
    return new Promise((resolve, reject) => {
      let formData = {};
      this.http.post(this.apiUrl + 'getUserTeams', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  createUserGroup(paramsData) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      // headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      paramsData.organisationId = this.authService.organisationId;
      this.http.post(this.apiUrl + 'createUserGroup', paramsData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getDSR(paramsData) {
    return new Promise((resolve, reject) => {
      // paramsData.organisationId = this.authService.organisationId;
      this.http.post(this.apiUrl + 'filterdataTask', paramsData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // for KRA
  createKRA(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'createKra', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateKRA(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'KraUpdate', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteKRA(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'deleteKra', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getUserKRA(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getUserKra', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getAllKra() {
    return new Promise((resolve, reject) => {
      let formData = {};
      formData['organisationId'] = this.authService.organisationId;
      this.http.post(this.apiUrl + 'getAllKra', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getParticularUserKra(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getKraForManager', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  kraManagerRating(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'managerRating', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /// for leave
  applyLeave(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'applyLeave', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getUserLeaves(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getUserLeaves', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getLeaves(employees, offset: number) {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      let skip = offset;
      this.http
        .post(this.apiUrl + 'getLeaves', { organisationId, employees, skip })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUserLeaveBalance() {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http
        .post(this.apiUrl + 'getUserLeaveBalance', {
          employeeId: this.authService.userId,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateLeave(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateLeave', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  downloadLeave(postData) {
    // let organisationId = this.authService.organisationId;
    // window.location.assign(this.apiUrl+'dowmloadAllEmployeeList'+'?employeeId='+postData.employeeId+'?sdate='+postData.sdate+'?edate='+postData.sdate)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'downloadLeaves', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getUserLeaveRecord() {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http
        .post(this.apiUrl + 'getUserLeaveRecord', {
          employeeId: this.authService.userId,
          permissionName: this.currentUrl,
          employeeIdMiddleware: this.employeeId,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  ///for mass upload

  massUpload(payload: any, data: any) {
    return this.http.post(this.apiUrl + 'dailyAttendance', data);
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    // console.log([year, month, day].join('-'))
    return [year, month, day].join('');
  }

  // UploadDocs(data) {
  //   return this.http.post(this.apiUrl + 'employeeFilesUploading', data, {
  //     headers: this.header,
  //   });
  // }
  UploadDocs(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'employeeFilesUpload', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // getAllDocs(postData) {
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .post(this.apiUrl + 'getoneEmployeeDocument', postData, {
  //         headers: this.header,
  //       })
  //       .subscribe(
  //         (resp: any) => {
  //           resolve(resp);
  //         },
  //         (error) => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  getAllDocs(postData) {
    console.log(postData);

    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .get(this.apiUrl + `employeeFilesByProject/${postData.projectId}`, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteDocs(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'deleteDocuments', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // for notes
  addNote(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'createNotes', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getAllNotes(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'fetchNotes', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateNote(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateNotes', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteNote(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'deleteNotes', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /// for assigned task
  getTasksAssigned(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getTasksAssigned', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getTestingTasksAssigned(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getTestingTasksAssigned', postData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // for notification
  getNotifications(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getNotifications', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // for customer
  createCustomer(postData) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'createCustomer', postData, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchCustomers() {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http
        .post(this.apiUrl + 'fetchCustomers', { organisationId })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateCustomer(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateCustomer', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getCustomerProjects(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getCustomerProjects', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // for Inventory
  createInventory(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'createInventoryItems', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getInventoryDetails(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getAllInventoryItems', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateInventoryItem(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateInventoryItems', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteInventoryItem(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'deleteInventoryItem', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getAssignItemDetail(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getAssignItemAllDetails', postData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  assignInventoryItem(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'assignItem', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  importInventory(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'importInventoryDetails', postData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  downloadInventory() {
    let organisationId = this.authService.organisationId;
    window.location.assign(
      this.apiUrl +
        'exportInventoryDetails' +
        '?organisationId=' +
        organisationId
    );
  }

  // for download employee list
  // downloadEmployeeList() {
  //   let organisationId = this.authService.organisationId;
  //   window.location.assign(
  //     this.apiUrl +
  //       'dowmloadAllEmployeeList' +
  //       '?organisationId=' +
  //       organisationId
  //   );
  // }

  async downloadEmployeeList() {
    let organisationId = this.authService.organisationId;
    let url =
      this.apiUrl +
      'dowmloadAllEmployeeList' +
      '?organisationId=' +
      organisationId;
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        jwt_token: this.jwt_token,
      },
    });
    let blob = await response.blob();
    let filename = 'Employee_List.xlsx'; // Provide appropriate filename
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // for ATS or CV Pool
  addCVPool(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'createCVPool', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getCVPool(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getAllCvPool', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteCVPool(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'deleteCv', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateCVPool(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateCvPool', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  searchCV(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'fuzzySearchforCvPool', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateEmployeeAttendance(id) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateEmployeeAttendance', id).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  userAdmin(payload: { year: number }): Promise<any> {
    {
      return new Promise((resolve, reject) => {
        this.http
          .post(this.apiUrl + 'getAllUserLeaveBalanceforAdmin', payload, {
            headers: this.header,
          })
          .subscribe(
            (resp: any) => {
              resolve(resp);
            },
            (error) => {
              reject(error);
            }
          );
      });
    }
  }
  updateleaveAdmin(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateAssignedLeave', data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  //  updateleaveAdmin(data: any){
  //   return new Promise((resolve, reject)=>{
  //     this.http.post(this.apiUrl + 'updateAssignedLeave', data,{headers:this.header}).subscribe((res: any)=>{
  //       resolve(res);
  //     },error=>{
  //       reject(error)
  //     })
  //   })
  // }

  //   /**********************Grievance************* */

  //   saveGrievance(data: any) {
  //     return new Promise((resolve, reject) => {
  //       this.http.post(this.apiUrl + 'saveOrSubmitGrievance', data,{headers:this.header}).subscribe((res: any) => {
  //         resolve(res);
  //       }, error => {
  //         reject(error)
  //       })
  //     })
  //   }

  //   getGrievance(data: any) {
  //     return new Promise((resolve, reject) => {
  //       this.http.post(this.apiUrl + 'getGrievance', data,{headers:this.header}).subscribe((res: any) => {
  //         resolve(res)
  //       }, error => {
  //         reject(error)
  //       })
  //     })
  //   }

  // /**********************Grievance************* */

  saveGrievance(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'saveOrSubmitGrievance', data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getGrievance(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getGrievance', data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getAllGrievance(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getAllNewGrievance', data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // need endpoint
  updateTicketData(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'assignGrievance', data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  // updateTicketComment(data:any){
  //   return new Promise((resolve, reject)=>{
  //     this.http.post(this.apiUrl + 'createTicketComment',data,{headers:this.header}).subscribe((res:any)=>{
  //       resolve(res)
  //     }, error => {
  //       reject(error)
  //     })
  //   })
  // }

  // subjectBehavior function ankit

  setTicket(ticketCount: number) {
    console.log(ticketCount);
    this.ticket.next(ticketCount);
  }

  // conveyance and allowance apis -Ankit

  createConveyance(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'createConvinceAndCalm', data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  getConveyance(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getConvinceAndCalm', data).subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  getManagerConveyance(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getManagerConvinceAndCalm', data).subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  updateConveyance(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'updateConvinceAndCalm', data).subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  //holidays calender
  getTeamId(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getMyTeamId', data, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getHoliDays(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getMyHolidays', data, { headers: this.header })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // capacity
  getCapacity(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getCapacity', data, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // subjectBehavior function ankit to refresh data after creating
  // setConveyance(data: number) {
  //   this.conveyance.next(data);
  // }

  // quality Asuurancde docs

  uploadQualityDocs(postData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'uploadDocument', postData, {
          headers: this.header,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getQualityDocs() {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .get(this.apiUrl + 'qualityDoc', {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // lead admin api Ankit

  getAssignedLead(postData) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getassignedLeadRequests', postData, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  createLead(postData) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'assignLeadRequests', postData, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  updateLeadData(postData) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'updateAssignedLead', postData, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // lead admin api vikash
  reportLead(postData) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getFilteredAssignedLeadRequests', postData, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getBdmList(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'bdmLists', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  leadgenerateCreate(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'createLeadGeneration', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  eventLists(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'eventList', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getSalesEmployees(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'fetchSalesEmployees', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchleadGenerate() {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .get(this.apiUrl + 'getleadGenerations', { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  updateLeadGeneration(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'updateLeadGeneration', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  updateLeadGenerationStatus(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'updateEventData', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getCompanyName(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'listOfCompletedLeads', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getDevEmployees(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'fetchDevEmployees', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // monthAttendance

  getMonthlyAttendance(data: any) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'viewEmployeesmonthAttendance', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getMonthlyDownloadAttendance(data: any) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'downloadEmployeesmonthAttendance', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  createStoryTask(taskData) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'createStoryTask', taskData, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getChartData(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getAllProjectTask', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getHourChartData(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getProjectMemberActual', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getBarData(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getEmployeeTaskCounts', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getDevSapEmployeeList(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'fetchEmployees', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  saveEmployeeCost(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'addEmployeeCost', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getCostData(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getEmployeeCost', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  editEmployeeCost(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'updateEmployeeCost', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getMembership(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.authService.apiUrl + 'getMemberProjectsNumber', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  datefilter(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.authService.apiUrl + 'filterTasksForEpicManager', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  //  Graph to Show Project Efforts and Corresponding Cost
  getProjectCostGraph(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getProjectSummary', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getProcessList() {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .get(this.apiUrl + 'getProcessDefinition', { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // positions code ankit

  createPositions(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'createOpenPositions', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // getProcessList() {
  //   return new Promise((resolve, reject) => {
  //     let headers = new HttpHeaders();
  //     headers = headers.append('jwt_token', this.jwt_token);
  //     headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
  //     this.http
  //       .get(this.apiUrl + 'getProcessDefinition',{headers:headers})
  //       .subscribe(
  //         (resp: any) => {
  //           resolve(resp);
  //         },
  //         (error) => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  leadEvents(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'upcomingEvents', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  addEvents(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      // headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'addEvent', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  updatePositions(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'updateOpenPositions', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getPositions() {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .get(this.apiUrl + 'getOpenPositions', { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getAssigned(data: any) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getAssignedLeadRequestsForWeek', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateAssigned(data: any) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'updateAssignedLead', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  leadGenerationFilter(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getLeadGenerationsByFilter', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  deleteEvents(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'deleteEvent', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // filters api for user tickets by ankit
  getProjectList(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getFilterProjects', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getFilterEpics(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getFilterEpics', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getFilterStory(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getFilterStory', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getFilterCreatedBy(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getFilterCreatedBy', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getFilterStatus(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getFilterTaskStatus', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getFilterFeasibilityStatus(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getFilterFeasibilityStatus', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getFilterReleaseNumber(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getAllReleaseNumbers', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  

  getSearchDataById(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getTaskById', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getDownloadUserTicket(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'downloadTasksForEpicManager', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getWeeklyDashboard(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'sprintDashboard', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getEmployeeListName(payload) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getAllEmployee', payload).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // release feature api for vishal new

  getReleaseData(payload) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getRelease', payload, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  createRelease(payload) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');

      this.http
        .post(this.apiUrl + 'createRelease', payload, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // release feature api for vishal new
  updateLead(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'updateAssignedLeadAdmin', data, {
          headers: headers,
        })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  deleteLead(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'deleteAssignedLead', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // Cost Report Apis Ankit
  getCostReport(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getDsrData', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getMisCostReport(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getMicReport', data, { headers: headers })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  leadGenerateStatus(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getAllStatusValues', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  
  fetchProjects(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'project-dropdown', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  fetchAllEmployees(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'employees-dropdown-weekwise', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  saveForecastData(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'staffing-forecasting', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchFilteredData(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'staffing-forecasting-dashboard', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
 
  updateEntries(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'update-staffing-data', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchPreviewData(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'preview-data', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  setSkills(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'createSkill', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getSkill(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getSkills', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  updateSkillData(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'updateSkills', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  skillDropdown(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getSkillList', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  createRating(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'createMonthlyRating', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  updateRating(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'updateMonthlyRating', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getRating(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getMonthlyRating', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  gerPerformanceData(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.apiUrl + 'getPerformanceReport', data, { headers: headers })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  furtherDeliverProduct(deliveryDetails: any, formData: any): Observable<any> {
    const payload = {
      ...formData,
      deliveryDetails: deliveryDetails
    };
    return this.http.post(this.apiUrl + "update-delivery-data-s2", payload);
  }

  fetchClients(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "asset-client-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchClientWarehouses(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'asset-warehouse-dropdown', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }
  fetchClientWarehousesAll(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'asset-warehouse-dropdown-all', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchWarehouseProducts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'delivery-product-list-s2', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });

  }

  fetchProductsByClient(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'delivery-product-list-s2', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchOEM(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "asset-oems-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchStore(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "stores-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchCategories(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "asset-categories-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchPurchaseId(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "purchaseId-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }


  fetchEngineers(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "asset-engineers-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  submitMaterial(material: any, formData: any): Observable<any> {
    const payload = {
      ...formData,
      material: material
    };
    return this.http.post(this.apiUrl + "asset-inventory-grn", payload);
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?categoryId=${categoryId}`);
  }

  deliverProduct(deliveryDetails: any, formData: any): Observable<any> {
    const payload = {
      ...formData,
      deliveryDetails: deliveryDetails
    };
    return this.http.post(this.apiUrl + "update-delivery-data-s1", payload);
  }

  generateChallan(deliveryDetails: any): Observable<Blob> {
    return this.http.post(this.apiUrl + 'generateChallan', deliveryDetails, { responseType: 'blob' });
  }

  getAssetsBySubstation(substation: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?substation=${substation}`);
  }

  getProducts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'scrap-managemet-dashboard', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  updateProduct(product: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "scrap-management-action", product, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchData(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "asset-inventory-dashboard", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchProducts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "delivery-product-list", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchQAProducts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "quality-assurance-dashboard", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchSites(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "asset-sites-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchDeliveredData(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'grid-view-dashboard', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchFaultyData(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.http.post(this.apiUrl + 'grid-view-dashboard', data, { headers: this.header }).subscribe((resp: any) => {
      this.http.post(this.apiUrl + 'faulty-asset-dashboard', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }


  ///// Methods for saving Category, Engineer, Model, OEM, Site, and Store

  saveCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}asset-category`, data);
  }

  submitProducts(payload: any) {
    return this.http.post(`${this.apiUrl}update-testing-data`, payload);
  }

  saveEngineer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}asset-engineer`, data);
  }

  saveModel(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}models`, data);
  }

  saveOEM(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}asset-oem`, data);
  }

  saveProject(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}asset-project`, data);
  }

  saveSite(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}asset-site`, data);
  }

  saveStore(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}asset-stores`, data);
  }

  submitReturn(assets: any): Observable<any> {
    return this.http.post(`${this.apiUrl}faulty-asset-action`, assets);
  }

  getItemsByPurchaseId(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getItemsByPurchaseId', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  getItemsByChallanNo(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getItemsByChallanNumber', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }


  submitMoreData(material: any, formData: any): Observable<any> {
    const payload = {
      ...formData,
      material: material
    };
    return this.http.post(this.apiUrl + 'asset-inventory-update-grn', payload);
  }


  saveClient(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}asset-client`, data);
  }

  saveWarehouse(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}asset-warehouse`, data);
  }

  deleteItem(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}delete-asset-data`, payload);
  }
  updateItem(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}update-asset-data`, payload);
  }
  // updateEntries(data: any): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.post(this.apiUrl + "update-staffing-data", data, { headers: this.header }).subscribe((resp: any) => {
  //       resolve(resp);
  //     }, error => {
  //       reject(error);
  //     });
  //   });
  // }

}
