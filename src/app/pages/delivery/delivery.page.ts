import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary
import jsPDF from 'jspdf';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {
  userId = localStorage.getItem("userId");
  categories: any[] = [];
  products: any[] = [];
  filteredProductList: any[] = [];
  filteredWarehouseProductList: any[] = [];
  clients: any[] = [];
  clientWarehouses: any[] = [];
  selectedClient: any;
  selectedWarehouse: any;
  selectedCategory: any;
  searchQuery: any;
  data: any;
  selectedSite: any;
  siteData: any[];
  productData: any[] = [];
  clientWarehouseProductData: any[] = [];
  warehouseProductData: any[] = [];
  deliveryAddress: any;
  showFurtherDelivery: boolean = false;
  selectedSegment: string = 'step1';
  isClientDetailsModalOpen: boolean = false;
  gstNumber: string = '';
  billingClient: any;
  billingWarehouse: any;
  billingGstNumber: string = '';
  companyPanNumber: string = '';
  dispatchedThrough: string = '';
  dispatchedDate: any;
  paymentTerms: string = '';
  otherReferences: string = '';
  destination: string = '';
  motorVehicleNo: string = '';
  selectedPurchase: any = null;

  constructor(private dataService: DataService, private toastController: ToastController) { }

  ngOnInit() {
    this.fetchDeliveryProducts();
    this.loadCategories();
    this.loadClients();
    this.loadSites();
    this.fetchWarehouseProducts();
  }

  segmentChanged() {
    if (this.selectedSegment === 'step2') {
      this.fetchWarehouseProducts();
    }
  }

  fetchProductsByClient() {
    if (this.selectedClient) {
      const formData = {
        permissionName: 'Tasks',
        employeeIdMiddleware: this.userId,
        employeeId: this.userId,
        clientName: this.selectedClient,
      };

      this.dataService.fetchProductsByClient(formData).then((res: any) => {
        this.clientWarehouseProductData = res.productData.map((product) => ({
          ...product,
          selected: false // Add selected property
        }));
        console.log("data fetched for client:", res)
      }).catch(error => {
        console.error('Error fetching client products data', error);
      });
    }
  }

  loadCategories() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchCategories(formData).then((res: any) => {
      this.categories = res; // Assign response to categories
    }).catch(error => {
      console.error('Error fetching categories data', error);
    });
  }

  fetchDeliveryProducts() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };
    console.log('formdata', formData);
    this.dataService.fetchProducts(formData).then((data: any) => {
      console.log('Delivery DATA:', data);
      this.productData = data.productData.map((product) => ({
        ...product,
        SerialNumber: product.serialNumber,
        ProductName: product.productName,
        Status: product.status,
        selected: false // Add selected property
      }));
      this.applyFilters(); // Filter products after loading
    }).catch(error => {
      console.error('Error fetching data', error);
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

  getFilteredProducts(): any[] {
    let filtered = this.productData;

    if (this.searchQuery) {
      filtered = filtered.filter(product => product.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.categoryName === this.selectedCategory.name);
    }

    return filtered;
  }

  getFilteredWarehouseProducts(): any[] {
    let filtered = this.warehouseProductData;

    if (this.searchQuery) {
      filtered = filtered.filter(product => product.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    return filtered;
  }

  applyFilters() {
    this.filteredProductList = this.getFilteredProducts();
  }

  applyWarehouseFilters() {
    this.filteredWarehouseProductList = this.getFilteredWarehouseProducts();
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

  trackByProductId(index: number, product: any): string {
    return product.id;
  }

  async presentToast(message: string, duration: number = 2000, position: 'bottom' | 'top' | 'middle' = 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position
    });
    toast.present();
  }

  openClientDetailsModal() {
    this.isClientDetailsModalOpen = true;
  }

  closeClientDetailsModal() {
    this.isClientDetailsModalOpen = false;
  }
  ///this one working fine interms of challan

  // deliverProductToWarehouse() {
  //   const selectedProducts = this.productData.filter(product => product.selected);
  //   if (!this.selectedClient) {
  //     this.presentToast('Please select a client.');
  //     return;
  //   }
  //   if (!this.selectedWarehouse) {
  //     this.presentToast('Please select a client warehouse.');
  //     return;
  //   }
  //   if (selectedProducts.length === 0) {
  //     this.presentToast('Please select at least one product.');
  //     return;
  //   }

  //   // Create the selectedPurchase object
  //   this.selectedPurchase = {
  //     purchaseId: selectedProducts.map(p => p.SerialNumber).join(', '), // Use the Serial Numbers as the purchase ID for demonstration
  //     items: selectedProducts.map(product => ({
  //       productName: product.ProductName,
  //       quantity: 1, // Assuming quantity is 1 for each selected product
  //       serialNumbers: [product.SerialNumber]
  //     })),
  //     challanNo: new Date().getTime(), // Example challan number
  //     storeLocation: this.selectedWarehouse.name,
  //     warrantyPeriodMonths: 12, // Example warranty period
  //     status: 'Delivered' // Example status
  //   };

  //   this.selectedSegment = 'step2';

  //   this.presentToast('Product delivered to the warehouse successfully!');
  // }

  //New Testing
  async deliverProductToWarehouse() {
    {

    }
    const selectedProducts = this.productData.filter(product => product.selected);
    if (!this.selectedClient) {
      await this.presentToast('Please select a client.');
      return;
    }
    if (!this.selectedWarehouse) {
      await this.presentToast('Please select a client warehouse.');
      return;
    }
    if (selectedProducts.length === 0) {
      await this.presentToast('Please select at least one product.');
      return;
    }

    // Create the selectedPurchase object
    this.selectedPurchase = {
      purchaseId: selectedProducts.map(p => p.SerialNumber).join(', '), // Use the Serial Numbers as the purchase ID for demonstration
      items: selectedProducts.map(product => ({
        productName: product.ProductName,
        quantity: 1, // Assuming quantity is 1 for each selected product
        serialNumbers: [product.SerialNumber]
      })),
      challanNo: new Date().getTime(), // Example challan number
      storeLocation: this.selectedWarehouse.name,
      warrantyPeriodMonths: 12, // Example warranty period
      status: 'Delivered' // Example status
    };

    // Assuming formData is available in your component
    const formData = {
      selectedClient: this.selectedClient,
      selectedWarehouse: this.selectedWarehouse,
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    // Call the service to save the delivery details
    this.dataService.deliverProduct(this.selectedPurchase, formData).subscribe(
      async response => {
        // Handle successful response
        await this.presentToast('Product delivered to the warehouse successfully!');
        this.selectedSegment = 'step2';
      },
      async error => {
        // Handle error response
        console.error('Error delivering product:', error);
        await this.presentToast('Failed to deliver the product. Please try again.');
      }
    );
  }

  async generateChallan() {
    const doc = new jsPDF();
    const imageUrl = 'assets/outwardChallan.jpg'; // Update the path to the actual path where the image is stored

    try {
      const imgData = await this.getBase64ImageFromURL(imageUrl);

      const addTemplate = (pageIndex: number) => {
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        doc.setFontSize(10);
        doc.text(`Challan Number: #${this.selectedPurchase.purchaseId}`, 10, 10);
        doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' });
      };

      let pageIndex = 0;
      addTemplate(pageIndex);

      doc.setFontSize(8);
      const startX = 10;
      const initialY = 73;
      let startY = initialY;
      const lineHeight = 8;
      const maxPageHeight = 270;

      // Add modal data to the PDF
      doc.setFontSize(9);
      doc.text(`${this.selectedClient}`, 13.5, 53.5);
      startY += lineHeight;
      doc.setFontSize(8);
      // doc.text(`${this.selectedWarehouse}`, 13.5, 60);
      // startY += lineHeight;
      const wrappedText = doc.splitTextToSize(this.selectedWarehouse, 80); // Adjust 100 as per your required width
      wrappedText.forEach(line => {
        if (startY + lineHeight > maxPageHeight) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex);
          doc.setFontSize(10); // Reset font size on the new page
          startY = initialY;
        }
        doc.text(line, 13.5, 60);
        startY += lineHeight;
      });
      doc.text(`GSTIN/UIN:   ${this.gstNumber}`, 13.5, 67.5);
      startY += lineHeight;
      //////////////////////////////////////////////////////////////////////////////////////////
      doc.setFontSize(9);
      doc.text(`${this.billingClient}`, 13.5, 90);
      startY += lineHeight;
      doc.setFontSize(8);
      const wrappedText2 = doc.splitTextToSize(this.billingWarehouse, 80); // Adjust 100 as per your required width
      wrappedText2.forEach(line => {
        if (startY + lineHeight > maxPageHeight) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex);
          doc.setFontSize(10); // Reset font size on the new page
          startY = initialY;
        }
        doc.text(line, 13.5, 97.5);
        startY += lineHeight;
      });
      doc.text(`GSTIN/UIN:   ${this.billingGstNumber}`, 13.5,105);
      startY += lineHeight;
   
      ///
      // doc.text(`Company PAN Number: ${this.companyPanNumber}`, startX, startY);
      // startY += lineHeight;
      // doc.text(`Dispatched Through: ${this.dispatchedThrough}`, startX, startY);
      // startY += lineHeight;
      // doc.text(`Dispatched Date: ${this.dispatchedDate}`, startX, startY);
      // startY += lineHeight;
      // doc.text(`Payment Terms: ${this.paymentTerms}`, startX, startY);
      // startY += lineHeight;
      // doc.text(`Destination: ${this.destination}`, startX, startY);
      // startY += lineHeight;
      // doc.text(`Motor Vehicle No: ${this.motorVehicleNo}`, startX, startY);
      // startY += lineHeight * 2; // Add extra space before product details

      const itemDetails: { [key: string]: { quantity: number; serialNumbers: string[] } } = {};

      this.selectedPurchase.items.forEach((item: any) => {
        const productName = item.productName;
        const quantity = item.quantity || 1;
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
  
      Object.keys(itemDetails).forEach((productName, index) => {
        const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
        const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
        const totalHeight = splitSerialNumbers.length * lineHeight;
        if (startY + totalHeight > maxPageHeight) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex);
          doc.setFontSize(7);
          startY = initialY;
        }

        doc.setFontSize(9);
        doc.text(`${index + 1}`, 13.5, 135); // Index
        doc.text(productName || '', 20, 135); // Product Name
        doc.text(`${this.dispatchedDate}`, 160, 20);
        doc.text(`${this.dispatchedDate}`, 160, 47);

        // startY += lineHeight;
        // Serial Numbers
        // splitSerialNumbers.forEach((line, lineInde60x) => {
        //   doc.text(line, 141, 135 + (lineIndex * lineHeight));
        // });
  
        doc.text(itemDetails[productName].quantity.toString(), 167.5, 135); // Quantity
  
        // Update startY for the next row
        startY += totalHeight + lineHeight / 2;
      });
  
      doc.save('Inward-Challan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
  
  // async generateChallan() {
  //   const doc = new jsPDF();
  //   const imageUrl = 'assets/outwardChallan.jpg'; // Update the path to the actual path where the image is stored
  
  //   try {
  //     const imgData = await this.getBase64ImageFromURL(imageUrl);
  
  //     const addTemplate = (pageIndex: number) => {
  //       doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  //       doc.setFontSize(10);
  //       doc.text(`Challan Number: #${this.selectedPurchase.purchaseId}`, 10, 10);
  //       doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' });
  //     };
  
  //     let pageIndex = 0;
  //     addTemplate(pageIndex);
  
  //     doc.setFontSize(8);
  //     const startX = 10;
  //     const initialY = 73;
  //     let startY = initialY;
  //     const lineHeight = 8;
  //     const maxPageHeight = 270;
  
  //     // Add modal data to the PDF
  //     doc.setFontSize(9);
  //     doc.text(`${this.selectedClient}`, 13.5, 53.5);
  //     startY += lineHeight;
  //     doc.setFontSize(8);
      
  //     const wrappedText = doc.splitTextToSize(this.selectedWarehouse, 80); // Adjust 100 as per your required width
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
  //     doc.text(`GSTIN/UIN:   ${this.gstNumber}`, 13.5, 67.5);
  //     startY += lineHeight;
  
  //     // Billing information
  //     doc.setFontSize(9);
  //     doc.text(`${this.billingClient}`, 13.5, 90);
  //     startY += lineHeight;
  //     doc.setFontSize(8);
  //     const wrappedText2 = doc.splitTextToSize(this.billingWarehouse, 80); // Adjust 100 as per your required width
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
  //     doc.text(`GSTIN/UIN:   ${this.billingGstNumber}`, 13.5, 105);
  //     startY += lineHeight;
  
  //     // Handle product details
  //     const itemDetails: { [key: string]: { quantity: number; serialNumbers: string[] } } = {};
  
  //     this.selectedPurchase.items.forEach((item: any) => {
  //       const productName = item.productName;
  //       const quantity = item.quantity || 1;
  //       const serialNumbers = item.serialNumbers || [];
  
  //       if (!itemDetails[productName]) {
  //         itemDetails[productName] = {
  //           quantity: 0,
  //           serialNumbers: []
  //         };
  //       }
  //       itemDetails[productName].quantity += quantity;
  //       itemDetails[productName].serialNumbers.push(...serialNumbers);
  //     });
  
  //     Object.keys(itemDetails).forEach((productName, index) => {
  //       const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
  //       const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
  //       const totalHeight = splitSerialNumbers.length * lineHeight;
  
  //       if (startY + totalHeight > maxPageHeight) {
  //         pageIndex++;
  //         doc.addPage();
  //         addTemplate(pageIndex);
  //         doc.setFontSize(8); // Reset font size on the new page
  //         startY = initialY;
  //       }
  
  //       doc.text(`${index + 1}`, 13.5, startY); // Index
  //       doc.text(productName || '', 20, startY); // Product Name
  
  //       // Serial Numbers
  //       splitSerialNumbers.forEach((line, lineIndex) => {
  //         doc.text(line, 141, startY + (lineIndex * lineHeight));
  //       });
  
  //       doc.text(itemDetails[productName].quantity.toString(), 167.5, startY); // Quantity
  
  //       // Update startY for the next product row
  //       startY += lineHeight;
  //       startY += totalHeight + lineHeight / 2;
  //     });
  
  //     doc.save('Inward-Challan.pdf');
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //   }
  // }
  

  

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

  submitAndGenerateChallan() {
    this.deliverProductToWarehouse()
    this.generateChallan()
  }

  deliverProductToSite() {
    if (!this.selectedSite) {
      this.presentToast('Please select a site.');
      return;
    }
    const selectedProducts = this.clientWarehouseProductData.filter(product => product.selected);
    const furtherDeliveryDetails = {
      products: selectedProducts,
      site: this.selectedSite,
    };
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };
    this.dataService.furtherDeliverProduct(furtherDeliveryDetails, formData).subscribe(
      () => {
        this.presentToast('Products delivered to site successfully!');
        this.selectedSite = null;
        this.clientWarehouseProductData.forEach(product => product.selected = false); // Deselect all products
        this.applyWarehouseFilters(); // Refresh filtered products
        this.showFurtherDelivery = false;
      },
      error => {
        console.error('Error delivering products to site', error);
        this.presentToast('There was an error delivering the products to the site.');
      }
    );
  }
}




// import { Component, OnInit } from '@angular/core';
// import { ToastController } from '@ionic/angular';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary
// import jsPDF from 'jspdf';

// @Component({
//   selector: 'app-delivery',
//   templateUrl: './delivery.page.html',
//   styleUrls: ['./delivery.page.scss'],
// })
// export class DeliveryPage implements OnInit {
//   categories: any[] = [];
//   products: any[] = [];
//   filteredProductList: any[] = [];
//   filteredWarehouseProductList: any[] = [];
//   clients: any[] = [];
//   clientWarehouses: any[] = [];
//   selectedClient: any;
//   selectedWarehouse: any;
//   selectedCategory: any;
//   selectedSite: any;
//   searchQuery: any;
//   data: any;
//   siteData: any[];
//   productData: any[] = [];
//   clientWarehouseProductData: any[] = [];
//   warehouseProductData: any[] = [];
//   deliveryAddress: any;
//   showFurtherDelivery: boolean = false;
//   selectedSegment: string = 'step1';
//   isClientDetailsModalOpen: boolean = false;
//   // selectedPurchase: any;
//   gstNumber: string = '';
//   billingClient: any;
//   billingWarehouse: any;
//   billingGstNumber: string = '';
//   companyPanNumber: string = '';
//   dispatchedThrough: string = '';
//   dispatchedDate: any;
//   paymentTerms: string = '';
//   otherReferences: string = '';
//   destination: string = '';
//   motorVehicleNo: string = '';
//   selectedPurchase: any = {
//     purchaseId: '12345', // Dummy data for testing
//     items: [
//       { productName: 'Product 1', quantity: 10, serialNumbers: ['SN1', 'SN2'] },
//       { productName: 'Product 2', quantity: 5, serialNumbers: ['SN3'] }
//     ],
//     challanNo: 'CH12345', // Dummy data for testing
//     storeLocation: 'Warehouse 1', // Dummy data for testing
//     warrantyPeriodMonths: '12', // Dummy data for testing
//     status: 'Dispatched' // Dummy data for testing
//   };

//   constructor(private dataService: DataService, private toastController: ToastController) { }

//   ngOnInit() {
//     this.fetchDeliveryProducts();
//     this.loadCategories();
//     this.loadClients();
//     this.loadSites();
//     this.fetchWarehouseProducts();
//   }

//   segmentChanged() {
//     if (this.selectedSegment === 'step2') {
//       this.fetchWarehouseProducts();
//     }
//   }

//   fetchProductsByClient() {
//     if (this.selectedClient) {
//       const formData = {
//         permissionName: 'Tasks',
//         employeeIdMiddleware: this.userId,
//         employeeId: this.userId,
//         clientName: this.selectedClient,
//       };

//       this.dataService.fetchProductsByClient(formData).then((res: any) => {
//         this.clientWarehouseProductData = res.productData.map((product) => ({
//           ...product,
//           selected: false // Add selected property
//         }));
//         console.log("data fetched for client:", res)
//       }).catch(error => {
//         console.error('Error fetching client products data', error);
//       });
//     }
//   }

//   loadCategories() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchCategories(formData).then((res: any) => {
//       this.categories = res; // Assign response to categories
//     }).catch(error => {
//       console.error('Error fetching categories data', error);
//     });
//   }

//   fetchDeliveryProducts() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };
//     console.log('formdata', formData);
//     this.dataService.fetchProducts(formData).then((data: any) => {
//       console.log('Delivery DATA:', data);
//       this.productData = data.productData.map((product) => ({
//         ...product,
//         SerialNumber: product.serialNumber,
//         ProductName: product.productName,
//         Status: product.status,
//         selected: false // Add selected property
//       }));
//       this.applyFilters(); // Filter products after loading
//     }).catch(error => {
//       console.error('Error fetching data', error);
//     });
//   }

//   fetchWarehouseProducts() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };
//     this.dataService.fetchWarehouseProducts(formData).then((data: any) => {
//       this.warehouseProductData = data.map((product) => ({
//         ...product,
//         SerialNumber: product.serialNumber,
//         ProductName: product.productName,
//         Status: product.status,
//         selected: false // Add selected property
//       }));
//       this.applyWarehouseFilters(); // Filter products after loading
//     }).catch(error => {
//       console.error('Error fetching warehouse products', error);
//     });
//   }

//   getFilteredProducts(): any[] {
//     let filtered = this.productData;

//     if (this.searchQuery) {
//       filtered = filtered.filter(product => product.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()));
//     }

//     if (this.selectedCategory) {
//       filtered = filtered.filter(product => product.categoryName === this.selectedCategory.name);
//     }

//     return filtered;
//   }

//   getFilteredWarehouseProducts(): any[] {
//     let filtered = this.warehouseProductData;

//     if (this.searchQuery) {
//       filtered = filtered.filter(product => product.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()));
//     }

//     return filtered;
//   }

//   applyFilters() {
//     this.filteredProductList = this.getFilteredProducts();
//   }

//   applyWarehouseFilters() {
//     this.filteredWarehouseProductList = this.getFilteredWarehouseProducts();
//   }

//   loadSites() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchSites(formData).then((res: any) => {
//       this.siteData = res;
//       console.log("Response:", res);
//     }).catch(error => {
//       console.error('Error fetching Substations data', error);
//     });
//   }

//   loadClients() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchClients(formData).then((res: any) => {
//       this.clients = res;
//       console.log("Clients Response:", res);
//     }).catch(error => {
//       console.error('Error fetching clients data', error);
//     });
//   }

//   fetchClientWarehouses() {
//     if (this.selectedClient) {
//       const formData = {
//         permissionName: 'Tasks',
//         employeeIdMiddleware: this.userId,
//         employeeId: this.userId,
//         clientName: this.selectedClient,
//       };

//       this.dataService.fetchClientWarehouses(formData).then((res: any) => {
//         this.warehouseProductData = res.map((product) => ({
//           ...product,
//           SerialNumber: product.serialNumber,
//           ProductName: product.productName,
//           Status: product.status,
//           selected: false // Add selected property
//         }));
//         this.applyWarehouseFilters(); // Filter products after loading
//         console.log("Client Warehouses Response:", res);
//       }).catch(error => {
//         console.error('Error fetching client warehouses data', error);
//       });
//     }
//   }

//   trackByProductId(index: number, product: any): string {
//     return product.id;
//   }

//   async presentToast(message: string, duration: number = 2000, position: 'bottom' | 'top' | 'middle' = 'bottom') {
//     const toast = await this.toastController.create({
//       message: message,
//       duration: duration,
//       position: position
//     });
//     toast.present();
//   }

//   openClientDetailsModal() {
//     this.isClientDetailsModalOpen = true;
//   }

//   closeClientDetailsModal() {
//     this.isClientDetailsModalOpen = false;
//   }

//   // deliverProductToWarehouse() {
//   //   const formData = {
//   //     permissionName: 'Tasks',
//   //     employeeIdMiddleware: this.userId,
//   //     employeeId: this.userId,
//   //   };
//   //   const selectedProducts = this.productData.filter(product => product.selected);
//   //   if (!this.selectedClient) {
//   //     this.presentToast('Please select a client.');
//   //     return;
//   //   }
//   //   if (!this.selectedWarehouse) {
//   //     this.presentToast('Please select a client warehouse.');
//   //     return;
//   //   }
//   //   if (selectedProducts.length === 0) {
//   //     this.presentToast('Please select at least one product.');
//   //     return;
//   //   }
//   //   const deliveryDetails = {
//   //     products: selectedProducts,
//   //     client: this.selectedClient,
//   //     warehouse: this.selectedWarehouse,
//   //     gstNumber: this.gstNumber,
//   //     billingClient: this.billingClient,
//   //     billingWarehouse: this.billingWarehouse,
//   //     billingGstNumber: this.billingGstNumber,
//   //     companyPanNumber: this.companyPanNumber,
//   //     dispatchedThrough: this.dispatchedThrough,
//   //     dispatchedDate: this.dispatchedDate,
//   //     paymentTerms: this.paymentTerms,
//   //     otherReferences: this.otherReferences,
//   //     destination: this.destination,
//   //     motorVehicleNo: this.motorVehicleNo,
//   //   };
//   //   this.dataService.deliverProduct(deliveryDetails, formData).subscribe(
//   //     () => {
//   //       this.presentToast('Products delivered to warehouse successfully!');
//   //       this.showFurtherDelivery = true;
//   //       this.selectedClient = null;
//   //       this.selectedWarehouse = null;
//   //       this.productData.forEach(product => product.selected = false); // Deselect all products
//   //       this.applyFilters(); // Refresh filtered products
//   //       this.closeClientDetailsModal(); // Close the modal
//   //     },
//   //     error => {
//   //       console.error('Error delivering products to warehouse', error);
//   //       this.presentToast('There was an error delivering the products to the warehouse.');
//   //     }
//   //   );
//   // }

//   deliverProductToSite() {
//       //   const selectedProducts = this.productData.filter(product => product.selected);

//     if (!this.selectedSite) {
//       this.presentToast('Please select a site.');
//       return;
//     }
//     const selectedProducts = this.clientWarehouseProductData.filter(product => product.selected);
//     const furtherDeliveryDetails = {
//       products: selectedProducts,
//       site: this.selectedSite,
//     };
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };
//     this.dataService.furtherDeliverProduct(furtherDeliveryDetails, formData).subscribe(
//       () => {
//         this.presentToast('Products delivered to site successfully!');
//         this.selectedSite = null;
//         this.clientWarehouseProductData.forEach(product => product.selected = false); // Deselect all products
//         this.applyWarehouseFilters(); // Refresh filtered products
//         this.showFurtherDelivery = false;
//       },
//       error => {
//         console.error('Error delivering products to site', error);
//         this.presentToast('There was an error delivering the products to the site.');
//       }
//     );
//   }

