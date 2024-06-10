import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  employeeId: any;
  notification: any = [];
  notificationItems: any = [];

  constructor(
    public commonService: CommonService,
    public modalCtrl: ModalController, private router: Router
  ) { }

  ngOnInit() {
    this.getNotification();
  }

  getNotification() {
    this.commonService.presentLoading();
    this.commonService.getNotifications({ employeeId: this.employeeId }).then((res: any) => {
      this.notificationItems = res.count;
      console.log("Total Notifications", this.notificationItems)
      this.commonService.loadingDismiss();
      console.log("notifications", res);
      this.notification = res.resp;
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
