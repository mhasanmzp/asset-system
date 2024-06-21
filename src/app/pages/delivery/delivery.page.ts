import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {
  categories: any[] = [];
  products: any[] = [];
  filteredProductList: any[] = [];
  filteredWarehouseProductList: any[] = [];
  clients: any[] = [];
  clientWarehouses: any[] = [];
  selectedClient: any;
  selectedWarehouse: any;
  selectedCategory: any;
  selectedSite: any;
  searchQuery: any;
  data: any;
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
        employeeIdMiddleware: 342,
        employeeId: 342,
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
      employeeIdMiddleware: 342,
      employeeId: 342,
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
      employeeIdMiddleware: 342,
      employeeId: 342,
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
      employeeIdMiddleware: 342,
      employeeId: 342,
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
      employeeIdMiddleware: 342,
      employeeId: 342,
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
      employeeIdMiddleware: 342,
      employeeId: 342,
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
        employeeIdMiddleware: 342,
        employeeId: 342,
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

  deliverProductToWarehouse() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };
    const selectedProducts = this.productData.filter(product => product.selected);
    if (!this.selectedClient) {
      this.presentToast('Please select a client.');
      return;
    }
    if (!this.selectedWarehouse) {
      this.presentToast('Please select a client warehouse.');
      return;
    }
    if (selectedProducts.length === 0) {
      this.presentToast('Please select at least one product.');
      return;
    }
    const deliveryDetails = {
      products: selectedProducts,
      client: this.selectedClient,
      warehouse: this.selectedWarehouse,
      gstNumber: this.gstNumber,
      billingClient: this.billingClient,
      billingWarehouse: this.billingWarehouse,
      billingGstNumber: this.billingGstNumber,
      companyPanNumber: this.companyPanNumber,
      dispatchedThrough: this.dispatchedThrough,
      dispatchedDate: this.dispatchedDate,
      paymentTerms: this.paymentTerms,
      otherReferences: this.otherReferences,
      destination: this.destination,
      motorVehicleNo: this.motorVehicleNo,
    };
    this.dataService.deliverProduct(deliveryDetails, formData).subscribe(
      () => {
        this.presentToast('Products delivered to warehouse successfully!');
        this.showFurtherDelivery = true;
        this.selectedClient = null;
        this.selectedWarehouse = null;
        this.productData.forEach(product => product.selected = false); // Deselect all products
        this.applyFilters(); // Refresh filtered products
        this.closeClientDetailsModal(); // Close the modal
      },
      error => {
        console.error('Error delivering products to warehouse', error);
        this.presentToast('There was an error delivering the products to the warehouse.');
      }
    );
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
      employeeIdMiddleware: 342,
      employeeId: 342,
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

  downloadChallan(deliveryDetails: any) {
    this.dataService.generateChallan(deliveryDetails).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'outward_challan.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      error => {
        console.error('Error generating challan', error);
        this.presentToast('There was an error generating the challan.');
      }
    );
  }
}



// import { Component, OnInit } from '@angular/core';
// import { ToastController } from '@ionic/angular';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

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
//         employeeIdMiddleware: 342,
//         employeeId: 342,
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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
//         employeeIdMiddleware: 342,
//         employeeId: 342,
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

//   deliverProductToWarehouse() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: 342,
//       employeeId: 342,
//     };
//     const selectedProducts = this.productData.filter(product => product.selected);
//     if (!this.selectedClient) {
//       this.presentToast('Please select a client.');
//       return;
//     }
//     if (!this.selectedWarehouse) {
//       this.presentToast('Please select a client warehouse.');
//       return;
//     }
//     if (selectedProducts.length === 0) {
//       this.presentToast('Please select at least one product.');
//       return;
//     }
//     const deliveryDetails = {
//       products: selectedProducts,
//       client: this.selectedClient,
//       warehouse: this.selectedWarehouse,
//     };
//     this.dataService.deliverProduct(deliveryDetails, formData).subscribe(
//       () => {
//         this.presentToast('Products delivered to warehouse successfully!');
//         this.showFurtherDelivery = true;
//         this.selectedClient = null;
//         this.selectedWarehouse = null;
//         this.productData.forEach(product => product.selected = false); // Deselect all products
//         this.applyFilters(); // Refresh filtered products
//       },
//       error => {
//         console.error('Error delivering products to warehouse', error);
//         this.presentToast('There was an error delivering the products to the warehouse.');
//       }
//     );
//   }

//   deliverProductToSite() {
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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

//   downloadChallan(deliveryDetails: any) {
//     this.dataService.generateChallan(deliveryDetails).subscribe(
//       (blob: Blob) => {
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'outward_challan.pdf';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//       },
//       error => {
//         console.error('Error generating challan', error);
//         this.presentToast('There was an error generating the challan.');
//       }
//     );
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

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

//   constructor(private dataService: DataService) { }

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
//         employeeIdMiddleware: 342,
//         employeeId: 342,
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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
//       employeeIdMiddleware: 342,
//       employeeId: 342,
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
//         employeeIdMiddleware: 342,
//         employeeId: 342,
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

//   deliverProductToWarehouse() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: 342,
//       employeeId: 342,
//     };
//     const selectedProducts = this.productData.filter(product => product.selected);
//     if (!this.selectedClient) {
//       alert('Please select a client.');
//       return;
//     }
//     if (!this.selectedWarehouse) {
//       alert('Please select a client warehouse.');
//       return;
//     }
//     if (selectedProducts.length === 0) {
//       alert('Please select at least one product.');
//       return;
//     }
//     const deliveryDetails = {
//       products: selectedProducts,
//       client: this.selectedClient,
//       warehouse: this.selectedWarehouse,
//     };
//     this.dataService.deliverProduct(deliveryDetails, formData).subscribe(
//       () => {
//         alert('Products delivered to warehouse successfully!');
//         this.showFurtherDelivery = true;
//         this.selectedClient = null;
//         this.selectedWarehouse = null;
//         this.productData.forEach(product => product.selected = false); // Deselect all products
//         this.applyFilters(); // Refresh filtered products
//       },
//       error => {
//         console.error('Error delivering products to warehouse', error);
//         alert('There was an error delivering the products to the warehouse.');
//       }
//     );
//   }

//   deliverProductToSite() {
//     if (!this.selectedSite) {
//       alert('Please select a site.');
//       return;
//     }
//     const selectedProducts = this.clientWarehouseProductData.filter(product => product.selected);
//     const furtherDeliveryDetails = {
//       products: selectedProducts,
//       site: this.selectedSite,
//     };
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: 342,
//       employeeId: 342,
//     };
//     this.dataService.furtherDeliverProduct(furtherDeliveryDetails, formData).subscribe(
//       () => {
//         alert('Products delivered to site successfully!');
//         this.selectedSite = null;
//         this.clientWarehouseProductData.forEach(product => product.selected = false); // Deselect all products
//         this.applyWarehouseFilters(); // Refresh filtered products
//         this.showFurtherDelivery = false;
//       },
//       error => {
//         console.error('Error delivering products to site', error);
//         alert('There was an error delivering the products to the site.');
//       }
//     );
//   }

//   downloadChallan(deliveryDetails: any) {
//     this.dataService.generateChallan(deliveryDetails).subscribe(
//       (blob: Blob) => {
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'outward_challan.pdf';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//       },
//       error => {
//         console.error('Error generating challan', error);
//         alert('There was an error generating the challan.');
//       }
//     );
//   }
// }