//   //Original

//   // async generateChallan() {
//   //   const doc = new jsPDF();

//   //   const imageUrl = 'assets/outwardChallan.jpg'; // Update the path to the actual path where the image is stored

//   //   try {
//   //     const imgData = await this.getBase64ImageFromURL(imageUrl);

//   //     const addTemplate = (pageIndex) => {
//   //       doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
//   //       doc.setFontSize(12);
//   //       doc.text(`Challan Number: #${this.selectedPurchase.purchaseId}`, 10, 10);
//   //       doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' });
//   //     };

//   //     let pageIndex = 0;
//   //     addTemplate(pageIndex);

//   //     doc.setFontSize(10);
//   //     const startX = 10;
//   //     const initialY = 73;
//   //     let startY = initialY;
//   //     const lineHeight = 8;
//   //     const maxPageHeight = 270;

//   //     // Add modal data to the PDF
//   //     doc.text(`Client: ${this.selectedClient}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`Client Warehouse: ${this.selectedWarehouse}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`GST Number: ${this.gstNumber}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`Billing Client: ${this.billingClient}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`Billing Warehouse: ${this.billingWarehouse}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`Billing GST Number: ${this.billingGstNumber}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`Company PAN Number: ${this.companyPanNumber}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`Dispatched Through: ${this.dispatchedThrough}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`Dispatched Date: ${this.dispatchedDate}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`Payment Terms: ${this.paymentTerms}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`Destination: ${this.destination}`, startX, startY);
//   //     startY += lineHeight;
//   //     doc.text(`Motor Vehicle No: ${this.motorVehicleNo}`, startX, startY);
//   //     startY += lineHeight * 2; // Add extra space before product details

