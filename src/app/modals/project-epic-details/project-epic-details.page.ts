import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ProjectService } from 'src/app/services/project.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-epic-details',
  templateUrl: './project-epic-details.page.html',
  styleUrls: ['./project-epic-details.page.scss'],
})
export class ProjectEpicDetailsPage implements OnInit {
  @Input() epic: any;
  @Input() projectMembers: any;
  showField: boolean = false;
  selectedUsers: any[] = [];

  constructor(
    private alertController: AlertController,
    private router: Router,
    public modalController: ModalController,
    private projectService: ProjectService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    console.log(this.epic);
    console.log(this.projectMembers);
    let userId = localStorage.getItem('userId');

    this.projectMembers.forEach((element: any) => {
      // debugger;
      if (element.type == 'Manager' && element.employeeId == userId) {
        this.showField = true;
      }
      this.epic.epicManagerName = '';

      // this.epic.epicManager.forEach((element1,index) => {
      //   debugger;
      //   let member = this.projectMembers.filter(el=>el.employeeId == element1)[0]
      //   if(index == (this.epic.epicManager.length - 1))
      //   {
      //     this.epic.epicManagerName = this.epic.epicManagerName + member.firstName
      //   }
      //   else if(index<(this.epic.epicManager.length - 1))
      //   {
      //     this.epic.epicManagerName = this.epic.epicManagerName + member.firstName + ', '
      //   }
      // });

      this.epic.epicManagerName = this.epic.epicManager
        .map((element1) => {
          let member = this.projectMembers.find(
            (el) => el.employeeId === element1
          );
          return member ? member.firstName : '';
        })
        .filter((name) => name) // Remove any empty strings if member was not found
        .join(', ');
    });
  }

  async deleteEpic() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader:
        'You want to delete this epic. All stories and tasks inside this epic will be deleted as well.',
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
            this.projectService.deleteProjectEpics({ id: this.epic.id }).then(
              (res: any) => {
                if (res.status == true) {
                  this.modalController.dismiss({
                    item: this.epic.id,
                    action: 'delete',
                  });
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

  taskNameUpdated(event: any) {}

  close() {
    if (this.selectedUsers.length > 0) {
      this.modalController.dismiss({ item: this.selectedUsers });
    } else {
      this.modalController.dismiss({ item: this.epic.epicManager });
    }
  }

  getAssigneeDetails(epic, data) {
    let user = this.projectMembers.filter((e) => e.employeeId == epic.assignee);
    if (user.length > 0) return user[0][data] || '';
    else return '';
  }

  getReporterDetails(epic, data) {
    let user = this.projectMembers.filter((e) => e.employeeId == epic.reporter);
    if (user.length > 0) return user[0][data] || '';
    else return '';
  }
}
