import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-api-service',
  templateUrl: './api-service.component.html',
  styleUrls: ['./api-service.component.css']
})
export class ApiService{

  private baseUrl: String = 'http://localhost:5000/api';
  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  get(url: String, other: any){
    return this.http.get(`${this.baseUrl}${url}`, other)
  }

  post(url: String, data: any, other: any){
    return this.http.post(`${this.baseUrl}${url}`, data, other)
  }
  put(url: String, data: any, other: any){
    return this.http.put(`${this.baseUrl}${url}`, data, other)
  }
  delete(url: String, data: any){
    return this.http.delete(`${this.baseUrl}${url}`, data)
  }
}