//   //     const itemDetails = {};

//   //     this.selectedPurchase.items.forEach((item) => {
//   //       const productName = item.productName;
//   //       const quantity = item.quantity || 1;
//   //       const serialNumbers = item.serialNumbers || [];

//   //       if (!itemDetails[productName]) {
//   //         itemDetails[productName] = {
//   //           quantity: 0,
//   //           serialNumbers: []
//   //         };
//   //       }
//   //       itemDetails[productName].quantity += quantity;
//   //       itemDetails[productName].serialNumbers.push(...serialNumbers);
//   //     });

//   //     Object.keys(itemDetails).forEach((productName, index) => {
//   //       const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
//   //       const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
//   //       const totalHeight = splitSerialNumbers.length * lineHeight;

//   //       if (startY + totalHeight > maxPageHeight) {
//   //         pageIndex++;
//   //         doc.addPage();
//   //         addTemplate(pageIndex);
//   //         doc.setFontSize(10);
//   //         startY = initialY;
//   //       }

//   //       doc.text(`${index + 1}`, startX + 6.75, startY);
//   //       doc.text(productName || '', startX + 15, startY);
//   //       doc.text(itemDetails[productName].quantity.toString(), startX + 177, startY);
//   //       doc.text(this.selectedPurchase.challanNo || '', startX + 110, startY);
//   //       doc.text(this.selectedPurchase.storeLocation || '', startX + 140, startY);
//   //       doc.text(this.selectedPurchase.warrantyPeriodMonths || '', startX + 170, startY);
//   //       doc.text(this.selectedPurchase.status || '', startX + 190, startY);

