import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import {
  AlertController,
  MenuController,
  ModalController,
} from '@ionic/angular';
import { ProjectTaskDetailsPage } from '../../modals/project-task-details/project-task-details.page';
import { Socket, io } from 'socket.io-client';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-project-wise-task',
  templateUrl: './project-wise-task.component.html',
  styleUrls: ['./project-wise-task.component.scss'],
})
export class ProjectWiseTaskComponent implements OnInit {
  @Input() allProjects;
  projectData: any = [];
  tasksData: any = [];
  projectDataOriginal: any = [];
  teamBoardColumns: any = [];
  projectMembers: any = [];
  projectMembers1: any = [];
  allUsers: any = [];
  filterr: any = [];
  columnSelect: any;
  selectedEpicId: any = 'all';
  selectedColumns: any = 'all';
  selectedTester: any = 'all';
  selectedAssignee: any = 'all';
  taskType: any = [
    { id: 0, name: 'Feature' },
    { id: 1, name: 'Bug' },
  ];
  selectedTaskType: any = 'all';
  selectedStoryList: any = 'all';
  selectedProject: any = {};
  enableFields: boolean = true;
  socket: Socket;
  estimatedCostTotal: number = 0;
  actualCostTotal: number = 0;
  chartOptionUser: any;
  totalActualHours: number = 0;
  totalEstimatedHours: number = 0;
  chartLoaded:boolean=true;
  projectName:string;

  constructor(
    public projectService: ProjectService,
    public commonService: CommonService,
    public router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private authService: AuthService
  ) {
    this.socket = io(this.authService.socketUrl, { autoConnect: true });
    this.socket.on('updateProjectTask', (res: any) => {
      for (let i = 0; i < this.projectData.length; i++) {
        if (this.projectData[i].storyTask_taskId == res.taskId) {
          (this.projectData[i].storyTask_actualDueDate = res.actualDueDate),
            (this.projectData[i].storyTask_actualHours = res.actualHours);
          this.projectData[i].storyTask_actualStartDate = res.actualStartDate;
          this.projectData[i].storyTask_assignee = res.assignee;
          this.projectData[i].storyTask_assignor = res.assignor;
          this.projectData[i].storyTask_category = res.category;
          this.projectData[i].storyTask_columnId = res.columnId;
          this.projectData[i].storyTask_completionDate = res.completionDate;
          this.projectData[i].storyTask_createdAt = res.createdAt;
          this.projectData[i].storyTask_createdBy = res.createdBy;
          this.projectData[i].storyTask_date = res.date;
          this.projectData[i].storyTask_description = res.description;
          this.projectData[i].storyTask_dueDate = res.dueDate;
          this.projectData[i].storyTask_estimatedHours = res.estimatedHours;
          this.projectData[i].storyTask_extraHours = res.extraHours;
          this.projectData[i].storyTask_fileName = res.fileName;
          this.projectData[i].storyTask_from = res.from;
          this.projectData[i].storyTask_onHold = res.onHold;
          this.projectData[i].storyTask_order = res.order;
          this.projectData[i].storyTask_priority = res.priority;
          this.projectData[i].epic_projectId = res.projectId;
          this.projectData[i].storyTask_projectTaskNumber =
            res.projectTaskNumber;
          this.projectData[i].storyTask_reOpened = res.reOpened;
          this.projectData[i].storyTask_reporter = res.reporter;
          this.projectData[i].storyTask_startDate = res.startDate;
          this.projectData[i].storyTask_status = res.status;
          this.projectData[i].storyTask_storyId = res.storyId;
          this.projectData[i].storyTask_taskId = res.taskId;
          this.projectData[i].storyTask_taskName = res.taskName;
          this.projectData[i].storyTask_taskType = res.taskType;
          this.projectData[i].storyTask_testCaseData = res.testCaseData;
          this.projectData[i].storyTask_tester = res.tester;
          this.projectData[i].storyTask_testingActualHours =
            res.testingActualHours;
          this.projectData[i].storyTask_testingDescription =
            res.testingDescription;
          this.projectData[i].storyTask_testingDueDate = res.testingDueDate;
          this.projectData[i].storyTask_testingEstimatedHours =
            res.testingEstimatedHours;
          this.projectData[i].storyTask_testingStartDate = res.testingStartDate;
          this.projectData[i].storyTask_to = res.to;
          this.projectData[i].storyTask_totalHoursSpent = res.totalHoursSpent;
          this.projectData[i].storyTask_updatedAt = res.updatedAt;
          this.projectData[i].storyTask_updatedBy = res.updatedBy;
          this.projectDataOriginal[i] = this.projectData[i];
        }
      }
    });
  }

