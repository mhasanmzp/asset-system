import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-scrap-management',
  templateUrl: './scrap-management.page.html',
  styleUrls: ['./scrap-management.page.scss'],
})
export class ScrapManagementPage implements OnInit {
  substations: string[] = [];
  data2: any = [];
  products: any[] = [];
  filteredProductsList: any[] = [];
  selectedSubstation: string = '';
  selectedCategory: string = '';
  searchQuery: any;
  data: any;
  siteData: any = [];
  userId = localStorage.getItem('userId');

  constructor(
    private assetService: DataService,
    private dataService: DataService, // Inject the DataService
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadSites();
    this.loadCategories();
    this.loadScrapProducts();
  }

  async presentToast(
    message: string,
    duration: number = 2000,
    position: 'bottom' | 'top' | 'middle' = 'bottom'
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top'
    });
    toast.present();
  }

  selectCategory(event: any) {
    // Handle category selection
    console.log('Selected Category:', this.selectedCategory);
    this.filterAssets();
  }

  loadSites() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService
      .fetchSites(formData)
      .then((res: any) => {
        this.siteData = res;
        console.log('Response ::::::::::::::', res);
      })
      .catch((error) => {
        console.error('Error fetching Substations data', error);
      });
  }

  loadCategories() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService
      .fetchCategories(formData)
      .then((res: any) => {
        this.data2 = res;
        console.log('Response ::::::::::::::', res);
      })
      .catch((error) => {
        console.error('Error fetching Categories data', error);
      });
  }

  loadScrapProducts() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService
      .getProducts(formData)
      .then((res: any) => {
        this.products = res;
        this.filterAssets(); // Initial filter
        console.log('Products Response:', res);
      })
      .catch((error) => {
        console.error('Error fetching products data', error);
      });
  }

  filterAssets() {
    console.log(
      'Filtering assets with selected category:',
      this.selectedCategory,
      'and search query:',
      this.searchQuery
    );

    this.filteredProductsList = this.products.filter((product) => {
      const matchesSearchQuery = this.searchQuery
        ? product.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      const matchesSubstation = this.selectedSubstation
        ? product.substation === this.selectedSubstation
        : true;

      const matchesCategory = this.selectedCategory
        ? product.categoryName === this.selectedCategory
        : true;

      return matchesSearchQuery && matchesSubstation && matchesCategory;
    });

    console.log('Filtered Products List:', this.filteredProductsList);
  }

  markAsUnscrap(product: any) {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    product.status = 'In Stock';

    this.assetService.updateProduct({ ...product, ...formData }).then(
      () => {
        this.presentToast('Product marked as In Stock.');
        this.loadScrapProducts(); // Refresh the product list
      },
      (error) => {
        console.error('Error marking product as In Stock', error);
        this.presentToast('There was an error marking the product as In Stock.');
      }
    );
  }
}
