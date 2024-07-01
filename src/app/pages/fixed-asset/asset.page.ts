// import { Component, OnInit } from '@angular/core';
// import { ToastController } from '@ionic/angular';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

// @Component({
//   selector: 'app-asset',
//   templateUrl: './asset.page.html',
//   styleUrls: ['./asset.page.scss'],
// })
// export class AssetPage implements OnInit {
//   isModalOpen = false;

//   data = {
//     masterData: '',
//   };
//   userId=localStorage.getItem("userId");
//   categoryInputs: string[] = [''];
//   engineerInputs: string[] = [''];
//   modelInputs: string[] = [''];
//   oemInputs: string[] = [''];
//   projectInputs: string[] = [''];
//   siteInputs: string[] = [''];
//   storeInputs: string[] = [''];
//   clientInputs: string[] = [''];
//   warehouseInputs: string[] = [''];
//   selectedClient: any;
//   clients = []; // Example client data

//   constructor(
//     private toastController: ToastController,
//     private dataService: DataService
//   ) { }

//   ngOnInit() { 
//     this.loadClients();
    
//   }

//   loadClients() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchClients(formData).then((res: any) => {
//       this.clients = res; // Assign response to categories
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching categories data', error);
//     });
//   }


//   openAddDataModal() {
//     this.isModalOpen = true;
  
//     // Initialize input arrays based on selected masterData
//     switch (this.data.masterData) {
//       case 'Category':
//         this.categoryInputs = [''];
//         break;
//       case 'OEM':
//         this.oemInputs = [''];
//         break;
//       case 'Project':
//         this.projectInputs = [''];
//         break;
//       case 'Site':
//         this.siteInputs = [''];
//         break;
//       case 'Store':
//         this.storeInputs = [''];
//         break;
//       case 'Client':
//         this.clientInputs = [''];
//         break;
//       case 'Warehouse':
//         this.warehouseInputs = [''];
//         this.selectedClient = '';
//         break;
//       default:
//         break;
//     }
//   }

//   closeAddDataModal() {
//     this.isModalOpen = false;

//     // Reset all input arrays
//     this.categoryInputs = [''];
//     this.oemInputs = [''];
//     this.projectInputs = [''];
//     this.siteInputs = [''];
//     this.storeInputs = [''];
//     this.clientInputs = [''];
//     this.warehouseInputs = [''];
//     this.selectedClient = '';
//   }

//   addCategoryInput() {
//     this.categoryInputs.push('');
//   }

//   removeCategoryInput(index: number) {
//     this.categoryInputs.splice(index, 1);
//   }

//   addEngineerInput() {
//     this.engineerInputs.push('');
//   }

//   removeEngineerInput(index: number) {
//     this.engineerInputs.splice(index, 1);
//   }

//   addModelInput() {
//     this.modelInputs.push('');
//   }

//   removeModelInput(index: number) {
//     this.modelInputs.splice(index, 1);
//   }

//   addOEMInput() {
//     this.oemInputs.push('');
//   }

//   removeOEMInput(index: number) {
//     this.oemInputs.splice(index, 1);
//   }

//   addProjectInput() {
//     this.projectInputs.push('');
//   }

//   removeProjectInput(index: number) {
//     this.projectInputs.splice(index, 1);
//   }

//   addSiteInput() {
//     this.siteInputs.push('');
//   }

//   removeSiteInput(index: number) {
//     this.siteInputs.splice(index, 1);
//   }

//   addStoreInput() {
//     this.storeInputs.push('');
//   }

//   removeStoreInput(index: number) {
//     this.storeInputs.splice(index, 1);
//   }

//   addClientInput() {
//     this.clientInputs.push('');
//   }

//   removeClientInput(index: number) {
//     this.clientInputs.splice(index, 1);
//   }

//   addWarehouseInput() {
//     this.warehouseInputs.push('');
//   }

//   removeWarehouseInput(index: number) {
//     this.warehouseInputs.splice(index, 1);
//   }

//   async saveData() {
//     let inputs;

//     switch (this.data.masterData) {
//       case 'Category':
//         inputs = this.categoryInputs.map(item => ({ category: item }));
//         break;
//       case 'Engineer':
//         inputs = this.engineerInputs.map(item => ({ engineer: item }));
//         break;
//       case 'Model':
//         inputs = this.modelInputs.map(item => ({ model: item }));
//         break;
//       case 'OEM':
//         inputs = this.oemInputs.map(item => ({ oem: item }));
//         break;
//       case 'Project':
//         inputs = this.projectInputs.map(item => ({ project: item }));
//         break;
//       case 'Site':
//         inputs = this.siteInputs.map(item => ({ site: item }));
//         break;
//       case 'Store':
//         inputs = this.storeInputs.map(item => ({ store: item }));
//         break;
//       case 'Client':
//         inputs = this.clientInputs.map(item => ({ client: item }));
//         break;
//       case 'Warehouse':
//         inputs = this.warehouseInputs.map(item => ({ warehouse: item, client: this.selectedClient }));
//         break;
//       default:
//         return;
//     }

