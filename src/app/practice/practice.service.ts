import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PracticeService {
  private apiUrl = environment.apiUrl; // Use environment variable

  constructor(private http: HttpClient) {}

  fetchPractices(page: number, perPage: number, filter: Object): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/practice?page=${page}&per_page=${perPage}`;
      this.http
        .post(apiURL, {filter})
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  changePracticeStatus(id: number, status: boolean): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/practice/status`;
      this.http
        .patch(apiURL, {
          id: id,
          is_active: status,
        })
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  addPractice(payload: any): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/practice/add`;
      this.http
        .post(apiURL, payload)
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  fetchPracticeLocations(id: number, page: number, perPage: number): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/practice/location/all/${id}?page=${page}&per_page=${perPage}`;
      this.http
        .get(apiURL)
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  changePracticeLocationStatus(id: number, status: boolean): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/practice/location/status`;
      this.http
        .patch(apiURL, {
          id: id,
          is_active: status,
        })
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  addPracticeLocation(payload: any): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/practice/location`;
      this.http
        .post(apiURL, payload)
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  updatePractice(payload: any): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/practice/update`;
      this.http
        .post(apiURL, payload)
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  findPractice(id: number): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/practice/${id}`;
      this.http
        .get(apiURL)
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  findPracticeLocation(id: number): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/practice/location/${id}`;
      this.http
        .get(apiURL)
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  getRegions(): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/regions`;
      this.http
        .get(apiURL)
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  getServices(): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/place-of-service`;
      this.http
        .get(apiURL)
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  uploadSignature(payload: any): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/file-upload`;
      this.http
        .post(apiURL, payload)
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }

  getSignature(id: number, type: string): Promise<any> {
    return new Promise((resolve: any, reject) => {
      let apiURL = `${this.apiUrl}/signnature-files/${id}/${type}`;
      this.http
        .get(apiURL)
        .toPromise()
        .then((res: any) => {
          resolve(res.data);
        });
    });
  }
}
