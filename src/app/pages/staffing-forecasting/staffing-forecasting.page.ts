import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { DataService } from 'src/app/services/staffing.service'; // Adjust the path as necessary
import { CommonService } from '../../services/common.service';



@Component({
  selector: 'app-staffing-forecasting',
  templateUrl: './staffing-forecasting.page.html',
  styleUrls: ['./staffing-forecasting.page.scss'],
})
export class StaffingForecastingPage {
  userId = localStorage.getItem("userId");
  teams = ['Project'];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  projects: any = [];
  allEmployees: any = [];

  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private toastController: ToastController,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.loadProjects();
    this.fetchEmployees();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }

  entries = [
    {
      team: '',
      projectName: '',
      projectId: '', // Add this
      resourceName: '',
      employeeId: '', // Add this
      hours: 0,
      date: '',
    },
  ];

  selectedMonth = '';
  selectedWeek = '';
  startDate = '';
  endDate = '';
  minDate = '';
  maxDate = '';

  addRow() {
    this.entries.push({
      team: '',
      projectName: '',
      projectId: '', // Add this
      resourceName: '',
      employeeId: '', // Add this
      hours: 0,
      date: '',
    });
  }

  submitData() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
      selectedMonth: this.selectedMonth,
      selectedWeek: this.selectedWeek,
      startDate: this.startDate,
      endDate: this.endDate,
      entries: this.entries,
    };

    this.dataService.saveForecastData(formData).then((res: any) => {
      this.presentToast('Data saved successfully!', 'success');
      console.log('Data saved:', res);
    }).catch(error => {
      this.presentToast('Error saving data.', 'danger');
      console.error('Error saving data', error);
    });
  }

  loadProjects() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchProjects(formData).then((res: any) => {
      this.projects = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching store data', error);
    });
  }

  fetchEmployees() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };
    this.dataService.fetchAllEmployees(formData).then((res: any) => {
      this.allEmployees = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching store data', error);
    });
  }

  copyRow(index: number) {
    const newRow = { ...this.entries[index] };
    this.entries.splice(index + 1, 0, newRow);
  }

  removeRow(index: number) {
    this.entries.splice(index, 1);
  }

  getTotalHours() {
    return this.entries.reduce((total, entry) => total + (entry.hours || 0), 0);
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

  updateProjectId(entry) {
    const selectedProject = this.projects.find(project => project.projectName === entry.projectName);
    if (selectedProject) {
      entry.projectId = selectedProject.projectId;
    }
  }

  updateEmployeeId(entry) {
    const selectedEmployee = this.allEmployees.find(employee => employee.name === entry.resourceName);
    if (selectedEmployee) {
      entry.employeeId = selectedEmployee.employeeId;
    }
  }
}


// import { Component } from '@angular/core';
// import { ModalController, ToastController } from '@ionic/angular';
// import * as moment from 'moment';
// import { DataService } from 'src/app/services/staffing.service'; // Adjust the path as necessary
// import { CommonService } from '../../services/common.service';



// @Component({
//   selector: 'app-staffing-forecasting',
//   templateUrl: './staffing-forecasting.page.html',
//   styleUrls: ['./staffing-forecasting.page.scss'],
// })
// export class StaffingForecastingPage {
//   userId=localStorage.getItem("userId");
//   teams = ['Project'];
//   months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   projects: any = [];
//   allEmployees: any = [];

  
//   constructor(
//     private modalController: ModalController,
//     private dataService: DataService,
//     private toastController: ToastController,
//     private commonService: CommonService,

//   ) { }


//   ngOnInit() {
//     this.loadProjects()
//     this.fetchEmployees()
//   }


//   async presentToast(message: string, color: string) {
//     const toast = await this.toastController.create({
//       message: message,
//       duration: 2000,
//       color: color,
//     });
//     toast.present();
//   }

//   entries = [
//     {
//       team: '',
//       projectName: '',
//       resourceName: '',
//       hours: 0,
//       date: '',
      
//     },
//   ];

//   selectedMonth = '';
//   selectedWeek = '';
//   startDate = '';
//   endDate = '';
//   minDate = '';
//   maxDate = '';

//   addRow() {
//     this.entries.push({
//       team: '',
//       projectName: '',
//       resourceName: '',
//       hours: 0,
//       date: '',
//     });
//   }

//   submitData() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//       selectedMonth: this.selectedMonth,
//       selectedWeek: this.selectedWeek,
//       startDate: this.startDate,
//       endDate: this.endDate,
//       entries: this.entries,
//     };

//     this.dataService.saveForecastData(formData).then((res: any) => {
//       this.presentToast('Data saved successfully!', 'success');
//       console.log('Data saved:', res);
//     }).catch(error => {
//       this.presentToast('Error saving data.', 'danger');
//       console.error('Error saving data', error);
//     });
    
//   }

//   loadProjects() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchProjects(formData).then((res: any) => {
//       this.projects = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching store data', error);
//     });
//   }

//   fetchEmployees(){
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };
//     this.dataService.fetchAllEmployees(formData).then((res: any) => {
//       this.allEmployees = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching store data', error);
//     });
//   }
//   copyRow(index: number) {
//     const newRow = { ...this.entries[index] };
//     this.entries.splice(index + 1, 0, newRow);
//   }

//   removeRow(index: number) {
//     this.entries.splice(index, 1);
//   }

//   // submitData() {
//   //   // Implement your submit logic here
//   //   console.log('Data submitted:', this.entries);
//   // }

//   getTotalHours() {
//     return this.entries.reduce((total, entry) => total + (entry.hours || 0), 0);
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
// }
