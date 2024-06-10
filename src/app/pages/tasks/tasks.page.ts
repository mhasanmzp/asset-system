import { Component, ViewChild, Renderer2, ViewEncapsulation, OnInit, ElementRef } from '@angular/core';
import { IonTextarea } from '@ionic/angular';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonService } from '../../services/common.service';
import { TasksService } from '../../services/tasks.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
  @ViewChild('boards') boards: ElementRef;
  @ViewChild('test') test: ElementRef;
  segment: any = 'boards';
  taskDate: any;
  selectedTeam: any;
  board: any = [];
  columns: any = [];
  myTeams: any = [];
  connectedTo: any = [];
  teamBoardColumns: any = [];
  memberProjects: any = [];
  previousDays: any = [];
  daysInWeek: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  projectTask: any = [];
  selectedHours: any;
  projectID: any;
  creationIcon: boolean = true;
  taskHours: any = 0;
  selectedTask: any;
  disableTaskBox: boolean = false;
  projectName: any;
  private subscription: Subscription;
  fromDate: string;
  toDate: string;


  constructor(
    private commonService: CommonService,
    private projectService: ProjectService,
    private authService: AuthService,
    private tasksService: TasksService,
    private renderer: Renderer2,
    public alertController: AlertController
  ) { }

  clickedOutside() {
  }


  ngOnInit() {
    this.teamBoardColumns = [];
    this.taskDate = this.commonService.formatDate(new Date());
    let month = new Date().getMonth();
    this.previousDays = this.LastNDays(7);
    this.previousDays[6].selected = true;
    this.commonService.presentLoading();

    this.tasksService.getUserTeams().then(resp => {
      this.myTeams = resp;
      this.selectedTeam = resp[0].teamId;
      this.tasksService.fetchTeamColumns(this.selectedTeam).then((columns: any) => {
        columns.forEach(c => {
          c.tasks = []
          this.connectedTo.push("box" + c.columnId);
          this.getTasks(c);
        })
        this.teamBoardColumns = columns;

      }, error => {
        this.commonService.loadingDismiss();
        this.commonService.showToast('error', error.error)
      })
    })
    this.projectService.getMemberProjects().then(resp => {
      this.memberProjects = resp;
      let projectId = []
      this.memberProjects.forEach(element => {
        projectId.push(element.projectId)
      }, error => {
        this.commonService.showToast('error', error.error)
      });

      if (projectId) {
        this.tasksService.getTasksDsr({ 'projectId': projectId, 'employeeId': localStorage.getItem("userId") }).then((res: any) => {
          this.projectTask = res;
        }, error => {
          this.commonService.loadingDismiss();
          this.commonService.showToast('error', error.error)
        })
      }
    })

    // this.subscription = this.authService.userLogin.subscribe(resp => {
    //   if (resp && Object.keys(resp).length > 0) {
    //     this.tasksService.getUserTeams().then(resp => {
    //       this.myTeams = resp;
    //       this.selectedTeam = resp[0].teamId;
    //       this.tasksService.fetchTeamColumns(this.selectedTeam).then((columns: any) => {
    //         columns.forEach(c => {
    //           c.tasks = []
    //           this.connectedTo.push("box" + c.columnId);
    //           this.getTasks(c);
    //         })
    //         this.teamBoardColumns = columns;

    //       }, error => {
    //         this.commonService.showToast('error', error.error)
    //       })
    //       this.projectService.getMemberProjects().then(resp => {
    //         this.memberProjects = resp;
    //         let projectId = []
    //         this.memberProjects.forEach(element => {
    //           projectId.push(element.projectId)
    //         }, error => {
    //           this.commonService.showToast('error', error.error)
    //         });

    //         if (projectId) {
    //           this.tasksService.getTasksDsr({ 'projectId': projectId, 'employeeId': this.authService.userId }).then((res: any) => {
    //             this.projectTask = res;
    //           }, error => {
    //             this.commonService.showToast('error', error.error)
    //           })
    //         }
    //       })


    //     })
    //   }
    // })
  }

  ionViewWillLeave() {
    // this.subscription.unsubscribe();
  }

  getDayOfWeek(taskDate) {
    let date = new Date(taskDate);
    let day = date.getDay();
    return this.daysInWeek[day];
  }

  async downloadDSR() {
    var date: any = moment(new Date());
    let url = this.authService.apiUrl + "downloadDsr?employeeIds=" + this.authService.userId + "&to=" + this.toDate + "&from=" + this.fromDate + "&timezone=" + Intl.DateTimeFormat().resolvedOptions().timeZone;

    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Jwt_token': localStorage.getItem('jwt_token')
      }
    });
    let blob = await response.blob();
    let filename = "Downloaded_DSR.csv"; // Provide appropriate filename
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  updateTaskProject(item) {
    this.updateTask(item);
  }


  getData(item) {
    this.showAlert(item.rejectReason, item.approverName);
  }

  async showAlert(msg, msg2) {
    const formattedMsg = `Reason - ${msg}<br><br>Rejected By - ${msg2}`;
    const alert = await this.alertController.create({
      header: 'mhbhg',
      message: formattedMsg,
      buttons: ['OK']
    });

    await alert.present();
  }




  selectBoxDate(date) {
    this.taskDate = date.date;
    this.changeDate(null)
    this.previousDays.forEach(date => {
      date.selected = false;
    })
    date.selected = true;
  }

  changeDate(ev) {
    if (ev != null) {
      this.taskDate = ev.target.value;
      this.previousDays.forEach(element => {
        element.selected = false;
      });
      this.previousDays.filter(date => date.date == this.taskDate)[0].selected = true;
    }
    this.taskHours = 0;
    this.teamBoardColumns.forEach(c => {
      c.tasks = []
      this.connectedTo.push("box" + c.columnId);
      this.getTasks(c);
    })
  }

  deleteTask(item, columnIndex, itemIndex) {
    this.creationIcon = true;
    this.teamBoardColumns[columnIndex].tasks.splice(itemIndex, 1);
    this.taskHours = this.taskHours - (item.hours ? item.hours : 0)
    this.tasksService.deleteUserTasks(item).then(resp => {
    }, error => {

    })
  }

  getTasks(column) {

    column.date = this.taskDate;
    this.tasksService.getUserTasks(column).then((tasks: any) => {
      this.commonService.loadingDismiss();
      tasks.forEach(task => {
        this.taskHours += task.hours
        let fromTime = new Date(task.from);
        task.fromDisplay = this.addLeadingZeros(fromTime.getHours(), 2) + ":" + this.addLeadingZeros(fromTime.getMinutes(), 2);

        let toTime = new Date(task.to);
        task.toDisplay = this.addLeadingZeros(toTime.getHours(), 2) + ":" + this.addLeadingZeros(toTime.getMinutes(), 2);
        if (column.columnName == 'Done') { task.disableTaskBox = true }
        else { task.disableTaskBox = false }
      })
      column.tasks = tasks;
    }, error => {
      this.commonService.showToast('error', error.error)
    })
  }

  addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
  }

  addTask() {
    let newTask = { taskName: "", projectId: 0, disableTaskBox: false };
    this.teamBoardColumns[0].tasks.unshift(newTask);
    this.editTask(newTask, 0, 0);
  }

  updateProject(task, c) {
    this.selectedHours = 0;
    task.taskName = '';
    this.selectedTask = task.projectTaskId
    this.projectTask.forEach(element => {
      if (element.projectId == task.projectId) {
        task.taskName = `(Task no - ${element.projectTaskNumber}) ${element.taskName}`;
        task.estimatedHours = element.estimatedHours ? element.estimatedHours : 0;
        this.selectedHours = element.estimatedHours ? element.estimatedHours : 0;
        task.projectId = element.projectId;
        task.projectName = element.projectName;
        let filteredProjects = this.memberProjects.filter(p => p.projectId == element.projectId);
        task.billable = filteredProjects[0].billable
      }
    });

    this.taskNameUpdated(task.taskName, task, c, '')
    this.tasksService.updateTask(task).then((resp: any) => {
      let item = this.teamBoardColumns.filter(e => e.columnName == 'Done')
      if (task.columnId == item[0].columnId) {
        task.disableTaskBox = true;
      } else {
        task.disableTaskBox = false;
      }

    }, error => {
    });
  }





  taskNameUpdated(ev, item, c, i) {
    item['taskName'] = ev.target?.value ? ev.target.value : ev;
    if (item.taskId) {
      this.updateTask(item);
    } else {
      item.teamId = this.selectedTeam;
      item.date = this.taskDate;
      item.columnId = this.teamBoardColumns[c].columnId;
      item.employeeId = this.authService.userId;
      this.tasksService.createTask(item).then((resp: any) => {
        item.taskId = resp.taskId;
      }, error => {
        this.commonService.showToast('error', error.error)
      })
    }
  }

  taskFromUpdated(ev, item) {
    this.taskHours = this.taskHours - (item.hours ? (+JSON.parse(JSON.stringify(item.hours))) : 0)
    let time = (ev.target.value).split(":");
    let date = new Date(this.taskDate);
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    item['from'] = date.getTime();
    item['fromDisplay'] = ev.target.value;

    if (item['to']) {
      item['to'] = new Date(item['to']).getTime();
      var differenceSec = (item['to'] - item['from']) / 1000;
      item['hours'] = (differenceSec / 3600).toFixed(2);
      if ((+item['hours']) > this.selectedHours && this.selectedTask != 0) {
        this.creationIcon = false;
        document.getElementById('taskBorder').style.borderColor = 'red';
        document.getElementById('taskBorder').style.borderStyle = 'solid';
        document.getElementById('taskBorder').style.borderWidth = '1px';
        this.commonService.showToast('error', `Your dsr will not be submitted. Hours should not be greater than task planned hours. Planned hours of this task is ${this.selectedHours} hrs.`)
      } else {

        this.creationIcon = true;
        document.getElementById('taskBorder').style.borderColor = '#4e4e4e';
        document.getElementById('taskBorder').style.borderStyle = 'solid';
        document.getElementById('taskBorder').style.borderWidth = '1px';
      }
      if (parseFloat(item['hours']) < 0) {
        item['hours'] = parseFloat(item['hours']) + 24;
      }

      this.taskHours += (+item['hours'])
    }
    this.updateTask(item);
  }

  taskToUpdated(ev, item) {
    this.taskHours = this.taskHours - (item.hours ? (+JSON.parse(JSON.stringify(item.hours))) : 0)
    let time = (ev.target.value).split(":");
    let date = new Date(this.taskDate);
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    item['to'] = date.getTime();
    item['toDisplay'] = ev.target.value; ///added by parul

    if (item['from']) {
      item['from'] = new Date(item['from']).getTime();
      var differenceSec = (item['to'] - item['from']) / 1000;
      item['hours'] = (differenceSec / 3600).toFixed(2);
      if ((+item['hours']) > this.selectedHours && this.selectedTask != 0) {
        this.creationIcon = false;
        document.getElementById('taskBorder').style.borderWidth = '1px';
        document.getElementById('taskBorder').style.borderStyle = 'solid';
        document.getElementById('taskBorder').style.borderColor = 'red';
        this.commonService.showToast('error', `Your dsr will not be submitted. Hours should not be greater than task planned hours. Planned hours of this task is ${this.selectedHours} hrs.`)
      } else {
        this.creationIcon = true;
        document.getElementById('taskBorder').style.borderColor = '#4e4e4e';
        document.getElementById('taskBorder').style.borderStyle = 'solid';
        document.getElementById('taskBorder').style.borderWidth = '1px';
      }
      if (parseFloat(item['hours']) < 0) {
        item['hours'] = parseFloat(item['hours']) + 24;
      }

      this.taskHours += (+item['hours'])
    }
    this.updateTask(item);
  }

  onBlur(event, item, c, i) {
    item['edit'] = false;
    if (item.name == '') {
      this.teamBoardColumns[c].tasks.splice(i, 1)
    } else {

    }
    item.focus = false;
  }

  editTask(item, c, i) {


    if (!item.status || item.status == 0) {
      item.projectTaskId = 0
      item['edit'] = true;
      let index = 'task' + c + i;
      let that = this;
      item.focus = true;
      setTimeout(() => {
        that.renderer.selectRootElement('#' + index).focus();
      }, 100)
    }
  }

  async drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((task: any, index) => {
        task.order = index;
        this.updateTask(task);
      })
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      event.container.data.forEach((task: any, index) => {
        task.order = index;
        task.columnId = event.container.id
        this.updateTask(task);
      })
    }
  }

  updateTask(task) {
    task.employeeId = this.authService.userId;
    this.tasksService.updateTask(task).then((resp: any) => {
      let item = this.teamBoardColumns.filter(e => e.columnName == 'Done')
      if (task.columnId == item[0].columnId) {
        task.disableTaskBox = true;
      } else {
        task.disableTaskBox = false;
      }
    }, error => {
      this.commonService.showToast('error', error.error)
    })
  }

  disableBox(ev, item) {

  }

  enableBox(ev, item) {

  }

  LastNDays(n: number) {
    var result = [];
    for (var i = 0; i < n; i++) {
      let d = new Date();
      d.setDate(d.getDate() - i);
      let date = this.formatDate(d).split("#");
      result.push({ date: date[0], day: date[1] });
    }
    let futuresDays = 7;
    result = result.reverse();
    let result2 = [];
    for (var i = futuresDays; i >= 1; i--) {
      let d = new Date();
      d.setDate(d.getDate() + i);
      let date = this.formatDate(d).split("#");
      result2.push({ date: date[0], day: date[1] });
    }

    return result.concat(result2.reverse());
  }

  formatDate(date) {

    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    date = yyyy + '-' + mm + '-' + dd;
    return date + "#" + dd
  }


}