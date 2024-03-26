import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/api-service/api-service.component';

@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrls: ['./edit-application.component.css']
})
export class EditApplicationComponent implements OnInit {
  formData: FormGroup;
  myFiles: any [] = [];
  resume: String;
  additional_documents: any [];
  constructor(private formBuilder: FormBuilder,
    private http: ApiService,
    private router: Router,
    private route: ActivatedRoute) {
   }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      name: "",
      dob: "",
      email: "",
      city: "",
      resume: "",
      additional_documents: [],
      phone: "",
      description: "",
    })
    let moment = require("moment");
    this.http.get('/application/'+ this.route.snapshot.paramMap.get('id'), {}).subscribe((data: any) => {
      console.log(data);
      this.resume = data.resume;
      this.additional_documents = data.additional_documents;
      this.formData.patchValue({...data, dob: new Date(data.dob).toLocaleDateString('en-US', {
    month: '2-digit',day: '2-digit',year: 'numeric'})});
    });
  }
  

  getFileDetails(e: any)  {
    for (var i = 0; i < e.target.files.length; i++) { 
      this.myFiles.push(e.target.files[i]);
    }
    this.uploadFile(this.myFiles, e.target.name);
  }
  
  uploadFile(files: File[], name: String) {
    const tempformData = new FormData();
    files.forEach((file, index) => {
      tempformData.append('files', file, file.name);
    });
    
    this.http.post('/uploads',  tempformData, {
      withCredentials: true
    }).subscribe((response: any)=>{
     if(name=="resume"){
      this.resume = "";
      response.forEach((item: any)=> this.resume = item.id);
     }
     else{
      this.additional_documents = [];
      response.forEach((item: any)=> this.additional_documents.push(item.id));
     }
     this.myFiles = [];
    },  (err) => {
     console.log(err);
     if(!err.status){
       Swal.fire("Error", "No Api Connection Error", "error");
     }
     else{
       Swal.fire("Error", err.error.message, "error");
     }
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
    let application = this.formData.getRawValue();
    if(application.name == "" || application.dob == "" || application.phone == ""){
      Swal.fire("Error", "Please Enter all required Field!", "error");
    }
    else if(!this.validateEmail(application.email)){
      Swal.fire("Error", "Please Enter valid Email!", "error");
    }
    else{
      application.resume = this.resume;
      application.additional_documents =  this.additional_documents; 
      this.http.put('/application/'+this.route.snapshot.paramMap.get('id'), application, {
        withCredentials: true
      }).subscribe(()=>{
        this.router.navigate(['/'])}, (err) => {
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
