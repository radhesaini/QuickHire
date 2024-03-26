import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/api-service/api-service.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formData: FormGroup
  constructor(private formBuilder: FormBuilder,
    private http: ApiService,
    private router: Router) {
   }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      name: "",
      email: "",
      password: ""
    })
  }

  validateEmail = (email: any) => {
    var validRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if(email.match(validRegex)){
      return true;
    }
    return false;
  }

  submit(): void{
    let user = this.formData.getRawValue();
    if(user.name == "" || user.email == "" || user.password == ""){
      Swal.fire("Error", "Please Enter all required Field!", "error");
    }
    else if(!this.validateEmail(user.email)){
      Swal.fire("Error", "Please Enter valid Email!", "error");
    }
    else{
      this.http.post('/register', user, {
        withCredentials: true
      }).subscribe(()=>
        this.router.navigate(['/']), (err) => {
          if(!err.status){
            Swal.fire("Error", "No Api Connection Error", "error");
          }
          else{
            Swal.fire("Error", err.error.message, "error");
          }
        }
      )
    }
  }
}