//     const payload = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//       data: inputs
//     };

//     console.log('Payload:', payload); // Debug: Check the payload content

//     let saveObservable;
//     switch (this.data.masterData) {
//       case 'Category':
//         saveObservable = this.dataService.saveCategory(payload);
//         break;
//       case 'Engineer':
//         saveObservable = this.dataService.saveEngineer(payload);
//         break;
//       case 'Model':
//         saveObservable = this.dataService.saveModel(payload);
//         break;
//       case 'OEM':
//         saveObservable = this.dataService.saveOEM(payload);
//         break;
//       case 'Project':
//         saveObservable = this.dataService.saveProject(payload);
//         break;
//       case 'Site':
//         saveObservable = this.dataService.saveSite(payload);
//         break;
//       case 'Store':
//         saveObservable = this.dataService.saveStore(payload);
//         break;
//       case 'Client':
//         saveObservable = this.dataService.saveClient(payload);
//         break;
//       case 'Warehouse':
//         saveObservable = this.dataService.saveWarehouse(payload);
//         break;
//     }

//     try {
//       await saveObservable.toPromise();
//       const toast = await this.toastController.create({
//         message: 'Data saved successfully!',
//         duration: 2000,
//         position: 'bottom'
//       });
//       await toast.present();
//       this.closeAddDataModal();
//     } catch (error) {
//       const toast = await this.toastController.create({
//         message: 'Failed to save data!',
//         duration: 2000,
//         position: 'bottom'
//       });
//       await toast.present();
//     }
//   }
// }

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
  userId = localStorage.getItem("userId");
  categoryInputs = [{ name: '', hsn: '' }];
  engineerInputs: string[] = [''];
  modelInputs: string[] = [''];
  oemInputs: string[] = [''];
  projectInputs: string[] = [''];
  siteInputs: string[] = [''];
  storeInputs: string[] = [''];
  clientInputs: string[] = [''];
  warehouseInputs: string[] = [''];
  selectedClient: any;
  clients = []; // Example client data

  constructor(
    private toastController: ToastController,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchClients(formData).then((res: any) => {
      this.clients = res; // Assign response to categories
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching categories data', error);
    });
  }

  openAddDataModal() {
    this.isModalOpen = true;

    // Initialize input arrays based on selected masterData
    switch (this.data.masterData) {
      case 'Category':
        this.categoryInputs = [{ name: '', hsn: '' }];
        break;
      case 'OEM':
        this.oemInputs = [''];
        break;
      case 'Project':
        this.projectInputs = [''];
        break;
      case 'Site':
        this.siteInputs = [''];
        break;
      case 'Store':
        this.storeInputs = [''];
        break;
      case 'Client':
        this.clientInputs = [''];
        break;
      case 'Warehouse':
        this.warehouseInputs = [''];
        this.selectedClient = '';
        break;
      default:
        break;
    }
  }

  closeAddDataModal() {
    this.isModalOpen = false;

    // Reset all input arrays
    this.categoryInputs = [{ name: '', hsn: '' }];
    this.oemInputs = [''];
    this.projectInputs = [''];
    this.siteInputs = [''];
    this.storeInputs = [''];
    this.clientInputs = [''];
    this.warehouseInputs = [''];
    this.selectedClient = '';
  }

  addCategoryInput() {
    this.categoryInputs.push({ name: '', hsn: '' });
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

  addClientInput() {
    this.clientInputs.push('');
  }

  removeClientInput(index: number) {
    this.clientInputs.splice(index, 1);
  }

  addWarehouseInput() {
    this.warehouseInputs.push('');
  }

  removeWarehouseInput(index: number) {
    this.warehouseInputs.splice(index, 1);
  }

  async saveData() {
    let inputs;

    switch (this.data.masterData) {
      case 'Category':
        inputs = this.categoryInputs.map(item => ({ category: item.name, hsn: item.hsn }));
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
      case 'Client':
        inputs = this.clientInputs.map(item => ({ client: item }));
        break;
      case 'Warehouse':
        inputs = this.warehouseInputs.map(item => ({ warehouse: item, client: this.selectedClient }));
        break;
      default:
        return;
    }

    const payload = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
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
      case 'Client':
        saveObservable = this.dataService.saveClient(payload);
        break;
      case 'Warehouse':
        saveObservable = this.dataService.saveWarehouse(payload);
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




// import { Component, OnInit } from '@angular/core';
// import { ToastController } from '@ionic/angular';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

// @Component({
//   selector: 'app-asset',
//   templateUrl: './asset.page.html',
//   styleUrls: ['./asset.page.scss'],
// })
// export class AssetPage implements OnInit {
//   isModalOpen = false;

//   data = {
//     masterData: '',
//   };

//   categoryInputs: string[] = [''];
//   engineerInputs: string[] = [''];
//   modelInputs: string[] = [''];
//   oemInputs: string[] = [''];
//   projectInputs: string[] = [''];
//   siteInputs: string[] = [''];
//   storeInputs: string[] = [''];

//   constructor(
//     private toastController: ToastController,
//     private dataService: DataService
//   ) { }

//   ngOnInit() { }

//   openAddDataModal() {
//     this.isModalOpen = true;
  
//     // Initialize input arrays based on selected masterData
//     switch (this.data.masterData) {
//       case 'Category':
//         this.categoryInputs = ['']; // Initialize with an empty input
//         break;
//       case 'OEM':
//         this.oemInputs = [''];
//         break;
//       case 'Project':
//         this.projectInputs = [''];
//         break;
//       case 'Site':
//         this.siteInputs = [''];
//         break;
//       case 'Store':
//         this.storeInputs = [''];
//         break;
//       default:
//         break;
//     }
//   }
  

//   closeAddDataModal() {
//     this.isModalOpen = false;
    
//     // Reset all input arrays
//     this.categoryInputs = [''];
//     this.oemInputs = [''];
//     this.projectInputs = [''];
//     this.siteInputs = [''];
//     this.storeInputs = [''];
//   }
  

//   addCategoryInput() {
//     this.categoryInputs.push('');
//   }

//   removeCategoryInput(index: number) {
//     this.categoryInputs.splice(index, 1);
//   }

//   addEngineerInput() {
//     this.engineerInputs.push('');
//   }

//   removeEngineerInput(index: number) {
//     this.engineerInputs.splice(index, 1);
//   }

//   addModelInput() {
//     this.modelInputs.push('');
//   }

//   removeModelInput(index: number) {
//     this.modelInputs.splice(index, 1);
//   }

//   addOEMInput() {
//     this.oemInputs.push('');
//   }

//   removeOEMInput(index: number) {
//     this.oemInputs.splice(index, 1);
//   }

//   addProjectInput() {
//     this.projectInputs.push('');
//   }

//   removeProjectInput(index: number) {
//     this.projectInputs.splice(index, 1);
//   }

//   addSiteInput() {
//     this.siteInputs.push('');
//   }

//   removeSiteInput(index: number) {
//     this.siteInputs.splice(index, 1);
//   }

//   addStoreInput() {
//     this.storeInputs.push('');
//   }

//   removeStoreInput(index: number) {
//     this.storeInputs.splice(index, 1);
//   }

//   async saveData() {
//     let inputs;
  
//     switch (this.data.masterData) {
//       case 'Category':
//         inputs = this.categoryInputs.map(item => ({ category: item }));
//         break;
//       case 'Engineer':
//         inputs = this.engineerInputs.map(item => ({ engineer: item }));
//         break;
//       case 'Model':
//         inputs = this.modelInputs.map(item => ({ model: item }));
//         break;
//       case 'OEM':
//         inputs = this.oemInputs.map(item => ({ oem: item }));
//         break;
//       case 'Project':
//         inputs = this.projectInputs.map(item => ({ project: item }));
//         break;
//       case 'Site':
//         inputs = this.siteInputs.map(item => ({ site: item }));
//         break;
//       case 'Store':
//         inputs = this.storeInputs.map(item => ({ store: item }));
//         break;
//       default:
//         return;
//     }
  
//     const payload = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//       data: inputs
//     };
  
//     console.log('Payload:', payload); // Debug: Check the payload content
  
//     let saveObservable;
//     switch (this.data.masterData) {
//       case 'Category':
//         saveObservable = this.dataService.saveCategory(payload);
//         break;
//       case 'Engineer':
//         saveObservable = this.dataService.saveEngineer(payload);
//         break;
//       case 'Model':
//         saveObservable = this.dataService.saveModel(payload);
//         break;
//       case 'OEM':
//         saveObservable = this.dataService.saveOEM(payload);
//         break;
//       case 'Project':
//         saveObservable = this.dataService.saveProject(payload);
//         break;
//       case 'Site':
//         saveObservable = this.dataService.saveSite(payload);
//         break;
//       case 'Store':
//         saveObservable = this.dataService.saveStore(payload);
//         break;
//     }
  
//     try {
//       await saveObservable.toPromise();
//       const toast = await this.toastController.create({
//         message: 'Data saved successfully!',
//         duration: 2000,
//         position: 'bottom'
//       });
//       await toast.present();
//       this.closeAddDataModal();
//     } catch (error) {
//       const toast = await this.toastController.create({
//         message: 'Failed to save data!',
//         duration: 2000,
//         position: 'bottom'
//       });
//       await toast.present();
//     }
//   }

  
  
// }
