import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';


@Component({
  selector: 'app-grn',
  templateUrl: './grn.page.html',
  styleUrls: ['./grn.page.scss'],
})
export class GrnPage implements OnInit {
  purchaseData: any[] = [];
  highlightedRows: Set<number> = new Set();
  userId=localStorage.getItem("userId");
  filteredData: any[] = [];
  isModalOpen = false;
  isDetailModalOpen = false;
  isAddMoreDataModalOpen = false;
  selectedPurchase: any;
  oemsList = [];
  categories = [];
  searchQuery: any;
  purchaseId: any// Added Purchase Id
  poData: any = [];
  data: any = [];
  storeData: any = [];
  data2: any = [];
  selectedPurchaseId: string;
  selectedOemName: string;

  material: any = {
    grnNo: '',
    grnDate: '',
    storeName: '',
    oemName: '',
    challanNo: '',
    challanDate: '',
    storeAddress: '',
    // purchaseId: '' // Added Purchase Id
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
  itemsPerPage = 5;


  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,


  ) { }

  ngOnInit() {
    this.loadOems();
    this.loadCategories();
    this.fetchData();
    this.loadStores();
    this.loadPurchaseId();
  }


  onPurchaseIdChange(event: any) {
    const selectedPo = this.poData.find(po => po.purchaseId === event.detail.value);
    if (selectedPo) {
      this.selectedPurchaseId = selectedPo.purchaseId;
      this.selectedOemName = selectedPo.oemName;
    }
  }
  
  

  loadStores() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
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

