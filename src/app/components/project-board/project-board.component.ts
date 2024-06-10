import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { ProjectTaskDetailsPage } from '../../modals/project-task-details/project-task-details.page';
import { ProjectSprintDetailsPage } from '../../modals/project-sprint-details/project-sprint-details.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.scss'],
})
export class ProjectBoardComponent implements OnInit {
  @Input() epicTasksListOriginal = [];
  @Input() projectMembers = [];
  @Input() teamBoardColumns: any = [];
  @Input() storyTasks = [];
  @Input() sprintStories = [];
  @Input() projectId: any;
  @Input() epicTasksList = [];
  @Input() epicStories = [];
  @Input() selectedStory: any = {};
  @Input() selectedTasks: any = {};
  @Input() sprintSegment: any;
  @Input() selectedSprint: any;

  projectMembers1: any = [];
  activeSprints: any = [];
  projectColumns: any = [];

  constructor(
    public commonService: CommonService,
    public authService: AuthService,
    public projectService: ProjectService,
    public modalController: ModalController, private router: Router
  ) { }

  ngOnInit() {
    this.projectService.getActiveSprints(this.projectId).then(data => {
      this.activeSprints = data;
      this.getSprints();
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  getSprints() {
    let activeSptint = this.activeSprints.filter(s => s.sprintId == this.selectedSprint)[0]
    let tasks = this.getTasks(activeSptint)
    tasks.forEach(t => {
      t.columnId = parseInt(t.columnId);
    })

    let groupStories = _.groupBy(tasks, 'storyName')
    let stories = Object.keys(groupStories);
    let sprintStories = [];
    stories.forEach(story => {

      let columns = JSON.parse(JSON.stringify(this.teamBoardColumns))
      columns.forEach(column => {
        column['tasks'] = tasks.filter(t => t.columnId == column.columnId && t.storyName == story);
      })

      sprintStories.push({
        name: story,
        columnTasks: columns,
        tasks: tasks.filter(t => t.storyName == story)
      });
    })

    this.sprintStories = sprintStories;
   

  }

  getTasks(sprint) {
    let filteredTasks = this.epicTasksListOriginal.filter(t => {
      return sprint['tasks'].indexOf(t.taskId) > -1
    })
    return filteredTasks;
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
      }
      else {
        this.updateTask(item);
      }
    })
  }
  assignTaskOverlay(item, i) {
    item.isOpen = !item.isOpen
    item.index = i;
  }

  assignTask(item, user) {
    item.assignee = user.employeeId;
    item.firstName = user.firstName;
    item.lastName = user.lastName;
    item.image = user.image;
    item.isOpen = !item.isOpen
    this.updateTask(item);
  }

  getAssigneeDetails(item, data) {
    if (item) {
      let user = this.projectMembers.filter(e => e.employeeId == item.assignee);
      if (user.length > 0)
        return user[0][data] || ''
      else
        return ''
    } else {
      return ''
    }
  }

  assignMember(event: any) {
    let name = event.target.value;
    this.projectMembers1 = name ? this.projectMembers.filter((val: any) => (val.firstName.toLowerCase().includes(name) || val.firstName.toUpperCase().includes(name) || val.firstName.includes(name))) : this.projectMembers;
  }

  updateTask(task) {
    this.getSprints();
    this.projectService.updateProjectTask(task).then((resp: any) => {

    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

}
