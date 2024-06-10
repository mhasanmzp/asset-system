import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ProjectService } from 'src/app/services/project.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-story-details',
  templateUrl: './project-story-details.page.html',
  styleUrls: ['./project-story-details.page.scss'],
})
export class ProjectStoryDetailsPage implements OnInit {
  @Input() story: any;
  @Input() projectMembers: any;
  showField: boolean = false;

  constructor(
    public modalController: ModalController, private projectService: ProjectService, private alertController: AlertController,
    private commonService: CommonService, private router: Router
  ) { }

  ngOnInit() {
    console.log(this.story)
    console.log(this.projectMembers);
    let userId = localStorage.getItem('userId');

    this.projectMembers.forEach(element => {
      if (element.type == 'Manager' && element.employeeId == userId) {
        console.log("Manager")
        this.showField = true
      }
    });
  }

  async deleteStory() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to delete this story. All task inside this story will be deleted as well.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.projectService.deleteEpicStory({ 'id': this.story.id }).then((res: any) => {
              if (res.status == true) {
                this.modalController.dismiss({ item: this.story.id, action: 'delete' });
              }
            }, error => {
              this.commonService.showToast('error', error.error.msg);
              if (error.error.statusCode == 401) {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigateByUrl('/login')
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }

  close() {
    this.modalController.dismiss();
  }

  getAssigneeDetails(story, data) {
    let user = this.projectMembers.filter(e => e.employeeId == story.assignee);
    if (user.length > 0)
      return user[0][data] || ''
    else
      return ''
  }

  getReporterDetails(story, data) {
    let user = this.projectMembers.filter(e => e.employeeId == story.reporter);
    if (user.length > 0)
      return user[0][data] || ''
    else
      return ''
  }

}
