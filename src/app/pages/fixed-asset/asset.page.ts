import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

@Component({
  selector: 'app-asset',
  templateUrl: './asset.page.html',
  styleUrls: ['./asset.page.scss'],
})
export class AssetPage implements OnInit {
  isModalOpen = false;

  data = {
    masterData: '',
  };

  categoryInputs: string[] = [''];
  engineerInputs: string[] = [''];
  modelInputs: string[] = [''];
  oemInputs: string[] = [''];
  projectInputs: string[] = [''];
  siteInputs: string[] = [''];
  storeInputs: string[] = [''];

  constructor(
    private toastController: ToastController,
    private dataService: DataService
  ) { }

  ngOnInit() { }

  openAddDataModal() {
    this.isModalOpen = true;
    this.data.masterData = 'Category';  // Set default segment to "Category"
  }

  closeAddDataModal() {
    this.isModalOpen = false;
  }

  addCategoryInput() {
    this.categoryInputs.push('');
  }

  removeCategoryInput(index: number) {
    this.categoryInputs.splice(index, 1);
  }

  addEngineerInput() {
    this.engineerInputs.push('');
  }

  removeEngineerInput(index: number) {
    this.engineerInputs.splice(index, 1);
  }

  addModelInput() {
    this.modelInputs.push('');
  }

  removeModelInput(index: number) {
    this.modelInputs.splice(index, 1);
  }

  addOEMInput() {
    this.oemInputs.push('');
  }

  removeOEMInput(index: number) {
    this.oemInputs.splice(index, 1);
  }

  addProjectInput() {
    this.projectInputs.push('');
  }

  removeProjectInput(index: number) {
    this.projectInputs.splice(index, 1);
  }

  addSiteInput() {
    this.siteInputs.push('');
  }

  removeSiteInput(index: number) {
    this.siteInputs.splice(index, 1);
  }

  addStoreInput() {
    this.storeInputs.push('');
  }

  removeStoreInput(index: number) {
    this.storeInputs.splice(index, 1);
  }

  async saveData() {
    let inputs;
  
    switch (this.data.masterData) {
      case 'Category':
        inputs = this.categoryInputs.map(item => ({ category: item }));
        break;
      case 'Engineer':
        inputs = this.engineerInputs.map(item => ({ engineer: item }));
        break;
      case 'Model':
        inputs = this.modelInputs.map(item => ({ model: item }));
        break;
      case 'OEM':
        inputs = this.oemInputs.map(item => ({ oem: item }));
        break;
      case 'Project':
        inputs = this.projectInputs.map(item => ({ project: item }));
        break;
      case 'Site':
        inputs = this.siteInputs.map(item => ({ site: item }));
        break;
      case 'Store':
        inputs = this.storeInputs.map(item => ({ store: item }));
        break;
      default:
        return;
    }
  
    const payload = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
      data: inputs
    };
  
    console.log('Payload:', payload); // Debug: Check the payload content
  
    let saveObservable;
    switch (this.data.masterData) {
      case 'Category':
        saveObservable = this.dataService.saveCategory(payload);
        break;
      case 'Engineer':
        saveObservable = this.dataService.saveEngineer(payload);
        break;
      case 'Model':
        saveObservable = this.dataService.saveModel(payload);
        break;
      case 'OEM':
        saveObservable = this.dataService.saveOEM(payload);
        break;
      case 'Project':
        saveObservable = this.dataService.saveProject(payload);
        break;
      case 'Site':
        saveObservable = this.dataService.saveSite(payload);
        break;
      case 'Store':
        saveObservable = this.dataService.saveStore(payload);
        break;
    }
  
    try {
      await saveObservable.toPromise();
      const toast = await this.toastController.create({
        message: 'Data saved successfully!',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
      this.closeAddDataModal();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Failed to save data!',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }
  }

  
  
}
