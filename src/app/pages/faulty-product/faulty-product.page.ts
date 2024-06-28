import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

@Component({
  selector: 'app-faulty-product',
  templateUrl: './faulty-product.page.html',
  styleUrls: ['./faulty-product.page.scss'],
})
export class FaultyProductPage implements OnInit {
  selectedSubstation: string = '';
  selectedAction: string = '';
  searchQuery: string = '';
  substations: any[] = [];
  changedAssets: any[] = [];
  deliveredData: any[] = [];
  substationData: any[] = [];
  userId = localStorage.getItem('userId');
  showOemModal: boolean = false;
  showSiteModal: boolean = false;
  oemReason: string = '';
  newSite: string = '';
  // Form data for OEM return
  selectedClientOem: string = '';
  selectedWarehouseOem: string = '';
  gstNumberOem: string = '';
  billingClientOem: string = '';
  billingWarehouseOem: string = '';
  billingGstNumberOem: string = '';
  companyPanNumberOem: string = '';
  dispatchedThroughOem: string = '';
  dispatchedDateOem: string = '';
  buyersOrderNumberOem: string = '';
  dispatchDocNoOem: string = '';
  paymentTermsOem: string = '';
  termsOfDeliveryOem: string = '';
  destinationOem: string = '';
  motorVehicleNoOem: string = '';

  // Form data for Site return
  selectedClientSite: string = '';
  selectedWarehouseSite: string = '';
  gstNumberSite: string = '';
  billingClientSite: string = '';
  billingWarehouseSite: string = '';
  billingGstNumberSite: string = '';
  companyPanNumberSite: string = '';
  dispatchedThroughSite: string = '';
  dispatchedDateSite: string = '';
  buyersOrderNumberSite: string = '';
  dispatchDocNoSite: string = '';
  paymentTermsSite: string = '';
  termsOfDeliverySite: string = '';
  destinationSite: string = '';
  motorVehicleNoSite: string = '';
clients: any;
warehouseProductData: any;
  selectedClient: any;
  filteredWarehouseProductList: any;

  constructor(
    private modalController: ModalController,
    private dataService: DataService, // Inject the DataService
    private toastController: ToastController,
    private loadingController: LoadingController // Inject LoadingController
  ) {}

  ngOnInit() {
    this.loadDeliveredData();
    this.loadSubstations();
  }

  
  applyWarehouseFilters() {
    this.filteredWarehouseProductList = this.getFilteredWarehouseProducts();
  }

