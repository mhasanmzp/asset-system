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

  // Define data arrays for different sections
  categories = [];
  oems = [];
  sites = [];
  stores = [];
  clients = [];
  warehouses = [];

  // Define input arrays for ADD functionality
  categoryInputs = [{ name: '', hsn: '' }];
  engineerInputs: string[] = [''];
  modelInputs: string[] = [''];
  oemInputs: string[] = [''];
  projectInputs: string[] = [''];
  siteInputs: string[] = [''];
  storeInputs = [{ name: '', address: '' }];
  clientInputs: string[] = [''];
  warehouseInputs: string[] = [''];

  selectedClient: any;
  currentView: string = 'add'; // Set default view

  constructor(
    private toastController: ToastController,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadClients();
    this.loadCategories();
    this.loadOems();
    this.loadSites();
    this.loadStores();
    this.loadWarehouses();
  }

  // Load data methods
  loadClients() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };
    this.dataService.fetchClients(formData).then((res: any) => {
      this.clients = res;
    }).catch(error => {
      console.error('Error fetching clients data', error);
    });
  }

  loadCategories() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };
    this.dataService.fetchCategories(formData).then((res: any) => {
      this.categories = res;
    }).catch(error => {
      console.error('Error fetching categories data', error);
    });
  }

  loadOems() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };
    this.dataService.fetchOEM(formData).then((res: any) => {
      this.oems = res;
    }).catch(error => {
      console.error('Error fetching OEMs data', error);
    });
  }

  loadSites() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };
    this.dataService.fetchSites(formData).then((res: any) => {
      this.sites = res;
    }).catch(error => {
      console.error('Error fetching sites data', error);
    });
  }

  loadStores() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };
    this.dataService.fetchStore(formData).then((res: any) => {
      this.stores = res;
    }).catch(error => {
      console.error('Error fetching stores data', error);
    });
  }

  loadWarehouses() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };
    this.dataService.fetchClientWarehousesAll(formData).then((res: any) => {
      this.warehouses = res;
    }).catch(error => {
      console.error('Error fetching warehouses data', error);
    });
  }

  openAddDataModal() {
    this.isModalOpen = true;
    this.resetInputs();
  }

  closeAddDataModal() {
    this.isModalOpen = false;
    this.resetInputs();
  }

  resetInputs() {
    // Reset all input arrays
    this.categoryInputs = [{ name: '', hsn: '' }];
    this.oemInputs = [''];
    this.projectInputs = [''];
    this.siteInputs = [''];
    this.storeInputs = [{ name: '', address: '' }];
    this.clientInputs = [''];
    this.warehouseInputs = [''];
    this.selectedClient = '';
  }

  selectDataType(type: string) {
    this.data.masterData = type; // Set the selected data type
    this.resetInputs();
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

  selectedDataType: string = '';


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
            this.storeInputs.push({ name: '', address: '' });
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
}
