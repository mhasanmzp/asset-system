import { Component, OnInit } from '@angular/core';
//Please Change the name of functions and fields

@Component({
  selector: 'app-faulty-product',
  templateUrl: './faulty-product.page.html',
  styleUrls: ['./faulty-product.page.scss'],
})
export class FaultyProductPage implements OnInit {
  selectedSubstation: string = '';
  searchQuery: string = '';
  substations: string[] = ['Substation 1', 'Substation 2', 'Substation 3'];
  assets: any[] = [
    {
      serialNumber: '123456',
      productName: 'Transformer',
      warrantyStartDate: '2021-01-01',
      warrantyEndDate: '2023-01-01',
      deliveredDate: '2021-01-15',
      siteName: 'Site A',
      status: 'Active',
      action: ''
    },
    {
      serialNumber: '654321',
      productName: 'Generator',
      warrantyStartDate: '2022-05-01',
      warrantyEndDate: '2024-05-01',
      deliveredDate: '2022-05-15',
      siteName: 'Site B',
      status: 'Inactive',
      action: ''
    }
    // Add more asset objects as needed
  ];

  selectSubstation(event: any) {
    this.selectedSubstation = event.detail.value;
    console.log('Selected substation:', this.selectedSubstation);
  }

  filteredAssets() {
    return this.assets.filter(asset => {
      return (
        asset.serialNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        asset.productName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        asset.warrantyStartDate.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        asset.warrantyEndDate.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        asset.deliveredDate.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        asset.siteName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        asset.status.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

  constructor() { }

  ngOnInit() {
  }

}
