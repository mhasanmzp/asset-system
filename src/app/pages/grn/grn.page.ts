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
  isAddMoreDataModalOpen = false;
  selectedPurchase: any;
  oemsList = [];
  categories = [];
  searchQuery: any;
  data: any = [];
  storeData: any = [];
  data2: any = [];
  material: any = {
    grnNo: '',
    grnDate: '',
    storeName: '',
    oemName: '',
    challanNo: '',
    challanDate: '',
    storeAddress: ''
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
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadOems();
    this.loadCategories();
    this.fetchData();
    this.loadStores();
  }

  loadStores() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };

    this.dataService.fetchStore(formData).then((res: any) => {
      this.storeData = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching store data', error);
    });
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
      console.error('Error fetching categories data', error);
    });
  }

  openDetailsModal(purchaseId: string) {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
      purchaseId: purchaseId
    };

    this.dataService.getItemsByPurchaseId(formData).then((data: any[]) => {
      const items = data.map(item => ({
        categoryName: item.categoryName,
        productName: item.productName,
        quantity: item.quantity,
        warrantyPeriodMonths: item.warrantyPeriodMonths,
        storeLocation: item.storeLocation,
        serialNumbers: item.serialNumber ? [item.serialNumber] : [],
        status: item.status,
        challanNo: item.challanNumber
      }));

      this.selectedPurchase = {
        purchaseId: purchaseId,
        oemName: data[0].oemName,
        storeName: data[0].inventoryStoreName,
        challanDate: data[0].purchaseDate,
        items: items
      };

      this.isDetailModalOpen = true;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  closeDetailsModal() {
    this.isDetailModalOpen = false;
  }

  openAddMaterialModal() {
    this.isModalOpen = true;
  }

  closeAddMaterialModal() {
    this.isModalOpen = false;
  }

  openAddMoreDataModal() {
    this.isAddMoreDataModalOpen = true;
  }

  closeAddMoreDataModal() {
    this.isAddMoreDataModalOpen = false;
  }

  addRow(rowData = null) {
    const newRow = rowData ? JSON.parse(JSON.stringify(rowData)) : {
      categoryName: '',
      productName: '',
      quantity: '',
      quantityUnit: '',
      warrantyPeriodMonths: '',
      storeLocation: '',
      serialNumbers: ['']
    };
    this.materialRows.push(newRow);
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
      challanDate: '',
      storeAddress: ''
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

    this.dataService.submitMaterial(this.material, formData).subscribe(async response => {
      const toast = await this.toastController.create({
        message: 'Asset saved successfully!',
        duration: 5000,
        position: 'bottom'
      });
      await toast.present();

      this.closeAddMaterialModal();
      this.fetchData();
      this.resetAddMaterialModal();
    }, async error => {
      const toast = await this.toastController.create({
        message: 'Failed to save asset. Please try again.',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    });
  }

  async saveMoreData() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
      purchaseId: this.selectedPurchase.purchaseId,
      oemName: this.selectedPurchase.oemName,
      challanNo: this.material.challanNo,
      challanDate: this.material.challanDate,
      materialRows: this.materialRows.map(row => ({
        categoryName: row.categoryName,
        productName: row.productName,
        quantity: row.quantity,
        quantityUnit: row.quantityUnit,
        warrantyPeriodMonths: row.warrantyPeriodMonths,
        storeLocation: row.storeLocation,
        serialNumber: row.serialNumbers[0] // Convert serialNumbers array to single serialNumber
      }))
    };

    this.dataService.submitMoreData(this.material, formData).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'More data saved successfully!',
          duration: 5000,
          position: 'bottom'
        });
        await toast.present();

        this.closeAddMoreDataModal();
        this.fetchData();
      },
      async error => {
        const toast = await this.toastController.create({
          message: 'Failed to save more data. Please try again.',
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
      }
    );
  }


  applyFilter() {
    if (this.searchQuery.trim() === '') {
      this.filteredData = this.purchaseData;
    } else {
      this.filteredData = this.purchaseData.filter(item =>
        item.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  get paginatedRows() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.materialRows.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.materialRows.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
