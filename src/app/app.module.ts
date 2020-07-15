
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ChangeDetectorRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';



import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';


import { RegisterModule } from './register/register.module';
import { AppRoutingModule } from './app-routing.module';
import { ConsumerDashboardModule } from './consumer-dashboard/consumer-dashboard.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConsumerDashboardComponent } from './consumer-dashboard/consumer-dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthenticateService } from './authenticate.service';
import { AuthGuard } from './auth.guard';
import { BasicAuthGuard } from './basic-auth.guard';
import { SpDashboardComponent } from './sp-dashboard/sp-dashboard.component';
import { GrocerydashboardComponent } from './grocerydashboard/grocerydashboard.component';
import { ActiveOrdersComponent } from './grocerydashboard/active-orders/active-orders.component';
import { PendingOrdersComponent } from './grocerydashboard/pending-orders/pending-orders.component';
import { HistoryComponent } from './grocerydashboard/history/history.component';
import { AllListsComponent } from './consumer-dashboard/grocery/all-lists/all-lists.component';
import { PlaceOrderWindowComponent } from './consumer-dashboard/grocery/place-order-window/place-order-window.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ConsumerDashboardComponent,
    SettingsComponent,
    SpDashboardComponent,
    GrocerydashboardComponent,
    ActiveOrdersComponent,
    PendingOrdersComponent,
    HistoryComponent,
    AllListsComponent,
    PlaceOrderWindowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RegisterModule,
    ConsumerDashboardModule,
    MatRippleModule,
    MatSnackBarModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatExpansionModule

  ],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: {color: 'primary'}
  },AuthenticateService,AuthGuard, BasicAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
