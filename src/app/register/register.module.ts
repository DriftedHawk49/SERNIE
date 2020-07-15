import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';

import { RegisterRoutingModule } from './register-routing.module';
import { JobSelectComponent } from './job-select/job-select.component';
import { ConsumerRegistrationComponent } from './consumer-registration/consumer-registration.component';
import { ServiceProviderRegistrationComponent } from './service-provider-registration/service-provider-registration.component';
import { ConsumerFormComponent } from './consumer-registration/consumer-form/consumer-form.component';
import { SpFormComponent } from './service-provider-registration/sp-form/sp-form.component';
import { AuthenticateService } from '../authenticate.service';
import { AuthGuard } from '../auth.guard';
import { BasicAuthGuard } from '../basic-auth.guard';







@NgModule({
  declarations: [
    JobSelectComponent,
    ConsumerRegistrationComponent,
    ServiceProviderRegistrationComponent,
    ConsumerFormComponent,
    SpFormComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatRippleModule
  ],
  providers: [AuthenticateService,AuthGuard, BasicAuthGuard]
})
export class RegisterModule { }