//   //       splitSerialNumbers.forEach((line, lineIndex) => {
//   //         doc.text(line, startX + 70, startY + (lineIndex * lineHeight));
//   //       });

//   //       startY += totalHeight + lineHeight / 2;
//   //     });

//   //     doc.save('Inward-Challan.pdf');
//   //   } catch (error) {
//   //     console.error('Error generating PDF:', error);
//   //   }
//   // }

//   // getBase64ImageFromURL(url: string): Promise<string> {
//   //   return new Promise((resolve, reject) => {
//   //     const img = new Image();
//   //     img.crossOrigin = 'Anonymous';
//   //     img.onload = () => {
//   //       const canvas = document.createElement('canvas');
//   //       canvas.width = img.width;
//   //       canvas.height = img.height;
//   //       const ctx = canvas.getContext('2d');
//   //       if (ctx) {
//   //         ctx.drawImage(img, 0, 0);
//   //         const dataURL = canvas.toDataURL('image/jpeg');
//   //         resolve(dataURL);
//   //       } else {
//   //         reject(new Error('Canvas context is null'));
//   //       }
//   //     };
//   //     img.onerror = reject;
//   //     img.src = url;
//   //   });
//   // }

//   // deliverProductToWarehouse() {
//   //   const formData = {
//   //     permissionName: 'Tasks',
//   //     employeeIdMiddleware: this.userId,
//   //     employeeId: this.userId,
//   //   };
//   //   const selectedProducts = this.productData.filter(product => product.selected);
//   //   if (!this.selectedClient) {
//   //     this.presentToast('Please select a client.');
//   //     return;
//   //   }
//   //   if (!this.selectedWarehouse) {
//   //     this.presentToast('Please select a client warehouse.');
//   //     return;
//   //   }
//   //   if (selectedProducts.length === 0) {
//   //     this.presentToast('Please select at least one product.');
//   //     return;
//   //   }
//   //   const deliveryDetails = {
//   //     products: selectedProducts,
//   //     client: this.selectedClient,
//   //     warehouse: this.selectedWarehouse,
//   //     gstNumber: this.gstNumber,
//   //     billingClient: this.billingClient,
//   //     billingWarehouse: this.billingWarehouse,
//   //     billingGstNumber: this.billingGstNumber,
//   //     companyPanNumber: this.companyPanNumber,
//   //     dispatchedThrough: this.dispatchedThrough,
//   //     dispatchedDate: this.dispatchedDate,
//   //     paymentTerms: this.paymentTerms,
//   //     otherReferences: this.otherReferences,
//   //     destination: this.destination,
//   //     motorVehicleNo: this.motorVehicleNo,
//   //   };
//   //   this.dataService.deliverProduct(deliveryDetails, formData).subscribe(
//   //     () => {
//   //       this.presentToast('Products delivered to warehouse successfully!');
//   //       this.showFurtherDelivery = true;
//   //       this.selectedClient = null;
//   //       this.selectedWarehouse = null;
//   //       this.productData.forEach(product => product.selected = false); // Deselect all products
//   //       this.applyFilters(); // Refresh filtered products
//   //       this.closeClientDetailsModal(); // Close the modal
//   //       this.generateChallan(); // Call generateChallan to create the PDF
//   //     },
//   //     error => {
//   //       console.error('Error delivering products to warehouse', error);
//   //       this.presentToast('There was an error delivering the products to the warehouse.');
//   //     }
//   //   );
//   // }

