import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-grn',
  templateUrl: './grn.page.html',
  styleUrls: ['./grn.page.scss'],
})
export class GrnPage implements OnInit {
  purchaseData: any[] = [];
  userId=localStorage.getItem("userId");
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
  moreDataRows: any[] = [{
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
    private toastController: ToastController,
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
      employeeIdMiddleware: this.userId,
      employeeId: this.userId
    };
    console.log("UserId:::::::::::::::",formData);
    
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
    this.resetAddMaterialModal()
  }

  openAddMoreDataModal() {
    this.isAddMoreDataModalOpen = true;
  }

  closeAddMoreDataModal() {
    this.isAddMoreDataModalOpen = false;
    this.resetAddMaterialModal()

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

  addRow2(rowData: any = null) {
    const newRow = rowData
      ? { ...rowData, serialNumbers: [...rowData.serialNumbers] }
      : {
          categoryName: '',
          productName: '',
          quantityUnit: '',
          warrantyPeriodMonths: '',
          serialNumbers: ['']
        };
    this.moreDataRows.push(newRow);
    // Optionally recalculate total pages if paging logic is implemented
  }

  removeRow2(index: number) {
    this.moreDataRows.splice(index, 1);
    // Optionally recalculate total pages if paging logic is implemented
  }


  updateSerialNumbersArray(row) {
    // Do nothing here to keep serialNumbers array unchanged
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
      materialRows: this.moreDataRows.map(row => ({
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

  async generateChallan() {
    const doc = new jsPDF();

    const imageUrl = 'assets/challanFormat.jpg'; // Update the path to the actual path where the image is stored

    try {
      // Load the image as base64
      const imgData = await this.getBase64ImageFromURL(imageUrl);

      // Add the image as the background
      const addTemplate = (pageIndex) => {
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297); // Position the image as per your template layout
        doc.setFontSize(12);
        doc.text(`Challan Number: #${this.selectedPurchase.purchaseId}`, 10, 10); // Print Challan Number at the top of each page
        doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' }); // Print Page Number at the top right of each page
      };

      let pageIndex = 0;
      addTemplate(pageIndex); // Add template to the first page

      // Add your data over the template
      doc.setFontSize(10);
      const startX = 10;
      const initialY = 73; // Initial position for the first product
      let startY = initialY;
      const lineHeight = 8; // Reduce line height to reduce spaces between rows
      const maxPageHeight = 270; // Maximum height for the content on one page before adding a new page
      const itemDetails = {}; // Object to store details for each product

      // Aggregate quantities and serial numbers by product name
      this.selectedPurchase.items.forEach((item) => {
        const productName = item.productName;
        const quantity = item.quantity || 1; // Assuming at least 1 quantity if not specified
        const serialNumbers = item.serialNumbers || [];

        if (!itemDetails[productName]) {
          itemDetails[productName] = {
            quantity: 0,
            serialNumbers: []
          };
        }
        itemDetails[productName].quantity += quantity;
        itemDetails[productName].serialNumbers.push(...serialNumbers);
      });

      // Iterate through aggregated items and add them to the PDF
      Object.keys(itemDetails).forEach((productName, index) => {
        // Split serial numbers into multiple lines if they exceed 95 width
        const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
        const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);

        // Calculate the total height needed for this product entry
        const totalHeight = splitSerialNumbers.length * lineHeight;

        // Check if adding this product will exceed the max page height
        if (startY + totalHeight > maxPageHeight) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex); // Add the template to the new page
          doc.setFontSize(10); // Ensure font size remains the same
          startY = initialY; // Reset startY to initialY for the new page
        }

        // Add product details
        doc.text(`${index + 1}`, startX + 6.75, startY); // Serial number
        doc.text(productName || '', startX + 15, startY); // Product Name
        doc.text(itemDetails[productName].quantity.toString(), startX + 177, startY); // Quantity
        doc.text(this.selectedPurchase.challanNo || '', startX + 110, startY);
        doc.text(this.selectedPurchase.storeLocation || '', startX + 140, startY);
        doc.text(this.selectedPurchase.warrantyPeriodMonths || '', startX + 170, startY);
        doc.text(this.selectedPurchase.status || '', startX + 190, startY);

        // Add serial numbers
        splitSerialNumbers.forEach((line, lineIndex) => {
          doc.text(line, startX + 70, startY + (lineIndex * lineHeight));
        });

        // Update startY for the next product
        startY += totalHeight + lineHeight / 2; // Add half lineHeight for minimal space between products
      });

      // Save the PDF
      doc.save('Inward-Challan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg');
          resolve(dataURL);
        } else {
          reject(new Error('Canvas context is null'));
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  }
}

// import { Component, OnInit } from '@angular/core';
// import { ModalController, ToastController } from '@ionic/angular';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// @Component({
//   selector: 'app-grn',
//   templateUrl: './grn.page.html',
//   styleUrls: ['./grn.page.scss'],
// })
// export class GrnPage implements OnInit {
//   purchaseData: any[] = [];
//   filteredData: any[] = [];
//   isModalOpen = false;
//   isDetailModalOpen = false;
//   isAddMoreDataModalOpen = false;
//   selectedPurchase: any;
//   oemsList = [];
//   categories = [];
//   searchQuery: any;
//   data: any = [];
//   storeData: any = [];
//   data2: any = [];
//   material: any = {
//     grnNo: '',
//     grnDate: '',
//     storeName: '',
//     oemName: '',
//     challanNo: '',
//     challanDate: '',
//     storeAddress: ''
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
//   currentPage = 1;
//   itemsPerPage = 10;

//   constructor(
//     private modalController: ModalController,
//     private dataService: DataService,
//     private toastController: ToastController,

//   ) { }


//   ngOnInit() {
//     this.loadOems();
//     this.loadCategories();
//     this.fetchData();
//     this.loadStores();
//   }

//   loadStores() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: 342,
//       employeeId: 342,
//     };

//     this.dataService.fetchStore(formData).then((res: any) => {
//       this.storeData = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching store data', error);
//     });
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
//       console.error('Error fetching categories data', error);
//     });
//   }

//   openDetailsModal(purchaseId: string) {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: 342,
//       employeeId: 342,
//       purchaseId: purchaseId
//     };

//     this.dataService.getItemsByPurchaseId(formData).then((data: any[]) => {
//       const items = data.map(item => ({
//         categoryName: item.categoryName,
//         productName: item.productName,
//         quantity: item.quantity,
//         warrantyPeriodMonths: item.warrantyPeriodMonths,
//         storeLocation: item.storeLocation,
//         serialNumbers: item.serialNumber ? [item.serialNumber] : [],
//         status: item.status,
//         challanNo: item.challanNumber
//       }));

//       this.selectedPurchase = {
//         purchaseId: purchaseId,
//         oemName: data[0].oemName,
//         storeName: data[0].inventoryStoreName,
//         challanDate: data[0].purchaseDate,
//         items: items
//       };

//       this.isDetailModalOpen = true;
//     }).catch(error => {
//       console.error('Error fetching data:', error);
//     });
//   }

//   closeDetailsModal() {
//     this.isDetailModalOpen = false;
//   }

//   openAddMaterialModal() {
//     this.isModalOpen = true;
//   }

//   closeAddMaterialModal() {
//     this.isModalOpen = false;
//   }

//   openAddMoreDataModal() {
//     this.isAddMoreDataModalOpen = true;
//   }

//   closeAddMoreDataModal() {
//     this.isAddMoreDataModalOpen = false;
//   }

//   addRow(rowData = null) {
//     const newRow = rowData ? JSON.parse(JSON.stringify(rowData)) : {
//       categoryName: '',
//       productName: '',
//       quantity: '',
//       quantityUnit: '',
//       warrantyPeriodMonths: '',
//       storeLocation: '',
//       serialNumbers: ['']
//     };
//     this.materialRows.push(newRow);
//   }

//   removeRow(index: number) {
//     if (this.materialRows.length > 1) {
//       this.materialRows.splice(index, 1);
//     }
//   }

//   updateSerialNumbersArray(row) {
//     // Do nothing here to keep serialNumbers array unchanged
//   }

//   resetAddMaterialModal() {
//     this.material = {
//       grnNo: '',
//       grnDate: '',
//       storeName: '',
//       oemName: '',
//       challanNo: '',
//       challanDate: '',
//       storeAddress: ''
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

//     this.dataService.fetchData(formData).then((data: any) => {
//       console.log('Asset DATA', data);
//       this.purchaseData = data.purchaseData.map((purchaseData) => ({
//         ...purchaseData,
//         quantityRejected: purchaseData.nonUsableItems,
//         stockableQuantity: purchaseData.usableItems,
//         purchaseId: purchaseData.purchaseId
//       }));
//       this.filteredData = this.purchaseData; // Initialize filtered data
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

//     this.dataService.submitMaterial(this.material, formData).subscribe(async response => {
//       const toast = await this.toastController.create({
//         message: 'Asset saved successfully!',
//         duration: 5000,
//         position: 'bottom'
//       });
//       await toast.present();

//       this.closeAddMaterialModal();
//       this.fetchData();
//       this.resetAddMaterialModal();
//     }, async error => {
//       const toast = await this.toastController.create({
//         message: 'Failed to save asset. Please try again.',
//         duration: 2000,
//         position: 'bottom'
//       });
//       await toast.present();
//     });
//   }

//   async saveMoreData() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: 342,
//       employeeId: 342,
//       purchaseId: this.selectedPurchase.purchaseId,
//       oemName: this.selectedPurchase.oemName,
//       challanNo: this.material.challanNo,
//       challanDate: this.material.challanDate,
//       materialRows: this.materialRows.map(row => ({
//         categoryName: row.categoryName,
//         productName: row.productName,
//         quantity: row.quantity,
//         quantityUnit: row.quantityUnit,
//         warrantyPeriodMonths: row.warrantyPeriodMonths,
//         storeLocation: row.storeLocation,
//         serialNumber: row.serialNumbers[0] // Convert serialNumbers array to single serialNumber
//       }))
//     };

//     this.dataService.submitMoreData(this.material, formData).subscribe(
//       async response => {
//         const toast = await this.toastController.create({
//           message: 'More data saved successfully!',
//           duration: 5000,
//           position: 'bottom'
//         });
//         await toast.present();

//         this.closeAddMoreDataModal();
//         this.fetchData();
//       },
//       async error => {
//         const toast = await this.toastController.create({
//           message: 'Failed to save more data. Please try again.',
//           duration: 2000,
//           position: 'bottom'
//         });
//         await toast.present();
//       }
//     );
//   }

//   applyFilter() {
//     if (this.searchQuery.trim() === '') {
//       this.filteredData = this.purchaseData;
//     } else {
//       this.filteredData = this.purchaseData.filter(item =>
//         item.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
//       );
//     }
//   }

//   get paginatedRows() {
//     const start = (this.currentPage - 1) * this.itemsPerPage;
//     const end = start + this.itemsPerPage;
//     return this.materialRows.slice(start, end);
//   }

//   get totalPages() {
//     return Math.ceil(this.materialRows.length / this.itemsPerPage);
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }

//   async generateChallan() {
//     const doc = new jsPDF();

//     const imageUrl = 'assets/challanFormat.jpg'; // Update the path to the actual path where the image is stored

//     try {
//       // Load the image as base64
//       const imgData = await this.getBase64ImageFromURL(imageUrl);

//       // Add the image as the background
//       const addTemplate = (pageIndex) => {
//         doc.addImage(imgData, 'JPEG', 0, 0, 210, 297); // Position the image as per your template layout
//         doc.setFontSize(12);
//         doc.text(`Challan Number: #${this.selectedPurchase.purchaseId}`, 10, 10); // Print Challan Number at the top of each page
//         doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' }); // Print Page Number at the top right of each page
//       };

//       let pageIndex = 0;
//       addTemplate(pageIndex); // Add template to the first page

//       // Add your data over the template
//       doc.setFontSize(10);
//       const startX = 10;
//       const initialY = 73; // Initial position for the first product
//       let startY = initialY;
//       const lineHeight = 8; // Reduce line height to reduce spaces between rows
//       const maxPageHeight = 270; // Maximum height for the content on one page before adding a new page
//       const itemDetails = {}; // Object to store details for each product

//       // Aggregate quantities and serial numbers by product name
//       this.selectedPurchase.items.forEach((item) => {
//         const productName = item.productName;
//         const quantity = item.quantity || 1; // Assuming at least 1 quantity if not specified
//         const serialNumbers = item.serialNumbers || [];

//         if (!itemDetails[productName]) {
//           itemDetails[productName] = {
//             quantity: 0,
//             serialNumbers: []
//           };
//         }
//         itemDetails[productName].quantity += quantity;
//         itemDetails[productName].serialNumbers.push(...serialNumbers);
//       });

//       // Iterate through aggregated items and add them to the PDF
//       Object.keys(itemDetails).forEach((productName, index) => {
//         // Split serial numbers into multiple lines if they exceed 95 width
//         const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
//         const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);

//         // Calculate the total height needed for this product entry
//         const totalHeight = splitSerialNumbers.length * lineHeight;

//         // Check if adding this product will exceed the max page height
//         if (startY + totalHeight > maxPageHeight) {
//           pageIndex++;
//           doc.addPage();
//           addTemplate(pageIndex); // Add the template to the new page
//           doc.setFontSize(10); // Ensure font size remains the same
//           startY = initialY; // Reset startY to initialY for the new page
//         }

//         // Add product details
//         doc.text(`${index + 1}`, startX + 6.75, startY); // Serial number
//         doc.text(productName || '', startX + 15, startY); // Product Name
//         doc.text(itemDetails[productName].quantity.toString(), startX + 177, startY); // Quantity
//         doc.text(this.selectedPurchase.challanNo || '', startX + 110, startY);
//         doc.text(this.selectedPurchase.storeLocation || '', startX + 140, startY);
//         doc.text(this.selectedPurchase.warrantyPeriodMonths || '', startX + 170, startY);
//         doc.text(this.selectedPurchase.status || '', startX + 190, startY);

//         // Add serial numbers
//         splitSerialNumbers.forEach((line, lineIndex) => {
//           doc.text(line, startX + 70, startY + (lineIndex * lineHeight));
//         });

//         // Update startY for the next product
//         startY += totalHeight + lineHeight / 2; // Add half lineHeight for minimal space between products
//       });

//       // Save the PDF
//       doc.save('challan.pdf');
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     }
//   }



//   getBase64ImageFromURL(url: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = 'Anonymous';
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext('2d');
//         if (ctx) {
//           ctx.drawImage(img, 0, 0);
//           const dataURL = canvas.toDataURL('image/jpeg');
//           resolve(dataURL);
//         } else {
//           reject(new Error('Canvas context is null'));
//         }
//       };
//       img.onerror = reject;
//       img.src = url;
//     });
//   }

// ///////////////

// }
