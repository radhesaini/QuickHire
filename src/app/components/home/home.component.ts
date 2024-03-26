import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api-service/api-service.component';
import { Emitters } from 'src/app/emitters/emitter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: String = "";

  constructor( private http: ApiService) { }

  ngOnInit(): void {
    this.http.get('/user', {
      withCredentials: true
    }).subscribe(
      (res: any) => {
      this.message = `Hi ${res.name}`;
      Emitters.authEmitter.emit(true);
    }, (err) => {
      this.message = "You are not logged in";
      Emitters.authEmitter.emit(false);
    });
  }

}
