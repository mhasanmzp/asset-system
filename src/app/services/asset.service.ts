import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'https://37c3-203-92-37-218.ngrok-free.app'; // Replace with your actual API endpoint

  header: any = {}

  constructor(private http: HttpClient) { }

  fetchOEM(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + "/asset-oems-dropdown", data, { headers: this.header }).subscribe((resp: any) => {
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
    return this.http.post(this.baseUrl + "/update-delivery-data", payload);
  }

  getSubstations(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  generateChallan(deliveryDetails: any): Observable<Blob> {
    return this.http.post(this.baseUrl + '/generateChallan', deliveryDetails, { responseType: 'blob' });
  }

  getAssetsBySubstation(substation: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?substation=${substation}`);
  }

  // getProducts(): Observable<any[]> {
  //   return this.http.get<any[]>(this.baseUrl);
  // }

  getProducts(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl +'/scrap-managemet-dashboard', data, { headers: this.header }).subscribe((resp: any) => {
        resolve(resp);
      }, error => {
        reject(error);
      });
    });
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${product.id}`, product);
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

  fetchSubstations(data: any): Promise<any> {
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
      this.http.post(this.baseUrl + '/faulty-asset-dashboard', data, { headers: this.header }).subscribe((resp: any) => {
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
    return this.http.post(`${this.baseUrl}/asset-oems`, data);
  }

  saveProject(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects`, data);
  }

  saveSite(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/sites`, data);
  }

  saveStore(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/stores`, data);
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
