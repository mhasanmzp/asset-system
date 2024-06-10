import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-ats',
  templateUrl: './ats.page.html',
  styleUrls: ['./ats.page.scss'],
})
export class AtsPage implements OnInit {
  allCVresponse: any;
  searchData: any;
  sCtc: any;
  eCtc: any;
  response: any;

  constructor(public modalController: ModalController, private authService: AuthService, private commonService: CommonService,
    private router:Router,private alertController: AlertController,) { }

  ngOnInit() {
    this.getAllCV();
  }

  

  getAllCV() {
    this.authService.userLogin.subscribe((resp: any) => {
      this.commonService.getCVPool({ organisationId: resp.organisationId }).then((res: any) => {
        this.allCVresponse = res;
        this.response = res;
      })
    });
  }

  displayCV(data) {
    let url = this.authService.apiUrl + 'resume/' + data.filename
    window.open(url, '_blank');
  }

  async deleteCV(id) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to delete this CV.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.commonService.deleteCVPool({ 'id': id }).then((res: any) => {
              if (res.msg) {
                this.commonService.showToast('success', res.msg);
                this.getAllCV();
              }else{
                this.commonService.showToast("error","Something went wrong.")
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }

  updateCV(data) {
  }

  searchCV() {
    if(this.searchData || this.sCtc || this.eCtc){
      let form = {
        search: this.searchData,
        sCtc: this.sCtc,
        eCtc: this.eCtc
      }
      this.commonService.searchCV(form).then((res:any) => {
        this.allCVresponse = res
      })
    }else{
      this.allCVresponse = this.response
    }
  }

  viewCV(data){

  }
}
