import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { EditApplicationComponent } from './components/edit-application/edit-application.component';
import { ShowDocumentsComponent } from './components/show-documents/show-documents.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'applications', component: ApplicationsComponent
  },
  {
    path: 'edit-application/:id', component: EditApplicationComponent
  },
  {
    path: 'show-documents/:id', component: ShowDocumentsComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
