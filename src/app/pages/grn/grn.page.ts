import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

@Component({
  selector: 'app-grn',
  templateUrl: './grn.page.html',
  styleUrls: ['./grn.page.scss'],
})
export class GrnPage implements OnInit {
  purchaseData: any[] = [];
  filteredData: any[] = [];
  isModalOpen = false;
  isDetailModalOpen = false;
  selectedPurchase: any;
  oemsList = [];
  categories = [];
  searchQuery: string = '';
  data: any = [];
  data2: any = [];
  material: any = {
    grnNo: '',
    grnDate: '',
    storeName: '',
    oemName: '',
    challanNo: '',
    challanDate: ''
  };
  materialRows: any[] = [{
    categoryName: '',
    productName: '',
    quantity: '',
    quantityUnit: '',
    warrantyPeriodMonths: '',
    storeLocation: '',
    serialNumbers: ['']
  }];

  constructor(
    private modalController: ModalController,
    private dataService: DataService, // Inject the DataService
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadOems();
    this.loadCategories();
    this.fetchData();
  }

  loadOems() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };

    this.dataService.fetchOEM(formData).then((res: any) => {
      this.data = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching OEM data', error);
    });
  }

  loadCategories() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };

    this.dataService.fetchCategories(formData).then((res: any) => {
      this.data2 = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching Categories data', error);
    });
  }

  openDetailsModal(purchaseId: string) {
    // Fetch details using purchaseId
    this.dataService.getItemsByPurchaseId(purchaseId).then((data) => {
      // Populate the "Details" modal with fetched data
      this.selectedPurchase = data; // Update with the correct property names based on your data structure
      // Open the "Details" modal
      this.isDetailModalOpen = true;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }
  
  closeDetailsModal() {
    // Close the "Details" modal
    this.isDetailModalOpen = false;
  }

  openAddMaterialModal() {
    this.isModalOpen = true;
  }

  closeAddMaterialModal() {
    this.isModalOpen = false;
  }

  addRow() {
    this.materialRows.push({
      categoryName: '',
      productName: '',
      quantity: '',
      quantityUnit: '',
      warrantyPeriodMonths: '',
      storeLocation: '',
      serialNumbers: ['']
    });
  }

  removeRow(index: number) {
    if (this.materialRows.length > 1) {
      this.materialRows.splice(index, 1);
    }
  }

  updateSerialNumbersArray(row) {
    const quantity = row.quantity;
    row.serialNumbers = Array.from({ length: quantity }, (_, i) => row.serialNumbers[i] || '');
  }

  resetAddMaterialModal() {
    this.material = {
      grnNo: '',
      grnDate: '',
      storeName: '',
      oemName: '',
      challanNo: '',
      challanDate: ''
    };
    this.materialRows = [{
      categoryName: '',
      productName: '',
      quantity: '',
      quantityUnit: '',
      warrantyPeriodMonths: '',
      storeLocation: '',
      serialNumbers: ['']
    }];
  }

  fetchData() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };
    console.log('formdata', formData);
    this.dataService.fetchData(formData).then((data: any) => {
      console.log('Asset DATA', data);
      this.purchaseData = data.purchaseData.map((purchaseData) => ({
        ...purchaseData,
        quantityRejected: purchaseData.nonUsableItems,
        stockableQuantity: purchaseData.usableItems,
        purchaseId: purchaseData.purchaseId
      }));
      this.filteredData = this.purchaseData; // Initialize filtered data
    }).catch(error => {
      console.error('Error fetching data', error);
    });
  }

  async saveMaterial() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
      ...this.material,
      materialRows: this.materialRows
    };

    // Save material via API using DataService
    this.dataService.submitMaterial(this.material, formData).subscribe(async response => {
      // Show success toast message
      const toast = await this.toastController.create({
        message: 'Asset saved successfully!',
        duration: 5000,
        position: 'bottom'
      });
      await toast.present();

      // Close the modal
      this.closeAddMaterialModal();
      // Refresh the data
      this.fetchData();
      // Reset the entered data of the Modal: Add Asset
      this.resetAddMaterialModal()
    }, async error => {
      // Handle error
      const toast = await this.toastController.create({
        message: 'Failed to save asset. Please try again.',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    });
  }

  // Filter purchase data based on search query
  applyFilter() {
    if (this.searchQuery.trim() === '') {
      // If search query is empty or only contains whitespace, reset to all data
      this.filteredData = this.purchaseData;
    } else {
      // Otherwise, filter the data
      this.filteredData = this.purchaseData.filter(item =>
        item.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  
  // applyFilters() {
  //   if (!this.searchQuery.trim()) {
  //     this.filteredData = [...this.purchaseData];
  //   } else {
  //     this.filteredData = this.purchaseData.filter(item => {
  //       return item.productName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
  //              item.purchaseId.toString().includes(this.searchQuery.toLowerCase());
  //     });
  //   }
  // }
}








// import { Component, OnInit } from '@angular/core';
// import { ModalController, ToastController } from '@ionic/angular';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

// @Component({
//   selector: 'app-grn',
//   templateUrl: './grn.page.html',
//   styleUrls: ['./grn.page.scss'],
// })
// export class GrnPage implements OnInit {
//   purchaseData: any[] = [];
//   isModalOpen = false;
//   isDetailModalOpen = false;
//   selectedPurchase: any;
//   oemsList = [];
//   categories = [];
//   searchTerm: any;
//   data: any = [];
//   data2: any = [];
//   material: any = {
//     grnNo: '',
//     grnDate: '',
//     storeName: '',
//     oemName: '',
//     challanNo: '',
//     challanDate: ''
//   };
//   materialRows: any[] = [{
//     categoryName: '',
//     productName: '',
//     quantity: '',
//     quantityUnit: '',
//     warrantyPeriodMonths: '',
//     storeLocation: '',
//     serialNumbers: ['']
//   }];

//   constructor(
//     private modalController: ModalController,
//     private dataService: DataService, // Inject the DataService
//     private toastController: ToastController
//   ) { }

//   ngOnInit() {
//     this.loadOems();
//     this.loadCategories();
//     this.fetchData();
//   }

//   loadOems() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: 342,
//       employeeId: 342,
//     };

//     this.dataService.fetchOEM(formData).then((res: any) => {
//       this.data = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching OEM data', error);
//     });
//   }

//   loadCategories() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: 342,
//       employeeId: 342,
//     };

//     this.dataService.fetchCategories(formData).then((res: any) => {
//       this.data2 = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching Categories data', error);
//     });
//   }

//   openDetailsModal(purchaseId: string) {
//     // Fetch details using purchaseId
//     this.dataService.getItemsByPurchaseId(purchaseId).then((data) => {
//       // Populate the "Details" modal with fetched data
//       this.selectedPurchase = data; // Update with the correct property names based on your data structure
//       // Open the "Details" modal
//       this.isDetailModalOpen = true;
//       console.log("Got Youuuuuuuuuuuuuuuu::::::::::::::::::::::::::::::::::::::::::::::::::::::::::")
//     }).catch(error => {
//       console.error('Error fetching data:', error);
//     });
//   }
  
//   closeDetailsModal() {
//     // Close the "Details" modal
//     this.isDetailModalOpen = false;
//   }

//   openAddMaterialModal() {
//     this.isModalOpen = true;
//   }

//   closeAddMaterialModal() {
//     this.isModalOpen = false;
//   }

//   addRow() {
//     this.materialRows.push({
//       categoryName: '',
//       productName: '',
//       quantity: '',
//       quantityUnit: '',
//       warrantyPeriodMonths: '',
//       storeLocation: '',
//       serialNumbers: ['']
//     });
//   }

//   removeRow(index: number) {
//     if (this.materialRows.length > 1) {
//       this.materialRows.splice(index, 1);
//     }
//   }

//   updateSerialNumbersArray(row) {
//     const quantity = row.quantity;
//     row.serialNumbers = Array.from({ length: quantity }, (_, i) => row.serialNumbers[i] || '');
//   }

//   resetAddMaterialModal() {
//     this.material = {
//       grnNo: '',
//       grnDate: '',
//       storeName: '',
//       oemName: '',
//       challanNo: '',
//       challanDate: ''
//     };
//     this.materialRows = [{
//       categoryName: '',
//       productName: '',
//       quantity: '',
//       quantityUnit: '',
//       warrantyPeriodMonths: '',
//       storeLocation: '',
//       serialNumbers: ['']
//     }];
//   }

//   fetchData() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: 342,
//       employeeId: 342,
//     };
//     console.log('formdata', formData);
//     this.dataService.fetchData(formData).then((data: any) => {
//       console.log('Asset DATA', data);
//       this.purchaseData = data.purchaseData.map((purchaseData) => ({
//         ...purchaseData,
//         quantityRejected: purchaseData.nonUsableItems,
//         stockableQuantity: purchaseData.usableItems,
//         purchaseId: purchaseData.purchaseId
//       }));
//     }).catch(error => {
//       console.error('Error fetching data', error);
//     });
//   }

//   async saveMaterial() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: 342,
//       employeeId: 342,
//       ...this.material,
//       materialRows: this.materialRows
//     };

//     // Save material via API using DataService
//     this.dataService.submitMaterial(this.material, formData).subscribe(async response => {
//       // Show success toast message
//       const toast = await this.toastController.create({
//         message: 'Asset saved successfully!',
//         duration: 5000,
//         position: 'bottom'
//       });
//       await toast.present();

//       // Close the modal
//       this.closeAddMaterialModal();
//       // Refresh the data
//       this.fetchData();
//       // resets the entered data of the Modal: Add Asset
//       this.resetAddMaterialModal()
//     }, async error => {
//       // Handle error
//       const toast = await this.toastController.create({
//         message: 'Failed to save asset. Please try again.',
//         duration: 2000,
//         position: 'bottom'
//       });
//       await toast.present();
//     });
//   }
// }


