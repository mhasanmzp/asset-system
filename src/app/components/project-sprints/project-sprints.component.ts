import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ModalController } from '@ionic/angular';
import { ProjectTaskDetailsPage } from '../../modals/project-task-details/project-task-details.page';
import { ProjectSprintDetailsPage } from '../../modals/project-sprint-details/project-sprint-details.page';
import { Router } from '@angular/router';
import { ProjectChartListPage } from 'src/app/modals/project-chart-list/project-chart-list.page';
import { number } from 'echarts';

@Component({
  selector: 'app-project-sprints',
  templateUrl: './project-sprints.component.html',
  styleUrls: ['./project-sprints.component.scss'],
})
export class ProjectSprintsComponent implements OnInit {
  @Input() epicTasksListOriginal = [];
  @Input() projectMembers = [];
  @Input() teamBoardColumns: any = [];
  @Input() storyTasks = [];
  @Input() projectId: any;
  @Input() epicTasksList = [];
  @Input() epicStories = [];
  @Input() selectedStory: any = {};
  @Input() selectedTasks: any = {};
  @Input() sprintSegment: any;
  selectedSprintTasks: any = [];
  estimatedHours: any = 0;
  actualHours: any = 0;
  sprintTasks = [];
  activeSprints: any = [];
  pastSprints: any = [];
  segment: any = 'ongoing';
  inActiveSprints: any = [];
  sprintTasksAssignment: any = {};
  sprintTasksAssignmentIds: any = [];
  newSprint: any = {};
  holdPercentage: any;
  donePercentage: any;
  inProgressPercentage: any;
  testingPercentage: any;
  pendingPercentage: any;
  totalHoursSpent: number;
  totalEstimatedHours = 0;
  releaseData: any = [];

