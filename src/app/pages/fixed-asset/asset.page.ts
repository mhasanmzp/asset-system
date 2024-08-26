
import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary
import { ModalController } from '@ionic/angular';

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
  editIndex: number | null = null;

  categories = [];
  oems = [];
  sites = [];
  stores = [];
  clients: any[] = [];
  warehouses = [];
  viewData: any = {};

  categoryInputs = [{ name: '', hsn: '' }];
  engineerInputs: string[] = [''];
  modelInputs: string[] = [''];
  oemInputs: [{ name: '', address: '', panNo: '', gstNo: '' }];
  originalData: any = {};

  projectInputs: string[] = [''];
  siteInputs: [{name:'',address:'', panNo: '', gstNo: ''}];
  storeInputs = [{ name: '', address: '' }];
  clientInputs: string[] = [''];
  warehouseInputs: [{name:'',address:'', panNo: '', gstNo: ''}];
  // warehouseInputs: string[] = [''];

  selectedClient: any;
  currentView: string = 'add'; 

  constructor(
    private toastController: ToastController,
    private dataService: DataService,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) {}

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
      this.viewData.Client = res;
    }).catch(error => {
      console.error('Error fetching clients data', error);
    });
  }

  loadClients1() {
    return new Promise((resolve, reject) => {
      // Simulate an API call
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: this.userId,
        employeeId: this.userId,
      };
      this.dataService.fetchClients(formData).then((res: any) => {
        this.clients = res;
        this.viewData.Client = res;
      }).catch(error => {
        console.error('Error fetching clients data', error);
      });
      setTimeout(() => {
        console.log('Clients loaded');
        resolve(true);
      }, 1000);
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
      this.viewData.Category = res;
    }).catch(error => {
      console.error('Error fetching categories data', error);
    });
  }
  loadCategories1() {
    return new Promise((resolve, reject) => {
      // Simulate an API call
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: 342,
        employeeId: 342,
      };
      this.dataService.fetchCategories(formData).then((res: any) => {
        this.categories = res;
        this.viewData.Category = res;
      }).catch(error => {
        console.error('Error fetching categories data', error);
      });
      setTimeout(() => {
        console.log('Categories loaded');
        resolve(true);
      }, 1000);
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
      this.viewData.OEM = res;
    }).catch(error => {
      console.error('Error fetching OEMs data', error);
    });
  }
  loadOems1() {
    return new Promise((resolve, reject) => {
      // Simulate an API call
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: 342,
        employeeId: 342,
      };
      this.dataService.fetchOEM(formData).then((res: any) => {
        this.oems = res;
        this.viewData.OEM = res;
      }).catch(error => {
        console.error('Error fetching OEMs data', error);
      });
      setTimeout(() => {
        console.log('OEMs loaded');
        resolve(true);
      }, 1000);
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
      this.viewData.Site = res;
    }).catch(error => {
      console.error('Error fetching sites data', error);
    });
  }

  loadSites1() {
    return new Promise((resolve, reject) => {
      // Simulate an API call
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: 342,
        employeeId: 342,
      };
      this.dataService.fetchSites(formData).then((res: any) => {
        this.sites = res;
        this.viewData.Site = res;
      }).catch(error => {
        console.error('Error fetching sites data', error);
      });
      setTimeout(() => {
        console.log('Sites loaded');
        resolve(true);
      }, 1000);
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
      this.viewData.Store = res;
    }).catch(error => {
      console.error('Error fetching stores data', error);
    });
  }

  loadStores1() {
    return new Promise((resolve, reject) => {
      // Simulate an API call
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: 342,
        employeeId: 342,
      };
      this.dataService.fetchStore(formData).then((res: any) => {
        this.stores = res;
        this.viewData.Store = res;
      }).catch(error => {
        console.error('Error fetching stores data', error);
      });
      setTimeout(() => {
        console.log('Stores loaded');
        resolve(true);
      }, 1000);
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
      this.viewData.Warehouse = res;
    }).catch(error => {
      console.error('Error fetching warehouses data', error);
    });
  }
  loadWarehouses1() {
    return new Promise((resolve, reject) => {
      // Simulate an API call
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: 342,
        employeeId: 342,
      };
      this.dataService.fetchClientWarehousesAll(formData).then((res: any) => {
        this.warehouses = res;
        this.viewData.Warehouse = res;
      }).catch(error => {
        console.error('Error fetching warehouses data', error);
      });
      setTimeout(() => {
        console.log('Warehouses loaded');
        resolve(true);
      }, 1000);
    });
  }

  openAddDataModal() {
    this.isModalOpen = true;
    this.resetInputs();
  }

  closeAddDataModal() {
    this.isModalOpen = false;
    this.modalController.dismiss(); 
    this.resetInputs();
    this.resetData();
    this.originalData = {}; // Reset the original data
    this.editIndex = null;
    this.originalData = {};
    this.loadClients();
    this.loadCategories();
    this.loadOems();
    this.loadSites();
    this.loadStores();
    this.loadWarehouses();
  }

  resetData() {
    this.data.masterData = null; 
    this.editIndex = null; 
  }
  resetData1() {
    this.data.masterData = null; 
    this.editIndex = null; 
  }

  resetInputs() {
    this.categoryInputs = [{ name: '', hsn: '' }];
    this.oemInputs = [{name:'',address:'', panNo: '', gstNo: ''}];
    this.projectInputs = [''];
    this.siteInputs = [{name:'',address:'', panNo: '', gstNo: ''}];
    this.warehouseInputs = [{name:'',address:'', panNo: '', gstNo: ''}];
    this.storeInputs = [{ name: '', address: '' }];
    this.clientInputs = [''];
    // this.warehouseInputs = [''];
    this.selectedClient = '';
  }

  selectDataType(type: string) {
    this.data.masterData = type; 
    this.resetInputs();
    this.currentView = 'add'; 
  }

  async saveData() {
    let inputs;
    switch (this.data.masterData) {
      case 'Category':
        inputs = this.categoryInputs.map(item => ({ category: item.name, hsn: item.hsn }));
        break;
      case 'OEM':
        console.log(this.oemInputs);
        
        inputs = this.oemInputs.map(item => ({ name: item.name, address:item.address, gstNo:item.gstNo, panNo:item.panNo }));
        break;
      case 'Installation Site':
        inputs = this.siteInputs.map(item => ({ name: item.name,address:item.address, gstNo:item.gstNo, panNo:item.panNo }));
        break;
      case 'Warehouse':
        inputs = this.storeInputs.map(item => ({ store: item }));
        break;
      case 'Customer':
        inputs = this.clientInputs.map(item => ({ client: item }));
        break;
      case 'Customer Warehouse':
        // inputs = this.warehouseInputs.map(item => ({ warehouse: item, client: this.selectedClient }));
        inputs = this.warehouseInputs.map(item => ({ name: item.name,address:item.address, gstNo:item.gstNo, panNo:item.panNo }));

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
      case 'OEM':
        saveObservable = this.dataService.saveOEM(payload);
        break;
      case 'Installation Site':
        saveObservable = this.dataService.saveSite(payload);
        break;
      case 'Warehouse':
        saveObservable = this.dataService.saveStore(payload);
        break;
      case 'Customer':
        saveObservable = this.dataService.saveClient(payload);
        break;
      case 'Customer Warehouse':
        saveObservable = this.dataService.saveWarehouse(payload);
        break;
    }

    try {
      await saveObservable.toPromise();
      const toast = await this.toastController.create({
        message: 'Data saved successfully!',
        duration: 4000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
      this.loadClients();
      this.loadCategories();
      this.loadOems();
      this.loadSites();
      this.loadStores();
      this.loadWarehouses();
      this.resetData1()
      // this.closeAddDataModal();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Failed to save data!',
        duration: 4000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
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
    this.oemInputs.push({name:'',address:'', panNo: '', gstNo: ''});
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
    this.siteInputs.push({name:'',address:'', panNo: '', gstNo: ''});
  }

  removeSiteInput(index: number) {
    this.siteInputs.splice(index, 1);
  }

  addStoreInput() {
    this.storeInputs.push({ name: '', address: '',  });
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
    this.warehouseInputs.push({name:'',address:'', panNo: '', gstNo: ''});;
  }

  removeWarehouseInput(index: number) {
    this.warehouseInputs.splice(index, 1);
  }

  dataTypes = [
    'Category', 'OEM', 'Installation Site', 'Warehouse', 'Customer', 'Customer Warehouse'
  ];

  startEdit(index: number) {
    this.editIndex = index;
    this.originalData = JSON.parse(JSON.stringify(this.viewData[this.data.masterData][index]));
  }

  async submitUpdate(type: string, item: any) {
    await this.updateData(type, item);
  }

  async refreshData() {
    const loading = await this.loadingController.create({
      message: 'Refreshing Data...',
    });
    await loading.present();
  
    try {
      await Promise.all([
        this.loadClients1(),
        this.loadCategories1(),
        this.loadOems1(),
        this.loadSites1(),
        this.loadStores1(),
        this.loadWarehouses1()
      ]);
      console.log('All data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      await loading.dismiss();
    }
  }

  async updateData(type: string, item: any) {
    this.editIndex = null; 
    const toast = await this.toastController.create({
      message: 'Data Updated Successfully!',
      duration: 4000,
      position: 'bottom',
      color: 'success'
    });

    const loading = await this.loadingController.create({
      message: 'Saving Data...',
    });
    await loading.present();
   
    const payload = {
      option: type,
      item: item,
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId, 
      employeeId: this.userId 
    };

    this.dataService.updateItem(payload).subscribe(
      (response) => {
        console.log('Item updated successfully:', response);
        loading.dismiss();

        this.refreshData(); 
        toast.present();
      },
      (error) => {
        // Handle error
        console.error('Error updating item:', error);
        loading.dismiss();
      }
    );
  }

  cancelEdit() {
    if (this.editIndex !== null && this.data.masterData) {
      const dataTypeKey = this.data.masterData;
      if (this.viewData[dataTypeKey] && this.viewData[dataTypeKey][this.editIndex]) {
        this.viewData[dataTypeKey][this.editIndex] = this.originalData; // Restore the original data
      }
    }
    this.editIndex = null;
    this.originalData = {};
    this.loadClients();
    this.loadCategories();
    this.loadOems();
    this.loadSites();
    this.loadStores();
    this.loadWarehouses();
  }
}




