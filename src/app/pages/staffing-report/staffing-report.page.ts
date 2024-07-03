import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/staffing.service'; // Adjust the path as necessary
import { CommonService } from '../../services/common.service';
import { ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-staffing-report',
  templateUrl: './staffing-report.page.html',
  styleUrls: ['./staffing-report.page.scss'],
})
export class StaffingReportPage implements OnInit {
  employees: any[] = [];
  projects: any[] = [];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  userId = localStorage.getItem("userId");
  filteredEmployees: any[] = [];
  filteredProjects: any[] = [];
  selectedEmployee: any;
  selectedProject: any;
  selectedMonth: string;
  selectedWeek = '';
  startDate = '';
  endDate = '';
  minDate = '';
  maxDate = '';
  totalHours = 0;

  filteredData: any[] = [];

  customAlertOptions: any = {
    subHeader: 'Select an Option',
    translucent: true,
  };

  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private toastController: ToastController,
    private commonService: CommonService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.fetchEmployees();
    this.loadProjects();
  }

  updateEmployeeId(selectedEmployee) {
    const selectedEmployees = this.employees.find(employee => employee.name === selectedEmployee.resourceName);
    if (selectedEmployee) {
      selectedEmployee.employeeId = selectedEmployees.employeeId;
    }
  }

  loadProjects() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchProjects(formData).then((res: any) => {
      this.projects = res;
      this.filteredProjects = res; // Ensure filteredProjects is also updated
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching projects data', error);
    });
  }

  fetchEmployees() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };
    this.dataService.fetchAllEmployees(formData).then((res: any) => {
      this.employees = res;
      this.filteredEmployees = res; // Ensure filteredEmployees is also updated
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching employees data', error);
    });
  }

  filterItems(event: any, type: string) {
    const searchTerm = event.target.value.toLowerCase();
    if (type === 'employee') {
      this.filteredEmployees = searchTerm.length > 0 ? this.employees.filter(employee => employee.name.toLowerCase().includes(searchTerm)) : this.employees;
    } else if (type === 'project') {
      this.filteredProjects = searchTerm.length > 0 ? this.projects.filter(project => project.name.toLowerCase().includes(searchTerm)) : this.projects;
    }
  }

  applyFilter() {
    this.getData();
  }

  navigateToForecasting() {
    this.router.navigate(['/staffing-forecasting']);
  }

  updateDateRange() {
    if (this.selectedMonth) {
      const monthIndex = this.months.indexOf(this.selectedMonth);
      const year = new Date().getFullYear();
      this.minDate = moment([year, monthIndex]).startOf('month').format('YYYY-MM-DD');
      this.maxDate = moment([year, monthIndex]).endOf('month').format('YYYY-MM-DD');

      // Reset dates and week number when month changes
      this.startDate = '';
      this.endDate = '';
      this.selectedWeek = '';
    }
  }

  updateWeekNumber() {
    if (this.startDate && this.endDate) {
      const startWeek = moment(this.startDate).isoWeek();
      const endWeek = moment(this.endDate).isoWeek();
      if (startWeek === endWeek) {
        this.selectedWeek = `${startWeek}`;
      } else {
        this.selectedWeek = `${startWeek}-${endWeek}`;
      }
    } else {
      this.selectedWeek = '';
    }
  }

  getData() {
    if (this.selectedEmployee || this.selectedWeek) {
      const filter = [
        {
          employeeId: this.selectedEmployee.employeeId,
          week: this.selectedWeek,
        },
      ];
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: this.userId,
        employeeId: this.userId,
        filter: filter,
      };
      this.dataService.fetchFilteredData(formData).then((res: any) => {
        this.filteredData = res.map(item => ({ ...item, showProjects:false })); // Initialize showProjects to false for each item
        console.log("Filtered Data ::::::::::::::", res);
      }).catch(error => {
        console.error('Error fetching filtered data', error);
      });
    } else {
      // Show an error message if necessary fields are not selected
      this.presentToast('Please select an employee and a week to filter.');
    }
  }

  getProjectEntries(projects) {
    return Object.entries(projects).map(([name, hours]) => ({ name, hours }));
  }

  toggleProjectDetails(index: number) {
    this.filteredData[index].showProjects = !this.filteredData[index].showProjects;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}



// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { DataService } from 'src/app/services/staffing.service'; // Adjust the path as necessary
// import { CommonService } from '../../services/common.service';
// import { ModalController, ToastController } from '@ionic/angular';
// import * as moment from 'moment';