  getFilteredWarehouseProducts(): any[] {
    let filtered = this.warehouseProductData;

    if (this.searchQuery) {
      filtered = filtered.filter(product => product.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    return filtered;
  }

  fetchClientWarehouses() {
    if (this.selectedClient) {
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: this.userId,
        employeeId: this.userId,
        clientName: this.selectedClient,
      };

      this.dataService.fetchClientWarehouses(formData).then((res: any) => {
        this.warehouseProductData = res.map((product) => ({
          ...product,
          SerialNumber: product.serialNumber,
          ProductName: product.productName,
          Status: product.status,
          selected: false // Add selected property
        }));
        this.applyWarehouseFilters(); // Filter products after loading
        console.log("Client Warehouses Response:", res);
      }).catch(error => {
        console.error('Error fetching client warehouses data', error);
      });
    }
  }


  selectSubstation(event: any) {
    this.selectedSubstation = event.detail.value;
    console.log('Selected substation:', this.selectedSubstation);
  }

  onActionChange(action: string) {
    this.selectedAction = action;
    this.trackSelectedAssets();
  }

  onSelectChange(asset: any) {
    this.trackSelectedAssets();
  }

  filteredAssets() {
    return this.deliveredData.filter(asset => {
      const matchesSearchQuery = this.searchQuery
        ? asset.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      const matchesSubstation = this.selectedSubstation
        ? asset.siteName === this.selectedSubstation
        : true;

      return matchesSearchQuery && matchesSubstation;
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }

  trackSelectedAssets() {
    this.changedAssets = this.deliveredData.filter(asset => asset.selected);
  }

  async submitReturn() {
    if (!this.selectedAction || this.selectedAction === 'null') {
      this.showToast('Please select an action.');
      return;
    }

    const filteredAssets = this.changedAssets.filter(asset => asset.selected);

    if (filteredAssets.length === 0) {
      this.showToast('No data to save.');
      return;
    }

    if (this.selectedAction === 'Sent Back to the OEM') {
      this.showOemModal = true;
    } else if (this.selectedAction === 'Sent Back to the Site') {
      this.showSiteModal = true;
    } else if (this.selectedAction === 'Mark as Scrap') {
      await this.submitReturnToServer();
    }
  }

  async submitReturnToServer() {
    const loading = await this.loadingController.create({
      message: 'Submitting data...',
    });
    await loading.present();

    try {
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: this.userId,
        employeeId: this.userId,
      };

      const dataToSend = {
        ...formData,
        assetsData: this.changedAssets.map(asset => ({ ...asset, action: this.selectedAction })),
      };

      const response = await this.dataService.submitReturn(dataToSend).toPromise();
      this.showToast('Data saved successfully!');
      this.changedAssets = [];
      this.loadDeliveredData(); // Refresh product list after successful submission
    } catch (error) {
      console.error('Error saving data', error);
      this.showToast('Failed to save data');
    } finally {
      await loading.dismiss();
    }
  }

  closeModal() {
    this.showOemModal = false;
    this.showSiteModal = false;
  }

  async submitOemReturn() {
    this.closeModal();
    // Add any specific logic for OEM return here if needed
    await this.submitReturnToServer();
  }

  async submitSiteReturn() {
    this.closeModal();
    // Add any specific logic for Site return here if needed
    await this.submitReturnToServer();
  }

  loadDeliveredData() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService
      .fetchDeliveredData(formData)
      .then((res: any) => {
        this.deliveredData = res;
        console.log('Response ::::::::::::::', res);
      })
      .catch(error => {
        console.error('Error fetching delivered data', error);
      });
  }

  loadSubstations() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService
      .fetchSites(formData)
      .then((res: any) => {
        this.substationData = res;
        console.log('Response ::::::::::::::', res);
      })
      .catch(error => {
        console.error('Error fetching Substations data', error);
      });
  }
}





// import { Component, OnInit } from '@angular/core';
// import { ModalController, ToastController, LoadingController } from '@ionic/angular';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

// @Component({
//   selector: 'app-faulty-product',
//   templateUrl: './faulty-product.page.html',
//   styleUrls: ['./faulty-product.page.scss'],
// })
// export class FaultyProductPage implements OnInit {
//   selectedSubstation: string = '';
//   selectedAction: string = '';
//   searchQuery: string = '';
//   substations: any[] = [];
//   changedAssets: any[] = [];
//   deliveredData: any[] = [];
//   substationData: any[] = [];
//   userId=localStorage.getItem("userId");

//   constructor(
//     private modalController: ModalController,
//     private dataService: DataService, // Inject the DataService
//     private toastController: ToastController,
//     private loadingController: LoadingController // Inject LoadingController
//   ) {}

//   ngOnInit() {
//     this.loadDeliveredData();
//     this.loadSubstations();
//   }

//   selectSubstation(event: any) {
//     this.selectedSubstation = event.detail.value;
//     console.log('Selected substation:', this.selectedSubstation);
//   }

//   onActionChange(action: string) {
//     this.selectedAction = action;
//     this.trackSelectedAssets();
//   }

//   onSelectChange(asset: any) {
//     this.trackSelectedAssets();
//   }

//   filteredAssets() {
//     return this.deliveredData.filter(asset => {
//       const matchesSearchQuery = this.searchQuery
//         ? asset.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
//         : true;

//       const matchesSubstation = this.selectedSubstation
//         ? asset.siteName === this.selectedSubstation
//         : true;

