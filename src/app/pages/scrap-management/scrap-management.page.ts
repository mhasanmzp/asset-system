import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

@Component({
  selector: 'app-scrap-management',
  templateUrl: './scrap-management.page.html',
  styleUrls: ['./scrap-management.page.scss'],
})
export class ScrapManagementPage implements OnInit {
  substations: string[] = [];
  categories: string[] = [];
  products: any[] = [];
  filteredProductsList: any[] = [];
  selectedSubstation: string = '';
  selectedCategory: string = '';
  searchQuery: string = '';
  data: any;

  constructor(
    private assetService: DataService,
    private dataService: DataService, // Inject the DataService


  ) {}

  ngOnInit() {
    this.loadSubstations();
    this.loadCategories();
    this.loadProducts();
  }

  loadSubstations() {
    this.assetService.getSubstations().subscribe(
      data => {
        this.substations = data;
      },
      error => {
        console.error('Error loading substations', error);
      }
    );
  }

  loadCategories() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };

    this.dataService.fetchCategories(formData).then((res: any) => {
      this.data= res
      console.log("Response ::::::::::::::",res)
    }).catch(error => {
      console.error('Error fetching OEM data', error);
    });
  }

  loadProducts() {
    this.assetService.getProducts().subscribe(
      data => {
        this.products = data;
        this.filterAssets();
      },
      error => {
        console.error('Error loading products', error);
      }
    );
  }

  filterAssets() {
    this.filteredProductsList = this.products;

    if (this.selectedSubstation) {
      this.filteredProductsList = this.filteredProductsList.filter(product => product.substation === this.selectedSubstation);
    }

    if (this.selectedCategory) {
      this.filteredProductsList = this.filteredProductsList.filter(product => product.category === this.selectedCategory);
    }

    if (this.searchQuery) {
      this.filteredProductsList = this.filteredProductsList.filter(product => product.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  }

  markAsScrap(product: any) {
    product.status = 'Scrap';
    this.assetService.updateProduct(product).subscribe(
      () => {
        alert('Product marked as Scrap.');
        this.loadProducts(); // Refresh the product list
      },
      error => {
        console.error('Error marking product as Scrap', error);
        alert('There was an error marking the product as Scrap.');
      }
    );
  }

  unmarkAsScrap(product: any) {
    product.status = 'Active'; // Assuming 'Active' is the normal status
    this.assetService.updateProduct(product).subscribe(
      () => {
        alert('Product unmarked as Scrap.');
        this.loadProducts(); // Refresh the product list
      },
      error => {
        console.error('Error unmarking product as Scrap', error);
        alert('There was an error unmarking the product as Scrap.');
      }
    );
  }
}