// @Component({
//   selector: 'app-staffing-report',
//   templateUrl: './staffing-report.page.html',
//   styleUrls: ['./staffing-report.page.scss'],
// })
// export class StaffingReportPage implements OnInit {
//   employees: any[] = [];
//   projects: any[] = [];
//   months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   userId = localStorage.getItem("userId");
//   filteredEmployees: any[] = [];
//   filteredProjects: any[] = [];
//   selectedEmployee: any;
//   selectedProject: any;
//   selectedMonth: string;
//   selectedWeek = '';
//   startDate = '';
//   endDate = '';
//   minDate = '';
//   maxDate = '';
//   totalHours = 0;

//   filteredData: any[] = [];

//   customAlertOptions: any = {
//     subHeader: 'Select an Option',
//     translucent: true,
//   };

//   constructor(
//     private modalController: ModalController,
//     private dataService: DataService,
//     private toastController: ToastController,
//     private commonService: CommonService,
//     private router: Router,
//   ) {}

//   ngOnInit() {
//     this.fetchEmployees();
//     this.loadProjects();
//   }

//   updateEmployeeId(selectedEmployee) {
//     const selectedEmployees = this.employees.find(employee => employee.name === selectedEmployee.resourceName);
//     if (selectedEmployee) {
//       selectedEmployee.employeeId = selectedEmployees.employeeId;
//     }
//   }

//   loadProjects() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchProjects(formData).then((res: any) => {
//       this.projects = res;
//       this.filteredProjects = res; // Ensure filteredProjects is also updated
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching projects data', error);
//     });
//   }

//   fetchEmployees() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };
//     this.dataService.fetchAllEmployees(formData).then((res: any) => {
//       this.employees = res;
//       this.filteredEmployees = res; // Ensure filteredEmployees is also updated
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching employees data', error);
//     });
//   }

//   filterItems(event: any, type: string) {
//     const searchTerm = event.target.value.toLowerCase();
//     if (type === 'employee') {
//       this.filteredEmployees = searchTerm.length > 0 ? this.employees.filter(employee => employee.name.toLowerCase().includes(searchTerm)) : this.employees;
//     } else if (type === 'project') {
//       this.filteredProjects = searchTerm.length > 0 ? this.projects.filter(project => project.name.toLowerCase().includes(searchTerm)) : this.projects;
//     }
//   }

//   applyFilter() {
//     this.getData();
//   }

//   navigateToForecasting() {
//     this.router.navigate(['/staffing-forecasting']);
//   }

//   updateDateRange() {
//     if (this.selectedMonth) {
//       const monthIndex = this.months.indexOf(this.selectedMonth);
//       const year = new Date().getFullYear();
//       this.minDate = moment([year, monthIndex]).startOf('month').format('YYYY-MM-DD');
//       this.maxDate = moment([year, monthIndex]).endOf('month').format('YYYY-MM-DD');

//       // Reset dates and week number when month changes
//       this.startDate = '';
//       this.endDate = '';
//       this.selectedWeek = '';
//     }
//   }

//   updateWeekNumber() {
//     if (this.startDate && this.endDate) {
//       const startWeek = moment(this.startDate).isoWeek();
//       const endWeek = moment(this.endDate).isoWeek();
//       if (startWeek === endWeek) {
//         this.selectedWeek = `${startWeek}`;
//       } else {
//         this.selectedWeek = `${startWeek}-${endWeek}`;
//       }
//     } else {
//       this.selectedWeek = '';
//     }
//   }

//   getData() {
//     if (this.selectedEmployee || this.selectedWeek) {
//       const filter = [
//         {
//           employeeId: this.selectedEmployee.employeeId,
//           week: this.selectedWeek,
//         },
//       ];
//       const formData = {
//         permissionName: 'Tasks',
//         employeeIdMiddleware: this.userId,
//         employeeId: this.userId,
//         filter: filter,
//       };
//       this.dataService.fetchFilteredData(formData).then((res: any) => {
//         this.filteredData = res;
//         console.log("Filtered Data ::::::::::::::", res);
//       }).catch(error => {
//         console.error('Error fetching filtered data', error);
//       });
//     } else {
//       // Show an error message if necessary fields are not selected
//       this.presentToast('Please select an employee and a week to filter.');
//     }
//   }

//   getProjectEntries(projects: any) {
//     return Object.entries(projects).map(([name, hours]) => ({ name, hours }));
//   }

//   async presentToast(message: string) {
//     const toast = await this.toastController.create({
//       message: message,
//       duration: 2000,
//       position: 'bottom',
//     });
//     toast.present();
//   }
// }





