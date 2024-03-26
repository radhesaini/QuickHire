import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api-service/api-service.component';
import { Emitters } from 'src/app/emitters/emitter';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  authenticated: Boolean = false;

  constructor( private http: ApiService) { }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth: Boolean)=>{
      this.authenticated = auth;
    });
  }

  logout(): void{
    this.http.post('/logout', {}, {
      withCredentials: true
  }).subscribe(()=> this.authenticated = false)
  }
}
