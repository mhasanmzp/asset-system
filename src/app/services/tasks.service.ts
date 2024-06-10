import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  token:any;
  header:any;
  jwt_token: any;
  apiUrl1 =
  'https://80fa-103-44-53-141.ngrok-free.app/';
  constructor(
    public authService: AuthService,
    public http: HttpClient
    ) { 
     
      this.jwt_token=localStorage.getItem('jwt_token');
      this.header = new HttpHeaders().set('jwt_token', this.jwt_token);
    }

    getUserTeams(){
      return new Promise((resolve, reject) => {
        this.http.post(this.authService.apiUrl + 'getUserTeams',{userId: localStorage.getItem("userId")}).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    fetchTeamColumns(teamId){
      return new Promise((resolve, reject) => {
        this.http.post(this.authService.apiUrl + 'fetchTeamColumns',{ teamId }).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    updateTask(task){
      return new Promise((resolve, reject) => {
        task.organisationId = this.authService.organisationId;
        this.http.post(this.authService.apiUrl + 'updateTask',task).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    createTask(task){
      return new Promise((resolve, reject) => {
        task.organisationId = this.authService.organisationId;
        task.employeeId = this.authService.userId;
        this.http.post(this.authService.apiUrl + 'createTask',task).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    getUserTasks(column){
      return new Promise((resolve, reject) => {
        column.organisationId = this.authService.organisationId;
        column.employeeId = this.authService.userId;
        this.http.post(this.authService.apiUrl + 'getUserTasks',column).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    deleteUserTasks(column){
      return new Promise((resolve, reject) => {
        column.organisationId = this.authService.organisationId;
        column.employeeId = this.authService.userId;
        this.http.post(this.authService.apiUrl + 'deleteTask',column).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    deleteStoryTasks(column){
      return new Promise((resolve, reject) => {
        column.organisationId = this.authService.organisationId;
        column.employeeId = this.authService.userId;
        this.http.post(this.authService.apiUrl + 'deleteStoryTask',column).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    filterDsr(params){
      return new Promise((resolve, reject) => {
        params.organisationId = this.authService.organisationId;
       
        this.http.post(this.authService.apiUrl + 'filterDsr',params).subscribe((resp: any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }
  
    getTasksDsr(data){
      return new Promise((resolve, reject) => {
        this.http.post(this.authService.apiUrl + 'getTasksforDsr',data).subscribe((resp:any) => {
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    requestTicket(data){
      return new Promise((resolve,reject)=>{
        this.http.post(this.authService.apiUrl+'requestTicket',data).subscribe((resp:any)=>{
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }

    getAllTicketsuser(data){
      return new Promise((resolve,reject)=>{
        this.http.post(this.authService.apiUrl+'getAllTicketsforuser',data).subscribe((resp:any)=>{
          resolve(resp)
        }, error => {
          reject(error)
        })
      })
    }
    
    getAllTicketsManager(data){
      return new Promise((resolve,reject)=>{
        this.http.post(this.authService.apiUrl+'getAllTicketsforManager',data).subscribe((resp:any)=>{
          resolve(resp)
        }, error=>{
          reject(error)
        })
      })
    }

    actionTicketbyManager(data){
      return new Promise((resolve,reject)=>{
        this.http.post(this.authService.apiUrl+'actionTicketbyProjectManager',data).subscribe((resp:any)=>{
          resolve(resp)
        }, error =>{
          reject(error)
        })
      })
    }
    getTaskLogsData(data:any)
    {
      return new Promise((resolve, reject) => {
        
        this.http
          .post(this.authService.apiUrl + 'getTaskLogs', data, {
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
