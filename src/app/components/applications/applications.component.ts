import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api-service/api-service.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ApplicationsComponent implements OnInit {
  applications: any;
  sMsg:string = '';
  formData: FormGroup;
  
  myFiles: any [] = [];
  resume: String;
  additional_documents: any [];
  constructor( private formBuilder: FormBuilder, private router: Router,  private filehttp: HttpClient,
     private http: ApiService, sanitizer: DomSanitizer) { }
  @ViewChild('closebutton') closebutton: any;

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

   
    this.getData();
    
  }

  getData(){
    this.http.get('/application', {}).subscribe((data: any) => {
      console.log(data);
      this.applications = data;
    });
  }

  onDelete(id: string){
    this.http.delete('/application/'+id, {}).subscribe((data: any) => {
      console.log(data);
      this.getData();
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
      this.http.post('/application', application, {
        withCredentials: true
      }).subscribe(()=>{
        this.closebutton.nativeElement.click();
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
