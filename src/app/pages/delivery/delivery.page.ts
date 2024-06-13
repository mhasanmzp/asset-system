import { Component, OnInit } from '@angular/core';
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
  warehouseProductData: any[] = [];
  deliveryAddress: any;
  showFurtherDelivery: boolean = false;
  selectedSegment: string = 'step1';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.fetchDeliveryProducts();
    this.loadCategories();
    this.loadClients();
    this.loadSites();
  }

  segmentChanged() {
    if (this.selectedSegment === 'step2') {
      this.fetchWarehouseProducts();
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
      console.log("Response ::::::::::::::", res);
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
      console.log('Delivery DATA :::::::::::::::::::::::::::::::::::::::', data);
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
      console.log("Response ::::::::::::::", res);
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
      console.log("Clients Response ::::::::::::::", res);
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
        clientId: this.selectedClient.id
      };

      this.dataService.fetchClientWarehouses(formData).then((res: any) => {
        this.clientWarehouses = res;
        console.log("Client Warehouses Response ::::::::::::::", res);
      }).catch(error => {
        console.error('Error fetching client warehouses data', error);
      });
    }
  }

  trackByProductId(index: number, product: any): string {
    return product.id;
  }

  deliverProductToWarehouse() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };
    const selectedProducts = this.productData.filter(product => product.selected);
    if (!this.selectedClient) {
      alert('Please select a client.');
      return;
    }
    if (!this.selectedWarehouse) {
      alert('Please select a client warehouse.');
      return;
    }
    if (selectedProducts.length === 0) {
      alert('Please select at least one product.');
      return;
    }
    const deliveryDetails = {
      products: selectedProducts,
      client: this.selectedClient,
      warehouse: this.selectedWarehouse,
    };
    this.dataService.deliverProduct(deliveryDetails, formData).subscribe(
      () => {
        alert('Products delivered to warehouse successfully!');
        this.showFurtherDelivery = true;
        this.selectedClient = null;
        this.selectedWarehouse = null;
        this.productData.forEach(product => product.selected = false); // Deselect all products
        this.applyFilters(); // Refresh filtered products
      },
      error => {
        console.error('Error delivering products to warehouse', error);
        alert('There was an error delivering the products to the warehouse.');
      }
    );
  }

  deliverProductToSite() {
    if (!this.selectedSite) {
      alert('Please select a site.');
      return;
    }
    const selectedProducts = this.warehouseProductData.filter(product => product.selected);
    const furtherDeliveryDetails = {
      products: selectedProducts,
      site: this.selectedSite,
    };
    this.dataService.furtherDeliverProduct(furtherDeliveryDetails).subscribe(
      () => {
        alert('Products delivered to site successfully!');
        this.selectedSite = null;
        this.warehouseProductData.forEach(product => product.selected = false); // Deselect all products
        this.applyWarehouseFilters(); // Refresh filtered products
        this.showFurtherDelivery = false;
      },
      error => {
        console.error('Error delivering products to site', error);
        alert('There was an error delivering the products to the site.');
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
        alert('There was an error generating the challan.');
      }
    );
  }
}
