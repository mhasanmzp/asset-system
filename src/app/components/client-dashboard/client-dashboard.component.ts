import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ModalController } from '@ionic/angular';
import { ProjectTaskDetailsPage } from '../../modals/project-task-details/project-task-details.page';
import { ProjectSprintDetailsPage } from '../../modals/project-sprint-details/project-sprint-details.page';
import { EChartsOption } from 'echarts';
import { Router } from '@angular/router';


@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
})
export class ClientDashboardComponent implements OnInit {
  @Input() epicTasksListOriginal = [];
  @Input() sprintTasks = [];
  @Input() projectMembers = [];
  @Input() teamBoardColumns: any = [];
  @Input() storyTasks = [];
  @Input() projectId: any;
  @Input() epicStories = [];
  @Input() selectedStory: any = {};
  @Input() selectedTasks: any = {};
  chartOption: EChartsOption;
  @Input() options: any;
  tasksCompletedToday: any = [];
  activeSprints: any = [];
  holdPercentage: any;
  donePercentage: any;
  inProgressPercentage: any;
  testingPercentage: any;
  pendingPercentage: any;
  filteredToDo: any;
  filteredInProgress: any;
  filteredTesting: any;
  filteredDone: any;
  filteredHold: any;

  constructor(
    public commonService: CommonService,
    public authService: AuthService, private router: Router,
    public projectService: ProjectService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.projectService.getActiveSprints(this.projectId).then(data => {
      this.activeSprints = data;
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
    
  }

  getSprintAssignees(sprint) {
    let estimatedHours = 0; let actualHours = 0;
    let sprintTasksAssignment = {};
    let tasks = this.getTasks(sprint);
    tasks.forEach(task => {
      if (!sprintTasksAssignment[task.assignee])
        sprintTasksAssignment[task.assignee] = 0;
      sprintTasksAssignment[task.assignee] = sprintTasksAssignment[task.assignee] + task.estimatedHours;
      estimatedHours += task.estimatedHours;
      actualHours += task.actualHours;
    })
    sprint['sprintTasksAssignment'] = sprintTasksAssignment;
    sprint['estimatedHours'] = estimatedHours;
    sprint['actualHours'] = actualHours
    return Object.keys(sprintTasksAssignment);
  }

  getTasks(sprint) {
    let filteredTasks = this.epicTasksListOriginal.filter(t => {
      return sprint['tasks'].indexOf(t.taskId) > -1
    })
    let holdCount = 0, doneCount = 0, inProgressCount = 0, testingCount = 0, pendingCount = 0;
    filteredTasks.forEach((ele: any) => {
      if (ele.onHold == true) {
        holdCount++;
      } else if (this.getTeamBoardColumns(ele.columnId) === 'Done') {
        doneCount++;
      } else if (this.getTeamBoardColumns(ele.columnId) === 'In Progress') {
        inProgressCount++;
      } else if (this.getTeamBoardColumns(ele.columnId) === 'Testing') {
        testingCount++;
      } else {
        pendingCount++;
      }
    })
    this.holdPercentage = ((holdCount / filteredTasks.length) * 100).toFixed(2);
    this.inProgressPercentage = ((inProgressCount / filteredTasks.length) * 100).toFixed(2);
    this.donePercentage = ((doneCount / filteredTasks.length) * 100).toFixed(2);
    this.testingPercentage = ((testingCount / filteredTasks.length) * 100).toFixed(2);
    this.pendingPercentage = ((pendingCount / filteredTasks.length) * 100).toFixed(2);
    return filteredTasks;
  }

  getDaysRemaining(sprint) {
    var date1 = new Date();
    var date2 = new Date(sprint.dueDate);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Math.ceil(Difference_In_Days);
  }

  getTasksCount(epicTasksList, status) {
    let filteredColumn = this.teamBoardColumns.filter(c => c.columnName == status)
    if (filteredColumn.length > 0) {
      let filtered = epicTasksList.filter(task => task.columnId == filteredColumn[0].columnId)
      return filtered.length
    } else
      return 0
  }

  getTasksCompletedToday() {
    let date = this.commonService.formatDate(new Date());
    let filtered = this.epicTasksListOriginal.filter(task => this.commonService.formatDate(task.completionDate) == date && task.status == 1)
    this.tasksCompletedToday = filtered;
    return filtered.length;
  }

  getTasksCreatedToday() {
    let date = this.commonService.formatDate(new Date());
    let filtered = this.epicTasksListOriginal.filter(task => this.commonService.formatDate(task.createdAt) == date)
    return filtered.length;
  }
  async viewSprintDetails(sprint) {
    const popover = await this.modalController.create({
      component: ProjectSprintDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        projectMembers: this.projectMembers,
        teamBoardColumns: this.teamBoardColumns,
        sprint
      },
      showBackdrop: true
    });
    await popover.present();
    popover.onDidDismiss().then((resp: any) => {
      this.updateSprint(sprint)
    })
  }


  updateSprint(sprint) {
    this.projectService.updateSprint(sprint).then((resp: any) => {
      this.ngOnInit();
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  getTeamBoardColumns(columnId) {
    let column = this.teamBoardColumns.filter(column => column.columnId == columnId);
    return column[0].columnName;
  }

  toFixed(num) {
    return parseFloat(num).toFixed(1);
  }

  async viewTaskDetails(item, story) {
    const popover = await this.modalController.create({
      component: ProjectTaskDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        item,
        projectMembers: this.projectMembers,
        teamBoardColumns: this.teamBoardColumns
      },
      showBackdrop: true
    });
    await popover.present();
    popover.onDidDismiss().then((resp: any) => {
      console.log(resp);
      if (resp.data?.action == 'delete') {
        this.storyTasks.splice(this.storyTasks.indexOf(item), 1);
        this.selectedStory.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              this.selectedStory.columnTasks[i].tasks.splice(this.selectedStory.columnTasks[i].tasks.indexOf(item), 1);
            }
          });
        });
        this.epicTasksListOriginal.forEach(element => {  
          if (element.taskId == item.taskId) {
            this.epicTasksListOriginal.splice(this.epicTasksListOriginal.indexOf(item), 1);
            this.epicTasksListOriginal.splice(this.epicTasksListOriginal.indexOf(item), 1);

          }
        });
      }
      if (resp.data?.status == 1 && story == null) {
        this.selectedStory.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              this.selectedStory.columnTasks[i].tasks.splice(this.selectedStory.columnTasks[i].tasks.indexOf(item), 1);
            }
          });
        });
        for (let i = 0; i < this.selectedStory.columnTasks.length; i++) {
          if (this.selectedStory.columnTasks[i].columnId == item.columnId) {
            this.selectedStory.columnTasks[i].tasks.push(item)
          }
        }
        this.updateTask(item);
        var task = this.selectedStory.columnTasks.filter(id => id.columnId == item.columnId)[0]
        task.tasks()
      }
      if (resp.data?.status == 1 && story) {
        story.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              story.columnTasks[i].tasks.splice(story.columnTasks[i].tasks.indexOf(item), 1);
            }
          });
        });
        for (let i = 0; i < story.columnTasks.length; i++) {
          if (story.columnTasks[i].columnId == item.columnId) {
            story.columnTasks[i].tasks.push(item)
          }
        }
        this.updateTask(item);
        var task = this.selectedStory.columnTasks.filter(id => id.columnId == item.columnId)[0]
        task.tasks()
      }
      if (resp.data?.action == 'update') { this.updateTask(item) }
      else {
        this.updateTask(item);
      }
    })
  }

  getListAssigneeDetails(item, key, data) {
    if (item) {
      let user = this.projectMembers.filter(e => e.employeeId == item[key]);
      if (user.length > 0)
        return user[0][data] || ''
      else
        return ''
    } else {
      return ''
    }
  }

  updateTask(task) {
    this.commonService.presentLoading()
   
  }

}
