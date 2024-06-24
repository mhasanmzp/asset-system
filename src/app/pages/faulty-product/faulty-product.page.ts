import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/asset.service'; // Adjust the path as necessary

@Component({
  selector: 'app-faulty-product',
  templateUrl: './faulty-product.page.html',
  styleUrls: ['./faulty-product.page.scss'],
})
export class FaultyProductPage implements OnInit {
  selectedSubstation: string = '';
  searchQuery: string = '';
  substations: any[] = [];
  changedAssets: any[] = [];
  deliveredData: any[] = [];
  substationData: any[] = [];
  userId=localStorage.getItem("userId");

  constructor(
    private modalController: ModalController,
    private dataService: DataService, // Inject the DataService
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadDeliveredData();
    this.loadSubstations();
  }

  selectSubstation(event: any) {
    this.selectedSubstation = event.detail.value;
    console.log('Selected substation:', this.selectedSubstation);
  }

  filteredAssets() {
    return this.deliveredData.filter(asset => {
      const matchesSearchQuery = this.searchQuery
        ? asset.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      const matchesSubstation = this.selectedSubstation
        ? asset.siteName === this.selectedSubstation
        : true;

      return matchesSearchQuery && matchesSubstation;
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  onActionChange(asset: any) {
    if (asset.action === 'null') {
      asset.action = null; // Reset to placeholder
    } else {
      this.trackChange(asset);
    }
  }

  trackChange(asset: any) {
    if (!this.changedAssets.includes(asset)) {
      this.changedAssets.push(asset);
    }
  }

 async submitReturn() {
  try {
    const filteredAssets = this.changedAssets.filter(asset => asset.action !== null && asset.action !== 'None');

    if (filteredAssets.length === 0) {
      this.showToast('No data to save.');
      return;
    }

    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    const dataToSend = {
      ...formData,
      assetsData: filteredAssets
    };

    const response = await this.dataService.submitReturn(dataToSend).toPromise();
    this.showToast('Data saved successfully!');
    this.changedAssets = [];
  } catch (error) {
    console.error('Error saving data', error);
    this.showToast('Failed to save data');
  }
}


  loadDeliveredData() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.userId,
      employeeId: this.userId,
    };

    this.dataService.fetchDeliveredData(formData).then((res: any) => {
      this.deliveredData = res;
      console.log("Response ::::::::::::::", res);
    }).catch(error => {
      console.error('Error fetching delivered data', error);
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
}
