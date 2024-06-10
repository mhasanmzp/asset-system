import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary
import { ModalController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-quality-assurance',
  templateUrl: './quality-assurance.page.html',
  styleUrls: ['./quality-assurance.page.scss'],
})
export class QualityAssurancePage implements OnInit {
  categories = [];
  oemList = [];
  substations = [];
  data: any = [];
  data2: any = [];


  selectedCategory: any;
  selectedOEM: any;
  searchQuery:'';
  selectedSubstation: string;

  products: any[] = [];

currentPage: number = 1;
itemsPerPage: number = 10;
selectedEngineer: any;
engineers: any = [];
oemName: any;
material: any = {
  oemName: '',
};
substationData : any[] = [];


constructor(
  private modalController: ModalController,
  private dataService: DataService, // Inject the DataService
  private toastController: ToastController
) { }

  ngOnInit() {
    this.loadOems()
    this.loadCategories()
    this.loadEngineers()
    this.fetchQAProducts()
  }

  selectCategory(event: any) {
    // Handle category selection
    console.log('Selected Category:', this.selectedCategory);
  }

  filteredProducts() {
    const filtered = this.searchQuery
      ? this.products.filter(product =>
         ( product.productName.toLowerCase().includes(this.searchQuery.toLowerCase())||
         product.serialNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
        ))
      : this.products;
    
    return this.paginate(filtered);
  }

  paginate(items: any[]) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return items.slice(start, end);
  }

  changePage(increment: number) {
    this.currentPage += increment;
  }

  deliverProduct() {
    console.log('Deliver product to:', this.selectedSubstation);
  }

  loadOems() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };

    this.dataService.fetchOEM(formData).then((res: any) => {
      this.data = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching OEM data', error);
    });
  }

  loadEngineers() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };

    this.dataService.fetchEngineers(formData).then((res: any) => {
      this.engineers = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching OEM data', error);
    });
  }


  loadCategories() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };

    this.dataService.fetchCategories(formData).then((res: any) => {
      this.data2 = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching Categories data', error);
    });
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

  fetchQAProducts() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
    };
    console.log('formdata', formData);
    this.dataService.fetchQAProducts(formData).then((data: any) => {
      console.log('Delivery DATA :::::::::::::::::::::::::::::::::::::::', data);
      this.products = data
    });

  }

  submitSelectedProducts() {
    const selectedProducts = this.products.filter(product => product.selection);
  
    if (selectedProducts.length === 0) {
      this.toastController.create({
        message: 'No products selected',
        duration: 2000,
        position: 'bottom'
      }).then(toast => toast.present());
      return;
    }
  
    const payload = {
      permissionName: 'Tasks',
      employeeIdMiddleware: 342,
      employeeId: 342,
      engineerName: this.selectedEngineer?.name,  // Assuming selectedEngineer is an object with a 'name' property
      items: selectedProducts.map(product => ({
        purchaseId: product.purchaseId,
        categoryName: product.categoryName,
        oemName: product.oemName,
        productName: product.productName,
        serialNumber: product.serialNumber,
        testResult: product.selection
      }))
    };
  
    this.dataService.submitProducts(payload).subscribe(async response => {
      this.toastController.create({
        message: 'Products submitted successfully!',
        duration: 2000,
        position: 'bottom'
      }).then(toast => toast.present());
  
      // Remove submitted products from the list
      this.products = this.products.filter(product => !product.selection);
      this.changePage(-this.currentPage + 1); // Reset to first page if necessary
    }, async error => {
      this.toastController.create({
        message: 'Failed to submit products. Please try again.',
        duration: 2000,
        position: 'bottom'
      }).then(toast => toast.present());
    });
  }
  

  
  // fetchDeliveryProducts() {
  //   const formData = {
  //     permissionName: 'Tasks',
  //     employeeIdMiddleware: 342,
  //     employeeId: 342,
  //   };
  //   console.log('formdata', formData);
  //   this.dataService.fetchProducts(formData).then((data: any) => {
  //     console.log('Delivery DATA :::::::::::::::::::::::::::::::::::::::', data);
  //     this.productData = data.productData.map((product) => ({
  //       ...product,
  //       SerialNumber: product.serialNumber,
  //       ProductName: product.productName,
  //       Status: product.status,
  //       selected: false // Add selected property
  //     }));
  //     this.applyFilters(); // Filter products after loading
  //   }).catch(error => {
  //     console.error('Error fetching data', error);
  //   });
  // }

}
