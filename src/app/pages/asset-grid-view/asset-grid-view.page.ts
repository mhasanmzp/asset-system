import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DataService } from 'src/app/services/asset.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';



const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-asset-grid-view',
  templateUrl: './asset-grid-view.page.html',
  styleUrls: ['./asset-grid-view.page.scss'],
})
export class AssetGridViewPage implements OnInit {
  substations: string[] = [];
  selectedSubstation: string = 'All';
  searchQuery: any;
  substationData: any[] = [];
  deliveredData: any[] = [];
  filteredDeliveredData: any[] = [];
  userId = localStorage.getItem("userId");

  constructor(
    private dataService: DataService,
    private loadingController: LoadingController,
    private router: Router,


  ) {}

  ngOnInit() {
    this.loadSites();
    this.loadDeliveredData();
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
      this.substationData = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching Substations data', error);
    });
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

    this.dataService.fetchDeliveredData(formData).then((res: any) => {
      this.deliveredData = res;
      this.filteredDeliveredData = res;
      loading.dismiss()
      // this.filterDeliveredData();  // Initial filter
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching Delivered data', error);
      loading.dismiss()

    });
  }

  filterDeliveredData() {
    this.filteredDeliveredData = this.deliveredData.filter(asset => {
      const matchesSearchQuery = this.searchQuery
        ? asset.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const matchesSubstation = this.selectedSubstation && this.selectedSubstation !== 'All'
        ? asset.siteName === this.selectedSubstation
        : true;
      return matchesSearchQuery && matchesSubstation;
    });
  }

  onSubstationChange() {
    this.filterDeliveredData();
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredDeliveredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'assets');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}



// import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/services/asset.service';

// @Component({
//   selector: 'app-asset-grid-view',
//   templateUrl: './asset-grid-view.page.html',
//   styleUrls: ['./asset-grid-view.page.scss'],
// })
// export class AssetGridViewPage implements OnInit {
//   substations: string[] = [];
//   selectedSubstation: string = 'All';
//   searchQuery: any;
//   substationData: any[] = [];
//   deliveredData: any[] = [];
//   filteredDeliveredData: any[] = [];
//   userId=localStorage.getItem("userId");

//   constructor(private dataService: DataService) {}

//   ngOnInit() {
//     this.loadSites();
//     this.loadDeliveredData();
//   }

//   loadSites() {
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

//   loadDeliveredData() {
//     const formData = {
//       permissionName: 'Tasks',
//       employeeIdMiddleware: this.userId,
//       employeeId: this.userId,
//     };

//     this.dataService.fetchDeliveredData(formData).then((res: any) => {
//       this.deliveredData = res;
//       this.filteredDeliveredData = res;
//       // this.filterDeliveredData();  // Initial filter
//       console.log("Response ::::::::::::::", res);
//     }).catch(error => {
//       console.error('Error fetching Delivered data', error);
//     });
//   }

//   filterDeliveredData() {
//     this.filteredDeliveredData = this.deliveredData.filter(asset => {
//       const matchesSearchQuery = this.searchQuery
//         ? asset.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
//         : true;
//       const matchesSubstation = this.selectedSubstation && this.selectedSubstation !== 'All'
//         ? asset.siteName === this.selectedSubstation
//         : true;
//       return matchesSearchQuery && matchesSubstation;
//     });
//   }

//   onSubstationChange() {
//     this.filterDeliveredData();
//   }
// }