// /// Original

// //Testing
// async generateChallan() {
//   const doc = new jsPDF();
//   const imageUrl = 'assets/outwardChallan.jpg';

//   try {
//     const imgData = await this.getBase64ImageFromURL(imageUrl);

//     const addTemplate = (pageIndex) => {
//       doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
//       doc.setFontSize(12);
//       doc.text(`Challan Number: #${this.selectedPurchase.purchaseId}`, 10, 10);
//       doc.text(`Page ${pageIndex + 1}`, 200, 10, { align: 'right' });
//     };

//     let pageIndex = 0;
//     addTemplate(pageIndex);

//     doc.setFontSize(10);
//     const startX = 10;
//     const initialY = 73;
//     let startY = initialY;
//     const lineHeight = 8;
//     const maxPageHeight = 270;

//     doc.text(`${this.selectedClient}`, 15, 55);
//     startY += lineHeight;
//     doc.text(`Client Warehouse: ${this.selectedWarehouse}`, startX, startY);
//     startY += lineHeight;
//     doc.text(`GST Number: ${this.gstNumber}`, startX, startY);
//     startY += lineHeight;
//     doc.text(`Billing Client: ${this.billingClient}`, startX, startY);
//     startY += lineHeight;
//     doc.text(`Billing Warehouse: ${this.billingWarehouse}`, startX, startY);
//     startY += lineHeight;
//     doc.text(`Billing GST Number: ${this.billingGstNumber}`, startX, startY);
//     startY += lineHeight;
//     doc.text(`Company PAN Number: ${this.companyPanNumber}`, startX, startY);
//     startY += lineHeight;
//     doc.text(`Dispatched Through: ${this.dispatchedThrough}`, startX, startY);
//     startY += lineHeight;
//     doc.text(`Dispatched Date: ${this.dispatchedDate}`, startX, startY);
//     startY += lineHeight;
//     doc.text(`Payment Terms: ${this.paymentTerms}`, startX, startY);
//     startY += lineHeight;
//     doc.text(`Destination: ${this.destination}`, startX, startY);
//     startY += lineHeight;
//     doc.text(`Motor Vehicle No: ${this.motorVehicleNo}`, startX, startY);
//     startY += lineHeight * 2;

