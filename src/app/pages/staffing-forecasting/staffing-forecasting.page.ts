import { Component } from '@angular/core';
import { ModalController, ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
// import { DataService } from 'src/app/services/staffing.service'; // Adjust the path as necessary
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-staffing-forecasting',
  templateUrl: './staffing-forecasting.page.html',
  styleUrls: ['./staffing-forecasting.page.scss'],
})
export class StaffingForecastingPage {
  userId = localStorage.getItem("userId");
  teams = ['Project','SAP'];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  projects: any = [];
  allEmployees: any = [];
  constructor(
    private modalController: ModalController,
    private dataService: CommonService,
    // private dataService: DataService,

    private toastController: ToastController,
    private router: Router,
  ) { }
  ngOnInit() {
    this.loadProjects();
    // this.fetchEmployees();
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
      projectId: '',
      resourceName: '',
      employeeId: '',
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
  totalHours= 0;
  addRow() {
    this.entries.push({
      team: '',
      projectName: '',
      projectId: '',
      resourceName: '',
      employeeId: '',
      hours: 0,
      date: '',
    });
  }
  resetData(){
    this.entries = [
      {
        team: '',
        projectName: '',
        projectId: '',
        resourceName: '',
        employeeId: '',
        hours: 0,
        date: '',
      },
    ];
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
      totalHours: this.totalHours,
      entries: this.entries,
    };
    this.dataService.saveForecastData(formData).then((res: any) => {
      this.presentToast('Data saved successfully!', 'success');
      this.resetData();
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
    }).catch(error => {
      console.error('Error fetching store data', error);
    });
  }


  copyRow(index: number) {
      const newRow = { ...this.entries[index] };

    if (newRow.date) {
      const currentDate = moment(newRow.date, 'YYYY-MM-DD');
      const incrementedDate = currentDate.add(1, 'days');
      newRow.date = incrementedDate.format('YYYY-MM-DD');
    }
  
    this.entries.splice(index + 1, 0, newRow);
  }
  

  removeRow(index: number) {
    this.entries.splice(index, 1);
  }

  getTotalHours() {
    this.totalHours = this.entries.reduce((total, entry) => total + (entry.hours || 0), 0);
    return this.totalHours;
  }

  updateDateRange() {
    if (this.selectedMonth) {
      const monthIndex = this.months.indexOf(this.selectedMonth);
      const year = new Date().getFullYear();
      this.minDate = moment([year, monthIndex]).startOf('month').format('YYYY-MM-DD');
      this.maxDate = moment([year, monthIndex]).endOf('month').format('YYYY-MM-DD');
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

  navigateToStaffingReport() {
    this.router.navigate(['/staffing-report']);
  }

  updateEmployeeId(entry: { resourceName: string, employeeId: string }) {
    const selectedEmployee = this.allEmployees.find(employee => employee.name === entry.resourceName);
    if (selectedEmployee) {
      entry.employeeId = selectedEmployee.employeeId;
      // console.log("data________", entry.employeeId);
    }
  }

    fetchEmployees() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
      weekNumber: this.selectedWeek,
    };
    this.dataService.fetchAllEmployees(formData).then((res: any) => {
      this.allEmployees = res;
      // console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching store data', error);
    });
  }
  onInput(event: any) {
    const inputValue = parseInt(event.target.value);
    if (inputValue > 45) {
      this.presentToast('Hours cannot exceed 45','danger');
        event.target.value = '45';
    } else if (inputValue > 45) {
        event.target.value = '45';
    }
}

}





