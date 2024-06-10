import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import Toastr from 'toastr2';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AppraisalService {
  token: any;
  header: any;
  loading: any;
  loading1: any;
  toastr: any;


  // pLoading() {
  //   throw new Error('Method not implemented.');
  // }
  // toastr: any;
  // url: any = 'https://7bfa-203-92-37-218.ngrok-free.app/';
  // header: any = {  
  //   'ngrok-skip-browser-warning': 'true',
  // };
  ticket = new Subject();

  // apiUrl = 'https://api.hr.timesofpeople.com/';
  apiUrl = 'https://api.hr.timesofpeople.com/';

  constructor(
    public authService: AuthService,
    public http: HttpClient,
    public loadingController: LoadingController,
    public toast: ToastController
  ) {}

  showToast(action: any, message: any) {
    this.toastr = new Toastr();
    this.toastr.options.closeDuration = 1000;
    this.toastr.options.progressBar = true;
    this.toastr.options.positionClass = 'toast-top-right';
    this.toastr[action](message, action + '!', { timeOut: 3000 });
  }

  department(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'departments', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  employeeList(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'empList', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  mainScreenList(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'appraisalListHr', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  selectManager(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'employees', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  selectHr(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'hrList', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  employeeManagerStore(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'empmangStore', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  employeeManagerFetch(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'empmangFetch', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  employeeManagerUpdate(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'empmangUpdate', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  employeeAppraisalAmount(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'hrRatingAmountStorage', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  employeeAmountUpdate(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'hrRatingAmountUpdate', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  employeeAmountShow(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'hrRatingAmountInfo', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  allDetailsofAnAppraisal(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'allDetailsOfAnAppraisal', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  async pLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'circles',
      duration: 1000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    return await this.loading.present();
  }

  async pLoading1() {
    this.loading1 = await this.loadingController.create({
      spinner: 'circles',
      // duration: 3000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    return await this.loading1.present();
  }

  loadingDismiss() {
    this.loading.dismiss();
  }
  loadingDismiss1() {
    this.loading1.dismiss();
  }

  initiateEmployee(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'initiateAppraisal', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  fetchemployeedetails(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'anEmpBasicDetails', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  totalAmount(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'automaticAmount', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  fetchAppraisalInfo(data: any) {
    return new Promise((resolve, reject) => {
      
      this.http
        .post(this.apiUrl + 'allAppraisalInfoOfAnEmp', data, {headers: this.header,}).subscribe(
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
  //  employee 2 screen rating submit button api
  submitRatings(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'employeeEvaluation', data, {
          headers: this.header,
        })
        .subscribe(
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
  submitRatingsmanager(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'managersEvaluation', data, {
          headers: this.header,
        })
        .subscribe(
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
  fetchEmpSubmittedData(data: any) {  
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'anAppraisalDetailsOfEmpEval', data)
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
  // fetchEmpSubmittedData(data: any){
  //  return this.http.post(this.apiUrl + 'anAppraisalDetailsOfEmpEval1', data)
  // }


  // manager screen api
  fetchManagerAssignedAppraisal(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'appraisalListL2L3L4L5', data, {
          headers: this.header,
        })
        .subscribe(
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
  //  manager screen  employee rating
  fetchRating(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'anAppraisalDetailsOfEmpEval', data, {
          headers: this.header,
        })
        .subscribe(
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
  setTicket(ticketCount: any) {
    console.log(ticketCount);
    this.ticket.next(ticketCount);
  }
  //  manager screen  Manager rating
  submitManagerRating(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'managersEvaluation', data, {
          headers: this.header,
        })
        .subscribe(
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
  //  manager screen manager  form
  fetchmanagerReview(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'managersEvaluation', data, {
          headers: this.header,
        })
        .subscribe(
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
  //  employee basic deatils on top manager screen
  // fetchemployeedetails(data: any) {
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .post(this.apiUrl + 'anEmpBasicDetails', data, {
  //         headers: this.header,
  //       })
  //       .subscribe(
  //         (res: any) => {
  //           resolve(res);
  //           console.log('res', res);
  //         },
  //         (error) => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  allDetailsofManagerRating(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'allDetailsOfAnAppraisal', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }



  // ankit apis

  getEmpForm(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'employeeForm',data)
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
  TopMangerreview(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'managersEvaluation',data)
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
  topEmployefetchdata(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'anEmpBasicDetails',data)
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
 finalhrResponse(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'hrResponse',data)
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


  

}
