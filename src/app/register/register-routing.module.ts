import { ServiceProviderRegistrationComponent } from './service-provider-registration/service-provider-registration.component';
import { JobSelectComponent } from './job-select/job-select.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumerRegistrationComponent } from './consumer-registration/consumer-registration.component';
import { RegisterComponent } from './register.component';
import { BasicAuthGuard } from '../basic-auth.guard';


const registerRoutes:Routes = [{
  
  path: "register",
  component: RegisterComponent,
  canActivate: [BasicAuthGuard],
  children:[{
  path: "",
  component: JobSelectComponent,
  },{
    path:"consumer-register",
    component: ConsumerRegistrationComponent
  },{
    path:"service-provider-register",
    component: ServiceProviderRegistrationComponent
  }]}
];


@NgModule({
  imports: [
    RouterModule.forChild(registerRoutes)
  ],
  exports:[RouterModule]
})
export class RegisterRoutingModule { }
