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
  substations: string[] = [];
  selectedSubstation: string;
  selectedCategory: any;
  searchQuery: any;
  data: any;
  substationData: any[];
  productData: any[] = [];
  deliveryAddress: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.fetchDeliveryProducts();
    this.loadCategories();
    this.loadSubstations();
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

  applyFilters() {
    this.filteredProductList = this.getFilteredProducts();
  }

  loadSubstations() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };

    this.dataService.fetchSubstations(formData).then((res: any) => {
      this.substationData = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching Substations data', error);
    });
  }

  trackByProductId(index: number, product: any): string {
    return product.id;
  }

  deliverProduct() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };
    const selectedProducts = this.productData.filter(product => product.selected);
    if (!this.selectedSubstation) {
      alert('Please select a substation.');
      return;
    }
    if (selectedProducts.length === 0) {
      alert('Please select at least one product.');
      return;
    }
    const deliveryDetails = {
      products: selectedProducts,
      substation: this.selectedSubstation,
    };
    this.dataService.deliverProduct(deliveryDetails, formData).subscribe(
      () => {
        alert('Products delivered successfully!');
        this.selectedSubstation = null;
        this.productData.forEach(product => product.selected = false); // Deselect all products
        this.applyFilters(); // Refresh filtered products
      },
      error => {
        console.error('Error delivering products', error);
        alert('There was an error delivering the products.');
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