//       return matchesSearchQuery && matchesSubstation;
//     });
//   }

//   async showToast(message: string) {
//     const toast = await this.toastController.create({
//       message,
//       duration: 2000,
//       position: 'top'
//     });
//     await toast.present();
//   }

//   trackSelectedAssets() {
//     this.changedAssets = this.deliveredData.filter(asset => asset.selected);
//   }

//   async submitReturn() {
//     const loading = await this.loadingController.create({
//       message: 'Submitting data...',
//     });
//     await loading.present();

//     try {
//       if (!this.selectedAction || this.selectedAction === 'null') {
//         await loading.dismiss();
//         this.showToast('Please select an action.');
//         return;
//       }

//       const filteredAssets = this.changedAssets.filter(asset => asset.selected);

//       if (filteredAssets.length === 0) {
//         await loading.dismiss();
//         this.showToast('No data to save.');
//         return;
//       }

//       const formData = {
//         permissionName: 'Tasks',
//         employeeIdMiddleware: this.userId,
//         employeeId: this.userId,
//       };

//       const dataToSend = {
//         ...formData,
//         assetsData: filteredAssets.map(asset => ({ ...asset, action: this.selectedAction }))
//       };

//       const response = await this.dataService.submitReturn(dataToSend).toPromise();
//       this.showToast('Data saved successfully!');
//       this.changedAssets = [];
//       this.loadDeliveredData(); // Refresh product list after successful submission
//     } catch (error) {
//       console.error('Error saving data', error);
//       this.showToast('Failed to save data');
//     } finally {
//       await loading.dismiss();
//     }
//   }

//   loadDeliveredData() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchDeliveredData(formData).then((res: any) => {
//       this.deliveredData = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching delivered data', error);
//     });
//   }

//   loadSubstations() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchSites(formData).then((res: any) => {
//       this.substationData = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching Substations data', error);
//     });
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { ModalController, ToastController, LoadingController } from '@ionic/angular';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

// @Component({
//   selector: 'app-faulty-product',
//   templateUrl: './faulty-product.page.html',
//   styleUrls: ['./faulty-product.page.scss'],
// })
// export class FaultyProductPage implements OnInit {
//   selectedSubstation: string = '';
//   searchQuery: string = '';
//   substations: any[] = [];
//   changedAssets: any[] = [];
//   deliveredData: any[] = [];
//   substationData: any[] = [];
//   userId=localStorage.getItem("userId");

//   constructor(
//     private modalController: ModalController,
//     private dataService: DataService, // Inject the DataService
//     private toastController: ToastController,
//     private loadingController: LoadingController // Inject LoadingController
//   ) {}

//   ngOnInit() {
//     this.loadDeliveredData();
//     this.loadSubstations();
//   }

//   selectSubstation(event: any) {
//     this.selectedSubstation = event.detail.value;
//     console.log('Selected substation:', this.selectedSubstation);
//   }

//   filteredAssets() {
//     return this.deliveredData.filter(asset => {
//       const matchesSearchQuery = this.searchQuery
//         ? asset.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
//         : true;

//       const matchesSubstation = this.selectedSubstation
//         ? asset.siteName === this.selectedSubstation
//         : true;

//       return matchesSearchQuery && matchesSubstation;
//     });
//   }

//   async showToast(message: string) {
//     const toast = await this.toastController.create({
//       message,
//       duration: 2000,
//       position: 'top'
//     });
//     await toast.present();
//   }

//   onActionChange(asset: any) {
//     if (asset.action === 'null') {
//       asset.action = null; // Reset to placeholder
//     } else {
//       this.trackChange(asset);
//     }
//   }

//   trackChange(asset: any) {
//     if (!this.changedAssets.includes(asset)) {
//       this.changedAssets.push(asset);
//     }
//   }

//   async submitReturn() {
//     const loading = await this.loadingController.create({
//       message: 'Submitting data...',
//     });
//     await loading.present();