  loadPurchaseId() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId
    };
    console.log("UserId:::::::::::::::",formData);
    
    this.dataService.fetchPurchaseId(formData).then((res: any) => {
      this.poData = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching OEM data', error);
    });
  }

  loadCategories() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchCategories(formData).then((res: any) => {
      this.data2 = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching categories data', error);
    });
  }

  navigateToAsset() {
    this.router.navigate(['/asset']);
  }


  async openDetailsModal(challanNumber: string) {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });

    await loading.present();

    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
      challanNumber: challanNumber,
    };

    await this.dataService.getItemsByChallanNo(formData).then(async (data: any[]) => {
      const items = data.map(item => ({
        categoryName: item.categoryName,
        productName: item.productName,
        quantity: item.quantity,
        warrantyPeriodMonths: item.warrantyPeriodMonths,
        storeLocation: item.storeLocation,
        serialNumbers: item.serialNumber ? [item.serialNumber] : [],
        status: item.status,
        challanNo: item.challanNumber,
        // purchaseId: item[0].purchaseId,

      
      }));

      this.selectedPurchase = {
        challanNumber: challanNumber,
        oemName: data[0].oemName,
        storeName: data[0].inventoryStoreName,
        challanDate: data[0].purchaseDate,
        purchaseId: data[0].purchaseId,

        items: items,
  
      };
      console.log("here::::::::::::::::::::::::::::::",this.selectedPurchase)
      await loading.dismiss();

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
    this.resetAddMoreMaterialModal()

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
    this.checkForDuplicates();

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
    this.checkForDuplicates();

    // Optionally recalculate total pages if paging logic is implemented
  }

  removeRow2(index: number) {
    if(this.moreDataRows.length>1){
      this.moreDataRows.splice(index, 1);
    }
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

  resetAddMoreMaterialModal() {
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
    this.moreDataRows=[{
      categoryName: '',
      productName: '',
      quantity: '',
      quantityUnit: '',
      warrantyPeriodMonths: '',
      storeLocation: '',
      serialNumbers: ['']
    }]
  }

  async fetchData() {
    
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();

    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchData(formData).then((data: any) => {
      console.log('Asset DATA', data);
      this.purchaseData = data.purchaseData.map((purchaseData) => ({
        ...purchaseData,
        quantityRejected: purchaseData.nonUsableItems,
        stockableQuantity: purchaseData.usableItems,
        purchaseId: purchaseData.purchaseId
      }));

      this.filteredData = this.purchaseData;
      loading.dismiss();
    }
  
  ).catch(error => {
      console.error('Error fetching data', error);
      loading.dismiss();

    });

  }


  async saveMaterial2() {
    const duplicates = this.checkForDuplicatesInSave();
    if (duplicates.length > 0) {
      const alert = await this.toastController.create({
        message: 'Duplicate serial numbers found: ' + duplicates.join(', '),
        color: 'danger',
        buttons: ['Close'],
      });
      await alert.present();
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Saving Data...',
    });
    await loading.present();
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
      ...this.material,
      // purchaseOrderNo: this.material.purchaseOrderNo, // Include purchaseOrderNo
      materialRows: this.materialRows.map((row, index) => ({
        serialNumber: index + 1, // Add serial number
        ...row
      }))
    };
    this.dataService.submitMaterial(this.material, formData).subscribe(async response => {
      const toast = await this.toastController.create({
        message: response.message || 'Items saved successfully!', // Use response message
        duration: 5000,
        position: 'bottom',
        color: 'success'
      });
      await loading.dismiss();
      await toast.present();
      this.closeAddMaterialModal();
      this.fetchData();
      this.resetAddMaterialModal();
      this.loadPurchaseId();
      await this.generateChallan(); // Call generateChallan after saving material
    }, async error => {
      const toast = await this.toastController.create({
        message: error.error.message || 'Failed to save asset. Please try again.', // Use error message
        duration: 6000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      await loading.dismiss()

    });
  }
  
  
  // saveMoreData() {
  //   const itemDetails = {}; // Object to store details for each product
  
  //   // Aggregate quantities and serial numbers by product name
  //   this.moreDataRows.forEach((row) => {
  //     const productName = row.productName.trim(); // Trim to remove any extra spaces
  //     const quantity = 1; // Assuming each row represents 1 unit, adjust as per your logic
  //     const serialNumbers = row.serialNumbers || [];
  
  //     if (!itemDetails[productName]) {
  //       itemDetails[productName] = {
  //         quantity: 0,
  //         serialNumbers: []
  //       };
  //     }
  
  //     itemDetails[productName].quantity += quantity; // Increase total quantity
  //     itemDetails[productName].serialNumbers.push(...serialNumbers); // Add serial numbers
  //   });
  
  //   // Prepare form data with aggregated quantities and serial numbers
  //   const formData = {
  //     permissionName: 'Tasks',
  //     employeeIdMiddleware: this.userId,
  //     employeeId: this.userId,
  //     purchaseId: this.selectedPurchaseId, // Use the selected purchaseId
  //     challanNo: this.material.challanNo, // Include challanNo here
  //     challanDate: this.material.challanDate,
  //     // purchaseId: this.selectedPurchaseId, // Use the selected purchaseId
  //     oemName: this.selectedOemName, // Use the selected oemName
  //     materialRows: Object.keys(itemDetails).map(productName => ({
  //       challanNo: this.material.challanNo, // Include challanNo for each item
  //       categoryName: this.moreDataRows.find(row => row.productName === productName)?.categoryName || '',
  //       productName: productName,
  //       quantity: itemDetails[productName].quantity, // Use aggregated quantity
  //       quantityUnit: this.moreDataRows.find(row => row.productName === productName)?.quantityUnit || '',
  //       warrantyPeriodMonths: this.moreDataRows.find(row => row.productName === productName)?.warrantyPeriodMonths || '',
  //       storeLocation: this.moreDataRows.find(row => row.productName === productName)?.storeLocation || '',
  //       serialNumbers: itemDetails[productName].serialNumbers
  //     }))
  //   };
  
  //   // Log the form data to ensure it's correct before proceeding
  //   console.log('Items to be included in the challan:', formData.materialRows);

  //   const challanNo = this.material.challanNo;

  //   // Send form data to backend service
  //   this.dataService.submitMoreData(this.material, formData).subscribe(
  //     async response => {
  //       const toast = await this.toastController.create({
  //         message: response.message || 'Items Added successfully!',
  //         duration: 6000,
  //         position: 'bottom',
  //         color: 'success'
  //       });
  //       await toast.present();
  //       this.closeAddMoreDataModal();
  //       this.fetchData();
  //       this.resetAddMoreMaterialModal();
  //       await this.generateChallanforNew(formData.materialRows, challanNo);      },
  //     async error => {
  //       const toast = await this.toastController.create({
  //         message: error.error.message || 'Failed to save more data. Please try again.',
  //         duration: 6000,
  //         position: 'bottom',
  //         color: 'danger'
  //       });
  //       await toast.present();
  //     }
  //   );
  // }

 async saveMoreData() {
  const duplicates = this.checkForDuplicatesInSave();
  if (duplicates.length > 0) {
    const alert = await this.toastController.create({
      message: 'Duplicate serial numbers found: ' + duplicates.join(', '),
      buttons: ['OK'],
    });
    await alert.present();
    return;
  }
    const loading = await this.loadingController.create({
      message: 'Saving Data...',
    });
    await loading.present();
    const itemDetails = {}; // Object to store details for each product
    // Aggregate quantities and serial numbers by product name
    this.moreDataRows.forEach((row) => {
      const productName = row.productName.trim(); // Trim to remove any extra spaces
      const quantity = 1; // Assuming each row represents 1 unit, adjust as per your logic
      const serialNumbers = row.serialNumbers || [];
  
      if (!itemDetails[productName]) {
        itemDetails[productName] = {
          quantity: 0,
          serialNumbers: []
        };
      }
  
      itemDetails[productName].quantity += quantity; // Increase total quantity
      itemDetails[productName].serialNumbers.push(...serialNumbers); // Add serial numbers
    });
  
    // Prepare form data with aggregated quantities and serial numbers
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
      oemName: this.selectedOemName, // Use the selected oemName
      challanNo: this.material.challanNo, // Include challanNo here
      challanDate: this.material.challanDate,
      purchaseId: this.selectedPurchaseId, // Use the selected purchaseId
      materialRows: Object.keys(itemDetails).map(productName => ({
        challanNo: this.material.challanNo, // Include challanNo for each item
        categoryName: this.moreDataRows.find(row => row.productName === productName)?.categoryName || '',
        productName: productName,
        quantity: itemDetails[productName].quantity, // Use aggregated quantity
        quantityUnit: this.moreDataRows.find(row => row.productName === productName)?.quantityUnit || '',
        warrantyPeriodMonths: this.moreDataRows.find(row => row.productName === productName)?.warrantyPeriodMonths || '',
        storeLocation: this.moreDataRows.find(row => row.productName === productName)?.storeLocation || '',
        serialNumbers: itemDetails[productName].serialNumbers
      }))
    };
  
    const challanNo = this.material.challanNo;
  
    // Send form data to backend service
    this.dataService.submitMoreData(this.material, formData).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: response.message || 'Items Added successfully!',
          duration: 6000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();
        await loading.dismiss()
        this.closeAddMoreDataModal();
        this.fetchData();
        this.resetAddMoreMaterialModal();
        await this.generateChallanforNew(formData.materialRows, challanNo);
      },
      async error => {
        const toast = await this.toastController.create({
          message: error.error.message || 'Failed to save more data. Please try again.',
          duration: 6000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
        await loading.dismiss()

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
  
    // const imageUrl = 'assets/challanFormat.jpg'; // Update the path to the actual path where the image is stored
    const imageUrl = 'assets/challanFormatFinal_page-0002.jpg'; // Update the path to the actual path where the image is stored
  
    try {
      // Load the image as base64
      const imgData = await this.getBase64ImageFromURL(imageUrl);
  
      // Add the image as the background
      const addTemplate = (pageIndex) => {
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297); // Position the image as per your template layout
        doc.setFontSize(12);
        
        // Calculate the width of the OEM name text and center it
        const oemName = this.selectedPurchase.oemName || '';
        const textWidth = doc.getTextWidth(`${oemName}`);
        const pageWidth = doc.internal.pageSize.getWidth();
        const textX = (pageWidth - textWidth) / 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13); // Ensure font size remains the same
        doc.text(`OEM:${oemName}`, textX, 28); // Center-aligned OEM Name at the top
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10); // Ensure font size remains the same
        doc.text(`Purchase Order ID: ${this.selectedPurchase.purchaseId}`, 10, 20);
        doc.text(`Challan Number: ${this.selectedPurchase.challanNumber}`, 10, 25);
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


  async generateChallanforNew(items: any[], challanNo: string) {
    const doc = new jsPDF();
    const imageUrl = 'assets/challanFormatFinal_page-0002.jpg'; // Update the path to the actual path where the image is stored
  
    try {
      const imgData = await this.getBase64ImageFromURL(imageUrl);
  
      const addTemplate = (pageIndex) => {
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297); // Position the image as per your template layout
        doc.setFontSize(12);
        const oemName = this.selectedPurchase.oemName || '';
        const textWidth = doc.getTextWidth(`${oemName}`);
        const pageWidth = doc.internal.pageSize.getWidth();
        const textX = (pageWidth - textWidth) / 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13); // Ensure font size remains the same
        doc.text(`OEM:${oemName}`, textX, 28); // Center-aligned OEM Name at the top
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10); // Ensure font size remains the same
        doc.text(`Purchase Order ID: ${this.selectedPurchase.purchaseId}`, 10, 20); // Print Challan Number at the top of each page
        doc.text(`Challan No: ${challanNo}`, 10, 28); // Print Challan Number at the top of each page
        doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' }); // Print Page Number at the top right of each page
      };
  
      let pageIndex = 0;
      addTemplate(pageIndex);
  
      doc.setFontSize(10);
      const startX = 10;
      const initialY = 73; // Initial position for the first product
      let startY = initialY;
      const lineHeight = 8; // Reduce line height to reduce spaces between rows
      const maxPageHeight = 270; // Maximum height for the content on one page before adding a new page
  
      items.forEach((item, index) => {
        const serialNumbers = item.serialNumbers.join(', ');
        const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
  
        const totalHeight = splitSerialNumbers.length * lineHeight;
  
        if (startY + totalHeight > maxPageHeight) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex); // Add the template to the new page
          doc.setFontSize(10); // Ensure font size remains the same
          startY = initialY; // Reset startY to initialY for the new page
        }
  
        doc.text(`${index + 1}`, startX + 6.75, startY); // Serial number
        doc.text(item.productName || '', startX + 15, startY); // Product Name
        doc.text(item.quantity.toString(), startX + 177, startY); // Quantity
        doc.text(this.selectedPurchase.storeLocation || '', startX + 110, startY);
        doc.text(this.selectedPurchase.warrantyPeriodMonths || '', startX + 140, startY);
        doc.text(this.selectedPurchase.status || '', startX + 170, startY);
  
        splitSerialNumbers.forEach((line, lineIndex) => {
          doc.text(line, startX + 70, startY + (lineIndex * lineHeight));
        });
  
        startY += totalHeight + lineHeight / 2; // Add half lineHeight for minimal space between products
      });
  
      doc.save('Inward-Challan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
  
  async saveMaterial() {
    const duplicates = this.checkForDuplicatesInSave();
    if (duplicates.length > 0) {
      const alert = await this.toastController.create({
        message: 'Duplicate serial numbers found: ' + duplicates.join(', '),
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
      ...this.material,
      materialRows: this.materialRows.map((row) => ({
        serialNumber: row.serialNumbers[0],
        ...row
      }))
    };
    this.dataService.submitMaterial(this.material, formData).subscribe(async response => {
      const toast = await this.toastController.create({
        message: response.message || 'Items saved successfully!',
        duration: 5000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
      this.closeAddMaterialModal();
      this.fetchData();
      this.resetAddMaterialModal();
      await this.generateChallan();
      this.loadPurchaseId();
    }, async error => {
      const toast = await this.toastController.create({
        message: error.error.message || 'Failed to save asset. Please try again.',
        duration: 6000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    });
  }
  
  checkForDuplicatesInSave() {
    const serialNumbers = this.materialRows.map(row => row.serialNumbers[0]);
    const duplicates = serialNumbers.filter((item, index) => serialNumbers.indexOf(item) !== index && item);
    return [...new Set(duplicates)];
  }
  
  checkForDuplicates() {
    this.highlightedRows.clear();
    const serialNumbersSet = new Set<string>();
    this.materialRows.forEach((row, index) => {
      const serialNumber = row.serialNumbers[0];
      if (serialNumbersSet.has(serialNumber) && serialNumber) {
        this.highlightedRows.add(index);
      } else {
        serialNumbersSet.add(serialNumber);
      }
    });
  }
  onSerialNumberChange(index: number) {
    this.highlightedRows.delete(index);
    this.checkForDuplicates();
  }

  get paginatedRows2() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.moreDataRows.slice(start, end);
  }
get totalPages2() {
    return Math.ceil(this.moreDataRows.length / this.itemsPerPage);
  }
nextPage2() {
    if (this.currentPage < this.totalPages2) {
      this.currentPage++;
    }
  }
prevPage2() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  updateChallanMinDate() {
    if (this.material.grnDate) {
      this.material.challanDate = '';
    }
  }
}
