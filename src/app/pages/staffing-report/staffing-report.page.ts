import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
// import { DataService } from 'src/app/services/staffing.service'; // Adjust the path as necessary
interface PreviewData {
  id: number;
  month: string;
  year: number;
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  date: string;
  team: string;
  projectId: number;
  projectName: string;
  employeeId: number;
  employeeName: string;
  hours: number;
  totalWeekHours: number;
}
interface ModalEntry {
  id: number;
  team: string;
  projectId: number;
  projectName: string;
  employeeName: string;
  date: string;
  hours: number;
}
@Component({
  selector: 'app-staffing-report',
  templateUrl: './staffing-report.page.html',
  styleUrls: ['./staffing-report.page.scss'],
  providers: [DatePipe],
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
  searchQuery: any;
  weekNo = this.selectedWeek;
  filteredData: any[] = [];
  isModalOpen = false;
  modalEntries: ModalEntry[] = [];
  originalModalEntries: ModalEntry[] = [];
  teams: string[] = [];
  allEmployees: any[] = [];
  previewData: PreviewData[] = [];
  customAlertOptions: any = {
    subHeader: 'Select an Option',
    translucent: true,
  };
  constructor(
    private dataService: CommonService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private datePipe: DatePipe
  ) {}
  ngOnInit() {
    this.fetchEmployees();
    this.loadProjects();
  }
  updateEmployeeId(selectedEmployeeName: string) {
    const selectedEmployee = this.employees.find(employee => employee.name === selectedEmployeeName);
    if (selectedEmployee) {
      this.selectedEmployee = selectedEmployee;
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
      this.filteredProjects = this.projects;
    }).catch(error => {
      console.error('Failed to load projects:', error);
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
      this.filteredEmployees = this.employees;
    }).catch(error => {
      console.error('Failed to fetch employees:', error);
    });
  }
  async getData() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
    const filter = [];
    if (this.selectedEmployee) {
      filter.push({
        employeeId: this.selectedEmployee.employeeId,
      });
    }
    if (this.selectedWeek) {
      filter.push({
        week: this.selectedWeek,
      });
    }
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
      filter: filter.length > 0 ? filter : null,
    };
    this.dataService.fetchFilteredData(formData).then(async (res: any) => {
      this.filteredData = res.map(item => ({ ...item, showProjects: false }));
      if (this.filteredData.length === 0) {
        const employeeName = this.selectedEmployee ? this.selectedEmployee.name : 'the selected criteria';
        await this.presentToast(`No data found for ${employeeName}`, 'warning');
      }
      await loading.dismiss();
    }).catch(async error => {
      console.error('Error fetching filtered data', error);
      await this.presentToast('Error fetching data', 'danger');
      await loading.dismiss();
    });
  }
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3500,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }
  exportToExcel() {
    const exportData: any[] = [];
    const projectNames = new Set<string>();
    const projectTotals: { [key: string]: number } = {}; // To store total hours for each project
    // Collect all unique project names and calculate total hours
    this.filteredData.forEach(item => {
      if (item.projects) {
        const projectsArray = Array.isArray(item.projects) ? item.projects : this.getProjectEntries(item.projects);
        projectsArray.forEach(project => {
          projectNames.add(project.name);
          if (!projectTotals[project.name]) {
            projectTotals[project.name] = 0;
          }
          projectTotals[project.name] += project.hours; // Accumulate total hours per project
        });
      }
    });
    // Convert set to array and sort
    const projectColumns = Array.from(projectNames).sort();
    // Prepare export data for main rows
    this.filteredData.forEach((item, index) => {
      item.weekStartDate = this.formatDate(item.weekStartDate); // Format the date here
      item.weekEndDate = this.formatDate(item.weekEndDate); // Format the date here
      const mainRow: any = {
        'Serial No.': index + 1,
        'Week No.': item.weekNumber,
        'Employee Name': item.employeeName,
        'Start Date': item.weekStartDate,
        'End Date': item.weekEndDate,
        'Weekly Estimated Hours': item.totalWeekHours,
        'Hourly Rate':item.hourlyRate
      };
      projectColumns.forEach(project => {
        mainRow[project] = '';
      });
      exportData.push(mainRow);
      if (item.projects) {
        const projectsArray = Array.isArray(item.projects) ? item.projects : this.getProjectEntries(item.projects);
        projectsArray.forEach(project => {
          mainRow[project.name] = project.hours;
        });
      }
    });
    // Prepare export data for total hours row per project
    const totalRow: any = {
      'Serial No.': '', // or any other identifier for the total row
      'Week No.': '', // or empty if not applicable
      'Employee Name': 'Total Hours', // Label for the total row
      'Start Date': '', // or empty if not applicable
      'End Date': '', // or empty if not applicable
      'Weekly Hours Spent': '', // or empty if not applicable
    };
    projectColumns.forEach(project => {
      totalRow[project] = projectTotals[project]; // Set total hours for each project
    });
    exportData.push(totalRow); // Add total row to export data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    // Write file
    XLSX.writeFile(workbook, "StaffingReport.xlsx");
  }
  navigateToForecasting() {
    this.router.navigate(['/staffing-forecasting']);
  }
  updateWeekNumber() {
    if (this.startDate) {
      this.selectedWeek = moment(this.startDate).format('W');
    } else {
      this.selectedWeek = '';
    }
  }
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
  toggleProjectDetails(index: number) {
    this.filteredData[index].showProjects = !this.filteredData[index].showProjects;
  }
  getProjectEntries(projects: { [key: string]: any }): { name: string, hours: number }[] {
    return Object.entries(projects).map(([name, hours]) => ({ name, hours }));
  }
  async openEditModal(item: any) {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
    this.selectedWeek = item.weekNumber;
    await this.fetchPreviewData(item);
    await loading.dismiss();
  }
  closeModal() {
    this.isModalOpen = false;
  }
  async fetchPreviewData(item: any) {
    const payload = {
      permissionName: "Tasks",
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
      weekNumber: item.weekNumber,
      employeeName: item.employeeName
    };
    try {
      const previewData = await this.dataService.fetchPreviewData(payload) as PreviewData[];
      previewData.forEach(data => {
        data.date = this.formatDate(data.date); // Format the date here
      });
      this.modalEntries = this.getModalEntries(previewData);
      this.originalModalEntries = JSON.parse(JSON.stringify(this.modalEntries)); // Store a copy of the original data
      this.isModalOpen = true;
    } catch (error) {
      console.error('Failed to fetch preview data:', error);
      await this.presentToast('Error fetching preview data', 'danger');
    }
  }
  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'yyyy-MM-dd') || '';
  }
  getModalEntries(previewData: PreviewData[]): ModalEntry[] {
    return previewData.map(item => ({
      id: item.id,
      team: item.team,
      projectId: item.projectId,
      projectName: item.projectName,
      employeeName: item.employeeName,
      date: item.date,
      hours: item.hours,
    }));
  }
  copyRow(index: number) {
    const newRow = { ...this.modalEntries[index], id: 0 }; // Assuming new rows should have an id of 0 or similar
    this.modalEntries.push(newRow);
  }
  removeRow(index: number) {
    this.modalEntries.splice(index, 1);
  }
  updateProjectId(entry: any) {
    const selectedProject = this.projects.find(project => project.projectName === entry.projectName);
    if (selectedProject) {
      entry.projectId = selectedProject.projectId;
    }
  }
  getChangedData(): ModalEntry[] {
    const changedData: ModalEntry[] = [];
    this.modalEntries.forEach((entry, index) => {
      const originalEntry = this.originalModalEntries[index];
      if (JSON.stringify(entry) !== JSON.stringify(originalEntry)) {
        changedData.push({
          id: entry.id,
          projectId: entry.projectId,
          team: entry.team,
          projectName: entry.projectName,
          employeeName: entry.employeeName,
          date: entry.date,
          hours: entry.hours,
        });
      }
    });
    return changedData;
  }
  async submitChanges() {
    const changedData = this.getChangedData();
    if (changedData.length > 0) {
      const payload = {
        permissionName: "Tasks",
        employeeIdMiddleware: this.userId,
        employeeId: this.userId,
        data: changedData
      };
      try {
        await this.dataService.updateEntries(payload);
        await this.presentToast('Changes submitted successfully', 'success');
        this.isModalOpen = false;
      } catch (error) {
        console.error('Failed to submit changes:', error);
        await this.presentToast('Error submitting changes', 'danger');
      }
    } else {
      await this.presentToast('No changes to submit', 'warning');
      this.isModalOpen = false;
    }
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