//     try {
//       const filteredAssets = this.changedAssets.filter(asset => asset.action !== null && asset.action !== 'None');

//       if (filteredAssets.length === 0) {
//         await loading.dismiss();
//         this.showToast('No data to save.');
//         return;
//       }

//       const formData = {
//         permissionName: 'Tasks',
//         employeeIdMiddleware: this.userId,
//         employeeId: this.userId,
//       };

//       const dataToSend = {
//         ...formData,
//         assetsData: filteredAssets
//       };

//       const response = await this.dataService.submitReturn(dataToSend).toPromise();
//       this.showToast('Data saved successfully!');
//       this.changedAssets = [];
//       this.loadDeliveredData(); // Refresh product list after successful submission
//     } catch (error) {
//       console.error('Error saving data', error);
//       this.showToast('Failed to save data');
//     } finally {
//       await loading.dismiss();
//     }
//   }

//   loadDeliveredData() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchDeliveredData(formData).then((res: any) => {
//       this.deliveredData = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching delivered data', error);
//     });
//   }

//   loadSubstations() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchSites(formData).then((res: any) => {
//       this.substationData = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching Substations data', error);
//     });
//   }
// }

///////////////////////////////////////


// import { Component, OnInit } from '@angular/core';
// import { ModalController, ToastController } from '@ionic/angular';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

// @Component({
//   selector: 'app-faulty-product',
//   templateUrl: './faulty-product.page.html',
//   styleUrls: ['./faulty-product.page.scss'],
// })
// export class FaultyProductPage implements OnInit {
//   selectedSubstation: string = '';
//   searchQuery: string = '';
//   substations: any[] = [];
//   changedAssets: any[] = [];
//   deliveredData: any[] = [];
//   substationData: any[] = [];
//   userId=localStorage.getItem("userId");

//   constructor(
//     private modalController: ModalController,
//     private dataService: DataService, // Inject the DataService
//     private toastController: ToastController
//   ) {}

//   ngOnInit() {
//     this.loadDeliveredData();
//     this.loadSubstations();
//   }

//   selectSubstation(event: any) {
//     this.selectedSubstation = event.detail.value;
//     console.log('Selected substation:', this.selectedSubstation);
//   }

//   filteredAssets() {
//     return this.deliveredData.filter(asset => {
//       const matchesSearchQuery = this.searchQuery
//         ? asset.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
//         : true;

//       const matchesSubstation = this.selectedSubstation
//         ? asset.siteName === this.selectedSubstation
//         : true;

//       return matchesSearchQuery && matchesSubstation;
//     });
//   }

//   async showToast(message: string) {
//     const toast = await this.toastController.create({
//       message,
//       duration: 2000,
//       position: 'top'
//     });
//     await toast.present();
//   }

//   onActionChange(asset: any) {
//     if (asset.action === 'null') {
//       asset.action = null; // Reset to placeholder
//     } else {
//       this.trackChange(asset);
//     }
//   }

//   trackChange(asset: any) {
//     if (!this.changedAssets.includes(asset)) {
//       this.changedAssets.push(asset);
//     }
//   }

//  async submitReturn() {
//   try {
//     const filteredAssets = this.changedAssets.filter(asset => asset.action !== null && asset.action !== 'None');

//     if (filteredAssets.length === 0) {
//       this.showToast('No data to save.');
//       return;
//     }

//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     const dataToSend = {
//       ...formData,
//       assetsData: filteredAssets
//     };

//     const response = await this.dataService.submitReturn(dataToSend).toPromise();
//     this.showToast('Data saved successfully!');
//     this.changedAssets = [];
//   } catch (error) {
//     console.error('Error saving data', error);
//     this.showToast('Failed to save data');
//   }
// }


//   loadDeliveredData() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchDeliveredData(formData).then((res: any) => {
//       this.deliveredData = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching delivered data', error);
//     });
//   }

//   loadSubstations() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchSites(formData).then((res: any) => {
//       this.substationData = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching Substations data', error);
//     });
//   }
// }
