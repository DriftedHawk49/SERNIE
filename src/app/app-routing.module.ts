import { ConsumerDashboardComponent } from './consumer-dashboard/consumer-dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './auth.guard';
import { BasicAuthGuard } from './basic-auth.guard';
import { SpDashboardComponent } from './sp-dashboard/sp-dashboard.component';
import { GroceryComponent } from './consumer-dashboard/grocery/grocery.component';
import { AllListsComponent } from './consumer-dashboard/grocery/all-lists/all-lists.component';
import { PlaceOrderWindowComponent } from './consumer-dashboard/grocery/place-order-window/place-order-window.component';
import { GrocerydashboardComponent } from './grocerydashboard/grocerydashboard.component';



const routes: Routes = [{
  path: "",
  component: HomeComponent,
  canActivate: [BasicAuthGuard]
},{
  path: "login",
  component: LoginComponent,
  canActivate: [BasicAuthGuard]
},{
  path: "dashboard",
  redirectTo: "dashboard/services",
  pathMatch: "full",
  canActivate: [AuthGuard]
},{
  path: "login/forgotpassword",
  component: ForgotPasswordComponent,
  canActivate: [BasicAuthGuard]
},{
  path: "dashboard",
  component: ConsumerDashboardComponent,
  canActivate: [AuthGuard]
},{
  path: "settings",
  component: SettingsComponent,
  canActivate: [AuthGuard]
},{
  path: "login/register",
  redirectTo: "register",
  pathMatch: "full",
  canActivate: [BasicAuthGuard]
},{
  path:"spdashboard",
  component: SpDashboardComponent,
  canActivate: [AuthGuard]
},{
  path: "grocery",
  component: GroceryComponent,
  canActivate: [AuthGuard]
},{
  path: "alllists",
  component: AllListsComponent,
  canActivate: [AuthGuard]
},{
  path: "grocery/alllists",
  redirectTo: "alllists",
  pathMatch: "full",
  canActivate: [AuthGuard]
},{
  path: "dashboard/grocery",
  redirectTo: "grocery",
  pathMatch: "full",
  canActivate: [AuthGuard]
},{
  path: "alllists/grocery",
  redirectTo: "grocery",
  pathMatch: "full",
  canActivate: [AuthGuard]
},{
  path: "grocery/placeorder",
  component: PlaceOrderWindowComponent,
  canActivate: [AuthGuard]
},{
  path: "grocery/placeorder/grocery",
  redirectTo: "grocery",
  pathMatch: "full",
  canActivate: [AuthGuard]
},{
  path: "grocery/placeorder/placeorder",
  redirectTo: "grocery/placeorder",
  pathMatch: "full",
  canActivate: [AuthGuard]
},{
  path: "placeorder",
  redirectTo: "grocery",
  pathMatch: "full",
  canActivate: [AuthGuard]
},{
  path: "dashboard/services/grocery",
  redirectTo: "grocery",
  pathMatch: "full",
  canActivate: [AuthGuard]
},{
  path: "grocery/dashboard",
  redirectTo: "dashboard/services",
  pathMatch: "full",
  canActivate: [AuthGuard]
},{
  path: "grocerydashboard",
  component: GrocerydashboardComponent,
  canActivate: [AuthGuard]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
