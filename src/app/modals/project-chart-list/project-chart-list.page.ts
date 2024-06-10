import { DatePipe, JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-chart-list',
  templateUrl: './project-chart-list.page.html',
  styleUrls: ['./project-chart-list.page.scss'],
})
export class ProjectChartListPage implements OnInit {
  @Input() sprint: any;
  @Input() projectMember: any;
  @Input() taskList: any;
  @Input() teamBoardColumn: any;
  @Input() flag: any;

  projectList: any;
  projectListOriginal: any;
  teamBoardColumns: any;
  projectMembers: any;
  id: any;
  listName: any;
  displayEpic: boolean = false;
  epicList: any = [];
  selectedMembers: any = [];
  selectedEpicId: any = 'all';
  taskType: any = [
    { id: 0, name: 'Feature' },
    { id: 1, name: 'Bug' },
  ];
  selectedDate: any;
  selectedTaskType: any = 'all';
  selectedTester: any = 'all';
  checkbox: any;
  estimatedHours: any;
  sprintTask: any = [];
  selectedTask: any = [];

  constructor(
    public modalController: ModalController,
    private authService: AuthService,
    private projectService: ProjectService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.flag == 'addTask') {
      this.projectListOriginal = this.taskList;
      this.projectList = this.taskList;
      this.teamBoardColumns = this.teamBoardColumn;
      this.projectMembers = this.projectMember;
      this.sprintTask = JSON.parse(JSON.stringify(this.sprint.tasks));
      this.sprintTask.forEach((element) => {
        this.projectList.forEach((ele) => {
          if (element === ele.taskId) {
            ele.checkedForSprint = true;
          }
        });
      });
    } else {
      this.projectList = JSON.parse(localStorage.getItem('projectTaskList'));
      this.projectListOriginal = JSON.parse(
        localStorage.getItem('projectTaskList')
      );
      this.teamBoardColumns = JSON.parse(
        localStorage.getItem('teamBoardColumn')
      );
      this.projectMembers = JSON.parse(localStorage.getItem('projectMember'));
      this.listName = localStorage.getItem('listName');
    }

    this.id = this.teamBoardColumns[0]?.projectId;
    let epic = [],
      epicId = [],
      epicList = [];
    if (this.projectList) {
    
      this.projectList.forEach((element) => {
        epic.push(element.epicName);
        epicId.push(element.epicId);
      });
      for (let i = 0; i < epic.length; i++) {
        if (epicList.indexOf(epic[i]) === -1) {
          epicList.push(epic[i]);
          this.epicList.push({ name: epic[i], id: epicId[i] });
        }
      }
    }
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

  close() {
    this.modalController.dismiss();
  }

  downloadExcel() {
    let url =
      this.authService.apiUrl + 'downloadProjectExcel?projectId=' + this.id;
    window.location.assign(url);
  }

  selectMemberTasks(member) {
    member.selected = !member.selected;
    let selectedMembers = this.projectMembers.filter((m) => m.selected == true);
    let members = [];
    selectedMembers.forEach((m) => {
      members.push(m.employeeId);
    });
    this.selectedMembers = members;
    this.filteredTask();
  }
  selectEpicTasks(event) {
    this.selectedEpicId = event.target.value;
    this.filteredTask();
  }
  dateFilter(event) {
    this.selectedDate = event.target.value;
    this.filteredTask();
  }
  selectType(event) {
    this.selectedTaskType = event.target.value;
    this.filteredTask();
  }
  selectTester(event) {
    this.selectedTester = event.target.value;
    this.filteredTask();
  }

  filteredTask() {
    this.projectList = this.projectListOriginal;

    if (this.selectedMembers.length > 0) {
      this.projectList = this.projectListOriginal.filter(
        (e) => this.selectedMembers.indexOf(e.assignee) > -1
      );
    }
    if (this.selectedEpicId != 'all') {
      this.projectList = this.projectList.filter(
        (e) => e.epicId == this.selectedEpicId
      );
    }
    if (this.selectedDate) {
      this.projectList = this.projectList.filter(
        (e) =>
          new DatePipe('en-US').transform(e.completionDate, 'yyyy-MM-dd') ==
          this.selectedDate
      );
    }
    if (this.selectedTaskType != 'all') {
      this.projectList = this.projectList.filter(
        (e) => e.taskType == this.selectedTaskType
      );
    }
    if (this.selectedTester != 'all') {
      this.projectList = this.projectList.filter(
        (e) => e.tester == this.selectedTester
      );
    }
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
    this.addSprintTask();
  }

  addSprintTask() {
    let taskId = [];
    taskId = JSON.parse(JSON.stringify(this.sprint.tasks));
    let tasks = this.projectListOriginal.filter(
      (e) => e['checkedForSprint'] == true
    );

    tasks.forEach((element) => {
      taskId.push(element.taskId);
    });
    this.selectedTask = taskId;
  }

  updateSprint() {
    let arr = this.selectedTask.filter(function (value, index, array) { 
      return array.indexOf(value) === index;
    })

    // console.log('********',arr,this.sprintTask)
    let form = {
      sprintId: this.sprint.sprintId,
      tasks: arr.length > 0 ? arr : this.sprintTask,
    };
    // console.log('update sprint',form)
    this.projectService.updateSprint(form).then((resp:any)=>{
      if(resp){
        this.close();
      }
    },error=>{
      this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
    })
  }
}