//     const itemDetails = {};

//     this.selectedPurchase.items.forEach((item) => {
//       const productName = item.productName;
//       const quantity = item.quantity || 1;
//       const serialNumbers = item.serialNumbers || [];

//       if (!itemDetails[productName]) {
//         itemDetails[productName] = {
//           quantity: 0,
//           serialNumbers: []
//         };
//       }
//       itemDetails[productName].quantity += quantity;
//       itemDetails[productName].serialNumbers.push(...serialNumbers);
//     });

//     Object.keys(itemDetails).forEach((productName, index) => {
//       const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
//       const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
//       const totalHeight = splitSerialNumbers.length * lineHeight;

//       if (startY + totalHeight > maxPageHeight) {
//         pageIndex++;
//         doc.addPage();
//         addTemplate(pageIndex);
//         doc.setFontSize(10);
//         startY = initialY;
//       }

//       doc.text(`${index + 1}`, startX + 6.75, startY);
//       doc.text(productName || '', startX + 15, startY);
//       doc.text(itemDetails[productName].quantity.toString(), startX + 177, startY);
//       // doc.text(this.selectedPurchase.challanNo || '', startX + 110, startY);
//       // doc.text(this.selectedPurchase.storeLocation || '', startX + 140, startY);
//       // doc.text(this.selectedPurchase.warrantyPeriodMonths || '', startX + 170, startY);
//       // doc.text(this.selectedPurchase.status || '', startX + 190, startY);

//       splitSerialNumbers.forEach((line, lineIndex) => {
//         doc.text(line, startX + 70, startY + (lineIndex * lineHeight));
//       });

//       startY += totalHeight + lineHeight / 2;
//     });

//     doc.save('Delivery-Challan.pdf');
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//   }
// }

// getBase64ImageFromURL(url: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = 'Anonymous';
//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         ctx.drawImage(img, 0, 0);
//         const dataURL = canvas.toDataURL('image/jpeg');
//         resolve(dataURL);
//       } else {
//         reject(new Error('Canvas context is null'));
//       }
//     };
//     img.onerror = reject;
//     img.src = url;
//   });
// }
// //testing

// }



// // import { Component, OnInit } from '@angular/core';
// // import { ToastController } from '@ionic/angular';
// // import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

// // @Component({
// //   selector: 'app-delivery',
// //   templateUrl: './delivery.page.html',
// //   styleUrls: ['./delivery.page.scss'],
// // })
// // export class DeliveryPage implements OnInit {
// //   categories: any[] = [];
// //   products: any[] = [];
// //   filteredProductList: any[] = [];
// //   filteredWarehouseProductList: any[] = [];
// //   clients: any[] = [];
// //   clientWarehouses: any[] = [];
// //   selectedClient: any;
// //   selectedWarehouse: any;
// //   selectedCategory: any;
// //   selectedSite: any;
// //   searchQuery: any;
// //   data: any;
// //   siteData: any[];
// //   productData: any[] = [];
// //   clientWarehouseProductData: any[] = [];
// //   warehouseProductData: any[] = [];
// //   deliveryAddress: any;
// //   showFurtherDelivery: boolean = false;
// //   selectedSegment: string = 'step1';

// //   constructor(private dataService: DataService, private toastController: ToastController) { }

// //   ngOnInit() {
// //     this.fetchDeliveryProducts();
// //     this.loadCategories();
// //     this.loadClients();
// //     this.loadSites();
// //     this.fetchWarehouseProducts();
// //   }

// //   segmentChanged() {
// //     if (this.selectedSegment === 'step2') {
// //       this.fetchWarehouseProducts();
// //     }
// //   }

// //   fetchProductsByClient() {
// //     if (this.selectedClient) {
// //       const formData = {
// //         permissionName: 'Tasks',
// //         employeeIdMiddleware: this.userId,
// //         employeeId: this.userId,
// //         clientName: this.selectedClient,
// //       };

// //       this.dataService.fetchProductsByClient(formData).then((res: any) => {
// //         this.clientWarehouseProductData = res.productData.map((product) => ({
// //           ...product,
// //           selected: false // Add selected property
// //         }));
// //         console.log("data fetched for client:", res)
// //       }).catch(error => {
// //         console.error('Error fetching client products data', error);
// //       });
// //     }
// //   }

// //   loadCategories() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };

// //     this.dataService.fetchCategories(formData).then((res: any) => {
// //       this.categories = res; // Assign response to categories
// //     }).catch(error => {
// //       console.error('Error fetching categories data', error);
// //     });
// //   }

// //   fetchDeliveryProducts() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };
// //     console.log('formdata', formData);
// //     this.dataService.fetchProducts(formData).then((data: any) => {
// //       console.log('Delivery DATA:', data);
// //       this.productData = data.productData.map((product) => ({
// //         ...product,
// //         SerialNumber: product.serialNumber,
// //         ProductName: product.productName,
// //         Status: product.status,
// //         selected: false // Add selected property
// //       }));
// //       this.applyFilters(); // Filter products after loading
// //     }).catch(error => {
// //       console.error('Error fetching data', error);
// //     });
// //   }

// //   fetchWarehouseProducts() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };
// //     this.dataService.fetchWarehouseProducts(formData).then((data: any) => {
// //       this.warehouseProductData = data.map((product) => ({
// //         ...product,
// //         SerialNumber: product.serialNumber,
// //         ProductName: product.productName,
// //         Status: product.status,
// //         selected: false // Add selected property
// //       }));
// //       this.applyWarehouseFilters(); // Filter products after loading
// //     }).catch(error => {
// //       console.error('Error fetching warehouse products', error);
// //     });
// //   }

// //   getFilteredProducts(): any[] {
// //     let filtered = this.productData;

// //     if (this.searchQuery) {
// //       filtered = filtered.filter(product => product.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()));
// //     }

// //     if (this.selectedCategory) {
// //       filtered = filtered.filter(product => product.categoryName === this.selectedCategory.name);
// //     }

// //     return filtered;
// //   }

// //   getFilteredWarehouseProducts(): any[] {
// //     let filtered = this.warehouseProductData;

