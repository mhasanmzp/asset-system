import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Rx from 'rxjs';
import { io } from 'socket.io-client';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getLoggedInUserId(): any {
    throw new Error('Method not implemented.');
  }
  domainAndScreenPermissions = new Rx.BehaviorSubject({});
  userDetails = new Rx.BehaviorSubject({});
  userLogin = new Rx.BehaviorSubject({});
  orgOnboarded = new Rx.BehaviorSubject({});
  updatePermissions = new Rx.BehaviorSubject(false);
  userGroup: any = {};
  apiUrl: any = 'https://api.hr.timesofpeople.com/';
  socketUrl: any = 'https://api.hr.timesofpeople.com/';
  // socketUrl: any = 'ws://localhost:3000/';
  // apiUrl: any ='http://localhost:3000/'
  // apiUrl: any ="https://fe07-103-44-53-141.ngrok-free.app/"
  



  apiPeerUrl: any = 'api.hr.timesofpeople.com';
  // socket = io('http://api.hr.timesofpeople.com');
  // socket = io('http://localhost:3000');

  // apiPeerUrl: any = 'localhost';
  // socket = io('https://52d8-122-161-51-16.in.ngrok.io/')
  geturl: string;
  posturl: string;
  userType: string;
  organisationId: any;
  userId: any;
  employeeId: any;
  employeeName: any;
  officialEmail: any;
  token: any;
  header: any;
  headers: any;
  jwt_token: any = localStorage.getItem('jwt_token');
  constructor(public http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.header = new HttpHeaders().set('jwt_token', localStorage.getItem('jwt_token'));
  }

  getUserDetails(userId, type) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(
          this.apiUrl+ 'getUserDetails',
          { userId: userId, type: type}
       
        )
        .subscribe(
          (resp: any) => {
            if (resp && resp.organisationEmail) {
              this.userType = 'organisation';
              this.organisationId = resp.organisationId;
              this.userId = resp.organisationId;
              this.userLogin.next(resp);
            }
            if (resp && resp.employeeId) {
              this.userType = 'employee';
              this.organisationId = resp.organisationId;
              this.employeeName = resp.firstName + ' ' + resp.lastName;
              this.userId = resp.employeeId;
              this.userLogin.next(resp);
            }
            localStorage.setItem('organisationId', this.organisationId);
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  organisationRegister(organisationData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'organisationRegister', organisationData)
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

  organisationUpdate(organisationData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'organisationUpdate', organisationData)
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

  getRandomQuote() {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.quotable.io/random').subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  login(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'login', data, ).subscribe(
        (resp) => {

          resolve(resp);

        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getNewsFeed() {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders()
      this.http.post(this.apiUrl + 'getNewsFeed', {}).subscribe(
        (resp) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  matchOtp(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'sentOtp', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  forgotPassword(postData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'forgotPassword', postData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  changePassword(formData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'changePassword', formData)
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

  createFeedback(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'createFeedback', data)
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

  getFeedback(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getFeedback', data)
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

  getLogTable(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getLogTableDetails', data)
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

  getLogTableByDate(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getLogTableDetailsByDate', data)
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

  getLogTableByEmployeeId(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiUrl + 'getLogTableDetailsByEmployeeId', data)
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

  // Cmf Functionalities Api
  cmfdata(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'createCmf', data).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  fetchCmfData() {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'getCmfRecords',{}).subscribe(
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