  ngOnInit() {
    this.projectName = this.allProjects[0].projectName;
    this.getAllProjects();
    this.getBarChartData();
  }

  // downlaoding all the tasks
  downloadExcel(): void {
    if (this.projectData.length > 0) {
      this.projectData.forEach((element) => {
        if (element.storyTask_storyId) {
          this.tasksData.push({

            projectTaskNumber: element.storyTask_projectTaskNumber,
            projectName: element.projectName,
            epicName: element.epic_name,
            storyName: element.story_name,
            taskName: element.storyTask_taskName,
            assignee: element.storyTask_assignee,
            estimatedHours: element.storyTask_estimatedHours,
            actualHours: element.storyTask_actualHours,
            estimatedCost: parseInt(element.storyTask_estimatedCost),
            actualCost: parseInt(element.storyTask_actualCost),
            status: this.getTeamBoardColumns(element.storyTask_columnId),
            startDate: element.storyTask_startDate,
            dueDate: element.storyTask_dueDate,
            actualStartDate: element.storyTask_actualStartDate,
            actualDueDate: element.storyTask_actualDueDate,

          });
        }
      });
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tasksData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'data.xlsx');
  }

  getAllProjects() {
    this.commonService.presentLoading();
    this.projectService
      .getProjectColumns({ projectId: this.allProjects[0].projectId })
      .then(
        (columns: any) => {
          columns.forEach((c) => {
            c.tasks = [];
            // this.connectedTo.push("box" + c.columnId);
          });
          this.teamBoardColumns = columns;
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          this.commonService.loadingDismiss();
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
          }
        }
      );
    this.projectService
      .getProjectMembers({ projectId: this.allProjects[0].projectId })
      .then(
        (members) => {
          this.projectMembers = members;
          this.projectMembers1 = members;
          this.allUsers = members;
          // this.getAllReport();
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          this.commonService.loadingDismiss();
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
          }
        }
      );
    this.projectService
      .getProjectData({ projectId: this.allProjects[0].projectId })
      .then(
        (response: any) => {
          this.commonService.loadingDismiss();
          this.projectData = response;
          // debugger;
          this.projectData.forEach((element) => {
            element.projectName = this.allProjects[0].projectName;

            // fixing estimated cost and actual cost to 2 decimal places
            element.storyTask_estimatedCost = element.storyTask_estimatedCost === null ? element.storyTask_estimatedCost : parseFloat(element.storyTask_estimatedCost).toFixed(2);
            element.storyTask_actualCost = element.storyTask_actualCost === null ? element.storyTask_actualCost : parseFloat(element.storyTask_actualCost).toFixed(2);
          });
          this.projectDataOriginal = JSON.parse(
            JSON.stringify(this.projectData)
          );
          // console.log('this.pr', this.projectData);

          // calculating total estimated Cost and actual cost
          this.projectData.map((item) => {
            if (item.storyTask_estimatedHours != null) {
              this.totalEstimatedHours += parseInt(item.storyTask_estimatedHours);
            }
            if (item.storyTask_actualHours != null) {
              this.totalActualHours += parseInt(item.storyTask_actualHours);
            }
            if (item.storyTask_estimatedCost != null) {
              this.estimatedCostTotal += parseInt(item.storyTask_estimatedCost);
            }
            if (item.storyTask_actualCost != null) {
              this.actualCostTotal += parseInt(item.storyTask_actualCost);
            }
          });
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          this.commonService.loadingDismiss();
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
          }
        }
      );


  }
  getTeamBoardColumns(columnId) {
    if (columnId) {
      let column = this.teamBoardColumns.filter(
        (column) => column.columnId == columnId
      );
      return column[0].columnName;
    } else {
      return '';
    }
  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
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

  filterChanged(ev) {
    this.filterr = [];
    this.columnSelect = ev;
    if (ev == 'epic') {
      let epicNames = this.getUniqueArray(this.projectDataOriginal, 'epic_id');
      epicNames.forEach((element) => {
        this.filterr.push({
          label: element.epic_name,
          type: 'checkbox',
          value: element.epic_id,
        });
      });
    } else if (ev == 'status') {
      this.teamBoardColumns.forEach((element) => {
        this.filterr.push({
          label: element.columnName,
          type: 'checkbox',
          value: element.columnId,
        });
      });
    } else if (ev == 'tester') {
      this.projectMembers.forEach((element) => {
        let firstName = element.firstName;
        let middleName = element.middleName
          ? element.middleName
          : element.lastName;
        let lastName = element.middleName ? element.lastName : '';
        let name = firstName + ' ' + middleName + ' ' + lastName;
        this.filterr.push({
          label: name,
          type: 'checkbox',
          value: element.employeeId,
        });
      });
    } else if (ev == 'assignee') {
      this.projectMembers.forEach((element) => {
        let firstName = element.firstName;
        let middleName = element.middleName
          ? element.middleName
          : element.lastName;
        let lastName = element.middleName ? element.lastName : '';
        let name = firstName + ' ' + middleName + ' ' + lastName;
        this.filterr.push({
          label: name,
          type: 'checkbox',
          value: element.employeeId,
        });
      });
    } else if (ev == 'type') {
      this.taskType.forEach((element) => {
        this.filterr.push({
          label: element.name,
          type: 'checkbox',
          value: element.id,
        });
      });
    }
    // else if (ev == "completionDate") {
    //   this.isModalOpen = true;
    // }
    else if (ev == 'story') {
      let storyName = this.getUniqueArray(this.projectDataOriginal, 'story_id');
      storyName.forEach((element) => {
        this.filterr.push({
          label: element.story_name,
          type: 'checkbox',
          value: element.story_id,
        });
      });
    } else if (ev == 'project') {
      this.allProjects.forEach((element) => {
        this.filterr.push({
          label: element.projectName,
          type: 'radio',
          value: element,
        });
      });
    }
    if (ev != 'completionDate') {
      this.presentAlertPrompt(this.filterr);
    }
  }

  async presentAlertPrompt(filter) {
    const alert = await this.alertController.create({
      inputs: filter,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { },
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (this.columnSelect == 'epic') {
              this.selectEpicTasks(data);
            } else if (this.columnSelect == 'status') {
              this.selectListColumns(data);
            } else if (this.columnSelect == 'tester') {
              this.selectTester(data);
            } else if (this.columnSelect == 'type') {
              this.selectType(data);
            } else if (this.columnSelect == 'story') {
              this.selectStoryList(data);
            } else if (this.columnSelect == 'assignee') {
              this.selectAssignee(data);
            } else if (this.columnSelect == 'project') {
              this.selectProjects(data);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  getUniqueArray(array, key) {
    return array.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t[key] === item[key])
    );
  }

  selectEpicTasks(event) {
    this.selectedEpicId = event;
    this.filterEpicTasks();
  }

  selectListColumns(event) {
    this.selectedColumns = event;
    this.filterEpicTasks();
  }

  selectTester(event) {
    this.selectedTester = event;
    this.filterEpicTasks();
  }

  selectAssignee(event) {
    this.selectedAssignee = event;
    this.filterEpicTasks();
  }

  selectType(event) {
    this.selectedTaskType = event;
    this.filterEpicTasks();
  }

  selectStoryList(event) {
    this.selectedStoryList = event;
    this.filterEpicTasks();
  }

  selectProjects(event) {
    this.projectName = event.projectName;

    this.selectedProject = event;
    this.filterProjectTasks();
  }

  filterProjectTasks() {
    if (this.selectedProject != null) {
      this.commonService.presentLoading();
      // ankit code for graph

      this.commonService.getProjectCostGraph({
        projectId: this.selectedProject.projectId,
        permissionName: 'Dashboard',
        employeeIdMiddleware: '344',
        organisationId: 1,
      }).then(
        (res: any) => {
          console.log(res)
          this.displayBarChart(
            res.Data,
            res.value
          );

          // this.docsList = res.documents;
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
        }
      );

      // ankit code for graph
      this.projectService
        .getProjectColumns({ projectId: this.selectedProject.projectId })
        .then(
          (columns: any) => {
            columns.forEach((c) => {
              c.tasks = [];
              // this.connectedTo.push("box" + c.columnId);
            });
            this.teamBoardColumns = columns;
          },
          (error) => {
            this.commonService.showToast('error', error.error.msg);
            this.commonService.loadingDismiss();
            if (error.error.statusCode == 401) {
              localStorage.clear();
              sessionStorage.clear();
              this.router.navigateByUrl('/login');
            }
          }
        );
      this.projectService
        .getProjectMembers({ projectId: this.selectedProject.projectId })
        .then(
          (members) => {
            this.projectMembers = members;
            this.projectMembers1 = members;
            this.allUsers = members;
            // this.getAllReport();
          },
          (error) => {
            this.commonService.showToast('error', error.error.msg);
            this.commonService.loadingDismiss();
            if (error.error.statusCode == 401) {
              localStorage.clear();
              sessionStorage.clear();
              this.router.navigateByUrl('/login');
            }
          }
        );
      this.projectService
        .getProjectData({ projectId: this.selectedProject.projectId })
        .then(
          (response: any) => {
            this.commonService.loadingDismiss();
            this.resetList();
            this.projectData = response;
            this.projectData.forEach((element) => {
              element.projectName = this.selectedProject.projectName;

              // fixing estimated cost and actual cost to 2 decimal places
              element.storyTask_estimatedCost = element.storyTask_estimatedCost === null ? element.storyTask_estimatedCost : parseFloat(element.storyTask_estimatedCost).toFixed(2);
              element.storyTask_actualCost = element.storyTask_actualCost === null ? element.storyTask_actualCost : parseFloat(element.storyTask_actualCost).toFixed(2);
            });
            this.projectDataOriginal = JSON.parse(
              JSON.stringify(this.projectData)
            );

            // calculating total estimated Cost and actual cost

            this.estimatedCostTotal = 0;
            this.actualCostTotal = 0;
            this.totalEstimatedHours = 0;
            this.totalActualHours = 0;
            this.projectData.map((item) => {
              if (item.storyTask_estimatedHours != null) {
                this.totalEstimatedHours += parseInt(item.storyTask_estimatedHours);
              }
              if (item.storyTask_actualHours != null) {
                this.totalActualHours += parseInt(item.storyTask_actualHours);
              }
              if (item.storyTask_estimatedCost != null) {
                this.estimatedCostTotal += parseInt(
                  item.storyTask_estimatedCost
                );
              }
              if (item.storyTask_actualCost != null) {
                this.actualCostTotal += parseInt(item.storyTask_actualCost);
              }
            });
          },
          (error) => {
            this.commonService.showToast('error', error.error.msg);
            this.commonService.loadingDismiss();
            if (error.error.statusCode == 401) {
              localStorage.clear();
              sessionStorage.clear();
              this.router.navigateByUrl('/login');
            }
          }
        );
    }
  }

  filterEpicTasks() {
    this.projectData = JSON.parse(JSON.stringify(this.projectDataOriginal));

    if (this.selectedColumns != 'all') {
      this.projectData = this.projectData.filter((e) =>
        this.selectedColumns.includes(e.storyTask_columnId)
      );
    }

    if (this.selectedEpicId != 'all') {
      this.projectData = this.projectData.filter((e) =>
        this.selectedEpicId.includes(e.epic_id)
      );
    }

    // if (this.selectedDate) {
    //   this.epicTasksList = this.epicTasksList.filter(e => new DatePipe('en-US').transform(e.completionDate, 'yyyy-MM-dd') == this.selectedDate);
    // }

    if (this.selectedTaskType != 'all') {
      this.projectData = this.projectData.filter((e) =>
        this.selectedTaskType.includes(e.storyTask_taskType)
      );
    }

    if (this.selectedTester != 'all') {
      this.projectData = this.projectData.filter((e) =>
        this.selectedTester.includes(e.storyTask_tester)
      );
    }
    if (this.selectedStoryList != 'all') {
      this.projectData = this.projectData.filter((e) =>
        this.selectedStoryList.includes(e.storyTask_storyId)
      );
    }
    if (this.selectedAssignee != 'all') {
      this.projectData = this.projectData.filter((e) =>
        this.selectedAssignee.includes(e.storyTask_assignee)
      );
    }

    // calculating total estimated Cost and actual cost
    this.estimatedCostTotal = 0;
    this.actualCostTotal = 0;
    this.totalEstimatedHours = 0;
    this.totalActualHours = 0;
    this.projectData.map((item) => {
      if (item.storyTask_estimatedHours != null) {
        this.totalEstimatedHours += parseInt(item.storyTask_estimatedHours);
      }
      if (item.storyTask_actualHours != null) {
        this.totalActualHours += parseInt(item.storyTask_actualHours);
      }
      if (item.storyTask_estimatedCost != null) {
        this.estimatedCostTotal += parseInt(item.storyTask_estimatedCost);
      }
      if (item.storyTask_actualCost != null) {
        this.actualCostTotal += parseInt(item.storyTask_actualCost);
      }
    });
    // ****************
  }

  async viewTaskDetails(taskData, story) {
    let item = {
      actualDueDate: taskData.storyTask_actualDueDate,
      actualHours: taskData.storyTask_actualHours,
      actualStartDate: taskData.storyTask_actualStartDate,
      assignee: taskData.storyTask_assignee,
      assignor: taskData.storyTask_assignor,
      category: taskData.storyTask_category,
      columnId: taskData.storyTask_columnId,
      completionDate: taskData.storyTask_completionDate,
      createdAt: taskData.storyTask_createdAt,
      createdBy: taskData.storyTask_createdBy,
      date: taskData.storyTask_date,
      description: taskData.storyTask_description,
      dueDate: taskData.storyTask_dueDate,
      epicId: taskData.epic_id,
      epicName: taskData.epic_name,
      estimatedHours: taskData.storyTask_estimatedHours,
      extraHours: taskData.storyTask_extraHours,
      fileName: taskData.storyTask_fileName,
      from: taskData.storyTask_from,
      onHold: taskData.storyTask_onHold,
      order: taskData.storyTask_order,
      priority: taskData.storyTask_priority,
      projectId: taskData.epic_projectId,
      projectTaskNumber: taskData.storyTask_projectTaskNumber,
      reOpened: taskData.storyTask_reOpened,
      reporter: taskData.storyTask_reporter,
      startDate: taskData.storyTask_startDate,
      status: taskData.storyTask_status,
      storyId: taskData.storyTask_storyId,
      storyName: taskData.story_name,
      taskId: taskData.storyTask_taskId,
      taskName: taskData.storyTask_taskName,
      taskType: taskData.storyTask_taskType,
      testCaseData: taskData.storyTask_testCaseData,
      tester: taskData.storyTask_tester,
      testingActualHours: taskData.storyTask_testingActualHours,
      testingDescription: taskData.storyTask_testingDescription,
      testingDueDate: taskData.storyTask_testingDueDate,
      testingEstimatedHours: taskData.storyTask_testingEstimatedHours,
      testingStartDate: taskData.storyTask_testingStartDate,
      to: taskData.storyTask_to,
      totalHoursSpent: taskData.storyTask_totalHoursSpent,
      updatedAt: taskData.storyTask_updatedAt,
      updatedBy: taskData.storyTask_updatedBy,
    };

    const popover = await this.modalController.create({
      component: ProjectTaskDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        item,
        projectMembers: this.projectMembers,
        teamBoardColumns: this.teamBoardColumns,
        enableFields: this.enableFields,
        showDelete: false,
      },
      showBackdrop: true,
    });
    await popover.present();
    popover.onDidDismiss().then((resp: any) => {
      // if (resp.data?.action == 'delete') {
      //   this.storyTasks.splice(this.storyTasks.indexOf(item), 1);
      //   this.selectedStory.columnTasks.forEach((element: any, i) => {
      //     element.tasks.forEach((task: any) => {
      //       if (task.taskId == item.taskId) {
      //         this.selectedStory.columnTasks[i].tasks.splice(this.selectedStory.columnTasks[i].tasks.indexOf(item), 1);
      //       }
      //     });
      //   });
      //   this.epicTasksList.forEach(element => {
      //     if (element.taskId == item.taskId) {
      //       this.epicTasksList.splice(this.epicTasksList.indexOf(item), 1);
      //       this.epicTasksListOriginal.splice(this.epicTasksListOriginal.indexOf(item), 1);

      //     }
      //   });
      // }
      if (resp.data?.status == 1 && story == null) {
        this.updateTask(item);
      }
      if (resp.data?.action == 'update') {
        this.updateTask(item);
      }
      // else if(resp.data?.action != 'delete') {
      //   this.updateTask(item);
      // }
      else {
      }
    });
  }

  updateTask(task) {
    this.commonService.presentLoading();
    this.projectService.updateProjectTask(task).then(
      (resp: any) => {
        // this.socket.emit('updateProjectTask', );
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

  resetList() {
    this.selectedEpicId = 'all';
    this.selectedColumns = 'all';
    // this.selectedDate = '';
    this.selectedTaskType = 'all';
    this.selectedTester = 'all';
    // this.selectedMembers = [];
    this.selectedStoryList = 'all';
    this.selectedAssignee = 'all';
    this.projectMembers.forEach((element) => {
      if (element.selected) {
        element.selected = false;
      }
    });
    this.filterEpicTasks();
  }

  // chart data

  getBarChartData() {
    this.chartLoaded=true;
    let payload = {
      projectId: this.allProjects[0].projectId,
      permissionName: 'Dashboard',
      employeeIdMiddleware: '344',
      organisationId: 1,
    };
    this.commonService.getProjectCostGraph(payload).then(
      (res: any) => {
        console.log(res)
        this.chartLoaded=false;

        this.displayBarChart(
          res.Data,
          res.value

        );

        // this.docsList = res.documents;
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
      }
    );
  }
  displayBarChart(data, value) {
    console.log(data)
    this.chartOptionUser = {
      title: {
        text: "Efforts/Cost  Report " + (this.projectName),
        left: 'center',
        textStyle: {
          color: '#747474',
        },
        padding: [0, 0, 50, 0],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: '#747474',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          color: '#747474',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        data: data,
      },
      series: [
        {
          // name: 'To Do',
          type: 'bar',
          stack: 'total',
          data: value,
        },
      ],
      color: ['#27ae60'],
    };
  }
}