// //     if (this.searchQuery) {
// //       filtered = filtered.filter(product => product.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()));
// //     }

// //     return filtered;
// //   }

// //   applyFilters() {
// //     this.filteredProductList = this.getFilteredProducts();
// //   }

// //   applyWarehouseFilters() {
// //     this.filteredWarehouseProductList = this.getFilteredWarehouseProducts();
// //   }

// //   loadSites() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };

// //     this.dataService.fetchSites(formData).then((res: any) => {
// //       this.siteData = res;
// //       console.log("Response:", res);
// //     }).catch(error => {
// //       console.error('Error fetching Substations data', error);
// //     });
// //   }

// //   loadClients() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };

// //     this.dataService.fetchClients(formData).then((res: any) => {
// //       this.clients = res;
// //       console.log("Clients Response:", res);
// //     }).catch(error => {
// //       console.error('Error fetching clients data', error);
// //     });
// //   }

// //   fetchClientWarehouses() {
// //     if (this.selectedClient) {
// //       const formData = {
// //         permissionName: 'Tasks',
// //         employeeIdMiddleware: this.userId,
// //         employeeId: this.userId,
// //         clientName: this.selectedClient,
// //       };

// //       this.dataService.fetchClientWarehouses(formData).then((res: any) => {
// //         this.warehouseProductData = res.map((product) => ({
// //           ...product,
// //           SerialNumber: product.serialNumber,
// //           ProductName: product.productName,
// //           Status: product.status,
// //           selected: false // Add selected property
// //         }));
// //         this.applyWarehouseFilters(); // Filter products after loading
// //         console.log("Client Warehouses Response:", res);
// //       }).catch(error => {
// //         console.error('Error fetching client warehouses data', error);
// //       });
// //     }
// //   }

// //   trackByProductId(index: number, product: any): string {
// //     return product.id;
// //   }

// //   async presentToast(message: string, duration: number = 2000, position: 'bottom' | 'top' | 'middle' = 'bottom') {
// //     const toast = await this.toastController.create({
// //       message: message,
// //       duration: duration,
// //       position: position
// //     });
// //     toast.present();
// //   }

// //   deliverProductToWarehouse() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };
// //     const selectedProducts = this.productData.filter(product => product.selected);
// //     if (!this.selectedClient) {
// //       this.presentToast('Please select a client.');
// //       return;
// //     }
// //     if (!this.selectedWarehouse) {
// //       this.presentToast('Please select a client warehouse.');
// //       return;
// //     }
// //     if (selectedProducts.length === 0) {
// //       this.presentToast('Please select at least one product.');
// //       return;
// //     }
// //     const deliveryDetails = {
// //       products: selectedProducts,
// //       client: this.selectedClient,
// //       warehouse: this.selectedWarehouse,
// //     };
// //     this.dataService.deliverProduct(deliveryDetails, formData).subscribe(
// //       () => {
// //         this.presentToast('Products delivered to warehouse successfully!');
// //         this.showFurtherDelivery = true;
// //         this.selectedClient = null;
// //         this.selectedWarehouse = null;
// //         this.productData.forEach(product => product.selected = false); // Deselect all products
// //         this.applyFilters(); // Refresh filtered products
// //       },
// //       error => {
// //         console.error('Error delivering products to warehouse', error);
// //         this.presentToast('There was an error delivering the products to the warehouse.');
// //       }
// //     );
// //   }

// //   deliverProductToSite() {
// //     if (!this.selectedSite) {
// //       this.presentToast('Please select a site.');
// //       return;
// //     }
// //     const selectedProducts = this.clientWarehouseProductData.filter(product => product.selected);
// //     const furtherDeliveryDetails = {
// //       products: selectedProducts,
// //       site: this.selectedSite,
// //     };
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };
// //     this.dataService.furtherDeliverProduct(furtherDeliveryDetails, formData).subscribe(
// //       () => {
// //         this.presentToast('Products delivered to site successfully!');
// //         this.selectedSite = null;
// //         this.clientWarehouseProductData.forEach(product => product.selected = false); // Deselect all products
// //         this.applyWarehouseFilters(); // Refresh filtered products
// //         this.showFurtherDelivery = false;
// //       },
// //       error => {
// //         console.error('Error delivering products to site', error);
// //         this.presentToast('There was an error delivering the products to the site.');
// //       }
// //     );
// //   }

// //   downloadChallan(deliveryDetails: any) {
// //     this.dataService.generateChallan(deliveryDetails).subscribe(
// //       (blob: Blob) => {
// //         const url = window.URL.createObjectURL(blob);
// //         const a = document.createElement('a');
// //         a.href = url;
// //         a.download = 'outward_challan.pdf';
// //         document.body.appendChild(a);
// //         a.click();
// //         document.body.removeChild(a);
// //       },
// //       error => {
// //         console.error('Error generating challan', error);
// //         this.presentToast('There was an error generating the challan.');
// //       }
// //     );
// //   }
// // }


// // import { Component, OnInit } from '@angular/core';
// // import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

// // @Component({
// //   selector: 'app-delivery',
// //   templateUrl: './delivery.page.html',
// //   styleUrls: ['./delivery.page.scss'],
// // })
// // export class DeliveryPage implements OnInit {
// //   categories: any[] = [];
// //   products: any[] = [];
// //   filteredProductList: any[] = [];
// //   filteredWarehouseProductList: any[] = [];
// //   clients: any[] = [];
// //   clientWarehouses: any[] = [];
// //   selectedClient: any;
// //   selectedWarehouse: any;
// //   selectedCategory: any;
// //   selectedSite: any;
// //   searchQuery: any;
// //   data: any;
// //   siteData: any[];
// //   productData: any[] = [];
// //   clientWarehouseProductData: any[] = [];
// //   warehouseProductData: any[] = [];
// //   deliveryAddress: any;
// //   showFurtherDelivery: boolean = false;
// //   selectedSegment: string = 'step1';

// //   constructor(private dataService: DataService) { }

// //   ngOnInit() {
// //     this.fetchDeliveryProducts();
// //     this.loadCategories();
// //     this.loadClients();
// //     this.loadSites();
// //     this.fetchWarehouseProducts();
// //   }

// //   segmentChanged() {
// //     if (this.selectedSegment === 'step2') {
// //       this.fetchWarehouseProducts();
// //     }
// //   }

// //   fetchProductsByClient() {
// //     if (this.selectedClient) {
// //       const formData = {
// //         permissionName: 'Tasks',
// //         employeeIdMiddleware: this.userId,
// //         employeeId: this.userId,
// //         clientName: this.selectedClient,
// //       };

