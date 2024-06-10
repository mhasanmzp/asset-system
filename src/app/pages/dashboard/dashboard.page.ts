import {
  Component,
  ViewChild,
  Renderer2,
  ViewEncapsulation,
  OnInit,
  ElementRef,
  Inject,
  OnDestroy,
} from '@angular/core';
import {
  IonTextarea,
  PopoverController,
  ModalController,
} from '@ionic/angular';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { createAnimation, Animation } from '@ionic/core';
import { DashboardService } from '../../services/dashboard.service';
import { AlertController } from '@ionic/angular';
import { NotificationsPage } from '../notifications/notifications.page';
import { ProjectTaskDetailsPage } from '../../modals/project-task-details/project-task-details.page';
import { EChartsOption } from 'echarts';
import { TasksService } from 'src/app/services/tasks.service';
import { DOCUMENT } from '@angular/common';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardPage implements OnInit, OnDestroy {
  notifications: any = 0;
  allTicketData: any;
  organisationId: any;
  daysInWeek: any = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  taskDate: any;
  segment: any = 'home';
  subSegment: any = 'projectList';
  isReportingManager: any = 0;
  posts: any = [];
  getNearbyPosts: boolean = false;
  checkedNearbyPosts: boolean = false;
  allProjects: any = [];
  newsFeed: any = [];
  today: any;
  attendanceData: any;
  quote: any = {};
  name = [
    { employeeName: 'Aniket' },
    { employeeName: 'Sonali' },
    { employeeName: 'Parul' },
    { employeeName: 'Vikash' },
    { employeeName: 'Faisal' },
  ];
  project = [
    { projectName: 'Hr Portal', progress: 0.3, teamName: 'Development Team' },
    { projectName: 'The Meet', progress: 0.8, teamName: 'Sales Team' },
  ];
  permissionViewAllDSR: boolean = false;
  isOpen: boolean = false;
  notification: any = [];
  employeeId: any;
  allTasks: any = [];
  testingTasks: any = [];
  responseLength: any;
  notificationItems: any = [];
  peer: any;
  conn: any;
  projectMembers: any = [];
  teamBoardColumns: any;
  connectedTo: any = [];
  raisedTicket: any;
  raisedTicketManager: any;
  windowHeight: any = 0;
  windowHeight1: any = 0;
  ticketExtraHours: any = 0;
  previousDays: any = [];
  selectedWeek: any = [];
  teams: any = [];
  teamEmployees: any = [];
  selectedTeam: any;
  selectAllCheckBox: any;
  checkBoxes: HTMLCollection | any;
  customAlertOptions: any = {
    header: 'Select Team',
    subHeader: 'Select All:',
    message: `<ion-checkbox id="selectAllCheckBox"></ion-checkbox>`,
  };
  weeklySummary: any = [];
  weeklySummaryHeader: any = [];
  tabs: any = [];
  tabKey: any = [];
  loaderDismiss: boolean = true;
  private subscription: Subscription;
  userId: any;
  leads: any = [];
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  month1: any;
  month2: any;
  month3: any;
  month4: any;
  selectedMonth: any;
  lead: any;
  leads1: any;
  quarters: string[] = [
    'January - March',
    'April - June',
    'July - September',
    'October - December',
  ];

  selectedMonths: any[] = [];
  disablePagination: boolean = false;
  skip: number = 0;



  constructor(
    public authService: AuthService,
    public projectService: ProjectService,
    public commonService: CommonService,
    public dashboardService: DashboardService,
    public modalController: ModalController,
    private taskService: TasksService,
    public router: Router,
    private alertController: AlertController,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.getAllTicketData();
    this.getTicketData();
  }

  ngOnInit() {
      this.skip = 0;

  }

  ionViewWillEnter() {
    this.segment = 'Home';
    this.loaderDismiss = true;
    this.newsFeed = [];
    this.posts = [];
    this.allTasks = [];
    this.previousDays = this.LastNWeek();
    this.organisationId = localStorage.getItem('organisationId');
    this.previousDays[2].selected = true;
    this.selectedWeek = this.previousDays[2];
    this.userId = +localStorage.getItem('userId');
    this.windowHeight = window.innerHeight - 90 + 'px';
    this.windowHeight1 = window.innerHeight - 190 + 'px';
    this.today = new Date();
    this.taskDate = this.commonService.formatDate(new Date());

    this.authService.getRandomQuote().then((resp) => {
      this.quote = resp;
    });
    // this.authService.getNewsFeed().then((resp) => {
    //   this.newsFeed = resp;
    // });
    this.getAllPost();
    this.fetchAllTeams();
    this.getUserTicket();
    this.getTasksAssigned();
    this.getUserDetail();
    this.data();

    this.subscription = this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.getAttendanceData();

        this.permissionViewAllDSR = resp.permissions.ViewAllDSR;
        localStorage.setItem(
          'employeeName',
          resp.firstName + ' ' + resp?.lastName
        );
        this.employeeId = resp.employeeId;
        this.getAllProjects();
        this.projectService.getTeamsReporting().then((resp: any) => {
          this.isReportingManager = resp.length;
        });
      }
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
  resetLeads() {
    // this.leads = [];
    this.data();
  }
  updateMonths(quarter: string) {
    const quarterIndex = this.quarters.indexOf(quarter);
    switch (quarterIndex) {
      case 0:
        this.selectedMonths = [
          { name: 'January', value: 1 },
          { name: 'February', value: 2 },
          { name: 'March', value: 3 },
        ];
        break;
      case 1:
        this.selectedMonths = [
          { name: 'April', value: 4 },
          { name: 'May', value: 5 },
          { name: 'June', value: 6 },
        ];
        break;
      case 2:
        this.selectedMonths = [
          { name: 'July', value: 7 },
          { name: 'August', value: 8 },
          { name: 'September', value: 9 },
        ];
        break;
      case 3:
        this.selectedMonths = [
          { name: 'October', value: 10 },
          { name: 'November', value: 11 },
          { name: 'December', value: 12 },
        ];
        break;
      default:
        this.selectedMonths = [];
        break;
    }
  }
  getUserDetail() {
    this.tabs = [];
    this.authService
      .getUserDetails(
        localStorage.getItem('userId'),
        localStorage.getItem('type')
      )
      .then((data: any) => {
        if (data) {
          delete data.tabs['Home'];
          this.tabKey = Object.keys(data.tabs);
          for (let i = 0; i < this.tabKey.length; i++) {
            if (data.tabs[this.tabKey[i]] == true)
              this.tabs.push(this.tabKey[i]);
          }
        }
      });
  }

  data() {
    this.commonService.presentLoading();
    let payload = {
      employeeId: this.userId,
      employeeIdMiddleware: this.userId,
      permissionName: 'Dashboard',
    };

    this.commonService.leadEvents(payload).then((res: any) => {
      this.leads = res.data.map((lead: any) => ({
        ...lead,
        eventStatus: lead.eventStatus ? 'Completed' : 'Scheduled',
      }));
    });
  }

  leadEvent(selectedMonthIndex: string) {
    this.commonService.presentLoading();

    let payload = {
      month: selectedMonthIndex,
      employeeId: this.userId,
      employeeIdMiddleware: this.userId,
      permissionName: 'Dashboard',
    };

    this.commonService
      .leadEvents(payload)
      .then(
        (res: any) => {
          console.log(res);
          // if(res.status == 200){
          if (res.data) {
            this.leads = res.data.map((lead: any) => ({
              ...lead,
              eventStatus: lead.eventStatus ? 'Completed' : 'Scheduled',
            }));
          } else if (res.message) {
            this.commonService.showToast('success', res.message);
            this.leads = [];
          }
        },
        (error) => {
          console.error(error);
          this.commonService.showToast(
            'error',
            'An error occurred while processing your request.'
          );
        }
      )
      .finally(() => {
        this.commonService.dismissLoading();
      });
  }

  getAttendanceData() {
    let formData = {
      organisationId: localStorage.getItem('organisationId'),
      date: this.commonService.formatDate(new Date()),
    };

    this.commonService.getEmployeeAttendence(formData).then(
      (resp: any) => {
        this.attendanceData = resp.filter(
          (r) => r.employeeId == this.authService.userId
        )[0];
      },
      (error) => {
        this.commonService.showToast('error', error.error);
      }
    );
  }

  getAllPost() {
    let payload = {
      organisationId:this.organisationId,
      skip: this.skip,
    };
    this.dashboardService.getAllPost(payload).then(
      (resp) => {
        this.loaderDismiss = false;
        this.posts = resp;
        this.skip+=5;
      },
      (error) => {
        this.commonService.showToast('error', error.error);
      }
    );
  }
  deletePost(id:number) {
    let payload = {
      organisationId:this.organisationId,
     employeeId :this.employeeId,
     employeeIdMiddleware:this.employeeId,
     postId:id

    };
    console.log(payload)
  }


  getMoreData(event) {

    let payload = {
      organisationId:this.organisationId,
      skip: this.skip,
    };
    this.dashboardService.getAllPost(payload).then(
      (resp) => {
        this.loaderDismiss = false;
        this.posts = this.posts.concat(resp);
        this.skip+=5;
        if (event) event.target.complete();
      
      
      },
      (error) => {
        this.commonService.showToast('error', error.error);
      }
    );
  }


  fetchAllTeams() {
    this.commonService.fetchAllTeams().then(
      (resp) => {
        this.teams = resp;
        this.teams.forEach((element) => {
          if (element.teamName == 'Development') {
            this.selectedTeam = element.teamId;
            this.teamEmployees = element.users;
          }
        });
        this.getWeeklySummary();
      },
      (error) => {
        this.commonService.showToast('error', error.error);
      }
    );
  }

  openSelector(selector) {
    selector.open().then((alert) => {
      this.selectAllCheckBox =
        this.document.getElementById('selectAllCheckBox');
      this.checkBoxes = this.document.getElementsByClassName('alert-checkbox');
      this.renderer.listen(this.selectAllCheckBox, 'click', () => {
        if (this.selectAllCheckBox.checked) {
          for (let checkbox of this.checkBoxes) {
            if (checkbox.getAttribute('aria-checked') === 'false') {
              (checkbox as HTMLButtonElement).click();
            }
          }
        } else {
          for (let checkbox of this.checkBoxes) {
            if (checkbox.getAttribute('aria-checked') === 'true') {
              (checkbox as HTMLButtonElement).click();
            }
          }
        }
      });
      alert.onWillDismiss().then(() => {
        this.teamChanged(this.selectAllCheckBox.checked);
      });
    });
  }

  teamChanged(event) {
    let selectedTeams = this.teams.filter(
      (t) => this.selectedTeam.indexOf(t.teamId) != -1
    );
    let employees = [];
    selectedTeams.forEach((team) => {
      employees = employees.concat(team.users);
    });
    employees = employees.filter((item, index) => {
      return employees.indexOf(item) == index;
    });
    this.teamEmployees = employees;
  }

  async presentPopover() {
  }

  getDayOfWeek(taskDate) {
    let date = new Date(taskDate);
    let day = date.getDay();
    return this.daysInWeek[day];
  }

  getAllProjects() {
    this.projectService.getMemberProjects().then(
      (resp: any) => {
        this.allProjects = resp;
        this.getManagerTicket();
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          this.logout();
        }
      }
    );
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  getTasksAssigned() {
    this.commonService
      .getTasksAssigned({ employeeId: localStorage.getItem('userId') })
      .then(
        (res: any) => {
          res.map((item) => {
            this.allTasks.push({
              taskId: item.storyTask_taskId,
              assignee: item.storyTask_assignee,
              assignor: item.storyTask_assignor,
              date: item.storyTask_date,
              organisationId: item.epic_organisationId,
              columnId: item.storyTask_columnId,
              taskName: item.storyTask_taskName,
              from: item.storyTask_from,
              to: item.storyTask_to,
              projectId: item.epic_projectId,
              status: item.epic_status,
              taskType: item.storyTask_taskType,
              storyId: item.storyTask_storyId,
              order:item.storyTask_order,
              description: item.storyTask_description,
              reporter: item.storyTask_reporter,
              dueDate: item.storyTask_dueDate,
              createdAt: item.storyTask_createdAt,
              updatedAt: item.storyTask_updatedAt,
              startDate: item.storyTask_startDate,
              estimatedHours: item.storyTask_estimatedHours,
              priority: item.storyTask_priority,
              completionDate: item.storyTask_completionDate,
              tester: item.storyTask_tester,
              reOpened: item.storyTask_reOpened,
              onHold: item.storyTask_onHold,
              projectTaskNumber: item.storyTask_projectTaskNumber,
              actualHours: item.storyTask_actualHours,
              testingDueDate: item.storyTask_testingDueDate,
              testingStartDate: item.storyTask_testingStartDate,
              testingDescription: item.storyTask_testingDescription,
              testingEstimatedHours: item.storyTask_testingEstimatedHours,
              testingActualHours: item.storyTask_testingActualHours,
              category: item.storyTask_category,
              extraHours: item.storyTask_extraHours,
              totalHoursSpent: item.storyTask_totalHoursSpent,
              testCaseData: item.storyTask_testCaseData,
              actualStartDate: item.storyTask_actualStartDate,
              actualDueDate: item.storyTask_actualDueDate,
              updatedBy: item.storyTask_updatedBy,
              createdBy: item.storyTask_createdBy,
              fileName: item.storyTask_fileName,
              estimatedCost: item.storyTask_estimatedCost,
              actualCost: item.storyTask_actualCost,
              isActive: item.storyTask_isActive,
              createType:item.storyTask_createType,
              feasibilityReason: item.storyTask_feasibilityReason,
              feasibilityStatus: item.storyTask_feasibilityStatus,
              projectName: item.Project_name,
              epicName:item.epic_name,
              storyName:item.story_name,
            });
          });

          this.responseLength = res.length;
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            this.logout();
          }
        }
      );
    this.getTestingTasksAssigned();
  }

  getTestingTasksAssigned() {
    this.commonService
      .getTestingTasksAssigned({ employeeId: localStorage.getItem('userId') })
      .then((res: any) => {
        this.testingTasks = res;
      });
  }

  async presentPopoverNotification() {
    const popover = await this.modalController.create({
      component: NotificationsPage,
      cssClass: 'notification-modal',
      showBackdrop: true,
      componentProps: { employeeId: this.employeeId },
    });
    await popover.present();
  }

  openNews(link) {
    window.open(link, '_blank');
  }

  updateTask(task) {
    this.commonService.presentLoading();
    this.projectService.updateProjectTask(task).then((resp: any) => {
      this.getTasksAssigned();
    });
  }

  async viewTaskDetails(item, story) {
    console.log('**********', item);
    this.commonService.presentLoading1();
    // this.allProjects.forEach((element) => {
    // if (element.projectName.includes(item.projectName)) {
    this.projectService.getProjectMembers({ projectId: item.projectId }).then(
      (members) => {
        this.projectMembers = members;
        this.projectService
          .getProjectColumns({ projectId: item.projectId })
          .then(async (columns: any) => {
            columns.forEach((c) => {
              c.tasks = [];
              this.connectedTo.push('box' + c.columnId);
            });
            this.teamBoardColumns = columns;

            this.commonService.loadingDismiss1();

            const popover = await this.modalController.create({
              component: ProjectTaskDetailsPage,
              cssClass: 'task-details',
              componentProps: {
                item,
                projectMembers: this.projectMembers,
                teamBoardColumns: this.teamBoardColumns,
              },
              showBackdrop: true,
            });
            await popover.present();
            popover.onDidDismiss().then((resp: any) => {
              if (resp.data?.status == 1 && story) {
                story.columnTasks.forEach((element: any, i) => {
                  element.tasks.forEach((task: any) => {
                    if (task.taskId == item.taskId) {
                      story.columnTasks[i].tasks.splice(
                        story.columnTasks[i].tasks.indexOf(item),
                        1
                      );
                    }
                  });
                });
                for (let i = 0; i < story.columnTasks.length; i++) {
                  if (story.columnTasks[i].columnId == item.columnId) {
                    story.columnTasks[i].tasks.push(item);
                  }
                }
                this.updateTask(item);
              }
              if (resp.data?.action == 'update') {
                this.updateTask(item);
              } else {
              }
            });
          });
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          this.logout();
        }
      }
    );
    // }
    // });
  }

  getUserTicket() {}

  getManagerTicket() {
    let projectID = [];
    this.allProjects.forEach((element) => {
      projectID.push(element.projectId);
    });

    if (projectID.length > 0) {
      this.taskService.getAllTicketsManager({ projectId: projectID }).then(
        (res: any) => {
          this.raisedTicketManager = res;
        },
        (error: any) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            this.logout();
          }
        }
      );
    }
  }

  approveTicket(data) {
    let form = {
      status: 1,
      requestId: data.requestId,
      taskId: data.taskId,
      extraHours: data.extraHours,
      projectId: data.projectId,
      approvedBy: this.employeeId,
      approverName: localStorage.getItem('employeeName'),
    };
    this.taskService.actionTicketbyManager(form).then(
      (res: any) => {
        this.getManagerTicket();
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          this.logout();
        }
      }
    );
  }

  LastNWeek() {
    var result = [];
    for (var i = 0; i < 3; i++) {
      var curr = new Date();
      var first = curr.getDate() - curr.getDay() + 1;
      var last = first + 4;
      var firstday = new Date(curr.getTime());
      firstday.setDate(first - 7 * i);
      var lastday = new Date(curr.getTime());
      lastday.setDate(last - 7 * i);
      let date1 = this.formatDate(firstday).split('#');
      let date2 = this.formatDate(lastday).split('#');
      result.push({
        fdate: { date: date1[0], day: date1[1] },
        ldate: { date: date2[0], day: date2[1] },
      });
    }
    result = result.reverse();

    let result2 = [];
    for (var i = 2; i >= 1; i--) {
      var curr = new Date();
      var first = curr.getDate() - curr.getDay() + 1;
      var last = first + 4;
      var firstday = new Date(curr.setDate(first + 7 * i));
      var lastday = new Date(curr.setDate(last + 7 * i));
      let date1 = this.formatDate(firstday).split('#');
      let date2 = this.formatDate(lastday).split('#');
      result2.push({
        fdate: { date: date1[0], day: date1[1] },
        ldate: { date: date2[0], day: date2[1] },
      });
    }
    return result.concat(result2.reverse());
  }

  formatDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    date = yyyy + '-' + mm + '-' + dd;
    return date + '#' + dd;
  }

  selectBoxWeek(date) {
    this.previousDays.forEach((date) => {
      date.selected = false;
    });
    date.selected = true;
    this.selectedWeek = date;
    this.getWeeklySummary();
  }

  getWeeklySummary() {
    let form = {
      startDate: this.selectedWeek.fdate.date,
      endDate: this.selectedWeek.ldate.date,
      employeeId: this.teamEmployees,
    };
    this.dashboardService.weeklySummaryReport(form).then(
      (resp: any) => {
        if (resp.msg) {
          // this.commonService.showToast('error', resp.msg);
        } else {
          this.weeklySummary = resp;
        }

        this.weeklySummaryHeader = this.weeklySummary.splice(0, 1);
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          this.logout();
        }
      }
    );
  }

  exportexcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'Weekly_Utilization.xlsx');
  }

  getAllTicketData() {
    let userId = +localStorage.getItem('userId');

    this.commonService
      .getAllGrievance({
        employeeId: userId,
        employeeIdMiddleware: userId,
        permissionName: 'Dashboard',
      })
      .then(
        (res: any) => {
          this.allTicketData = res.filter((item: any) => {
            return item.status == 'New';
          }).length;
        },
        (error) => {
          this.commonService.showToast('error', error.error);
        }
      );
  }

  getTicketData() {
    this.commonService.ticket.subscribe((data) => {
      this.allTicketData = data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
