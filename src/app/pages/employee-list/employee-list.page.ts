import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.scss'],
})
export class EmployeeListPage implements OnInit {
  allEmployees: any = [];
  allEmployeesReal: any = [];
  loader: boolean = false;
  employeeType: any = 0;
  allTeam: any;
  selectedTeam: any;
  allEmployees1: any;
  private subscription: Subscription;

  constructor(
    public commonService: CommonService,
    public authService: AuthService,
    public router: Router) { }

  ngOnInit() {
    this.subscription = this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.fetchEmployee();
        this.employeeType = 0
      }
    })
  }

  ionViewWillEnter() {
    // this.authService.userLogin.subscribe((resp: any) => {
    //   if (resp && Object.keys(resp).length > 0) {
    //     this.fetchEmployee();
    //     this.employeeType = 0
    //   }
    // })
    this.ngOnInit()
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  fetchEmployee() {
    this.commonService.presentLoading();
    this.commonService.getEmployeeList().then((resp: any) => {
      this.allEmployees = resp;
      this.allEmployeesReal = resp;
      this.allEmployees1 = resp;
      this.loader = false;
      this.fetchAllTeams();
    }, error => {
      // this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  fetchAllTeams() {
    this.commonService.fetchAllTeams().then(resp => {
      this.allTeam = resp
    }, error => {
      // this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  searchTeam(event) {
    this.selectedTeam = event.target.value;
    if (this.selectedTeam == 'search') {
      this.allEmployees = this.allEmployeesReal
    } else {
      this.allTeam.forEach(element => {
        if (element.teamId == this.selectedTeam) {
          this.allEmployees = [];
          this.allEmployees = this.allEmployeesReal.filter(e => element.users.includes(e.employeeId))
        
        }
      });
    }

  }

  searchEmployeeType(event) {
    let searchType = event.target.value;
    if (searchType == 0) {
      this.allEmployees = this.allEmployeesReal
    } else {
      let employee;
      if (this.selectedTeam != 'search')
        employee = this.allEmployees1.filter((emp: any) => emp.employeeType == searchType)
      else
        employee = this.allEmployeesReal.filter((emp: any) => emp.employeeType == searchType)

      if (employee.length > 0) {
        this.allEmployees = employee;
      }
    }
  }

  searchEmployee(event) {
    let searchTerm = event.target.value;
    let emp;
    if (this.selectedTeam != 'search')
      emp = this.allEmployees1.filter(e => e.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
    else
      emp = this.allEmployeesReal.filter(e => e.firstName.toLowerCase().includes(searchTerm.toLowerCase()))

    if (emp.length > 0) {
      this.allEmployees = emp;
    }
   
  }


  updateEmployee(request: any) {
    this.router.navigate(['/employee-onboarding/' + request.employeeId]);
  }

  downloadList() {
    this.commonService.downloadEmployeeList()
  }
}
