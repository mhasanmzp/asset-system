import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  OnInit,
  NgZone,
  OnDestroy,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  AlertController,
  MenuController,
  ModalController,
} from '@ionic/angular';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project.service';
import { TasksService } from '../../services/tasks.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectTaskDetailsPage } from '../../modals/project-task-details/project-task-details.page';
import { ProjectEpicDetailsPage } from '../../modals/project-epic-details/project-epic-details.page';
import { ProjectStoryDetailsPage } from '../../modals/project-story-details/project-story-details.page';
import Gantt from 'frappe-gantt';
import 'quill-mention';
import { AddNotePage } from 'src/app/modals/add-note/add-note.page';
import { DatePipe } from '@angular/common';
import { EChartsOption } from 'echarts';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Component({
  selector: 'app-project-manage',
  templateUrl: './project-manage.page.html',
  styleUrls: ['./project-manage.page.scss'],
})
export class ProjectManagePage implements OnInit, OnDestroy {
  @ViewChild('completionDate') completionDate1: any;
  projectId: any = 0;
  ganttWidth: any = 0;
  selectedEpicIndex: any = 0;
  selectedStoryIndex: any = 0;
  selectedEpic: any = {};
  selectedStory: any = 0;
  ganttMode: any = 'Day';
  isOpen = false;
  projects: any;
  selectedMembers: any = [];
  epicTasksList: any = [];
  epicTasksListOriginal: any = [];
  selectedEpicId: any = 'all';
  selectedColumns: any = 'all';
  searchTaskTerm: any;
  sprintSegment: any = 'ongoing';
  selectedTasks: any = {};
  isModalOpen = false;
  private subscription: Subscription;
  socket: Socket;
  totalEstimatedHours: number = 0;
  totalActualHours: number = 0;