  constructor(
    public commonService: CommonService,
    private router: Router,
    public authService: AuthService,
    public projectService: ProjectService,
    public modalController: ModalController,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    //  debugger;
    const sprint = {};
    const filteredTasks = this.getTasks(sprint);

    if (this.sprintSegment) {
      this.segment = this.sprintSegment;
    } else {
    }

    this.changeSprint(sprint);
    this.getSprints();

    // Function to get all release numbers of selected project
    this.getReleaseNumbers();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  sprintSegmentChanged() {}

  // Function to get all release numbers of selected project Ankit
  getReleaseNumbers() {
    this.projectService.getReleaseNumbers({ projectId: this.projectId }).then(
      (res: any) => {
        this.releaseData = res.releaseNumber.map((number) => {
          return { releaseNumber: number };
        });
      },
      (error) => {
        if (error.error.statusCode == 401) {
          this.commonService.showToast('error', 'No Data Found');
        }
      }
    );
  }

  getSprintEstimatedHours(sprint) {
    let estimatedHours = 0;
    let tasks = this.getTasks(sprint);

    tasks.forEach((task) => {
      estimatedHours += task.estimatedHours;
    });

    return estimatedHours;
  }

  changeSprint(sprint) {
    this.estimatedHours = 0;
    this.actualHours = 0;

    this.estimatedHours = this.getSprintEstimatedHours(sprint);
    this.selectedSprintTasks = this.epicTasksList.filter(
      (e) => e['checkedForSprint'] == true
    );

    this.selectedSprintTasks.forEach((task) => {
      this.sprintTasks.push(parseInt(task.taskId));
    });

    this.sprintTasksAssignment = {};

    this.selectedSprintTasks.forEach((task) => {
      if (!this.sprintTasksAssignment[task.assignee]) {
        this.sprintTasksAssignment[task.assignee] = 0;
      }
      this.sprintTasksAssignment[task.assignee] += task.estimatedHours;
      this.estimatedHours += task.estimatedHours;
      this.actualHours += task.actualHours;
    });

    this.sprintTasksAssignmentIds = Object.keys(this.sprintTasksAssignment);
  }

  getSprints() {
    this.projectService.getInactiveSprints(this.projectId).then((data) => {
      this.inActiveSprints = data;
    });
    this.projectService.getActiveSprints(this.projectId).then((data) => {
      this.activeSprints = data;
    });
    this.projectService.getPastSprints(this.projectId).then((data) => {
      this.pastSprints = data;
    });
  }

  getSprintActualHours(sprint) {
    let actualHours = 0;
    for (const assignee in sprint.sprintTasksAssignment) {
      if (sprint.sprintTasksAssignment.hasOwnProperty(assignee)) {
        actualHours += sprint.sprintTasksAssignment[assignee].actualHours;
      }
    }
    return actualHours;
  }
  getSprintAssignees(sprint) {
    let sprintTasksAssignment = {};
    let tasks = this.getTasks(sprint);

    tasks.forEach((task) => {
      if (!sprintTasksAssignment[task.assignee]) {
        sprintTasksAssignment[task.assignee] = {
          estimatedHours: 0,
          actualHours: 0,
        };
      }
      sprintTasksAssignment[task.assignee].estimatedHours +=
        task.estimatedHours;
      sprintTasksAssignment[task.assignee].actualHours += task.actualHours;
    });
    sprint['sprintTasksAssignment'] = sprintTasksAssignment;
    sprint['estimatedHours'] = this.getSprintEstimatedHours(sprint);
    sprint['actualHours'] = this.getSprintActualHours(sprint);

    return Object.keys(sprintTasksAssignment);
  }

  calculateHoldCount(tasks: any[]): number {
    return tasks.filter((task) => task.onHold).length;
  }

  getTasks(sprint) {
    if (!sprint || !sprint['tasks'] || !Array.isArray(sprint['tasks'])) {
      return [];
    }

    let filteredTasks = this.epicTasksListOriginal.filter((t) => {
      return sprint['tasks'].indexOf(t.taskId) > -1;
    });
    let holdCount = this.calculateHoldCount(filteredTasks),
      doneCount = 0,
      inProgressCount = 0,
      testingCount = 0,
      pendingCount = 0,
      totalHoursSpent = 0;

    filteredTasks.forEach((ele) => {
      if (ele.onHold === true) {
        holdCount++;
      } else if (this.getTeamBoardColumns(ele.columnId) === 'Done') {
        doneCount++;
      } else if (this.getTeamBoardColumns(ele.columnId) === 'In Progress') {
        inProgressCount++;
        totalHoursSpent += ele.totalHoursspent;
      } else if (this.getTeamBoardColumns(ele.columnId) === 'Testing') {
        testingCount++;
      } else {
        pendingCount++;
      }

      this.totalHoursSpent += ele.totalHoursSpent;
    });

    this.holdPercentage = ((holdCount / filteredTasks.length) * 100).toFixed(2);
    this.inProgressPercentage = (
      (inProgressCount / filteredTasks.length) *
      100
    ).toFixed(2);
    this.donePercentage = ((doneCount / filteredTasks.length) * 100).toFixed(2);
    this.testingPercentage = (
      (testingCount / filteredTasks.length) *
      100
    ).toFixed(2);
    this.pendingPercentage = (
      (pendingCount / filteredTasks.length) *
      100
    ).toFixed(2);
    this.totalHoursSpent = totalHoursSpent;

    return filteredTasks;
  }

  updateSprint(sprint) {
    this.projectService.updateSprint(sprint).then(
      (resp: any) => {
        this.getSprints();
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  getDaysRemaining(sprint) {
    var date1 = new Date();
    var date2 = new Date(sprint.dueDate);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Math.ceil(Difference_In_Days);
  }

  async viewSprintDetails(sprint) {
    const popover = await this.modalController.create({
      component: ProjectSprintDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        projectMembers: this.projectMembers,
        teamBoardColumns: this.teamBoardColumns,
        sprint,
      },
      showBackdrop: true,
    });
    await popover.present();
    popover.onDidDismiss().then((resp: any) => {
      this.updateSprint(sprint);
    });
  }

  async viewTaskDetails(item, story) {
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
      if (resp.data?.action == 'delete') {
        this.storyTasks.splice(this.storyTasks.indexOf(item), 1);
        this.selectedStory.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              this.selectedStory.columnTasks[i].tasks.splice(
                this.selectedStory.columnTasks[i].tasks.indexOf(item),
                1
              );
            }
          });
        });
        this.epicTasksList.forEach((element) => {
          if (element.taskId == item.taskId) {
            this.epicTasksList.splice(this.epicTasksList.indexOf(item), 1);
            this.epicTasksListOriginal.splice(
              this.epicTasksListOriginal.indexOf(item),
              1
            );
          }
        });
      }
      if (resp.data?.status == 1 && story == null) {
        this.selectedStory.columnTasks.forEach((element: any, i) => {
          element.tasks.forEach((task: any) => {
            if (task.taskId == item.taskId) {
              this.selectedStory.columnTasks[i].tasks.splice(
                this.selectedStory.columnTasks[i].tasks.indexOf(item),
                1
              );
            }
          });
        });
        for (let i = 0; i < this.selectedStory.columnTasks.length; i++) {
          if (this.selectedStory.columnTasks[i].columnId == item.columnId) {
            this.selectedStory.columnTasks[i].tasks.push(item);
          }
        }
        this.updateTask(item);
      }
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
  }

  getTeamBoardColumns(columnId) {
    let column = this.teamBoardColumns.filter(
      (column) => column.columnId == columnId
    );
    return column[0].columnName;
  }

  getListAssigneeDetails(item, key, data) {
    if (item) {
      let user = this.projectMembers.filter((e) => e.employeeId == item[key]);
      if (user.length > 0) return user[0][data] || '';
      else return '';
    } else {
      return '';
    }
  }

  updateTask(task) {
    this.commonService.presentLoading();
    this.projectService.updateProjectTask(task).then((resp: any) => {});
  }

  createSprint() {
    this.newSprint['tasks'] = this.sprintTasks;
    this.newSprint['projectId'] = this.projectId;
    this.projectService.createSprint(this.newSprint).then(
      (resp: any) => {
        this.commonService.showToast(
          'success',
          'New Sprint created successfully!'
        );
        this.newSprint = {};
        this.selectedSprintTasks = [];
        this.sprintTasks = [];
        this.selectedTasks = {};
        this.epicTasksList.forEach((e) => (e['checkedForSprint'] = false));
        this.sprintSegment = 'ongoing';
        this.segment = 'ongoing';
        this.getSprints();
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  async addTask(sprint) {
    const popover = await this.modalController.create({
      component: ProjectChartListPage,
      cssClass: 'dsr-preview-modal',
      componentProps: {
        projectMember: this.projectMembers,
        teamBoardColumn: this.teamBoardColumns,
        taskList: JSON.parse(JSON.stringify(this.epicTasksListOriginal)),
        flag: 'addTask',
        sprint,
      },
      showBackdrop: true,
    });
    await popover.present();
    popover.onDidDismiss().then((resp: any) => {
      this.getSprints();
    });
  }

  removeSprintTask(epic, sprint) {
    let task = sprint.tasks.filter((e) => e !== epic);
    let form = {
      sprintId: sprint.sprintId,
      tasks: task,
    };
    this.projectService.updateSprint(form).then(
      (resp: any) => {
        if (resp) {
          this.getSprints();
        }
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  downloadSprint(sprint) {
    this.projectService.downloadSprint(sprint);
  }
}
