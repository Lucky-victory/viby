import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  get<T>(path: string) {
    return this.http.get(`${this.apiBaseUrl}${path}`);
  }
  post(path: string, data = {}) {
    return this.http.post(`${this.apiBaseUrl}${path}`,data)
  }
  put(path: string, data = {}) {
    return this.http.put(`${this.apiBaseUrl}${path}`,data)
  }
  delete(path: string) {
    return this.http.delete(`${this.apiBaseUrl}${path}`);
  }

  // update the backend to always return results in data property
}
