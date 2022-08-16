import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  get(path:string) {
    return this.http.get(path);
  }
}
