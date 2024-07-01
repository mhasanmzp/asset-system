import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf'; // Ensure you have the jsPDF library installed
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
  selectedOem: string = '';
  selectedOemAddress: string = '';
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
  clients: any[] = [];
  warehouseProductData: any[] = [];
  selectedClient: any;
  filteredWarehouseProductList: any[] = [];
  storeData:any[] = [];
  data: any[] = [];
  data2: any[] = [];

  constructor(
    private modalController: ModalController,
    private dataService: DataService, // Inject the DataService
    private toastController: ToastController,
    private loadingController: LoadingController // Inject LoadingController
  ) {}

  ngOnInit() {
    this.loadDeliveredData();
    this.loadSubstations();
    this.loadOems();
    this.loadCategories();
    this.loadStores();
    this.loadClients();
    this.fetchClientWarehouses()
    
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
  
  loadClients() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchClients(formData).then((res: any) => {
      this.clients = res;
      console.log("Clients Response:", res);
    }).catch(error => {
      console.error('Error fetching clients data', error);
    });
  }

  fetchWarehouseProducts() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };
    this.dataService.fetchWarehouseProducts(formData).then((data: any) => {
      this.warehouseProductData = data.map((product) => ({
        ...product,
        SerialNumber: product.serialNumber,
        ProductName: product.productName,
        Status: product.status,
        selected: false // Add selected property
      }));
      this.applyWarehouseFilters(); // Filter products after loading
    }).catch(error => {
      console.error('Error fetching warehouse products', error);
    });
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
    if (this.selectedClientSite) {
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: this.userId,
        employeeId: this.userId,
        clientName: this.selectedClientSite,
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
    this.generateOemChallan()
    // Add any specific logic for OEM return here if needed
    await this.submitReturnToServer();
  }

  async submitSiteReturn() {
    this.closeModal();
    this.generateChallan();
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
      .fetchFaultyData(formData)
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

  // async generateChallan() {
  //   const doc = new jsPDF();
  //   const imageUrl = 'assets/outwardChallan.jpg'; // Update the path to the actual path where the image is stored
  //   let totalQuantity = 0;
  //   try {
  //     const imgData = await this.getBase64ImageFromURL(imageUrl);

  //     const addTemplate = (pageIndex) => {
  //       doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  //       doc.setFontSize(10);
  //       doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' });
  //     };

  //     let pageIndex = 0;
  //     addTemplate(pageIndex);

  //     doc.setFontSize(8);
  //     const startX = 10;
  //     const initialY = 73;
  //     let startY = initialY;
  //     const lineHeight = 8;
  //     const reducedLineHeight = 3.5;
  //     const maxPageHeight = 270;

  //     // Add modal data to the PDF
  //     doc.setFontSize(9);
  //     doc.setFont("helvetica", "bold");
  //     doc.text(`${this.selectedClientSite}`, 13.5, 53.5);
  //     startY += lineHeight;
  //     doc.setFont("helvetica", "normal");

  //     doc.setFontSize(8);
  //     const wrappedText = doc.splitTextToSize(this.selectedWarehouseSite, 80); // Adjust 100 as per your required width
  //     wrappedText.forEach(line => {
  //       if (startY + lineHeight > maxPageHeight) {
  //         pageIndex++;
  //         doc.addPage();
  //         addTemplate(pageIndex);
  //         doc.setFontSize(10); // Reset font size on the new page
  //         startY = initialY;
  //       }
  //       doc.text(line, 13.5, 60);
  //       startY += lineHeight;
  //     });
  //     doc.text(`GSTIN/UIN:   ${this.gstNumberSite}`, 13.5, 67.5);
  //     startY += lineHeight;

  //     doc.setFontSize(9);
  //     doc.setFont("helvetica", "bold");
  //     doc.text(`${this.billingClientSite}`, 13.5, 90);
  //     startY += lineHeight;
  //     doc.setFont("helvetica", "normal");

  //     doc.setFontSize(8);
  //     const wrappedText2 = doc.splitTextToSize(this.billingWarehouseSite, 80); // Adjust 100 as per your required width
  //     wrappedText2.forEach(line => {
  //       if (startY + lineHeight > maxPageHeight) {
  //         pageIndex++;
  //         doc.addPage();
  //         addTemplate(pageIndex);
  //         doc.setFontSize(10); // Reset font size on the new page
  //         startY = initialY;
  //       }
  //       doc.text(line, 13.5, 97.5);
  //       startY += lineHeight;
  //     });
  //     doc.text(`GSTIN/UIN:   ${this.billingGstNumberSite}`, 13.5, 105);
  //     startY += lineHeight;

  //     const itemDetails = {};

  //     this.changedAssets.forEach((item) => {
  //       const productName = item.productName;
  //       const quantity = item.quantity || 1;
  //       const hsnNumber = item.hsnNumber || ''; // Assuming hsnNumber is a property of item

  //       if (!itemDetails[productName]) {
  //         itemDetails[productName] = {
  //           quantity: 0,
  //           serialNumbers: [],
  //           hsnNumber: hsnNumber
  //         };
  //       }
  //       itemDetails[productName].quantity += quantity;
  //       console.log("itemDetails :::::::::::::::::::::::",itemDetails);
        
  //     });

  //     let randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
  //     let formattedDate = new Date().toISOString().slice(0, 10).split('-').reverse().join('-');

  //     startY += 15;

  //     Object.keys(itemDetails).forEach((productName, index) => {
  //       const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
  //       const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
  //       const totalHeight = splitSerialNumbers.length * lineHeight;

  //       if (startY + totalHeight > maxPageHeight) {
  //         pageIndex++;
  //         doc.addPage();
  //         addTemplate(pageIndex);
  //         doc.setFontSize(7);
  //         startY = initialY + 15;
  //       }

  //       const productNameY = startY;
  //       const quantityY = startY;
  //       const serialNumbersY = startY;
  //       const hsnNumberY = startY;
  //       doc.setFontSize(10);
  //       doc.text(`${index + 1}`, 13.5, productNameY);
  //       doc.setFont("helvetica", "bold");
  //       doc.text(productName || '', 20, productNameY);
  //       doc.setFont("helvetica", "normal");
  //       doc.text(itemDetails[productName].quantity.toString(), 167.5, quantityY);
  //       doc.setFontSize(9);
  //       doc.text(itemDetails[productName].hsnNumber, 141.5, hsnNumberY); // HSN Number
       

  //       splitSerialNumbers.forEach(line => {
  //         if (startY + lineHeight > maxPageHeight) {
  //           pageIndex++;
  //           doc.addPage();
  //           addTemplate(pageIndex);
  //           doc.setFontSize(7);
  //           startY = initialY + 15;
  //         }
  //         doc.text(line, 60, serialNumbersY);
  //         startY += reducedLineHeight;
  //       });

  //       totalQuantity += itemDetails[productName].quantity;

  //       startY += reducedLineHeight / 2;

  //       if (index === 0) {
  //         doc.text(`${this.companyPanNumberSite}`, 60, 224);
  //         doc.text(`DN-${randomSixDigitNumber}`, 96.5, 24);
  //         doc.text(`${this.buyersOrderNumberSite}`, 96.5, 51.25);
  //         doc.text(`${this.dispatchDocNoSite}`, 96.5, 60);
  //         doc.text(`${this.termsOfDeliverySite}`, 96.5, 86);
  //         doc.setFontSize(9);
  //         doc.text(`${this.dispatchedThroughSite}`, 96.5, 68);
  //         doc.text(formattedDate, 137, 24);
  //         doc.text(`${this.paymentTermsSite}`, 137, 33.5);
  //         doc.text(`${this.dispatchedDateSite}`, 137, 51);
  //         doc.text(`${this.destinationSite}`, 137, 68);
  //         doc.text(`${this.motorVehicleNoSite}`, 137, 77);
  //         let billOfLading = `${this.dispatchDocNoSite} dt. ${formattedDate}`;
  //         doc.text(`${billOfLading}`, 96.5, 77);
  //         let refNoAndDate = `SO/${randomSixDigitNumber} dt. ${formattedDate}`;
  //         doc.text(`${refNoAndDate}`, 96.5, 41.7);
  //       }
  //     });

  //     doc.text(`${totalQuantity}`, 166, 197);

  //     doc.save(`${this.selectedClientSite}-Delivery-Return-Challan.pdf`);
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //   }
  // }

  async generateChallan() {
    const doc = new jsPDF();
    const imageUrl = 'assets/outwardChallan.jpg'; // Update the path to the actual path where the image is stored
    let totalQuantity = 0;
  
    try {
      const imgData = await this.getBase64ImageFromURL(imageUrl);
  
      const addTemplate = (pageIndex) => {
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        doc.setFontSize(10);
        doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' });
      };
  
      const addCommonInfo = () => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(`${this.selectedClientSite}`, 13.5, 53.5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
  
        const wrappedText = doc.splitTextToSize(this.selectedWarehouseSite, 80);
        let startY = 60;
        wrappedText.forEach(line => {
          doc.text(line, 13.5, startY);
          startY += 8;
        });
        doc.text(`GSTIN/UIN:   ${this.gstNumberSite}`, 13.5, startY);
  
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(`${this.billingClientSite}`, 13.5, 90);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
  
        const wrappedText2 = doc.splitTextToSize(this.billingWarehouseSite, 80);
        startY = 97.5;
        wrappedText2.forEach(line => {
          doc.text(line, 13.5, startY);
          startY += 8;
        });
        doc.text(`GSTIN/UIN:   ${this.billingGstNumberSite}`, 13.5, startY);
      };
  
      let pageIndex = 0;
      addTemplate(pageIndex);
      addCommonInfo();
  
      doc.setFontSize(8);
      const initialY = 140; // Adjusted Y position for product list
      let startY = initialY;
      const lineHeight = 8;
      const reducedLineHeight = 3.5;
      const maxPageHeight = 270;
      const maxProductsPerPage = 11;
  
      const itemDetails = {};
  
      this.changedAssets.forEach((item) => {
        const productName = item.productName;
        const quantity = item.quantity || 1;
        const hsnNumber = item.hsnNumber || ''; // Assuming hsnNumber is a property of item
  
        if (!itemDetails[productName]) {
          itemDetails[productName] = {
            quantity: 0,
            serialNumbers: [],
            hsnNumber: hsnNumber
          };
        }
        itemDetails[productName].quantity += quantity;
        // Assuming serialNumbers is a property of item
        itemDetails[productName].serialNumbers.push(item.serialNumbers);
      });
  
      let randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
      let formattedDate = new Date().toISOString().slice(0, 10).split('-').reverse().join('-');
  
      let productCounter = 0;
  
      Object.keys(itemDetails).forEach((productName, index) => {
        if (productCounter >= maxProductsPerPage) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex);
          addCommonInfo();
          startY = initialY;
          productCounter = 0;
        }
  
        const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
        const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
        const totalHeight = splitSerialNumbers.length * lineHeight;
  
        const productNameY = startY;
        const quantityY = startY;
        const serialNumbersY = startY;
        const hsnNumberY = startY;
  
        doc.setFontSize(10);
        doc.text(`${index + 1}`, 13.5, productNameY);
        doc.setFont("helvetica", "bold");
        doc.text(productName || '', 20, productNameY);
        doc.setFont("helvetica", "normal");
        doc.text(itemDetails[productName].quantity.toString(), 167.5, quantityY);
        doc.setFontSize(9);
        doc.text(itemDetails[productName].hsnNumber, 141.5, hsnNumberY); // HSN Number
  
        splitSerialNumbers.forEach(line => {
          if (startY + lineHeight > maxPageHeight) {
            pageIndex++;
            doc.addPage();
            addTemplate(pageIndex);
            addCommonInfo();
            startY = initialY;
            productCounter = 0;
          }
          doc.text(line, 60, serialNumbersY);
          startY += reducedLineHeight;
        });
  
        totalQuantity += itemDetails[productName].quantity;
  
        startY += reducedLineHeight / 2;
        productCounter++;
  
        if (index === 0) {
          doc.setFontSize(9);
          doc.text(`${this.companyPanNumberSite}`, 60, 224);
          doc.text(`DN-${randomSixDigitNumber}`, 96.5, 24);
          doc.text(`${this.buyersOrderNumberSite}`, 96.5, 51.25);
          doc.text(`${this.dispatchDocNoSite}`, 96.5, 60);
          doc.text(`${this.termsOfDeliverySite}`, 96.5, 86);
          doc.text(`${this.dispatchedThroughSite}`, 96.5, 68);
          doc.text(formattedDate, 137, 24);
          doc.text(`${this.paymentTermsSite}`, 137, 33.5);
          doc.text(`${this.dispatchedDateSite}`, 137, 51);
          doc.text(`${this.destinationSite}`, 137, 68);
          doc.text(`${this.motorVehicleNoSite}`, 137, 77);
          let billOfLading = `${this.dispatchDocNoSite} dt. ${formattedDate}`;
          doc.text(`${billOfLading}`, 96.5, 77);
          let refNoAndDate = `SO/${randomSixDigitNumber} dt. ${formattedDate}`;
          doc.text(`${refNoAndDate}`, 96.5, 41.7);
        }
      });
  
      doc.text(`${totalQuantity}`, 166, 197);
  
      doc.save(`${this.selectedClientSite}-Delivery-Return-Challan.pdf`);
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

  // async generateOemChallan() {
  //   const doc = new jsPDF();
  //   const imageUrl = 'assets/outwardChallan.jpg'; // Update the path to the actual path where the image is stored
  //   let totalQuantity = 0;
  //   try {
  //     const imgData = await this.getBase64ImageFromURL(imageUrl);

  //     const addTemplate = (pageIndex) => {
  //       doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  //       doc.setFontSize(10);
  //       doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' });
  //     };

  //     let pageIndex = 0;
  //     addTemplate(pageIndex);

  //     doc.setFontSize(8);
  //     const startX = 10;
  //     const initialY = 73;
  //     let startY = initialY;
  //     const lineHeight = 8;
  //     const reducedLineHeight = 3.5;
  //     const maxPageHeight = 270;

  //     // Add modal data to the PDF
  //     doc.setFontSize(9);
  //     doc.setFont("helvetica", "bold");
  //     doc.text(`${this.selectedOem}`, 13.5, 53.5);
  //     startY += lineHeight;
  //     doc.setFont("helvetica", "normal");

  //     doc.setFontSize(8);
  //     const wrappedText = doc.splitTextToSize(this.selectedOemAddress, 80); // Adjust 100 as per your required width
  //     wrappedText.forEach(line => {
  //       if (startY + lineHeight > maxPageHeight) {
  //         pageIndex++;
  //         doc.addPage();
  //         addTemplate(pageIndex);
  //         doc.setFontSize(10); // Reset font size on the new page
  //         startY = initialY;
  //       }
  //       doc.text(line, 13.5, 60);
  //       startY += lineHeight;
  //     });
  //     doc.text(`GSTIN/UIN:   ${this.gstNumberOem}`, 13.5, 67.5);
  //     startY += lineHeight;

  //     doc.setFontSize(9);
  //     doc.setFont("helvetica", "bold");
  //     doc.text(`${this.selectedOem}`, 13.5, 90);
  //     startY += lineHeight;
  //     doc.setFont("helvetica", "normal");

  //     doc.setFontSize(8);
  //     const wrappedText2 = doc.splitTextToSize(this.selectedOemAddress, 80); // Adjust 100 as per your required width
  //     wrappedText2.forEach(line => {
  //       if (startY + lineHeight > maxPageHeight) {
  //         pageIndex++;
  //         doc.addPage();
  //         addTemplate(pageIndex);
  //         doc.setFontSize(10); // Reset font size on the new page
  //         startY = initialY;
  //       }
  //       doc.text(line, 13.5, 97.5);
  //       startY += lineHeight;
  //     });
  //     doc.text(`GSTIN/UIN:   ${this.gstNumberOem}`, 13.5, 105);
  //     startY += lineHeight;

  //     const itemDetails = {};

  //     this.changedAssets.forEach((item) => {
  //       const productName = item.productName;
  //       const quantity = item.quantity || 1;
  //       const hsnNumber = item.hsnNumber || ''; // Assuming hsnNumber is a property of item


  //       if (!itemDetails[productName]) {
  //         itemDetails[productName] = {
  //           quantity: 0,
  //           serialNumbers: [],
  //           hsnNumber: hsnNumber

  //         };
  //       }
  //       itemDetails[productName].quantity += quantity;
  //       console.log("Item Details :::::::::::::::::::::::::::",);
        
  //     });

  //     let randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
  //     let formattedDate = new Date().toISOString().slice(0, 10).split('-').reverse().join('-');

  //     startY += 15;

  //     Object.keys(itemDetails).forEach((productName, index) => {
  //       const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
  //       const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
  //       const totalHeight = splitSerialNumbers.length * lineHeight;

  //       if (startY + totalHeight > maxPageHeight) {
  //         pageIndex++;
  //         doc.addPage();
  //         addTemplate(pageIndex);
  //         doc.setFontSize(7);
  //         startY = initialY + 15;
  //       }

  //       const productNameY = startY;
  //       const quantityY = startY;
  //       const serialNumbersY = startY;
  //       const hsnNumberY = startY;


  //       doc.setFontSize(10);
  //       doc.text(`${index + 1}`, 13.5, productNameY);
  //       doc.setFont("helvetica", "bold");
  //       doc.text(productName || '', 20, productNameY);
  //       doc.setFont("helvetica", "normal");
  //       doc.text(itemDetails[productName].quantity.toString(), 167.5, quantityY);
  //       doc.setFontSize(9);
  //       doc.text(itemDetails[productName].hsnNumber, 141.5, hsnNumberY); // HSN Number
  

  //       splitSerialNumbers.forEach(line => {
  //         if (startY + lineHeight > maxPageHeight) {
  //           pageIndex++;
  //           doc.addPage();
  //           addTemplate(pageIndex);
  //           doc.setFontSize(7);
  //           startY = initialY + 15;
  //         }
  //         doc.text(line, 60, serialNumbersY);
  //         startY += reducedLineHeight;
  //       });

  //       totalQuantity += itemDetails[productName].quantity;

  //       startY += reducedLineHeight / 2;

  //       if (index === 0) {
  //         doc.text(`${this.companyPanNumberOem}`, 60, 224);
  //         doc.text(`DN-${randomSixDigitNumber}`, 96.5, 24);
  //         doc.text(`${this.buyersOrderNumberOem}`, 96.5, 51.25);
  //         doc.text(`${this.dispatchDocNoOem}`, 96.5, 60);
  //         doc.text(`${this.termsOfDeliveryOem}`, 96.5, 86);
  //         doc.setFontSize(9);
  //         doc.text(`${this.dispatchedThroughOem}`, 96.5, 68);
  //         doc.text(formattedDate, 137, 24);
  //         doc.text(`${this.paymentTermsOem}`, 137, 33.5);
  //         doc.text(`${this.dispatchedDateOem}`, 137, 51);
  //         doc.text(`${this.destinationOem}`, 137, 68);
  //         doc.text(`${this.motorVehicleNoOem}`, 137, 77);
  //         let billOfLading = `${this.dispatchDocNoOem} dt. ${formattedDate}`;
  //         doc.text(`${billOfLading}`, 96.5, 77);
  //         let refNoAndDate = `SO/${randomSixDigitNumber} dt. ${formattedDate}`;
  //         doc.text(`${refNoAndDate}`, 96.5, 41.7);
  //       }
  //     });

  //     doc.text(`${totalQuantity} `, 166, 197);

  //     doc.save(`${this.selectedOem}-Delivery-Return-Challan.pdf`);
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //   }
  // }

  async generateOemChallan() {
    const doc = new jsPDF();
    const imageUrl = 'assets/outwardChallan.jpg'; // Update the path to the actual path where the image is stored
    let totalQuantity = 0;
    const productsPerPage = 11; // Maximum number of products per page
  
    try {
      const imgData = await this.getBase64ImageFromURL(imageUrl);
  
      const addTemplate = (pageIndex) => {
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        doc.setFontSize(10);
        doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' });
      };
  
      const addCommonInfo = (pageIndex) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(`${this.selectedOem}`, 13.5, 53.5);
  
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const wrappedText = doc.splitTextToSize(this.selectedOemAddress, 80); // Adjust 100 as per your required width
        let startY = 60;
        wrappedText.forEach(line => {
          doc.text(line, 13.5, startY);
          startY += 8;
        });
        doc.text(`GSTIN/UIN:   ${this.gstNumberOem}`, 13.5, startY);
  
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(`${this.selectedOem}`, 13.5, 90);
  
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const wrappedText2 = doc.splitTextToSize(this.selectedOemAddress, 80); // Adjust 100 as per your required width
        startY = 97.5;
        wrappedText2.forEach(line => {
          doc.text(line, 13.5, startY);
          startY += 8;
        });
        doc.text(`GSTIN/UIN:   ${this.gstNumberOem}`, 13.5, startY);
  
        doc.setFontSize(9);
        doc.text(`${this.companyPanNumberOem}`, 60, 224);
        doc.text(`DN-${randomSixDigitNumber}`, 96.5, 24);
        doc.text(`${this.buyersOrderNumberOem}`, 96.5, 51.25);
        doc.text(`${this.dispatchDocNoOem}`, 96.5, 60);
        doc.text(`${this.termsOfDeliveryOem}`, 96.5, 86);
        doc.text(`${this.dispatchedThroughOem}`, 96.5, 68);
        doc.text(formattedDate, 137, 24);
        doc.text(`${this.paymentTermsOem}`, 137, 33.5);
        doc.text(`${this.dispatchedDateOem}`, 137, 51);
        doc.text(`${this.destinationOem}`, 137, 68);
        doc.text(`${this.motorVehicleNoOem}`, 137, 77);
        let billOfLading = `${this.dispatchDocNoOem} dt. ${formattedDate}`;
        doc.text(`${billOfLading}`, 96.5, 77);
        let refNoAndDate = `SO/${randomSixDigitNumber} dt. ${formattedDate}`;
        doc.text(`${refNoAndDate}`, 96.5, 41.7);
      };
  
      let pageIndex = 0;
      let randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
      let formattedDate = new Date().toISOString().slice(0, 10).split('-').reverse().join('-');
      
      addTemplate(pageIndex);
      addCommonInfo(pageIndex);
  
      doc.setFontSize(8);
      const initialY = 140; // Adjust the starting Y position for products to leave space for common info
      let startY = initialY;
      const lineHeight = 8;
      const reducedLineHeight = 3.5;
      const maxPageHeight = 270;
  
      const itemDetails = {};
  
      this.changedAssets.forEach((item) => {
        const productName = item.productName;
        const quantity = item.quantity || 1;
        const hsnNumber = item.hsnNumber || ''; // Assuming hsnNumber is a property of item
  
        if (!itemDetails[productName]) {
          itemDetails[productName] = {
            quantity: 0,
            serialNumbers: [],
            hsnNumber: hsnNumber
          };
        }
        itemDetails[productName].quantity += quantity;
      });
  
      let productCount = 0;
  
      Object.keys(itemDetails).forEach((productName, index) => {
        if (productCount >= productsPerPage) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex);
          addCommonInfo(pageIndex);
          startY = initialY;
          productCount = 0;
        }
  
        const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
        const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
        const totalHeight = splitSerialNumbers.length * lineHeight;
  
        if (startY + totalHeight > maxPageHeight) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex);
          addCommonInfo(pageIndex);
          startY = initialY;
        }
  
        const productNameY = startY;
        const quantityY = startY;
        const serialNumbersY = startY;
        const hsnNumberY = startY;
  
        doc.setFontSize(10);
        doc.text(`${index + 1}`, 13.5, productNameY);
        doc.setFont("helvetica", "bold");
        doc.text(productName || '', 20, productNameY);
        doc.setFont("helvetica", "normal");
        doc.text(itemDetails[productName].quantity.toString(), 167.5, quantityY);
        doc.setFontSize(9);
        doc.text(itemDetails[productName].hsnNumber, 141.5, hsnNumberY); // HSN Number
  
        splitSerialNumbers.forEach(line => {
          if (startY + lineHeight > maxPageHeight) {
            pageIndex++;
            doc.addPage();
            addTemplate(pageIndex);
            addCommonInfo(pageIndex);
            startY = initialY;
          }
          doc.text(line, 60, serialNumbersY);
          startY += reducedLineHeight;
        });
  
        totalQuantity += itemDetails[productName].quantity;
  
        startY += reducedLineHeight / 2;
        productCount++;
      });
  
      // Print total quantity on the last page
      doc.text(`${totalQuantity} `, 166, 197);
  
      doc.save(`${this.selectedOem}-Delivery-Return-Challan.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
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