// //       this.dataService.fetchProductsByClient(formData).then((res: any) => {
// //         this.clientWarehouseProductData = res.productData.map((product) => ({
// //           ...product,
// //           selected: false // Add selected property
// //         }));
// //         console.log("data fetched for client:", res)
// //       }).catch(error => {
// //         console.error('Error fetching client products data', error);
// //       });
// //     }
// //   }

// //   loadCategories() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };

// //     this.dataService.fetchCategories(formData).then((res: any) => {
// //       this.categories = res; // Assign response to categories
// //     }).catch(error => {
// //       console.error('Error fetching categories data', error);
// //     });
// //   }

// //   fetchDeliveryProducts() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };
// //     console.log('formdata', formData);
// //     this.dataService.fetchProducts(formData).then((data: any) => {
// //       console.log('Delivery DATA:', data);
// //       this.productData = data.productData.map((product) => ({
// //         ...product,
// //         SerialNumber: product.serialNumber,
// //         ProductName: product.productName,
// //         Status: product.status,
// //         selected: false // Add selected property
// //       }));
// //       this.applyFilters(); // Filter products after loading
// //     }).catch(error => {
// //       console.error('Error fetching data', error);
// //     });
// //   }

// //   fetchWarehouseProducts() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };
// //     this.dataService.fetchWarehouseProducts(formData).then((data: any) => {
// //       this.warehouseProductData = data.map((product) => ({
// //         ...product,
// //         SerialNumber: product.serialNumber,
// //         ProductName: product.productName,
// //         Status: product.status,
// //         selected: false // Add selected property
// //       }));
// //       this.applyWarehouseFilters(); // Filter products after loading
// //     }).catch(error => {
// //       console.error('Error fetching warehouse products', error);
// //     });
// //   }

// //   getFilteredProducts(): any[] {
// //     let filtered = this.productData;

// //     if (this.searchQuery) {
// //       filtered = filtered.filter(product => product.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()));
// //     }

// //     if (this.selectedCategory) {
// //       filtered = filtered.filter(product => product.categoryName === this.selectedCategory.name);
// //     }

// //     return filtered;
// //   }

// //   getFilteredWarehouseProducts(): any[] {
// //     let filtered = this.warehouseProductData;

// //     if (this.searchQuery) {
// //       filtered = filtered.filter(product => product.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()));
// //     }

// //     return filtered;
// //   }

// //   applyFilters() {
// //     this.filteredProductList = this.getFilteredProducts();
// //   }

// //   applyWarehouseFilters() {
// //     this.filteredWarehouseProductList = this.getFilteredWarehouseProducts();
// //   }

// //   loadSites() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };

// //     this.dataService.fetchSites(formData).then((res: any) => {
// //       this.siteData = res;
// //       console.log("Response:", res);
// //     }).catch(error => {
// //       console.error('Error fetching Substations data', error);
// //     });
// //   }

// //   loadClients() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };

// //     this.dataService.fetchClients(formData).then((res: any) => {
// //       this.clients = res;
// //       console.log("Clients Response:", res);
// //     }).catch(error => {
// //       console.error('Error fetching clients data', error);
// //     });
// //   }

// //   fetchClientWarehouses() {
// //     if (this.selectedClient) {
// //       const formData = {
// //         permissionName: 'Tasks',
// //         employeeIdMiddleware: this.userId,
// //         employeeId: this.userId,
// //         clientName: this.selectedClient,
// //       };

// //       this.dataService.fetchClientWarehouses(formData).then((res: any) => {
// //         this.warehouseProductData = res.map((product) => ({
// //           ...product,
// //           SerialNumber: product.serialNumber,
// //           ProductName: product.productName,
// //           Status: product.status,
// //           selected: false // Add selected property
// //         }));
// //         this.applyWarehouseFilters(); // Filter products after loading
// //         console.log("Client Warehouses Response:", res);
// //       }).catch(error => {
// //         console.error('Error fetching client warehouses data', error);
// //       });
// //     }
// //   }

// //   trackByProductId(index: number, product: any): string {
// //     return product.id;
// //   }

// //   deliverProductToWarehouse() {
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };
// //     const selectedProducts = this.productData.filter(product => product.selected);
// //     if (!this.selectedClient) {
// //       alert('Please select a client.');
// //       return;
// //     }
// //     if (!this.selectedWarehouse) {
// //       alert('Please select a client warehouse.');
// //       return;
// //     }
// //     if (selectedProducts.length === 0) {
// //       alert('Please select at least one product.');
// //       return;
// //     }
// //     const deliveryDetails = {
// //       products: selectedProducts,
// //       client: this.selectedClient,
// //       warehouse: this.selectedWarehouse,
// //     };
// //     this.dataService.deliverProduct(deliveryDetails, formData).subscribe(
// //       () => {
// //         alert('Products delivered to warehouse successfully!');
// //         this.showFurtherDelivery = true;
// //         this.selectedClient = null;
// //         this.selectedWarehouse = null;
// //         this.productData.forEach(product => product.selected = false); // Deselect all products
// //         this.applyFilters(); // Refresh filtered products
// //       },
// //       error => {
// //         console.error('Error delivering products to warehouse', error);
// //         alert('There was an error delivering the products to the warehouse.');
// //       }
// //     );
// //   }

// //   deliverProductToSite() {
// //     if (!this.selectedSite) {
// //       alert('Please select a site.');
// //       return;
// //     }
// //     const selectedProducts = this.clientWarehouseProductData.filter(product => product.selected);
// //     const furtherDeliveryDetails = {
// //       products: selectedProducts,
// //       site: this.selectedSite,
// //     };
// //     const formData = {
// //       permissionName: 'Tasks',
// //       employeeIdMiddleware: this.userId,
// //       employeeId: this.userId,
// //     };
// //     this.dataService.furtherDeliverProduct(furtherDeliveryDetails, formData).subscribe(
// //       () => {
// //         alert('Products delivered to site successfully!');
// //         this.selectedSite = null;
// //         this.clientWarehouseProductData.forEach(product => product.selected = false); // Deselect all products
// //         this.applyWarehouseFilters(); // Refresh filtered products
// //         this.showFurtherDelivery = false;
// //       },
// //       error => {
// //         console.error('Error delivering products to site', error);
// //         alert('There was an error delivering the products to the site.');
// //       }
// //     );
// //   }

// //   downloadChallan(deliveryDetails: any) {
// //     this.dataService.generateChallan(deliveryDetails).subscribe(
// //       (blob: Blob) => {
// //         const url = window.URL.createObjectURL(blob);
// //         const a = document.createElement('a');
// //         a.href = url;
// //         a.download = 'outward_challan.pdf';
// //         document.body.appendChild(a);
// //         a.click();
// //         document.body.removeChild(a);
// //       },
// //       error => {
// //         console.error('Error generating challan', error);
// //         alert('There was an error generating the challan.');
// //       }
// //     );
// //   }
// // }
