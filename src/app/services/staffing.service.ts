import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {




  private baseUrl = 'https://b3f1-203-92-37-218.ngrok-free.app'; // Replace with your actual API endpoint

  header: any = {}

  constructor(private http: HttpClient) { }


  fetchProjects(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/project-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchAllEmployees(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/employees-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  saveForecastData(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/staffing-forecasting", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }


  fetchFilteredData(data: any){
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/staffing-forecasting-dashboard", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }




}