  myFileInput: ElementRef;
  files: File;
  searchTask:any;
  @ViewChild('gantt') ganttEl: ElementRef;
  atValues = [
    { id: 1, value: 'Fredrik Sundqvist' },
    { id: 2, value: 'Patrik Sjölin' },
  ];
  hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' },
  ];
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['code-block'],
        [{ header: 1 }, { header: 2 }],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          {
            color: [
              '#000000',
              '#e60000',
              '#ff9900',
              '#ffff00',
              '#008a00',
              '#0066cc',
              '#9933ff',
              '#ffffff',
              '#facccc',
              '#ffebcc',
              '#ffffcc',
              '#cce8cc',
              '#cce0f5',
              '#ebd6ff',
              '#bbbbbb',
              '#f06666',
              '#ffc266',
              '#ffff66',
              '#66b966',
              '#66a3e0',
              '#c285ff',
              '#888888',
              '#a10000',
              '#b26b00',
              '#b2b200',
              '#006100',
              '#0047b2',
              '#6b24b2',
              '#444444',
              '#5c0000',
              '#663d00',
              '#666600',
              '#003700',
              '#002966',
              '#3d1466',
              'custom-color',
            ],
          },
          { background: [] },
          'link',
          'emoji',
        ],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],

        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ font: [] }],
        [{ align: [] }],

        ['clean'],

        ['link'],
      ],
    },

    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['@', '#'],
      source: (searchTerm, renderList, mentionChar) => {
        let values;

        if (mentionChar === '@') {
          values = this.atValues;
        } else {
          values = this.hashValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (var i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
    'emoji-toolbar': false,
    'emoji-textarea': false,
    'emoji-shortname': false,
    keyboard: {
      bindings: {
        shiftEnter: {
          key: 13,
          shiftKey: true,
          handler: (range, context) => {},
        },
        enter: {
          key: 13,
          handler: (range, context) => {
            return true;
          },
        },
      },
    },
  };

  segment: any = 'dashboard';
  epics: any = [];
  gantt: any;
  windowHeight: any = 0;
  windowHeight1: any = 0;
  projectEpics: any = [
    {
      id: 'sample',
      name: 'Sample Epic',
      start: this.commonService.formatDate(new Date()),
      end: this.commonService.formatDate(new Date()),
      progress: 0,
    },
  ];
  epicStories: any = [];
  epicStoriesArray: any = [];
  storyTasks: any = [];
  projectEpicsTest: any = [
    {
      id: 'Task 1',
      name: 'Sample Epic',
      start: this.commonService.formatDate(new Date()),
      end: this.commonService.formatDate(new Date()),
      progress: 0,
    },
  ];
  toggleMenu: boolean = true;
  teamBoardColumns: any = [];
  connectedTo: any = [];
  projectMembers: any = [];
  projectName: any = '';
  projectMembers1: any = [];
  allUsers: any = [];
  userLogin: any;
  enableFields: boolean = true;
  userId: string;
  allDocs: any;
  responseLength: any;
  id: any;
  allNotes: any;
  sprintTasks: any = [];
  sprintTasksAssignment: any = {};
  sprintTasksAssignmentIds: any = [];
  estimatedHours: any = 0;
  activeSprints: any = [];
  selectedSprint: any = 0;
  employeeType: any;
  priority: any = [
    { id: 0, name: 'Low' },
    { id: 1, name: 'Medium' },
    { id: 2, name: 'High' },
    { id: 3, name: 'Hold' },
    { id: 4, name: 'Show Stopper' },
  ];
  taskType: any = [
    { id: 0, name: 'Feature' },
    { id: 1, name: 'Bug' },
  ];
  selectedDate: any;
  selectedTaskType: any = 'all';
  selectedTester: any = 'all';
  selectedStoryList: any = 'all';
  selectedAssignee: any = 'all';
  selectedCreatedBy: any = 'all';
  selectedPriority: any = 'all';
  filteredToDo: any;
  filteredInProgress: any;
  filteredTesting: any;
  filteredDone: any;
  chartOptionToday: EChartsOption;
  chartOption: EChartsOption;
  filteredHold: any;
  tasksCompletedToday: any;
  taskCreatedfiltered: any;
  chartOptionHours: any;
  sDateEffort: any;
  eDateEffort: any;
  filteredEffortsDate: any;
  allReportResponse: any;
  chartOptionUser: any;
  columnSelect: any;
  filterr: any;
  checkbox: any;
  isAddingTask: any;
  date: any;
  stories: any = [];
  messages: any = [];
  projectData: any = [];
  epicsData: any = [];

  constructor(
    private router: Router,
    public modalCtrl: ModalController,
    private tasksService: TasksService,
    private changeDetector: ChangeDetectorRef,
    private menuController: MenuController,
    private modalController: ModalController,
    private activated: ActivatedRoute,
    public authService: AuthService,
    private projectService: ProjectService,
    private alertController: AlertController,
    private commonService: CommonService,
    private loadingController: LoadingController,
    public ngZone: NgZone
  ) {
    // this.socket = io(this.authService.socketUrl);
    // // ////To update Project tasks
    // this.socket.on('updateProjectTask', (res: any) => {
    //   for (let i = 0; i < this.epicTasksList.length; i++) {
    //     if (this.epicTasksList[i].taskId == res.taskId) {
    //       this.epicTasksList[i] = res;
    //       this.epicTasksListOriginal[i] = res;
    //     }
    //   }
    //   console.log("task list",this.projectEpics)
    //   for(let i=0;i<this.projectEpics.length;i++)
    //   {
    //     if(this.projectEpics[i].id == res.epicId)
    //     {
    //       for(let j=0;j<this.projectEpics[i].stories.length;j++)
    //       {
    //         if(this.projectEpics[i].stories[j].id == res.storyId)
    //         {
    //           this.projectEpics[i].stories[j].columnTasks.forEach((element: any, index) => {
    //             element.tasks.forEach((task: any) => {
    //               if (task.taskId == res.taskId) {
    //                 this.projectEpics[i].stories[j].columnTasks[index].tasks.splice(this.projectEpics[i].stories[j].columnTasks[index].tasks.indexOf(task), 1);
    //               }
    //             });
    //             if (this.projectEpics[i].stories[j].columnTasks[index].columnId == res.columnId) {
    //               this.projectEpics[i].stories[j].columnTasks[index].tasks.push(res)
    //             }
    //           });
    //         }
    //       }
    //     }
    //   }
    //   console.log("task list*********",this.projectEpics)
    // });
    // this.socket.on('epicUpdate', (res: any) => {
    //   console.log("response epic update",res)
    //   for (let i = 0; i < this.projectEpics.length; i++) {
    //     if (this.projectEpics[i].id == res.id || this.projectEpics[i].id == ('epic' + res.id)) {
    //       this.projectEpics[i] = res
    //     }
    //   }
    //   for (let i = 0; i < this.epicTasksList.length; i++) {
    //     if (this.epicTasksList[i].epicId == ('epic' + res.id)) {
    //       this.epicTasksList[i].epicName = res.name
    //       this.epicTasksListOriginal[i].epicName = res.name
    //     }
    //   }
    // });
    // this.socket.on('storyUpdate', (res: any) => {
    //   console.log("story update",res)
    //   for (let i = 0; i < this.projectEpics.length; i++) {
    //     for (let j = 0; j < this.projectEpics[i].stories.length; j++) {
    //       if (this.projectEpics[i].stories[j].id == res.id) {
    //         this.projectEpics[i].stories[j].name = res.name
    //         this.projectEpics[i].stories[j].description = res.description
    //       }
    //     }
    //   }
    //   for (let i = 0; i < this.epicTasksList.length; i++) {
    //     if (this.epicTasksList[i].storyId == res.id) {
    //       this.epicTasksList[i].storyName = res.name
    //       this.epicTasksListOriginal[i].storyName = res.name
    //     }
    //   }
    // });
    // this.socket.on('createStoryTask', (res: any) => {
    //   console.log("create task",res)
    //   if (this.epicTasksList.indexOf(res.dataValues.taskId) == -1) {
    //     let task = {}
    //     console.log("abcdef", this.projectEpics)
    //     task['taskName'] = res.taskName;
    //     task['estimatedHours'] = 0;
    //     task['priority'] = 0;
    //     task['taskType'] = 0;
    //     task['employeeId'] = this.authService.userId;
    //     // task['order'] = that.storyTasks.length;
    //     task['reporter'] = this.authService.userId;
    //     task['columnId'] = res.columnId;
    //     task['epicId'] = (res.epicId).replace('epic', '');
    //     task['epicName'] = this.epicStories.filter(e => e.epicId = task['epicId'])[0]['epicName']
    //     task['storyId'] = (res.storyId);
    //     task['projectId'] = this.projectId;
    //     task['taskId'] = res.dataValues.taskId;
    //     task['projectTaskNumber'] = res.dataValues.projectTaskNumber;
    //     this.storyTasks.unshift(task)
    //     let storyName;
    //     let epicName;
    //     // this.selectedStory.columnTasks[0].tasks.push(task);
    //     for (let i = 0; i < this.projectEpics.length; i++) {
    //       for (let j = 0; j < this.projectEpics[i].stories.length; j++) {
    //         if (this.projectEpics[i].stories[j].id == res.storyId) {
    //           storyName = this.projectEpics[i].stories[j].name
    //           epicName = this.projectEpics[i].name
    //           this.projectEpics[i].stories[j].columnTasks[0].tasks.push(task)
    //         }
    //       }
    //     }
    //     this.epicTasksList.push(task);
    //     this.epicTasksList[this.epicTasksList.length - 1]['epicName'] = epicName;
    //     this.epicTasksList[this.epicTasksList.length - 1]['storyName'] = storyName;
    //     this.epicTasksList[this.epicTasksList.length - 1]['createdAt'] = new Date().toISOString();
    //     this.epicTasksListOriginal.push(task);
    //     this.epicTasksListOriginal[this.epicTasksListOriginal.length - 1]['epicId'] = "epic" + task['epicId'];
    //     this.epicTasksListOriginal[this.epicTasksListOriginal.length - 1]['epicName'] = epicName;
    //     this.epicTasksListOriginal[this.epicTasksListOriginal.length - 1]['storyName'] = storyName;
    //     this.epicTasksListOriginal[this.epicTasksListOriginal.length - 1]['createdAt'] = new Date().toISOString();
    //   }
    // });
    // this.socket.on('createStory', (res: any) => {
    //   console.log("response story",res)
    //   let story = {}
    //   story['name'] = res.name,
    //     story['progress'] = 0,
    //     story['reporter'] = this.authService.userId;
    //   story['epicId'] = (res.epicId).replace('epic', '')
    //   story['projectId'] = this.projectId
    //   story['id'] = res.dataValues.id;
    //   for (let i = 0; i < this.projectEpics.length; i++) {
    //     if (this.projectEpics[i].id == ('epic' + res.epicId)) {
    //       this.projectEpics[i].stories.push(story)
    //       this.projectEpics[i].stories[this.projectEpics[i].stories.length - 1]['columnTasks'] = JSON.parse(JSON.stringify(this.teamBoardColumns))
    //     }
    //   }
    // });
    // this.socket.on('createEpic', (res: any) => {
    //   console.log("res epic", res)
    //   let epic = {}
    //   epic['name'] = res.name;
    //   epic['start'] = res.start;
    //   epic['end'] = res.end;
    //   epic['progress'] = 0;
    //   epic['reporter'] = this.authService.userId;
    //   epic['projectId'] = this.projectId;
    //   epic['stories'] = [];
    //   epic['id'] = "epic" + res.dataValues.id;
    //   if (this.projectEpics[0].id == 'sample') {
    //     this.projectEpics = [epic];
    //     this.selectedEpic = epic;
    //   }
    //   else {
    //     this.projectEpics.push(epic);
    //     this.selectedEpic = epic;
    //     this.selectEpic(epic, this.projectEpics.length - 1)
    //   }
    //   // let story = {}
    //   // story['name'] = res.name,
    //   //   story['progress'] = 0,
    //   //   story['reporter'] = this.authService.userId;
    //   // story['epicId'] = (res.epicId).replace('epic', '')
    //   // story['projectId'] = this.projectId
    //   // story['id'] = res.dataValues.id;
    //   // for (let i = 0; i < this.projectEpics.length; i++) {
    //   //   if (this.projectEpics[i].id == ('epic' + res.epicId)) {
    //   //     this.projectEpics[i].stories.push(story)
    //   //     this.projectEpics[i].stories[this.projectEpics[i].stories.length - 1]['columnTasks'] = JSON.parse(JSON.stringify(this.teamBoardColumns))
    //   //   }
    //   // }
    // });
    // this.socket.on('deleteStoryTask', (res: any) => {
    //   this.storyTasks.splice(this.storyTasks.indexOf(res), 1);
    //   for (let i = 0; i < this.epicTasksList.length; i++) {
    //     if (this.epicTasksList[i].taskId == res.taskId) {
    //       this.epicTasksList.splice(i, 1);
    //       this.epicTasksListOriginal.splice(i,1);
    //     }
    //   }
    //   for(let i=0;i<this.projectEpics.length;i++)
    //   {
    //     if(this.projectEpics[i].id == res.epicId)
    //     {
    //       for(let j=0;j<this.projectEpics[i].stories.length;j++)
    //       {
    //         if(this.projectEpics[i].stories[j].id == res.storyId)
    //         {
    //           this.projectEpics[i].stories[j].columnTasks.forEach((element: any, index) => {
    //             element.tasks.forEach((task: any, index1) => {
    //               if (task.taskId == res.taskId) {
    //                 // this.selectedStory.columnTasks[i].tasks.splice(this.selectedStory.columnTasks[i].tasks.indexOf(res),1);
    //                 console.log(index1)
    //                 this.projectEpics[i].stories[j].columnTasks[index].tasks.splice(index1, 1);
    //               }
    //             });
    //           });
    //         }
    //       }
    //     }
    //   }
    // });
  }

  logScrolling(ev) {}

  segmentChanged() {
    if (this.segment != 'list') {
      this.selectedEpicId = 'all';
      this.selectedColumns = 'all';
      this.selectedDate = '';
      this.selectedTaskType = 'all';
      this.selectedCreatedBy = 'all';
      this.selectedPriority = 'all';
      this.filterEpicTasks();
    }
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  createSprint() {
    let tasks = this.epicTasksList.filter((e) => e['checkedForSprint'] == true);

    this.sprintTasksAssignment = {};
    tasks.forEach((task) => {
      if (!this.sprintTasksAssignment[task.assignee])
        this.sprintTasksAssignment[task.assignee] = 0;
      this.sprintTasksAssignment[task.assignee] =
        this.sprintTasksAssignment[task.assignee] + task.estimatedHours;
      this.estimatedHours += task.estimatedHours;
    });
    this.sprintTasksAssignmentIds = Object.keys(this.sprintTasksAssignment);
  }

  selectAllForCreateSprint(event, allData) {
    this.checkbox = document.getElementById('checkbox');
    if (this.checkbox.checked == true) {
      allData.forEach((element) => {
        element['checkedForSprint'] = false;
      });
    } else {
      allData.forEach((element) => {
        element['checkedForSprint'] = true;
      });
    }

    this.createSprint();
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
    this.authService.userLogin.next({});
  }

  toggleMenuButton() {
    this.toggleMenu = !this.toggleMenu;
    this.menuController.enable(this.toggleMenu);
  }

  async downloadExcel() {
    let url =
      this.authService.apiUrl +
      'downloadProjectExcel?projectId=' +
      this.projectId;
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        Jwt_token: localStorage.getItem('jwt_token'),
      },
    });
    let blob = await response.blob();
    let filename = 'Downloaded_Report.xlsx'; // Provide appropriate filename
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  selectBoardSprint(event) {
    let sprintId = event.target.value;
  }

  ngOnInit() {
    this.totalEstimatedHours = 0;
    this.totalEstimatedHours = 0;
    this.userId = localStorage.getItem('userId');
    this.projectId = this.activated.snapshot.params.id;
    let that = this;
    this.projectName = '';
    this.projects = [];

    this.getprojectChartData();
    this.getChartHours();
    this.getBarChartData();

    this.projectService.getProjectEpics({ projectId: this.projectId }).then(
      (epics: any) => {
        this.epicsData = epics;
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
    this.projectService.getActiveSprints(this.projectId).then(
      (data) => {
        this.activeSprints = data;
        this.selectedSprint = data[0]?.sprintId;
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
    this.windowHeight = window.innerHeight - 90 + 'px';
    this.windowHeight1 = window.innerHeight - 150 + 'px';

    this.gantt = new Gantt('#gantt', this.projectEpics, {
      header_height: 50,
      column_width: 30,
      step: 24,
      view_mode: 'Day',
      view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month', 'Year'],
      bar_height: 30,
      bar_corner_radius: 3,
      arrow_curve: 5,
      padding: 20,
      date_format: 'YYYY-MM-DD',
      custom_popup_html: null,
      draggable: true,
      on_click: function (task) {},
      on_drag: function (task) {
        let taskObj = Object.assign(task);
        taskObj.id = parseInt(task.id.replace('epic', ''));
        that.projectService.updateProjectEpic(taskObj);
      },
      on_date_change: function (task, start, end) {
        let taskObj = Object.assign(task);
        taskObj.start = that.commonService.formatDate(start);
        taskObj.end = that.commonService.formatDate(end);
        taskObj.id = parseInt(task.id.replace('epic', ''));
        that.projectService.updateProjectEpic(taskObj);
      },
      on_progress_change: function (task, progress) {},
      on_view_change: function (mode) {},
    });

    this.subscription = this.authService.userLogin.subscribe((resp) => {
      if (resp && Object.keys(resp).length > 0) {
        this.projectService.getMemberProjects().then(
          (resp: any) => {
            this.projects = resp;
            this.projectName = this.projects.filter(
              (project) => project.projectId == this.projectId
            )[0].projectName;
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

        this.userLogin = resp;
        this.commonService.presentLoading();
        this.projectService
          .getProjectMembers({ projectId: this.projectId })
          .then(
            (members) => {
              this.projectMembers = members;
              this.projectMembers1 = members;
              this.allUsers = members;
              // this.getAllReport();

              let projectManager = this.projectMembers.filter(
                (id) => id.employeeId == this.userLogin.employeeId
              )[0];
              if (projectManager != null && projectManager.type == 'Manager') {
                this.enableFields = false;
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
    });
    this.projectService.getProjectData({ projectId: this.projectId }).then(
      (resp: any) => {
        this.projectData = resp;
        if (this.epicsData.length > 0) {
          this.epicsData.forEach((epic) => {
            epic.id = 'epic' + epic.id;
            delete epic.projectId;
          });

          let epicsData = [];
          for (var i = 0; i < 20; i++) {
            epicsData.push({
              id: 'Task ' + i,
              name: 'Redesign website',
              start: '2022-09-18',
              end: '2022-09-30',
              progress: 20,
            });
          }

          this.projectEpics = this.epicsData;
          that.selectedEpic = that.projectEpics[0];

          this.projectEpics.forEach((epic, index) => {
            this.fetchEpicStories(epic, index);
          });

          this.gantt.refresh(this.projectEpics);
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

    this.projectService.getProjectColumns({ projectId: this.projectId }).then(
      (columns: any) => {
        columns.forEach((c) => {
          c.tasks = [];
          this.connectedTo.push('box' + c.columnId);
        });
        this.teamBoardColumns = columns;
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

    this.projectService.getProjectEpics({ projectId: this.projectId }).then(
      (epics: any) => {
        if (epics.length > 0) {
          epics.forEach((epic) => {
            epic.id = 'epic' + epic.id;
            delete epic.projectId;
          });

          let epicsData = [];
          for (var i = 0; i < 20; i++) {
            epicsData.push({
              id: 'Task ' + i,
              name: 'Redesign website',
              start: '2022-09-18',
              end: '2022-09-30',
              progress: 20,
            });
          }

          this.projectEpics = epics;
          that.selectedEpic = that.projectEpics[0];

          this.projectEpics.forEach((epic, index) => {
            this.fetchEpicStories(epic, index);
          });

          this.gantt.refresh(this.projectEpics);
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

    const myTimeout = setTimeout(myStopFunction, 200);

    var userSelection = document.getElementsByClassName('gantt-container');
    userSelection[0].addEventListener('scroll', (el) => {
      let topScroller = document.getElementById('topScroller');
      topScroller.scrollLeft = userSelection[0].scrollLeft;
    });

    let topScroller = document.getElementById('topScroller');
    topScroller.addEventListener('scroll', (el) => {
      var userSelection = document.getElementsByClassName('gantt-container');
      userSelection[0].scrollLeft = topScroller.scrollLeft;
    });

    function myStopFunction() {
      var userSelection = document.getElementsByClassName('gantt-container');
      userSelection[0].classList.add('ganttTest');

      let sl = userSelection[0].scrollLeft,
        cw = userSelection[0].scrollWidth;
      let width = window.innerWidth;

      that.ganttWidth = width;

      userSelection[0].scrollLeft = width / 4;

      clearTimeout(myTimeout);
    }
    this.getDocs();
    this.getNotes();

    this.employeeType = localStorage.getItem('type');
  }

  fetchEpicStories(epic, index) {
    this.gantt.refresh(this.projectEpics);
    epic.stories = [];
    let projectData = this.projectData.filter(
      (el) => 'epic' + el.epic_id == epic.id
    );
    for (let i = 0; i < projectData.length; i++) {
      if (epic.stories.length > 0) {
        if (
          epic.stories.filter((el) => el.id == projectData[i].story_id)
            .length == 0
        ) {
          epic.stories.push({
            id: projectData[i].story_id,
            createdAt: projectData[i].story_createdAt,
            description: projectData[i].story_description,
            end: projectData[i].story_end,
            epicId: projectData[i].story_epicId,
            name: projectData[i].story_name,
            organisationId: projectData[i].story_organisationId,
            progress: projectData[i].story_progress,
            projectId: projectData[i].story_projectId,
            reporter: projectData[i].story_reporter,
            start: projectData[i].story_start,
            status: projectData[i].story_status,
            updatedAt: projectData[i].story_updatedAt,
          });
        }
      } else {
        epic.stories.push({
          id: projectData[i].story_id,
          createdAt: projectData[i].story_createdAt,
          description: projectData[i].story_description,
          end: projectData[i].story_end,
          epicId: projectData[i].story_epicId,
          name: projectData[i].story_name,
          organisationId: projectData[i].story_organisationId,
          progress: projectData[i].story_progress,
          projectId: projectData[i].story_projectId,
          reporter: projectData[i].story_reporter,
          start: projectData[i].story_start,
          status: projectData[i].story_status,
          updatedAt: projectData[i].story_updatedAt,
        });
      }
    }
    if (index == 0) {
      this.selectedEpicIndex = 0;
      this.selectedStoryIndex = 0;
      this.epicStories = epic.stories;
      this.selectedStory = this.epicStories[this.selectedStoryIndex];
    }
    epic.stories.forEach((story, i) => {
      story.columnTasks = JSON.parse(JSON.stringify(this.teamBoardColumns));
      let projectTaskData = [];
      let tasksData = [];
      projectTaskData = projectData.filter((el) => el.story_id == story.id);
      if (projectTaskData.length > 0) {
        projectTaskData.forEach((element) => {
          if (element.storyTask_storyId) {
            tasksData.push({
              actualDueDate: element.storyTask_actualDueDate,
              actualHours: element.storyTask_actualHours,
              actualStartDate: element.storyTask_actualStartDate,
              assignee: element.storyTask_assignee,
              assignor: element.storyTask_assignor,
              category: element.storyTask_category,
              columnId: element.storyTask_columnId,
              completionDate: element.storyTask_completionDate,
              createdAt: element.storyTask_createdAt,
              createdBy: element.storyTask_createdBy,
              date: element.storyTask_date,
              description: element.storyTask_description,
              dueDate: element.storyTask_dueDate,
              estimatedHours: element.storyTask_estimatedHours,
              extraHours: element.storyTask_extraHours,
              fileName: element.storyTask_fileName,
              from: element.storyTask_from,
              onHold: element.storyTask_onHold,
              order: element.storyTask_order,
              priority: element.storyTask_priority,
              projectId: element.epic_projectId,
              projectTaskNumber: element.storyTask_projectTaskNumber,
              reOpened: element.storyTask_reOpened,
              reporter: element.storyTask_reporter,
              startDate: element.storyTask_startDate,
              status: element.storyTask_status,
              storyId: element.storyTask_storyId,
              taskId: element.storyTask_taskId,
              taskName: element.storyTask_taskName,
              taskType: element.storyTask_taskType,
              testCaseData: element.storyTask_testCaseData,
              tester: element.storyTask_tester,
              testingActualHours: element.storyTask_testingActualHours,
              testingDescription: element.storyTask_testingDescription,
              testingDueDate: element.storyTask_testingDueDate,
              testingEstimatedHours: element.storyTask_testingEstimatedHours,
              testingStartDate: element.storyTask_testingStartDate,
              to: element.storyTask_to,
              totalHoursSpent: element.storyTask_totalHoursSpent,
              updatedAt: element.storyTask_updatedAt,
              updatedBy: element.storyTask_updatedBy,
              estimatedCost: parseInt(element.storyTask_estimatedCost),
              actualCost: parseInt(element.storyTask_actualCost),
            });
          }
        });
      }

      // calculating total estimated Hours and Total Actual hours of all task
      tasksData.map((item) => {
        this.totalEstimatedHours += item.estimatedHours;
        this.totalActualHours += item.actualHours;
      });

      // removed this code on 12 Apr,24 bcz in project list section on story filter we are getting repeated stories name
      // epic.stories.forEach((element) => {
      //   if (
      //     epic.stories.length > 0 &&
      //     element.tasks &&
      //     element.tasks.length > 0
      //   ) {
      //     this.stories.push(element);
      //   }
      // });

      story.tasks = tasksData.sort((a, b) => {
        if (a.projectTaskNumber > b.projectTaskNumber) {
          return -1;
        }
        if (a.projectTaskNumber < b.projectTaskNumber) {
          return 1;
        }
        return 0;
      });
      if (index == 0 && i == 0) {
        this.storyTasks = tasksData;
      }
      story.columnTasks.forEach((column, j) => {
        let filteredTasks = tasksData.filter(
          (t) => t.columnId == column.columnId && t.storyId == story.id
        );
        if (filteredTasks.length > 0) {
          column.tasks = filteredTasks;
        }
      });
      this.epicStoriesArray = Object.assign(epic.stories, {});

      this.epicTasksList = this.flat(this.projectEpics).sort((a, b) => {
        // if (a.projectTaskNumber < b.projectTaskNumber) {
        //   return -1;
        // }
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        return 0;
      });

      this.epicTasksListOriginal = this.flat(this.projectEpics).sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        return 0;
      });
      let epicTasks = this.epicTasksListOriginal.filter(
        (e) => e.epicId == epic.id
      );
      let epicTasksDone = epicTasks.filter((e) => e.status == 1);
      if (epicTasks == 0) epic['progress'] = 0;
      else
        epic['progress'] = (
          (parseFloat(epicTasksDone.length) * 100) /
          parseFloat(epicTasks.length)
        ).toFixed(2);

      this.projectEpics.forEach((e) => {
        if (e.epicId == epic.id) e['progress'] = epic['progress'];
      });

      this.gantt.refresh(this.projectEpics);
      this.change_view_mode('Week');
      this.ganttMode = 'Week';

      // this.getTaskChart(this.epicTasksListOriginal);
      // this.getTodayTask(this.epicTasksListOriginal);

      // filtering only those stories which have tasks
      if (story.tasks.length > 0) {
        this.stories.push(story);
      }

    });
  }

  flat(array) {
    let newArray = array.slice();

    let epicList = [];

    newArray.forEach(function (epic) {
      if (Array.isArray(epic.stories)) {
        epic.stories.forEach((story) => {
          if (story && story['tasks'] && story['tasks'].length > 0) {
            story['tasks'].forEach((task) => {
              task['storyId'] = story['id'];
              task['storyName'] = story['name'];
              task['epicId'] = epic['id'];
              task['epicName'] = epic['name'];
              epicList.push(task);
            });
          }
        });
      }
    });

    return epicList;
  }

  selectEpic(epic, index) {
    this.selectedEpicIndex = index;
    this.selectedEpic = epic;
    this.epicStories = epic.stories;
    console.log("select epic",this.epicStories)

    this.selectedStoryIndex = 0;
    if (epic.stories) {
      this.selectedStory = this.epicStories[this.selectedStoryIndex];
    } else {
      this.selectedStory = null;
    }
    this.selectStory(this.selectedStory, 0);
  }

  selectStory(story, index) {
    this.selectedStoryIndex = index;
    this.selectedStory = story;
    if (story) {
      let columnTasks = story.columnTasks;
      let column1 =
        columnTasks[0].tasks.length != 0 ? columnTasks[0].tasks : [];
      let column2 = columnTasks[1].tasks.length ? columnTasks[1].tasks : [];
      let column3 = columnTasks[2].tasks.length ? columnTasks[2].tasks : [];
      let column4 = columnTasks[3].tasks.length ? columnTasks[3].tasks : [];
      this.storyTasks =
        column1.concat(column2).concat(column3).concat(column4) || [];
    } else {
      this.storyTasks = [];
    }
  }

  addTask() {
    let newTask = { taskName: '', projectId: 0 };
  }

  onBlur(event, item, c, i) {
    item['edit'] = false;
    if (item.name == '') {
      this.teamBoardColumns[c].tasks.splice(i, 1);
    } else {
    }
    item.focus = false;
  }

  taskNameUpdated(ev, item, c, i) {
    item['taskName'] = ev.target.value;
    if (item.taskId) {
    } else {
      this.tasksService.createTask(item).then(
        (resp: any) => {
          item.taskId = resp.taskId;
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
  }

  async drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data.forEach((task: any, index) => {
        task.order = index;
        this.updateTask(task);
      });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data.forEach((task: any, index) => {
        task.order = index;
        task.columnId = event.container.id;
        this.updateTask(task);
      });
    }
  }

  updateTask(task) {
    this.commonService.presentLoading();
    this.createSprint();
    if (task.actualStartDate == '') {
      task.actualStartDate = null;
    }
    if (task.actualDueDate == '') {
      task.actualDueDate = null;
    }

    this.projectService.updateProjectTask(task).then(
      (resp: any) => {},
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

  updateEpic(epic, item) {
    epic['epicManager'] = item;
    this.projectService.updateProjectEpic(epic).then(
      (resp: any) => {
        this.gantt.refresh(this.projectEpics);
        this.commonService.showToast('success', 'Epic Updated Successfully');
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

  updateStory(story) {
    this.projectService.updateEpicStory(story).then(
      (resp: any) => {},
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

  assignTaskOverlay(item, i) {
    item.isOpen = !item.isOpen;
    item.index = i;
  }

  assignTask(item, user) {
    item.assignee = user.employeeId;
    item.firstName = user.firstName;
    item.lastName = user.lastName;
    item.image = user.image;
    item.isOpen = !item.isOpen;
    this.updateTask(item);
  }

  getAssigneeDetails(item, data) {
    if (item) {
      let user = this.projectMembers.filter(
        (e) => e.employeeId == item.assignee
      );
      if (user.length > 0) return user[0][data] || '';
      else return '';
    } else {
      return '';
    }
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
  getListReporterDetails(item, key, data) {
    if (item) {
      let user = this.projectMembers.filter((e) => e.employeeId == item[key]);
      if (user.length > 0) return user[0][data] || '';
      else return '';
    } else {
      return '';
    }
  }

  getTeamBoardColumns(columnId) {
    let column = this.teamBoardColumns.filter(
      (column) => column.columnId == columnId
    );
    if (column.length > 0) return column[0].columnName;
    else return '';
  }

  selectEpicTasks(event) {
    this.selectedEpicId = event;
    this.filterEpicTasks();
  }

  updateTaskStatus(item) {
    item.status = !item.status;
    item.completionDate = new Date();
    this.updateTask(item);
  }

  selectMemberTasks(member) {
    member.selected = !member.selected;
    let selectedMembers = this.projectMembers.filter((m) => m.selected == true);
    let members = [];
    selectedMembers.forEach((m) => {
      members.push(m.employeeId);
    });
    this.selectedMembers = members;
    this.filterEpicTasks();
  }

  selectListColumns(event) {
    this.selectedColumns = event;
    this.filterEpicTasks();
  }

  searchTasks(ev) {
    this.searchTaskTerm = ev.target.value;
    if (this.searchTaskTerm) {
      this.segment = 'list';
      this.filterEpicTasks();
    } else {
      this.epicTasksList = JSON.parse(
        JSON.stringify(this.epicTasksListOriginal)
      );
      this.filterEpicTasks();
    }
  }

  dateFilter(event) {
    this.selectedDate = event.target.value;
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

  selectTester(event) {
    this.selectedTester = event;
    this.filterEpicTasks();
  }

  selectAssignee(event) {
    this.selectedAssignee = event;
    this.filterEpicTasks();
  }
  selectCreatedBy(event) {
    this.selectedCreatedBy = event;
    this.filterEpicTasks();
  }
  selectPriority(event) {
    this.selectedPriority = event;
    this.filterEpicTasks();
  }

  filterEpicTasks() {
    var filteredArray = this.epicStoriesArray
      .filter((element) =>
        element.tasks.some(
          (subElement) => this.selectedMembers.indexOf(subElement.assignee) > -1
        )
      )
      .map((element) => {
        let n = Object.assign({}, element, {
          tasks: element.tasks.filter(
            (subElement) =>
              this.selectedMembers.indexOf(subElement.assignee) > -1
          ),
        });
        return n;
      });
    // if (this.selectedMembers.length > 0) this.epicStories = filteredArray;
    // else this.epicStories = this.epicStoriesArray;

    this.epicTasksList = JSON.parse(JSON.stringify(this.epicTasksListOriginal));

    if (this.selectedMembers.length > 0) {
      this.epicTasksList = this.epicTasksListOriginal.filter(
        (e) => this.selectedMembers.indexOf(e.assignee) > -1
      );
    }

    if (this.selectedColumns != 'all') {
      this.epicTasksList = this.epicTasksList.filter((e) =>
        this.selectedColumns.includes(e.columnId)
      );
    }

    if (this.selectedEpicId != 'all') {
      this.epicTasksList = this.epicTasksList.filter((e) =>
        this.selectedEpicId.includes(e.epicId)
      );
    }

    if (this.selectedDate) {
      this.epicTasksList = this.epicTasksList.filter(
        (e) =>
          new DatePipe('en-US').transform(e.completionDate, 'yyyy-MM-dd') ==
          this.selectedDate
      );
    }

    if (this.selectedTaskType != 'all') {
      this.epicTasksList = this.epicTasksList.filter((e) =>
        this.selectedTaskType.includes(e.taskType)
      );
    }

    if (this.selectedTester != 'all') {
      this.epicTasksList = this.epicTasksList.filter((e) =>
        this.selectedTester.includes(e.tester)
      );
    }
    if (this.selectedStoryList != 'all') {
      this.epicTasksList = this.epicTasksList.filter((e) =>
        this.selectedStoryList.includes(e.storyId)
      );
    }
    if (this.selectedAssignee != 'all') {
      this.epicTasksList = this.epicTasksList.filter((e) =>
        this.selectedAssignee.includes(e.assignee)
      );
    }
    if (this.selectedCreatedBy != 'all') {
      this.epicTasksList = this.epicTasksList.filter((e) =>
        this.selectedCreatedBy.includes(e.reporter)
      );
    }
    if (this.selectedPriority != 'all') {
      this.epicTasksList = this.epicTasksList.filter((e) =>
        
        this.selectedPriority.includes(e.priority)
      );
    }

    if (this.searchTaskTerm && this.searchTaskTerm.length > 0) {
      this.epicTasksList = this.epicTasksList.filter(
        (e) =>
          e.taskName
            .toLowerCase()
            .includes(this.searchTaskTerm.toLowerCase()) ||
          e.projectTaskNumber.toString().includes(this.searchTaskTerm)
      );
    }
  }

  async addEpic() {
    let date = this.commonService.formatDate(new Date());
    let that = this;
    const alert = await this.alertController.create({
      header: 'Enter epic details!',
      inputs: [
        {
          name: 'epicName',
          type: 'text',
          placeholder: 'Epic name',
        },
        {
          name: 'epicStartDate',
          value: date,
          type: 'date',
          placeholder: 'Start Date',
        },
        {
          name: 'epicStopDate',
          value: date,
          type: 'date',
          placeholder: 'Start Date',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Add',
          handler: (epicData) => {
            let epic = {};
            epic['name'] = epicData.epicName;
            epic['start'] = epicData.epicStartDate;
            epic['end'] = epicData.epicStopDate;
            epic['progress'] = 0;
            epic['reporter'] = this.authService.userId;
            epic['projectId'] = this.projectId;
            epic['stories'] = [];

            if (epic['name'] && epic['start'] && epic['end']) {
              this.projectService.createEpic(epic).then(
                (resp: any) => {
                  epic['id'] = 'epic' + resp.id;

                  if (that.projectEpics[0].id == 'sample') {
                    that.projectEpics = [epic];
                    that.selectedEpic = epic;
                  } else {
                    that.projectEpics.push(epic);
                    that.selectedEpic = epic;
                    this.selectEpic(epic, that.projectEpics.length - 1);
                  }

                  that.gantt.refresh(that.projectEpics);
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
            } else {
              this.commonService.showToast('error', 'Please fill all fields');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async addStory() {
    let that = this;
    const alert = await this.alertController.create({
      header: 'Enter story details!',
      inputs: [
        {
          name: 'storyName',
          type: 'textarea',
          placeholder: 'Story name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Add',
          handler: (epicData) => {
            let story = {};
            (story['name'] = epicData.storyName),
              (story['progress'] = 0),
              (story['reporter'] = this.authService.userId);
            story['epicId'] = this.selectedEpic.id.replace('epic', '');
            story['projectId'] = this.projectId;

            if (story['name']) {
              this.projectService.createStory(story).then(
                (resp: any) => {
                  story['id'] = resp.id;
                  if (!that.epicStories) {
                    that.epicStories = [];
                  }
                  that.epicStories.push(story);
                  if (that.epicStories.length == 1) {
                    that.selectedStory = that.epicStories[0];
                  } else {
                    that.selectedStory =
                      that.epicStories[that.epicStories.length - 1];
                  }
                  that.epicStories[that.epicStories.length - 1]['columnTasks'] =
                    JSON.parse(JSON.stringify(this.teamBoardColumns));

                  this.selectStory(
                    that.selectedStory,
                    that.epicStories.length - 1
                  );
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
            } else {
              this.commonService.showToast('error', 'Please fill all fields');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async addStoryTask() {
    if (this.isAddingTask) {
      return;
    }
    this.isAddingTask = true;
    let date = this.commonService.formatDate(new Date());
    let that = this;
    const alert = await this.alertController.create({
      header: 'Enter task!',
      inputs: [
        {
          name: 'taskName',
          type: 'textarea',
          placeholder: 'Task name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.isAddingTask = false;
          },
        },
        {
          text: 'Add',
          handler: (taskData) => {
            let task = {};

            task['taskName'] = taskData.taskName;
            task['estimatedHours'] = 0;
            task['priority'] = 0;
            task['taskType'] = 0;
            task['employeeId'] = this.authService.userId;

            task['order'] = that.storyTasks.length;
            task['reporter'] = this.authService.userId;
            task['columnId'] = that.teamBoardColumns[0].columnId;
            task['epicId'] = this.selectedEpic.id.replace('epic', '');
            task['epicName'] = this.epicStories.filter(
              (e) => (e.epicId = task['epicId'])
            )[0]['epicName'];
            task['storyId'] = this.selectedStory.id;
            task['projectId'] = this.projectId;
            task['employeeId'] = this.authService.userId;
            task['employeeIdMiddleware'] = this.authService.userId;
            task['permissionName'] = 'Dashboard';

            if (task['taskName'] && task['estimatedHours'] >= 0) {
              this.projectService
                .createStoryTask(task)
                .then(
                  (resp: any) => {
                    task['taskId'] = resp.result.taskId;
                    task['projectTaskNumber'] = resp.result.projectTaskNumber;
                    that.storyTasks.unshift(task);
                    that.selectedStory.columnTasks[0].tasks.push(task);

                    // console.log('xhgfuyas', this.epicTasksList);
                    that.epicTasksList.push(task); /// since task is not getting reflected in list tab --- added by Parul
                    that.epicTasksList[that.epicTasksList.length - 1][
                      'epicName'
                    ] = that.selectedEpic.name;
                    that.epicTasksList[that.epicTasksList.length - 1][
                      'storyName'
                    ] = that.selectedStory.name;
                    that.epicTasksList[that.epicTasksList.length - 1][
                      'createdAt'
                    ] = new Date().toISOString();

                    that.epicTasksListOriginal.push(task);
                    that.epicTasksListOriginal[
                      that.epicTasksListOriginal.length - 1
                    ]['epicId'] = 'epic' + task['epicId'];
                    that.epicTasksListOriginal[
                      that.epicTasksListOriginal.length - 1
                    ]['epicName'] = that.selectedEpic.name;
                    that.epicTasksListOriginal[
                      that.epicTasksListOriginal.length - 1
                    ]['storyName'] = that.selectedStory.name;
                    that.epicTasksListOriginal[
                      that.epicTasksListOriginal.length - 1
                    ]['createdAt'] = new Date().toISOString();

                    // this.getAllReport();
                  },
                  (error) => {
                    this.commonService.showToast('error', error.error.msg);
                    if (error.error.statusCode == 401) {
                      localStorage.clear();
                      sessionStorage.clear();
                      this.router.navigateByUrl('/login');
                    }
                  }
                )
                .finally(() => {
                  this.isAddingTask = false;
                });
            } else {
              this.commonService.showToast('error', 'Please fill all fields');
              this.isAddingTask = false;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async viewTaskDetails(taskData, story) {
    let item = JSON.parse(JSON.stringify(taskData));
    // item = JSON.parse(JSON.stringify(taskData))
    const popover = await this.modalController.create({
      component: ProjectTaskDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        item,
        projectMembers: this.projectMembers,
        teamBoardColumns: this.teamBoardColumns,
        enableFields: this.enableFields,
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
      if (resp.data?.action == 'update') {
        if (item.assignee == null) {
          this.commonService.showToast(
            'warning',
            'Please assign task to someone'
          );
        } else if (
          (item.assignee != null && item.startDate == null) ||
          item.dueDate == null
        ) {
          this.commonService.showToast(
            'warning',
            'Planned Start Date and Planned End Date is mandatory'
          );
        } else {
          this.ngZone.run(() => {
            // console.log("this.stor",this.storyTasks)
            for (let j = 0; j < this.storyTasks.length; j++) {
              if (this.storyTasks[j].taskId == item.taskId) {
                this.storyTasks[j] = item;
              }
            }
            for (let i = 0; i < this.epicTasksList.length; i++) {
              if (this.epicTasksList[i].taskId == item.taskId) {
                this.epicTasksList[i] = item;
                this.epicTasksListOriginal[i] = item;
              }
            }
            // console.log(this.selectedStory.columnTasks)
            this.selectedStory.columnTasks.forEach((element: any, i) => {
              element.tasks.forEach((task: any) => {
                if (task.taskId == item.taskId) {
                  this.selectedStory.columnTasks[i].tasks.splice(task, 1);
                }
              });
            });
            for (let i = 0; i < this.selectedStory.columnTasks.length; i++) {
              if (this.selectedStory.columnTasks[i].columnId == item.columnId) {
                this.selectedStory.columnTasks[i].tasks.push(item);
              }
            }
          });

          // for(let i=0;i<this.projectEpics.length;i++)
          // {
          //   if(this.projectEpics[i].id == item.epicId)
          //   {
          //     for(let j=0;j<this.projectEpics[i].stories.length;j++)
          //     {
          //       if(this.projectEpics[i].stories[j].id == item.storyId)
          //       {
          //         this.projectEpics[i].stories[j].columnTasks.forEach((element: any, index) => {
          //           element.tasks.forEach((task: any) => {
          //             if (task.taskId == item.taskId) {
          //               this.projectEpics[i].stories[j].columnTasks[index].tasks.splice(this.projectEpics[i].stories[j].columnTasks[index].tasks.indexOf(task), 1);
          //             }
          //           });
          //           if (this.projectEpics[i].stories[j].columnTasks[index].columnId == item.columnId) {
          //             this.projectEpics[i].stories[j].columnTasks[index].tasks.push(item)
          //           }
          //         });
          //       }
          //     }
          //   }
          // }
          this.updateTask(item);
        }
      } else if (resp.data?.action != 'delete') {
        // this.updateTask(item);
      }
    });
  }

  async viewEpicDetails(epic) {
    const popover = await this.modalController.create({
      component: ProjectEpicDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        epic,
        projectMembers: this.projectMembers,
      },
      showBackdrop: true,
    });
    await popover.present();
    popover.onDidDismiss().then((resp) => {
      if (resp.data?.action == 'delete') {
        let index = this.projectEpics.indexOf(epic);
        this.projectEpics.splice(this.projectEpics.indexOf(epic), 1);
        this.epicStories = [];
        this.storyTasks = [];
        if (this.projectEpics.length - 1 == index - 1) {
          this.selectEpic(
            this.projectEpics[this.projectEpics.length - 1],
            this.projectEpics.length - 1
          );
        } else {
          this.selectEpic(
            this.projectEpics[this.projectEpics.length - 1],
            index
          );
        }
      } else {
        this.updateEpic(epic, resp.data.item);
      }
    });
  }

  async viewStoryDetails(story) {
    const popover = await this.modalController.create({
      component: ProjectStoryDetailsPage,
      cssClass: 'task-details',
      componentProps: {
        story,
        projectMembers: this.projectMembers,
      },
      showBackdrop: true,
    });
    await popover.present();
    popover.onDidDismiss().then((resp) => {
      if (resp.data?.action == 'delete') {
        let index = this.epicStories.indexOf(story);
        this.epicStories.splice(this.epicStories.indexOf(story), 1);
        this.epicStoriesArray = this.epicStories;
        this.selectedStory = [];
        this.storyTasks = [];
        this.epicTasksList.forEach((element) => {
          if (element.storyId == story.id) {
            this.epicTasksList.splice(this.epicTasksList.indexOf(story), 1);
            this.epicTasksListOriginal.splice(
              this.epicTasksListOriginal.indexOf(story),
              1
            );
          }
        });
        if (this.epicStories.length - 1 == index - 1) {
          this.selectStory(
            this.epicStories[this.epicStories.length - 1],
            this.epicStories.length - 1
          );
        } else {
          this.selectStory(
            this.epicStories[this.epicStories.length - 1],
            index
          );
        }
      } else {
        this.updateStory(story);
      }
    });
  }

  change_view_mode(mode) {
    this.gantt.change_view_mode(mode);
  }

  assignMember(event: any) {
    let name = event.target.value;
    this.projectMembers1 = name
      ? this.projectMembers.filter(
          (val: any) =>
            val.firstName.toLowerCase().includes(name) ||
            val.firstName.toUpperCase().includes(name) ||
            val.firstName.includes(name)
        )
      : this.projectMembers;
  }

  searchEmployee(ev) {
    if (ev.target.value.length > 0) {
      this.commonService.searchEmployees(ev.target.value).then(
        (resp) => {
          this.projectMembers = resp;
          let fieldData;
          for (let i = 0; i < this.projectMembers.length; i++) {
            fieldData = this.allUsers.filter(
              (res) => res.officialEmail == this.projectMembers[i].officialEmail
            )[0];
            if (fieldData && fieldData.type)
              this.projectMembers[i].type = fieldData.type;
            if (fieldData && fieldData.billable)
              this.projectMembers[i].billable = fieldData.billable;
            if (fieldData && fieldData.hoursAssign)
              this.projectMembers[i].hoursAssign = fieldData.hoursAssign;
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
    } else {
      this.projectMembers = this.allUsers;
    }
  }

  checkInTeam(user) {
    let employee = this.allUsers.filter((r) => r.employeeId == user.employeeId);
    if (employee.length > 0) return false;
    else return true;
  }

  addEmployeeTeam(user) {
    this.allUsers.push(user);
    if (this.projectId) {
      user.projectId = this.projectId;
      this.projectService.addProjectMember(user).then(
        (resp: any) => {
          user.id = resp.id;
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
  }

  removeProjectMember(user) {
    let index = this.allUsers.indexOf(user);
    this.allUsers.splice(index, 1);
    if (this.projectId) {
      user.projectId = this.projectId;
      this.projectService.removeProjectMember(user).then(
        (resp) => {},
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
  }

  selectRole(user) {
    let form = {
      memberId: user.id,
      type: user.type,
    };
    this.projectService.updateProjectMember(form).then(
      (resp) => {},
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

  selectBillable(user) {
    let form = {
      memberId: user.id,
      billable: user.billable,
    };
    this.projectService.updateProjectMember(form).then(
      (resp) => {},
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

  selectHours(user) {
    let form = {
      memberId: user.id,
      hoursAssign: user.hoursAssign,
    };
    this.projectService.updateProjectMember(form).then(
      (resp) => {},
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

  handleFileSelect(file: any) {
    this.files = file.target.files[0];
    this.uploadFile();
  }

  uploadFile(): void {
    if (this.files) {
      let ExcelSheetdata = new FormData();
      let files = this.files;
      let projectId = this.projectId;
      ExcelSheetdata.append('files', files);
      ExcelSheetdata.append('projectId', projectId);
      ExcelSheetdata.append('employeeId', this.userLogin.employeeId);
      ExcelSheetdata.append('organisationId', this.userLogin.organisationId);

      this.commonService.UploadDocs(ExcelSheetdata).then(
        (res) => {
          this.commonService.showToast('success', 'File Uploaded');
          this.getDocs();
        },
        (error: any) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
          }
        }
      );
    } else {
      this.commonService.showToast('error', 'Something went wrong');
    }
  }

  async deleteDocs(id) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to delete this docs.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.commonService.deleteDocs({ documentId: id }).then(
              (res: any) => {
                if (res.code == 1) {
                  this.commonService.showToast('success', 'res.msg');
                  this.getDocs();
                } else {
                  this.commonService.showToast('error', res.msg);
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
          },
        },
      ],
    });

    await alert.present();
  }

  getDocs() {
    this.commonService.presentLoading();
    this.commonService.getAllDocs({ projectId: this.projectId }).then(
      (res: any) => {
        this.allDocs = res.files;

        this.responseLength = res.length;
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

  async addNote() {
    const popover = await this.modalController.create({
      component: AddNotePage,
      cssClass: 'notes-modal',
      showBackdrop: true,
      componentProps: { projectId: this.projectId },
    });
    await popover.present();
    popover.onDidDismiss().then((resp) => {
      this.getNotes();
    });
  }

  getNotes() {
    this.commonService.getAllNotes({ projectId: this.projectId }).then(
      (res: any) => {
        this.allNotes = res;
        this.responseLength = res.length;
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

  async editNote(data) {
    const popover = await this.modalController.create({
      component: AddNotePage,
      cssClass: 'dsr-preview-modal',
      showBackdrop: true,
      componentProps: { DATA: data },
    });
    await popover.present();
    popover.onDidDismiss().then((resp) => {
      this.getNotes();
    });
  }

  openDocument(document) {
    let restOfUrl = document.path.substring(
      document.path.indexOf('hrportalserver') + 'hrportalserver'.length
    );
    // console.log(restOfUrl);
    let url = this.authService.apiUrl + restOfUrl;
    window.open(url, '_blank');
  }

  assignTaskNumbers() {
    this.epicTasksListOriginal.forEach((task, index) => {
      task['projectTaskNumber'] = index + 1;
      this.updateTask(task);
    });
  }

  gotoCreateSprint() {
    this.sprintSegment = 'new';
    this.segment = 'sprints';
  }

  getStoryProgress(story) {
    let storyTasks = story.tasks;
    if (storyTasks) {
      let doneTasks = storyTasks.filter((t) => t.status == 1);
      if (storyTasks == 0) story['progress'] = 0;
      else story['progress'] = doneTasks.length / storyTasks.length;

      return story['progress'];
    }
  }

  getEpicProgress(epic) {
    let epicTasks = this.epicTasksListOriginal.filter(
      (e) => e.epicId == epic.id
    );
    let epicTasksDone = epicTasks.filter((e) => e.status == 1);

    if (epicTasks == 0) epic['progress'] = 0;
    else epic['progress'] = epicTasksDone.length / epicTasks.length;

    return epic['progress'];
  }

  async deleteNote(id) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to delete this note.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.commonService.deleteNote({ id: id }).then((res: any) => {
              if (res) {
                this.getNotes();
              }
            });
          },
        },
      ],
    });

    await alert.present();
  }

  // getAllReport() {
  //   this.projectService
  //     .getAllProjectReport({ projectId: this.projectId })
  //     .then((resp: any) => {
  //       this.allReportResponse = resp;
  //       let employeeName = [],
  //         employeePlannedHour = [],
  //         employeeActualHour = [];
  //       let toDo = [],
  //         inProgress = [],
  //         done = [],
  //         hold = [],
  //         testing = [];
  //       let filteredColumn1 = this.teamBoardColumns.filter(
  //         (c) => c.columnName == 'To Do'
  //       );
  //       let filteredColumn2 = this.teamBoardColumns.filter(
  //         (c) => c.columnName == 'In Progress'
  //       );
  //       let filteredColumn3 = this.teamBoardColumns.filter(
  //         (c) => c.columnName == 'Unit Testing'
  //       );
  //       let filteredColumn4 = this.teamBoardColumns.filter(
  //         (c) => c.columnName == 'Done'
  //       );
  //       let filteredColumn5 = this.teamBoardColumns.filter(
  //         (c) => c.columnName == 'Hold'
  //       );
  //       this.projectMembers1.forEach((ele) => {
  //         let toDoList = [],
  //           inProgressList = [],
  //           doneList = [],
  //           holdList = [],
  //           testingList = [];
  //         this.allReportResponse.forEach((element) => {
  //           if (element.employeeId == ele.employeeId) {
  //             employeeActualHour.push(element.actualHours);
  //             employeePlannedHour.push(element.plannedhours);
  //             employeeName.push(ele.firstName);

  //             toDoList = element.Tasks.filter(
  //               (task) => task.columnId == filteredColumn1[0].columnId
  //             );
  //             inProgressList = element.Tasks.filter(
  //               (task) => task.columnId == filteredColumn2[0].columnId
  //             );
  //             testingList = element.Tasks.filter(
  //               (task) => task.columnId == filteredColumn3[0].columnId
  //             );
  //             doneList = element.Tasks.filter(
  //               (task) => task.columnId == filteredColumn4[0].columnId
  //             );
  //             holdList = element.Tasks.filter(
  //               (task) => task.columnId == filteredColumn5[0].columnId
  //             );
  //           }
  //         });
  //         toDo.push(toDoList.length);
  //         inProgress.push(inProgressList.length);
  //         done.push(doneList.length);
  //         hold.push(holdList.length);
  //         testing.push(testingList.length);
  //       });
  //       // this.displayHoursChart(
  //       //   employeeName,
  //       //   employeeActualHour,
  //       //   employeePlannedHour
  //       // );
  //       // this.displayBarChart(
  //       //   employeeName,
  //       //   toDo,
  //       //   inProgress,
  //       //   done,
  //       //   hold,
  //       //   testing
  //       // );
  //     });
  // }
  // getTaskChart(taskList) {
  //   let filteredColumn1 = this.teamBoardColumns.filter(
  //     (c) => c.columnName == 'To Do'
  //   );
  //   let filteredColumn2 = this.teamBoardColumns.filter(
  //     (c) => c.columnName == 'In Progress'
  //   );
  //   let filteredColumn3 = this.teamBoardColumns.filter(
  //     (c) => c.columnName == 'Unit Testing'
  //   );
  //   let filteredColumn4 = this.teamBoardColumns.filter(
  //     (c) => c.columnName == 'Done'
  //   );
  //   let filteredColumn5 = this.teamBoardColumns.filter(
  //     (c) => c.columnName == 'Hold'
  //   );
  //   let columnData = [];
  //   if (filteredColumn1.length > 0) {
  //     this.filteredToDo = taskList.filter(
  //       (task) => task.columnId == filteredColumn1[0].columnId
  //     );
  //     columnData.push({ value: this.filteredToDo.length, name: 'To Do' });
  //   }
  //   if (filteredColumn2.length > 0) {
  //     this.filteredInProgress = taskList.filter(
  //       (task) => task.columnId == filteredColumn2[0].columnId
  //     );
  //     columnData.push({
  //       value: this.filteredInProgress.length,
  //       name: 'In Progress',
  //     });
  //   }
  //   if (filteredColumn3.length > 0) {
  //     this.filteredTesting = taskList.filter(
  //       (task) => task.columnId == filteredColumn3[0].columnId
  //     );
  //     columnData.push({
  //       value: this.filteredTesting.length,
  //       name: 'Unit Testing',
  //     });
  //   }
  //   if (filteredColumn4.length > 0) {
  //     this.filteredDone = taskList.filter(
  //       (task) => task.columnId == filteredColumn4[0].columnId
  //     );
  //     columnData.push({ value: this.filteredDone.length, name: 'Done' });
  //   }
  //   if (filteredColumn5.length > 0) {
  //     this.filteredHold = taskList.filter(
  //       (task) => task.columnId == filteredColumn5[0].columnId
  //     );
  //     columnData.push({ value: this.filteredHold.length, name: 'Hold' });
  //   } else {
  //     return 0;
  //   }
  //   // this.displayChart(columnData);
  // }

  // api call to display all project health data along with todays created data and completed data

  getprojectChartData() {
    let payload = {
      projectId: this.projectId,
      permissionName: 'Dashboard',
      employeeIdMiddleware: '344',
      organisationId: 1,
    };
    this.commonService.getChartData(payload).then(
      (res: any) => {
        // console.log("chart task dataa is",res)
        this.displayChart(res.data);
        this.displayTodayChart(res.todayData);
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
      }
    );
  }

  displayChart(data) {
    // console.log("chart data",data)
    this.chartOption = {
      title: {
        text: 'Project Health',
        left: 'center',
        textStyle: {
          color: '#747474',
        },
        padding: [0, 0, 50, 0],
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          color: '#747474',
        },
      },
      series: [
        {
          name: this.projectName,
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          data: data,
          color: ['#e74c3c', '#f1c40f', '#3498db', '#27ae60', '#B1907F'],
          tooltip: {
            backgroundColor: '#747474',
            textStyle: {
              color: '#fff',
            },
          },
        },
      ],
    };
  }
  // onChartInit(data) {
  //   let status;
  //   data.on('click', (params) => {
  //     status = params.data.name;
  //     if (status == 'To Do') {
  //       this.previewProjectList(this.filteredToDo, 'To Do');
  //     } else if (status == 'In Progress') {
  //       this.previewProjectList(this.filteredInProgress, 'In Progress');
  //     } else if (status == 'Unit Testing') {
  //       this.previewProjectList(this.filteredTesting, 'Unit Testing');
  //     } else if (status == 'Done') {
  //       this.previewProjectList(this.filteredDone, 'Done');
  //     } else if (status == 'Hold') {
  //       this.previewProjectList(this.filteredHold, 'Hold');
  //     } else if (status == "Today's Complete Task") {
  //       this.previewProjectList(
  //         this.tasksCompletedToday,
  //         "Today's Complete Task"
  //       );
  //     } else if (status == "Today's Created Task") {
  //       this.previewProjectList(
  //         this.taskCreatedfiltered,
  //         "Today's Created Task"
  //       );
  //     }
  //   });
  // }
  previewProjectList(data, name) {
    localStorage.setItem('listName', name);
    localStorage.setItem('projectTaskList', JSON.stringify(data));
    localStorage.setItem(
      'teamBoardColumn',
      JSON.stringify(this.teamBoardColumns)
    );
    localStorage.setItem('projectMember', JSON.stringify(this.projectMembers));
    this.router.navigateByUrl('/project-chart-list');
  }
  // getTodayTask(taskList) {
  //   let columnData = [];
  //   let date = this.commonService.formatDate(new Date());
  //   let filtered = taskList.filter(
  //     (task) =>
  //       this.commonService.formatDate(task.completionDate) == date &&
  //       task.status == 1
  //   );
  //   this.tasksCompletedToday = filtered;
  //   columnData.push({
  //     value: this.tasksCompletedToday.length,
  //     name: "Today's Complete Task",
  //   });

  //   let date1 = this.commonService.formatDate(new Date());
  //   this.taskCreatedfiltered = taskList.filter(
  //     (task) => this.commonService.formatDate(task.createdAt) == date1
  //   );
  //   columnData.push({
  //     value: this.taskCreatedfiltered.length,
  //     name: "Today's Created Task",
  //   });

  //   // this.displayTodayChart(columnData);
  // }
  displayTodayChart(data) {
    // console.log(data)
    this.chartOptionToday = {
      title: {
        text: "Today's Update",
        left: 'center',
        textStyle: {
          color: '#747474',
        },
        padding: [0, 0, 50, 0],
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          color: '#747474',
        },
      },
      series: [
        {
          name: this.projectName,
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          data: data,
          color: ['#2ecc71', '#ccc'],
          tooltip: {
            backgroundColor: '#747474',
            textStyle: {
              color: '#fff',
            },
          },
        },
      ],
    };
  }
  getTaskHours(taskList) {
    // console.log(taskList)
    let employeeName = [],
      employeePlannedHour = [],
      employeeActualHour = [];

    this.projectMembers1.forEach((ele) => {
      let phours = 0,
        ahours = 0;
      taskList.forEach((element) => {
        if (ele.employeeId === element.assignee) {
          phours += element.estimatedHours;
          ahours += element.actualHours;
        }
        if (ele.employeeId === element.tester) {
          phours += element.testingEstimatedHours;
          ahours += element.testingActualHours;
        }
      });
      if (ahours === 0 && phours === 0) {
      } else {
        employeeActualHour.push(ahours);
        employeePlannedHour.push(phours);
        employeeName.push(ele.firstName);
      }
    });
    // this.displayHoursChart(
    //   employeeName,
    //   employeeActualHour,
    //   employeePlannedHour
    // );
  }

  // api call to display hours project member wise
  getChartHours() {
    let payload = {
      projectId: this.projectId,
      permissionName: 'Dashboard',
      employeeIdMiddleware: '344',
      organisationId: 1,
    };
    this.commonService.getHourChartData(payload).then(
      (res: any) => {
        // console.log("chart task dataa is",res)
        this.displayHoursChart(
          res.memberNames,
          res.actualHours,
          res.estimatedHours
        );

        // this.docsList = res.documents;
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
      }
    );
  }
  displayHoursChart(name, actual, planned) {
    // console.log(name,actual,planned)
    this.chartOptionHours = {
      title: {
        text: 'Effort by Hours Report',
        left: 'center',
        textStyle: {
          color: '#747474',
        },
        padding: [0, 0, 50, 0],
      },
      tooltip: {
        backgroundColor: '#747474',
        textStyle: {
          color: '#fff',
        },
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        valueFormatter: (value) => value.toFixed(2),
      },
      legend: {
        data: ['Planned Hours', 'Actual Hours'],
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
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: name,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Planned Hours',
          type: 'line',
          data: planned,
          color: 'red',
        },
        {
          name: 'Actual Hours',
          type: 'line',
          data: actual,
          color: 'green',
        },
      ],
    };
  }
  filterEffortDate(event) {
    if (this.sDateEffort > this.eDateEffort) {
      this.commonService.showToast(
        'error',
        'End date should be greater than Start date.'
      );
      this.eDateEffort = this.sDateEffort;
    } else {
      // if (this.sDateEffort && this.eDateEffort) {
      //   this.filteredEffortsDate = this.epicTasksListOriginal.filter(
      //     (e) =>
      //       e.startDate >= this.sDateEffort && e.dueDate <= this.eDateEffort
      //   );
      // } else {
      //   this.filteredEffortsDate = this.epicTasksListOriginal;
      // }
      let payload = {
        projectId: this.projectId,
        permissionName: 'Dashboard',
        employeeIdMiddleware: '344',
        organisationId: 1,
        startDate: this.sDateEffort,
        endDate: this.eDateEffort,
      };

      this.commonService.getHourChartData(payload).then(
        (res: any) => {
          this.displayHoursChart(
            res.memberNames,
            res.actualHours,
            res.estimatedHours
          );

          // this.docsList = res.documents;
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
        }
      );
    }
    this.getTaskHours(this.filteredEffortsDate);
  }

  // api call to display bar chart for particular employee with list of todo ,inprogress done etc tasks.
  getBarChartData() {
    let payload = {
      projectId: this.projectId,
      permissionName: 'Dashboard',
      employeeIdMiddleware: '344',
      organisationId: 1,
    };
    this.commonService.getBarData(payload).then(
      (res: any) => {
        this.displayBarChart(
          res.employeeNames,
          res.taskCounts['To Do'],
          res.taskCounts['In Progress'],
          res.taskCounts['Done'],
          res.taskCounts['Hold'],
          res.taskCounts['Unit Testing']
        );

        // this.docsList = res.documents;
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
      }
    );
  }

  displayBarChart(name, toDo, inProgress, done, hold, testing) {
    this.chartOptionUser = {
      title: {
        text: "Effort by User's Report(in task)",
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
        data: name,
      },
      series: [
        {
          name: 'To Do',
          type: 'bar',
          stack: 'total',
          data: toDo,
        },
        {
          name: 'In Progress',
          type: 'bar',
          stack: 'total',
          data: inProgress,
        },
        {
          name: 'Done',
          type: 'bar',
          stack: 'total',
          data: done,
        },
        {
          name: 'Hold',
          type: 'bar',
          stack: 'total',
          data: hold,
        },
        {
          name: 'Unit Testing',
          type: 'bar',
          stack: 'total',
          data: testing,
        },
      ],
      color: ['#e74c3c', '#f1c40f', '#27ae60', '#B1907F', '#3498db'],
    };
  }

  filterChanged(ev) {
    this.filterr = [];
    this.columnSelect = ev;
    if (ev == 'epic') {
      this.projectEpics.forEach((element) => {
        this.filterr.push({
          label: element.name,
          type: 'checkbox',
          value: element.id,
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
    } else if (ev == 'createdBy') {
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
    } else if (ev == 'completionDate') {
      this.isModalOpen = true;
    } else if (ev == 'story') {
      this.stories.forEach((element) => {
        this.filterr.push({
          label: element.name,
          type: 'checkbox',
          value: element.id,
        });
      });
    }
     else if (ev == 'priority') {
      this.priority.forEach((element) => {
        this.filterr.push({
          label: element.name,
          type: 'checkbox',
          value: element.id,
        });
      });
    }
    if (ev != 'completionDate') this.presentAlertPrompt(this.filterr);
  }

  setOpen(ev) {
    this.isModalOpen = ev;
  }
  async presentAlertPrompt(filter) {
    const alert = await this.alertController.create({
      inputs: filter,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
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
            } else if (this.columnSelect == 'createdBy') {
              this.selectCreatedBy(data);
            }
             else if (this.columnSelect == 'priority') {
              this.selectPriority(data);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  resetList() {
    this.selectedEpicId = 'all';
    this.selectedColumns = 'all';
    this.selectedDate = '';
    this.selectedTaskType = 'all';
    this.selectedTester = 'all';
    this.selectedMembers = [];
    this.selectedStoryList = 'all';
    this.selectedAssignee = 'all';
    this.selectedCreatedBy = 'all';
    this.selectedPriority = 'all';
    this.projectMembers.forEach((element) => {
      if (element.selected) {
        element.selected = false;
      }
    });
    this.filterEpicTasks();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  viewFile(file) {
    window.open(this.authService.apiUrl + 'images/documents/' + file, '_blank');
  }
}
