import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import * as Rx from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  token:any;
  header:any;
  jwt_token:any;
  apiUrl1: any = 'https://3968-103-44-53-141.ngrok-free.app/';

  constructor(
    public http: HttpClient,
    public authService: AuthService
    ) { 
      
      this.jwt_token=localStorage.getItem('jwt_token');
      this.header = new HttpHeaders().set('jwt_token', this.jwt_token);
    }

  createPost(postData) {
    return new Promise((resolve, reject) => {
      postData.organisationId = this.authService.organisationId;
      postData.creator = this.authService.userId;
      this.http.post(this.authService.apiUrl + 'createPost', postData).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  // getAllPost() {
  //   return new Promise((resolve, reject) => {
  //     this.http.post(this.authService.apiUrl  + 'getAllPost', {organisationId: this.authService.organisationId, skip: 0}).subscribe((resp: any) => {
  //       resolve(resp)
  //     }, error => {
  //       reject(error)
  //     })
  //   })
  // }
  getAllPost(payload:{}) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl  + 'getAllPost', payload).subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  deletePost(postData){
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'deletePost', postData).subscribe((resp:any) => {
        resolve(resp)
      }), error => {
        reject(error)
      }
    })
  }

  getRandomQuote() {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.quotable.io/random').subscribe((resp: any) => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }
  
  login(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl  + 'login', data).subscribe(resp => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }
  
  getNewsFeed() {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl  + 'getNewsFeed',{}).subscribe(resp => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }
  
  filterByTeam(paramsData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl  + 'filterByTeam',paramsData).subscribe(resp => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }
  
  taskTypeFilter(paramsData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl  + 'taskTypeFilter',paramsData).subscribe(resp => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }

  weeklySummaryReport(data){
    return new Promise((resolve, reject) =>{
      this.http.post(this.authService.apiUrl + 'weeklyUtilization',data).subscribe(resp => {
        resolve(resp)
      }, error => {
        reject(error)
      })
    })
  }
}