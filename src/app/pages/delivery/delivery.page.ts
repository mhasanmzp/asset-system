import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
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
  buyersOrderNumber: string = '';
  termsOfDelivery: string = '';
  refNoAndDate: string = '';
  dispatchedThrough: string = '';
  dispatchedDate: any;
  otherReferences: string = '';
  paymentTerms: string = '';
  dispatchDocNo: string = '';
  // billOfLading: string = '';
  destination: string = '';
  motorVehicleNo: string = '';
  selectedPurchase: any = null;

  constructor(private dataService: DataService, 
    private toastController: ToastController,
    private loadingController: LoadingController // Inject LoadingController
  ) { }

  ngOnInit() {
    this.fetchDeliveryProducts();
    this.loadCategories();
    this.loadClients();
    this.loadSites();
    this.fetchWarehouseProducts()
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
        serialNumbers: [product.SerialNumber],
        hsnNumber: product.hsnNumber,
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
        this.fetchDeliveryProducts()
        this.selectedSegment = 'step1';
      },
      async error => {
        // Handle error response
        console.error('Error delivering product:', error);
        await this.presentToast('Failed to deliver the product. Please try again.');
      }
    );
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
  //     doc.text(`${this.selectedClient}`, 13.5, 53.5);
  //     startY += lineHeight;
  //     doc.setFont("helvetica", "normal");
  
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
  
  //     doc.setFontSize(9);
  //     doc.setFont("helvetica", "bold");
  //     doc.text(`${this.billingClient}`, 13.5, 90);
  //     startY += lineHeight;
  //     doc.setFont("helvetica", "normal");
  
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
  
  //     const itemDetails = {};
  
  //     this.selectedPurchase.items.forEach((item) => {
  //       const productName = item.productName;
  //       const quantity = item.quantity || 1;
  //       // const serialNumbers = item.serialNumbers || [];
  
  //       if (!itemDetails[productName]) {
  //         itemDetails[productName] = {
  //           quantity: 0,
  //           serialNumbers: []
  //         };
  //       }
  //       itemDetails[productName].quantity += quantity;
  //       // itemDetails[productName].serialNumbers.push(...serialNumbers);
  //     });
  
  //     // Generate a random 6-digit number for delivery note
  //     let randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
  //     let formattedDate = new Date().toISOString().slice(0, 10).split('-').reverse().join('-');
  
  //     // Add an offset to startY before printing the first row of product details
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
  //         startY = initialY + 15; // Apply the offset for new pages as well
  //       }
  
  //       // Setting the initial Y positions for the columns of the table
  //       const productNameY = startY;
  //       const quantityY = startY;
  //       const serialNumbersY = startY;
  
  //       // Add product details
  //       doc.setFontSize(10);
  //       doc.text(`${index + 1}`, 13.5, productNameY); // Index
  //       doc.setFont("helvetica", "bold");
  //       doc.text(productName || '', 20, productNameY); // Product Name
  //       doc.setFont("helvetica", "normal");
  //       doc.text(itemDetails[productName].quantity.toString(), 167.5, quantityY); // Quantity
  
  //       // Add serial numbers, adjusting startY accordingly
  //       splitSerialNumbers.forEach(line => {
  //         if (startY + lineHeight > maxPageHeight) {
  //           pageIndex++;
  //           doc.addPage();
  //           addTemplate(pageIndex);
  //           doc.setFontSize(7);
  //           startY = initialY + 15; // Apply the offset for new pages as well
  //         }
  //         doc.text(line, 60, serialNumbersY);
  //         startY += reducedLineHeight;
  //       });
  
  //       totalQuantity += itemDetails[productName].quantity;
  
  //       startY += reducedLineHeight / 2; // Extra space between products
  
  //       // Add other details only once on the first page
  //       if (index === 0) {
  //         doc.text(`${this.companyPanNumber}`, 60, 224);
  //         doc.text(`DN-${randomSixDigitNumber}`, 96.5, 24);
  //         doc.text(`${this.buyersOrderNumber}`, 96.5, 51.25);
  //         doc.text(`${this.dispatchDocNo}`, 96.5, 60);
  //         doc.text(`${this.termsOfDelivery}`, 96.5, 86);
  //         doc.setFontSize(9);
  //         doc.text(`${this.dispatchedThrough}`, 96.5, 68);
  //         doc.text(formattedDate, 137, 24);
  //         doc.text(`${this.paymentTerms}`, 137, 33.5);
  //         doc.text(`${this.dispatchedDate}`, 137, 51); // Needs to be updated
  //         doc.text(`${this.destination}`, 137, 68);
  //         doc.text(`${this.motorVehicleNo}`, 137, 77);
  //         // doc.text(`${totalQuantity} Nos.`, 166, 197);
  //         let billOfLading = `${this.dispatchDocNo} dt. ${formattedDate}`;
  //         doc.text(`${billOfLading}`, 96.5, 77);
  //         let refNoAndDate = `SO/${randomSixDigitNumber} dt. ${formattedDate}`;
  //         doc.text(`${refNoAndDate}`, 96.5, 41.7);
  //       }
  //     });
  
  //     // Print total quantity on the last page
  //     doc.text(`${totalQuantity}`, 166, 197);
  
  //     doc.save(`${this.selectedClient}-Delivery-Challan.pdf`);
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
  
      let pageIndex = 0;
      addTemplate(pageIndex);
  
      doc.setFontSize(8);
      const startX = 10;
      const initialY = 73;
      let startY = initialY;
      const lineHeight = 8;
      const reducedLineHeight = 3.5;
      const maxPageHeight = 270;
  
      // Add modal data to the PDF
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`${this.selectedClient}`, 13.5, 53.5);
      startY += lineHeight;
      doc.setFont("helvetica", "normal");
  
      doc.setFontSize(8);
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
  
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`${this.billingClient}`, 13.5, 90);
      startY += lineHeight;
      doc.setFont("helvetica", "normal");
  
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
      doc.text(`GSTIN/UIN:   ${this.billingGstNumber}`, 13.5, 105);
      startY += lineHeight;
  
      const itemDetails = {};
  
      this.selectedPurchase.items.forEach((item) => {
        const productName = item.productName;
        const quantity = item.quantity || 1;
        const hsnNumber = item.hsnNumber || ''; // Assuming hsnNumber is a property of item
  
        if (!itemDetails[productName]) {
          itemDetails[productName] = {
            quantity: 0,
            serialNumbers: [],
            hsnNumber: hsnNumber // Store the HSN number
          };
        }
        itemDetails[productName].quantity += quantity;
      });
  
      // Generate a random 6-digit number for delivery note
      let randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
      let formattedDate = new Date().toISOString().slice(0, 10).split('-').reverse().join('-');
  
      // Add an offset to startY before printing the first row of product details
      startY += 15;
  
      Object.keys(itemDetails).forEach((productName, index) => {
        const serialNumbers = itemDetails[productName].serialNumbers.join(', ');
        const splitSerialNumbers = doc.splitTextToSize(serialNumbers, 95);
        const totalHeight = splitSerialNumbers.length * lineHeight;
  
        if (startY + totalHeight > maxPageHeight) {
          pageIndex++;
          doc.addPage();
          addTemplate(pageIndex);
          doc.setFontSize(7);
          startY = initialY + 15; // Apply the offset for new pages as well
        }
  
        // Setting the initial Y positions for the columns of the table
        const productNameY = startY;
        const quantityY = startY;
        const hsnNumberY = startY;
        const serialNumbersY = startY;
  
        // Add product details
        doc.setFontSize(10);
        doc.text(`${index + 1}`, 13.5, productNameY); // Index
        doc.setFont("helvetica", "bold");
        doc.text(productName || '', 20, productNameY); // Product Name
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(itemDetails[productName].hsnNumber, 141.5, hsnNumberY); // HSN Number
        doc.setFontSize(10);
        doc.text(itemDetails[productName].quantity.toString(), 167.5, quantityY); // Quantity
  
        // Add serial numbers, adjusting startY accordingly
        splitSerialNumbers.forEach(line => {
          if (startY + lineHeight > maxPageHeight) {
            pageIndex++;
            doc.addPage();
            addTemplate(pageIndex);
            doc.setFontSize(7);
            startY = initialY + 15; // Apply the offset for new pages as well
          }
          doc.text(line, 60, serialNumbersY);
          startY += reducedLineHeight;
        });
  
        totalQuantity += itemDetails[productName].quantity;
  
        startY += reducedLineHeight / 2; // Extra space between products
  
        // Add other details only once on the first page
        if (index === 0) {
          doc.text(`${this.companyPanNumber}`, 60, 224);
          doc.text(`DN-${randomSixDigitNumber}`, 96.5, 24);
          doc.text(`${this.buyersOrderNumber}`, 96.5, 51.25);
          doc.text(`${this.dispatchDocNo}`, 96.5, 60);
          doc.text(`${this.termsOfDelivery}`, 96.5, 86);
          doc.setFontSize(9);
          doc.text(`${this.dispatchedThrough}`, 96.5, 68);
          doc.text(formattedDate, 137, 24);
          doc.text(`${this.paymentTerms}`, 137, 33.5);
          doc.text(`${this.dispatchedDate}`, 137, 51); // Needs to be updated
          doc.text(`${this.destination}`, 137, 68);
          doc.text(`${this.motorVehicleNo}`, 137, 77);
          // doc.text(`${totalQuantity} Nos.`, 166, 197);
          let billOfLading = `${this.dispatchDocNo} dt. ${formattedDate}`;
          doc.text(`${billOfLading}`, 96.5, 77);
          let refNoAndDate = `SO/${randomSixDigitNumber} dt. ${formattedDate}`;
          doc.text(`${refNoAndDate}`, 96.5, 41.7);
        }
      });
  
      // Print total quantity on the last page
      doc.text(`${totalQuantity}`, 166, 197);
  
      doc.save(`${this.selectedClient}-Delivery-Challan.pdf`);
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

 async submitAndGenerateChallan() {
    await this.deliverProductToWarehouse()
    this.generateChallan()
    this.closeClientDetailsModal()
  
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
        this.fetchWarehouseProducts(); // Fetch the latest products
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