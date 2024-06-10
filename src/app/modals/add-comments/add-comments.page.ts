import { Component, OnInit ,Input} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup,FormControl} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ProjectService } from 'src/app/services/project.service';
@Component({
  selector: 'app-add-comments',
  templateUrl: './add-comments.page.html',
  styleUrls: ['./add-comments.page.scss'],
})
export class AddCommentsPage implements OnInit {
  @Input() item: any;
  newComment: any;
  organisationId:any=this.authService.organisationId;
  taskCommentsArr:any=[];
  constructor(private ModalController:ModalController,
    private formBuilder: FormBuilder,
     private authService:AuthService,
    private commonService:CommonService,
    private projectService:ProjectService
     ) { 
  }
  comment:any;
  ngOnInit() {
    console.log("item data is ",this.item)
    console.log("organisationId  is ",this.organisationId)
    this.getMoreData();

  }
  closeModal(obj) {
    if(obj!=null)
    this.ModalController.dismiss(obj);
    else
    this.ModalController.dismiss();
  }
  
  getMoreData() {
    let formData={
      "organisationId":this.organisationId,
      "taskId": this.item.taskId
    }
    this.commonService.presentLoading1();
    this.projectService.getUserComments(formData).then(
      (resp: any) => {
        this.commonService.loadingDismiss1();
        this.taskCommentsArr=resp;
        console.log("allProjectsEpic data is ",resp)
      },
      (error) => {
        this.commonService.loadingDismiss1();
        this.commonService.showToast('error', error.error.msg);
      }
    );
  }

  update(){
    if(this.newComment!=null || this.newComment!='')
    {
      let formData={
        "organisationId":this.organisationId,
        "taskId": this.item.taskId,
        "employeeId":this.authService.userId,
        "taskComment":this.newComment,
        "createdAt":new Date()
      }
      this.commonService.presentLoading1();
      this.projectService.updateUserComments(formData).then(
        (resp: any) => {
          this.commonService.loadingDismiss1();
          this.closeModal({taskComment: resp.taskComment});
        },
        (error) => {
          this.commonService.loadingDismiss1();
          this.commonService.showToast('error', error.error.msg);
        }
      );
    }
    else{
      this.commonService.showToast('error',"Please enter comments")
    }
  }
}
