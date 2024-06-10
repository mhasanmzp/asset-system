import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-project-type-list',
  templateUrl: './project-type-list.page.html',
  styleUrls: ['./project-type-list.page.scss'],
})
export class ProjectTypeListPage implements OnInit {
  @Input() projectName:any;
  @Input() projectList:any;
  
  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.projectList.forEach(element => {
      element.estHours = element.estHours ? (element.estHours).toFixed(2): 0;
      element.actHurs = element.actHurs ? (element.actHurs).toFixed(2) : 0
    });
  }

  close(){
    this.modalController.dismiss();
  }
}
