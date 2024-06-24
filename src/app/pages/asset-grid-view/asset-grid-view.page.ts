import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/asset.service';

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
  userId=localStorage.getItem("userId");

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadSites();
    this.loadDeliveredData();
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

  loadDeliveredData() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchDeliveredData(formData).then((res: any) => {
      this.deliveredData = res;
      this.filteredDeliveredData = res;
      // this.filterDeliveredData();  // Initial filter
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching Delivered data', error);
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

  // onSearchQueryChange() {
  //   if (this.searchQuery === '') {
  //     this.filteredDeliveredData = this.deliveredData.slice();
  //   } else {
  //     this.filterDeliveredData();
  //   }
  // }

  onSubstationChange() {
    this.filterDeliveredData();
  }
}
