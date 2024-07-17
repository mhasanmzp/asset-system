import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary
import { ModalController, ToastController, LoadingController } from '@ionic/angular';

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

  selectedCategory: any = '';
  selectedOEM: any = '';
  searchQuery: string = '';
  selectedSubstation: string;
  userId=localStorage.getItem("userId");
  products: any[] = [];
  user: any;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  selectedEngineer: any;
  engineers: any = [];
  oemName: any;
  material: any = {
    oemName: '',
  };
  substationData: any[] = [];

  constructor(
    private modalController: ModalController,
    private dataService: DataService, // Inject the DataService
    private toastController: ToastController,
    private loadingController: LoadingController,

  ) { }

  ngOnInit() {
    this.loadOems();
    this.loadCategories();
    this.loadEngineers();
    this.fetchQAProducts();
  }

  selectCategory(event: any) {
    // Handle category selection
    console.log('Selected Category:', this.selectedCategory);
    this.filteredProducts();
  }

  selectOEM(event: any) {
    // Handle OEM selection
    console.log('Selected OEM:', this.selectedOEM);
    this.filteredProducts();
  }

  filteredProducts() {
    const filtered = this.products.filter(product => {
      const matchesSearchQuery = this.searchQuery
        ? product.productName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.serialNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const matchesCategory = this.selectedCategory
        ? this.selectedCategory === 'All' || product.categoryName === this.selectedCategory
        : true;
      const matchesOEM = this.selectedOEM
        ? this.selectedOEM === 'All' || product.oemName === this.selectedOEM
        : true;

      return matchesSearchQuery && matchesCategory && matchesOEM;
    });

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
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchOEM(formData).then((res: any) => {
      this.data = res;
      this.data.unshift({ oemName: 'All' }); // Add "All" option
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching OEM data', error);
    });
  }

  loadEngineers() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchEngineers(formData).then((res: any) => {
      this.engineers = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching Engineers data', error);
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
      this.data2.unshift({ name: 'All' }); // Add "All" option
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching Categories data', error);
    });
  }

  loadSubstations() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchSites(formData).then((res: any) => {
      this.substationData = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching Substations data', error);
    });
  }

  async fetchQAProducts() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();

    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };
    console.log('formdata', formData);
    this.dataService.fetchQAProducts(formData).then((data: any) => {
      console.log('Delivery DATA :::::::::::::::::::::::::::::::::::::::', data);
      this.products = data;
      loading.dismiss();

    }).catch(error => {

      console.error('Error fetching QA Products data', error);
      loading.dismiss();
      this.toastController.create({
        message: 'Failed to load Products, Please Refresh the Page...',
        duration: 3000,
        position: 'bottom',
        color:'danger'
      }).then(toast => toast.present());
      return;

    });
  }

  handleTestResultChange(event: any, product: any) {
    product.selection = event.detail.value;
    if (product.selection === 'PASS') {
      product.remark = ''; // Clear remark if "PASS" is selected
    }
  }

  async submitSelectedProducts() {
 
    const selectedProducts = this.products.filter(product => product.selection);

    if (selectedProducts.length === 0) {
      this.toastController.create({
        message: 'No products selected',
        duration: 2000,
        position: 'bottom'
      }).then(toast => toast.present());
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
    const payload = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
      engineerName: this.selectedEngineer?.name,  // Assuming selectedEngineer is an object with a 'name' property
      items: selectedProducts.map(product => ({
        purchaseId: product.purchaseId,
        categoryName: product.categoryName,
        oemName: product.oemName,
        productName: product.productName,
        serialNumber: product.serialNumber,
        testResult: product.selection,
        remark: product.remark || '' // Add remark if it exists
      }))
    };

    this.dataService.submitProducts(payload).subscribe(async response => {
      this.toastController.create({
        message: 'Products submitted successfully!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      }).then(toast => toast.present());
      // loading.dismiss();
      // Remove submitted products from the list
      this.products = this.products.filter(product => !product.selection);
      this.changePage(-this.currentPage + 1); // Reset to first page if necessary
      this.filteredProducts()
      loading.dismiss();

    }, async error => {
      loading.dismiss();
      this.toastController.create({
        message: 'Failed to submit products. Please try again.',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
        
      }).then(toast => toast.present());
    });
  }

 

}

// import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary
// import { ModalController, ToastController } from '@ionic/angular';

// @Component({
//   selector: 'app-quality-assurance',
//   templateUrl: './quality-assurance.page.html',
//   styleUrls: ['./quality-assurance.page.scss'],
// })
// export class QualityAssurancePage implements OnInit {
//   categories = [];
//   oemList = [];
//   substations = [];
//   data: any = [];
//   data2: any = [];

//   selectedCategory: any = '';
//   selectedOEM: any = '';
//   searchQuery: string = '';
//   selectedSubstation: string;

//   products: any[] = [];

//   currentPage: number = 1;
//   itemsPerPage: number = 10;
//   selectedEngineer: any;
//   engineers: any = [];
//   oemName: any;
//   material: any = {
//     oemName: '',
//   };
//   substationData: any[] = [];

//   constructor(
//     private modalController: ModalController,
//     private dataService: DataService, // Inject the DataService
//     private toastController: ToastController
//   ) { }

//   ngOnInit() {
//     this.loadOems();
//     this.loadCategories();
//     this.loadEngineers();
//     this.fetchQAProducts();
//   }

//   selectCategory(event: any) {
//     // Handle category selection
//     console.log('Selected Category:', this.selectedCategory);
//     this.filteredProducts();
//   }

//   selectOEM(event: any) {
//     // Handle OEM selection
//     console.log('Selected OEM:', this.selectedOEM);
//     this.filteredProducts();
//   }

//   filteredProducts() {
//     const filtered = this.products.filter(product => {
//       const matchesSearchQuery = this.searchQuery
//         ? product.productName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
//           product.serialNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
//         : true;
//       const matchesCategory = this.selectedCategory
//         ? this.selectedCategory === 'All' || product.categoryName === this.selectedCategory
//         : true;
//       const matchesOEM = this.selectedOEM
//         ? this.selectedOEM === 'All' || product.oemName === this.selectedOEM
//         : true;

//       return matchesSearchQuery && matchesCategory && matchesOEM;
//     });

//     return this.paginate(filtered);
//   }

//   paginate(items: any[]) {
//     const start = (this.currentPage - 1) * this.itemsPerPage;
//     const end = start + this.itemsPerPage;
//     return items.slice(start, end);
//   }

//   changePage(increment: number) {
//     this.currentPage += increment;
//   }

//   deliverProduct() {
//     console.log('Deliver product to:', this.selectedSubstation);
//   }

//   loadOems() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchOEM(formData).then((res: any) => {
//       this.data = res;
//       this.data.unshift({ oemName: 'All' }); // Add "All" option
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching OEM data', error);
//     });
//   }

//   loadEngineers() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchEngineers(formData).then((res: any) => {
//       this.engineers = res;
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching Engineers data', error);
//     });
//   }

//   loadCategories() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchCategories(formData).then((res: any) => {
//       this.data2 = res;
//       this.data2.unshift({ name: 'All' }); // Add "All" option
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching Categories data', error);
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

//   fetchQAProducts() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };
//     console.log('formdata', formData);
//     this.dataService.fetchQAProducts(formData).then((data: any) => {
//       console.log('Delivery DATA :::::::::::::::::::::::::::::::::::::::', data);
//       this.products = data;
//     }).catch(error => {
//       console.error('Error fetching QA Products data', error);
//     });
//   }

//   submitSelectedProducts() {
//     const selectedProducts = this.products.filter(product => product.selection);

//     if (selectedProducts.length === 0) {
//       this.toastController.create({
//         message: 'No products selected',
//         duration: 2000,
//         position: 'bottom'
//       }).then(toast => toast.present());
//       return;
//     }

//     const payload = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//       engineerName: this.selectedEngineer?.name,  // Assuming selectedEngineer is an object with a 'name' property
//       items: selectedProducts.map(product => ({
//         purchaseId: product.purchaseId,
//         categoryName: product.categoryName,
//         oemName: product.oemName,
//         productName: product.productName,
//         serialNumber: product.serialNumber,
//         testResult: product.selection
//       }))
//     };

//     this.dataService.submitProducts(payload).subscribe(async response => {
//       this.toastController.create({
//         message: 'Products submitted successfully!',
//         duration: 2000,
//         position: 'bottom'
//       }).then(toast => toast.present());

//       // Remove submitted products from the list
//       this.products = this.products.filter(product => !product.selection);
//       this.changePage(-this.currentPage + 1); // Reset to first page if necessary
//     }, async error => {
//       this.toastController.create({
//         message: 'Failed to submit products. Please try again.',
//         duration: 2000,
//         position: 'bottom'
//       }).then(toast => toast.present());
//     });
//   }
// }
