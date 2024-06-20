import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {




  private baseUrl = 'https://4266-203-92-37-218.ngrok-free.app'; // Replace with your actual API endpoint

  header: any = {}

  constructor(private http: HttpClient) { }



  ///////////test/////////

  
  getOneEmployee(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + 'getoneEmployee', formData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  furtherDeliverProduct(deliveryDetails: any, formData: any): Observable<any> {
    const payload = {
      ...formData,
      deliveryDetails: deliveryDetails
    };
    return this.http.post(this.baseUrl + "/update-delivery-data-s2", payload);
  }

  fetchClients(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/asset-client-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchClientWarehouses(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + '/asset-warehouse-dropdown', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchWarehouseProducts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + '/delivery-product-list-s2', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });

  }

  fetchProductsByClient(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + '/delivery-product-list-s2', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  //////////////////////////////////
  fetchOEM(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/asset-oems-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchStore(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/stores-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchCategories(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/asset-categories-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchEngineers(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/asset-engineers-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  submitMaterial(material: any, formData: any): Observable<any> {
    const payload = {
      ...formData,
      material: material
    };
    return this.http.post(this.baseUrl + "/asset-inventory-grn", payload);
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?categoryId=${categoryId}`);
  }

  deliverProduct(deliveryDetails: any, formData: any): Observable<any> {
    const payload = {
      ...formData,
      deliveryDetails: deliveryDetails
    };
    return this.http.post(this.baseUrl + "/update-delivery-data-s1", payload);
  }

  generateChallan(deliveryDetails: any): Observable<Blob> {
    return this.http.post(this.baseUrl + '/generateChallan', deliveryDetails, { responseType: 'blob' });
  }

  getAssetsBySubstation(substation: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?substation=${substation}`);
  }

  getProducts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + '/scrap-managemet-dashboard', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  

  updateProduct(product: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/scrap-management-action", product, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchData(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/asset-inventory-dashboard", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchProducts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/delivery-product-list", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchQAProducts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/quality-assurance-dashboard", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchSites(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/asset-sites-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  fetchDeliveredData(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + '/grid-view-dashboard', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  // Methods for saving Category, Engineer, Model, OEM, Project, Site, and Store

  saveCategory(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/asset-category`, data);
  }

  submitProducts(payload: any) {
    return this.http.post(`${this.baseUrl}/update-testing-data`, payload);
  }

  saveEngineer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/asset-engineer`, data);
  }

  saveModel(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/models`, data);
  }

  saveOEM(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/asset-oem`, data);
  }

  saveProject(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/asset-project`, data);
  }

  saveSite(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/asset-site`, data);
  }

  saveStore(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/asset-stores`, data);
  }

  submitReturn(assets: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/faulty-asset-action`, assets);
  }

  getItemsByPurchaseId(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + '/getItemsByPurchaseId', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  submitMoreData(material: any, formData: any): Observable<any> {
    const payload = {
      ...formData,
      material: material
    };
    return this.http.post(this.baseUrl + '/asset-inventory-update-grn', payload);
  }


  saveClient(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/asset-client`, data);
  }

  saveWarehouse(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/asset-warehouse`, data);
  }


}



// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { Observable } from "rxjs";

// @Injectable({
//   providedIn: 'root'
// })
// export class DataService {

//   private baseUrl = 'https://32cd-203-92-37-218.ngrok-free.app'; // Replace with your actual API endpoint

//   header: any = {}

//   constructor(private http: HttpClient) { }

//   fetchOEM(data: any): Promise<any> {
//     return new Promise((resolve, reject) => {
//       this.http.post(this.baseUrl + "/asset-oems-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
//         resolve(resp);
//       }, error => {
//         reject(error);
//       });
//     });
//   }

//   fetchCategories(data: any): Promise<any> {
//     return new Promise((resolve, reject) => {
//       this.http.post(this.baseUrl + "/asset-categories-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
//         resolve(resp);
//       }, error => {
//         reject(error);
//       });
//     });
//   }

//   submitMaterial(material: any, formData: any): Observable<any> {
//     const payload = {
//       ...formData,
//       material: material
//     };
//     return this.http.post(this.baseUrl + "/asset-inventory-grn", payload);
//   }

//   getProductsByCategory(categoryId: number): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}?categoryId=${categoryId}`);
//   }

//   deliverProduct(deliveryDetails: any, formData: any): Observable<any> {
//     const payload = {
//       ...formData,
//       deliveryDetails: deliveryDetails
//     };
//     return this.http.post(this.baseUrl + "/update-delivery-data", payload);
//   }

//   getSubstations(): Observable<any[]> {
//     return this.http.get<any[]>(this.baseUrl);
//   }

//   generateChallan(deliveryDetails: any): Observable<Blob> {
//     return this.http.post(this.baseUrl + '/generateChallan', deliveryDetails, { responseType: 'blob' });
//   }

//   getAssetsBySubstation(substation: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}?substation=${substation}`);
//   }

//   getProducts(): Observable<any[]> {
//     return this.http.get<any[]>(this.baseUrl);
//   }

//   updateProduct(product: any): Observable<any> {
//     return this.http.put<any>(`${this.baseUrl}/${product.id}`, product);
//   }

//   fetchData(data: any): Promise<any> {
//     return new Promise((resolve, reject) => {
//       this.http.post(this.baseUrl + "/asset-inventory-dashboard", data, { headers: this.header }).subscribe((resp: any) => {
//         resolve(resp);
//       }, error => {
//         reject(error);
//       });
//     });
//   }

//   fetchProducts(data: any): Promise<any> {
//     return new Promise((resolve, reject) => {
//       this.http.post(this.baseUrl + "/delivery-product-list", data, { headers: this.header }).subscribe((resp: any) => {
//         resolve(resp);
//       }, error => {
//         reject(error);
//       });
//     });
//   }

//   fetchSubstations(data: any): Promise<any> {
//     return new Promise((resolve, reject) => {
//       this.http.post(this.baseUrl + "/asset-sites-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
//         resolve(resp);
//       }, error => {
//         reject(error);
//       });
//     });
//   }

//   // Add methods for saving Category, Engineer, Model, OEM, Project, Site, and Store
//   saveCategory(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/categories`, data);
//   }

//   saveEngineer(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/engineers`, data);
//   }

//   saveModel(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/models`, data);
//   }

//   saveOEM(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/oems`, data);
//   }

//   saveProject(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/projects`, data);
//   }

//   saveSite(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/sites`, data);
//   }

//   saveStore(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/stores`, data);
//   }
// }