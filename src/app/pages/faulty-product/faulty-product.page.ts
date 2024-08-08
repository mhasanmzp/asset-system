import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf'; //for challan pdf.
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/asset.service'; 
// import { CommonService } from 'src/app/services/common.service';
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
  siteData: any[];
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
  storeData: any[] = [];
  data: any[] = [];
  data2: any[] = [];
  showReturnGoodModal = false;
  selectedReturnSite: string = '';
  siteOrderNumber: string;
  siteAddress: string;
  gstNumberReturn: string;
  dispatchedThroughReturn: string;
  returnChallanNo: any;
  returnChallanDate: any;
  returnReceivingDate: any;

  returnDescription: string;
  selectedReturnSiteAddress: string = '';

  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,

  ) { }

  ngOnInit() {
    this.loadDeliveredData();
    this.loadSubstations();
    this.loadOems();
    this.loadCategories();
    this.loadStores();
    this.loadClients();
    this.fetchClientWarehouses();
    this.loadSites();
  }

  navigateToAsset() {
    this.router.navigate(['/asset']);
  }

  loadSites() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchSites(formData).then((res: any) => {
      this.siteData = res;
      console.log("Response:", res);
    }).catch(error => {
      console.error('Error fetching Substations data', error);
    });
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
    console.log("UserId:::::::::::::::", formData);

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
        selected: false
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
          selected: false
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

  async showToast(message: string, color: string = 'default') {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color,
    });
    await toast.present();
  }

  trackSelectedAssets() {
    this.changedAssets = this.deliveredData.filter(asset => asset.selected);
  }

  // async submitReturn() {
  //   if (!this.selectedAction || this.selectedAction === 'null') {
  //     this.showToast('Please select an action.');
  //     return;
  //   }
  
  //   const filteredAssets = this.changedAssets.filter(asset => asset.selected);
  
  //   if (filteredAssets.length === 0) {
  //     this.showToast('No data to save.');
  //     return;
  //   }
  
  //   // Check if any product has an empty or null siteName
  //   const hasEmptySiteName = filteredAssets.some(asset => !asset.siteName);
  
  //   // Remove the restriction if action is "Mark as Scrap" or if any siteName is null/empty
  //   if (this.selectedAction !== 'Mark as Scrap' && !hasEmptySiteName) {
  //     // Check if all selected products are from the same installation site
  //     const installationSites = new Set(filteredAssets.map(asset => asset.siteName));
  //     if (installationSites.size > 1) {
  //       this.showToast('Please ensure all selected products are from the same Installation Site.', 'danger');
  //       return;
  //     }
  //   }
  
  //   // Map the selected action to the corresponding status
  //   const actionStatusMap = {
  //     'Mark as Scrap': 'SCRAP',
  //     'Return under inspection': 'RETURN UNDER INSPECTION',
  //     'Sent Back to the Site': 'RETURN TO SITE',
  //     'Sent Back to the OEM': 'RETURN TO OEM',
  //   };
  
  //   const expectedStatus = actionStatusMap[this.selectedAction];
  
  //   // Check if any asset's status matches the selected action's expected status
  //   const conflictingAsset = filteredAssets.find(asset => asset.status === expectedStatus);
  //   if (conflictingAsset) {
  //     this.showToast(`The selected product "${conflictingAsset.productName}" already has the status "${expectedStatus}".`, 'danger');
  //     return;
  //   }
  
  //   // Proceed with action based on the selected option
  //   if (this.selectedAction === 'Sent Back to the OEM') {
  //     this.showOemModal = true;
  //   } else if (this.selectedAction === 'Sent Back to the Site') {
  //     this.showSiteModal = true;
  //   } else if (this.selectedAction === 'Return under inspection') {
  //     this.showReturnGoodModal = true;
  //   } else if (this.selectedAction === 'Mark as Scrap') {
  //     await this.submitReturnToServer();
  //   }
  // }
  
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
  
    // Separate assets with empty and non-empty site names
    const assetsWithEmptySiteName = filteredAssets.filter(asset => !asset.siteName);
    const assetsWithNonEmptySiteName = filteredAssets.filter(asset => asset.siteName);
  
    // Get unique site names from the non-empty siteName assets
    const uniqueSiteNames = new Set(assetsWithNonEmptySiteName.map(asset => asset.siteName));
  
    // Check if there are multiple unique non-empty site names
    if (uniqueSiteNames.size > 1) {
      this.showToast('Please ensure all selected products are from the same Installation Site.', 'danger');
      return;
    }
  
    // Check if both empty site names and a unique non-empty site name are selected
    if (assetsWithEmptySiteName.length > 0 && uniqueSiteNames.size === 1) {
      // Allow selection if only one unique site name is present alongside empty site names
    } else if (assetsWithEmptySiteName.length === 0 && uniqueSiteNames.size === 1) {
      // Allow selection if only one unique site name is present
    } else if (assetsWithEmptySiteName.length > 0 && uniqueSiteNames.size === 0) {
      // Allow selection if only empty site names are present
    } else {
      this.showToast('Please ensure all selected products are either from the same Installation Site or have no site name.', 'danger');
      return;
    }
  
    // Map the selected action to the corresponding status
    const actionStatusMap = {
      'Mark as Scrap': 'SCRAP',
      'Return under inspection': 'RETURN UNDER INSPECTION',
      'Sent Back to the Site': 'RETURN TO SITE',
      'Sent Back to the OEM': 'RETURN TO OEM',
    };
  
    const expectedStatus = actionStatusMap[this.selectedAction];
  
    // Check if any asset's status matches the selected action's expected status
    const conflictingAsset = filteredAssets.find(asset => asset.status === expectedStatus);
    if (conflictingAsset) {
      this.showToast(`The selected product "${conflictingAsset.productName}" already has the status "${expectedStatus}".`, 'danger');
      return;
    }
  
    // Proceed with action based on the selected option
    if (this.selectedAction === 'Sent Back to the OEM') {
      this.showOemModal = true;
    } else if (this.selectedAction === 'Sent Back to the Site') {
      this.showSiteModal = true;
    } else if (this.selectedAction === 'Return under inspection') {
      this.showReturnGoodModal = true;
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
      this.loadDeliveredData();
    } catch (error) {
      console.error('Error saving data', error);
      this.showToast('Failed to save data');
    } finally {
      await loading.dismiss();
    }
  }

  async submitOemReturn() {
    this.closeModal();
    this.generateOemChallan()
    await this.submitReturnToServer();
  }

  async submitSiteReturn() {
    this.closeModal();
    this.generateChallan();
    await this.submitReturnToServer();
  }

  async loadDeliveredData() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });

    await loading.present();

    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService
      .fetchFaultyData(formData)
      .then((res: any) => {
        this.deliveredData = res;
        loading.dismiss()
      })
      .catch(error => {
        console.error('Error fetching delivered data', error);
        loading.dismiss()

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

  async generateChallan() {
    const doc = new jsPDF();
    const imageUrl = 'assets/outwardChallan.jpg'; // Update the path to the actual path.
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
        doc.text(`${this.selectedClientSite}`, 13.5, 90);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        const wrappedText2 = doc.splitTextToSize(this.selectedWarehouseSite, 80);
        startY = 97.5;
        wrappedText2.forEach(line => {
          doc.text(line, 13.5, startY);
          startY += 8;
        });
        doc.text(`GSTIN/UIN:   ${this.gstNumberSite}`, 13.5, startY);
      };

      let pageIndex = 0;
      addTemplate(pageIndex);
      addCommonInfo();

      doc.setFontSize(8);
      const initialY = 140; 
      let startY = initialY;
      const lineHeight = 8;
      const reducedLineHeight = 3.5;
      const maxPageHeight = 270;
      const maxProductsPerPage = 11;

      const itemDetails = {};

      this.changedAssets.forEach((item) => {
        const productName = item.productName;
        const quantity = item.quantity || 1;
        const hsnNumber = item.hsnNumber || '';

        if (!itemDetails[productName]) {
          itemDetails[productName] = {
            quantity: 0,
            serialNumbers: [],
            hsnNumber: hsnNumber
          };
        }
        itemDetails[productName].quantity += quantity;
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

        const serialNumbers = itemDetails[productName].serialNumbers.join(' ');
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
        doc.text(itemDetails[productName].hsnNumber, 141.5, hsnNumberY); 

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

  async generateOemChallan() {
    const doc = new jsPDF();
    const imageUrl = 'assets/outwardChallan.jpg';
    let totalQuantity = 0;
    const productsPerPage = 11;

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
        const wrappedText = doc.splitTextToSize(this.selectedOemAddress, 80);
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
        const wrappedText2 = doc.splitTextToSize(this.selectedOemAddress, 80);
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
      const initialY = 140;
      let startY = initialY;
      const lineHeight = 8;
      const reducedLineHeight = 3.5;
      const maxPageHeight = 270;

      const itemDetails = {};

      this.changedAssets.forEach((item) => {
        const productName = item.productName;
        const quantity = item.quantity || 1;
        const hsnNumber = item.hsnNumber || '';

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
        doc.text(itemDetails[productName].hsnNumber, 141.5, hsnNumberY);

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

      doc.text(`${totalQuantity} `, 166, 197);

      doc.save(`${this.selectedOem}-Delivery-Return-Challan.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  onSiteChange() {
    const selectedSiteData = this.siteData.find(site => site.siteName === this.selectedClientSite);
    this.selectedWarehouseSite = selectedSiteData ? selectedSiteData.address : '';
  }

  onOemChange() {
    const selectedOemData = this.data.find(oem => oem.oemName === this.selectedOem);
    this.selectedOemAddress = selectedOemData ? selectedOemData.address : '';
  }

  resetSiteModal() {
    this.selectedClientSite = '';
    this.selectedWarehouseSite = '';
    this.gstNumberSite = '';
    this.companyPanNumberSite = '';
    this.dispatchedThroughSite = '';
    this.dispatchedDateSite = '';
    this.buyersOrderNumberSite = '';
    this.dispatchDocNoSite = '';
    this.paymentTermsSite = '';
    this.termsOfDeliverySite = '';
    this.destinationSite = '';
    this.motorVehicleNoSite = '';
  }

  resetOemModal() {
    this.selectedOem = '';
    this.selectedOemAddress = '';
    this.gstNumberOem = '';
    this.companyPanNumberOem = '';
    this.dispatchedThroughOem = '';
    this.dispatchedDateOem = '';
    this.dispatchDocNoOem = '';
    this.destinationOem = '';
    this.motorVehicleNoOem = '';
    this.termsOfDeliveryOem = '';
  }

  openReturnGoodModal() {
    this.showReturnGoodModal = true;
  }

  closeModal() {
    this.showReturnGoodModal = false;
    this.showOemModal  = false;
    this.showSiteModal =false;
  }

  resetReturnGoodModal() {
    this.selectedReturnSite = '';
    this.siteOrderNumber = '';
    this.siteAddress = '';
    this.gstNumberReturn = '';
    this.dispatchedThroughReturn = '';
  }

  async submitReturnGood() {
    await this.returnChallan()
    this.submitReturnToServer()
    this.closeModal();
    this.resetReturnGoodModal();
  }
 
//WORKING FINE
  async returnChallan() {
    const doc = new jsPDF();
    const imageUrl = 'assets/returnChallan.jpg';
    let totalQuantity = 0;
    const productsPerPage = 11;
  
    try {
      const imgData = await this.getBase64ImageFromURL(imageUrl);
  
      const addTemplate = (pageIndex) => {
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        doc.setFontSize(10);
        doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' });
      };
  
      const addHeaderInfo = () => {
        doc.setFontSize(10);
  
        // Print "Return from Site:"
        doc.setFont("helvetica", "bold");
        doc.text('Return from Site:', 13.5, 30.5);
  
        // Print selected site name
        doc.setFont("helvetica", "normal");
        const siteText = this.selectedReturnSite || 'No Site Selected';
        doc.text(siteText, 45, 30.5);
  
        // Calculate the width of the site name text and position the "Address:" text
        const siteTextWidth = doc.getTextWidth(siteText);
        const addressLabelX = 48 + siteTextWidth + 5; // 5 is the space before the comma
  
        // Print ", Address:"
        doc.setFont("helvetica", "bold");
        doc.text('Address:', addressLabelX, 30.5);
  
        // Calculate the width of ", Address:" text and position the address text
        const addressLabelWidth = doc.getTextWidth(', Address:');
        const addressTextX = addressLabelX + addressLabelWidth + 2; // 2 is the space after the colon
  
        // Print the address
        doc.setFont("helvetica", "normal");
        doc.text(this.selectedReturnSiteAddress || 'No Address', addressTextX, 30.5);
  
        // Extract client and clientWarehouse from the first item in changedAssets
        const firstItem = this.changedAssets[0] || {};
        const client = firstItem.client || 'No Data';
        const clientWarehouse = firstItem.clientWarehouse || 'No Data';
  
        // Print "To: client Address: clientWarehouse" just below the "Return from Site" row
        doc.setFont("helvetica", "bold");
        doc.text('To:', 13.5, 35.5);
        doc.setFont("helvetica", "normal");
        doc.text(client, 22.5, 35.5);
  
        const clientTextWidth = doc.getTextWidth(client);
        const clientAddressLabelX = 28 + clientTextWidth + 1; // 1 is the space before the comma
  
        doc.setFont("helvetica", "bold");
        doc.text('Address:', clientAddressLabelX, 35.5);
  
        const clientAddressLabelWidth = doc.getTextWidth('Address:');
        const clientAddressTextX = clientAddressLabelX + clientAddressLabelWidth + 2; // 2 is the space after the colon
  
        doc.setFont("helvetica", "normal");
        doc.text(clientWarehouse, clientAddressTextX, 35.5);
  
        // Print "Challan No:" and "Challan Date:"
        doc.setFont("helvetica", "bold");
        doc.text('Challan No:', 13.5, 40.5);
        doc.text('Challan Date:', 13.5, 45.5);
  
        // Print the challan number and date
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(this.returnChallanNo || 'No Challan No', 40, 40.5);
        doc.text(this.returnChallanDate || 'No Challan Date', 40, 45.5);
  
        // Print the return receiving date
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('Return Receiving Date:', 147.5, 30);
        doc.setFont("helvetica", "normal");
        doc.text(this.returnReceivingDate, 188.5, 30);
      };
  
      console.log('Selected Site before PDF:', this.selectedReturnSite);
      console.log('Selected Site Address before PDF:', this.selectedReturnSiteAddress);
  
      let pageIndex = 0;
      addTemplate(pageIndex);
      addHeaderInfo();
  
      doc.setFontSize(8);
      const initialY = 70;
      let startY = initialY;
      const lineHeight = 8;
      const maxPageHeight = 270;
  
      let productCount = 0;
  
      this.changedAssets.forEach((item, index) => {
        if (productCount >= productsPerPage) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex);
          addHeaderInfo();
          startY = initialY;
          productCount = 0;
        }
  
        const serialNumbers = item.serialNumber || '';
        const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
        const descriptionOfIssue = item.descriptionOfIssue || '';
        const splitDescription = doc.splitTextToSize(descriptionOfIssue, 55);
        const totalHeight = Math.max(splitSerialNumbers.length, splitDescription.length) * lineHeight;
  
        if (startY + totalHeight > maxPageHeight) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex);
          addHeaderInfo();
          startY = initialY;
        }
  
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}`, 14, startY);
        doc.setFont("helvetica", "bold");
        doc.text(item.productName || '', 25, startY);
        doc.setFont("helvetica", "normal");
        doc.text(splitSerialNumbers, 80.5, startY);
        doc.text((item.quantity || 1).toString(), 120.5, startY);
        doc.setFontSize(9);
        splitDescription.forEach((line, i) => {
          doc.text(line, 130, startY + (i * lineHeight));
        });
  
        startY += totalHeight;
  
        totalQuantity += item.quantity || 1;
  
        productCount++;
        console.log("ChangedAssets:::::::::::::", this.changedAssets);
      });
  
      doc.save(`${this.selectedReturnSite}-Delivery-Return-Challan.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
  
  onReturnSiteChange() {
    console.log('Selected Site:', this.selectedReturnSite);
    const selectedSite = this.siteData.find(site => site.siteName === this.selectedReturnSite);
    if (selectedSite) {
      this.selectedReturnSiteAddress = selectedSite.address;
    } else {
      this.selectedReturnSiteAddress = '';
    }
    console.log('Selected Site Address:', this.selectedReturnSiteAddress);
  }

}











