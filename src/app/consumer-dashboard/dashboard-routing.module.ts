import { HistoryComponent } from './history/history.component';
import { ServicesComponent } from './services/services.component';
import { ConsumerDashboardComponent } from './consumer-dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';


const consumerRoutes:Routes = [{
  
  path: "dashboard",
  component: ConsumerDashboardComponent,
  canActivate: [AuthGuard],
  children:[{
  path: "",
  component: ServicesComponent
  },{
    path: "services",
    component: ServicesComponent
  },{
    path: "history",
    component: HistoryComponent
  }]}
];


@NgModule({
  imports: [
    RouterModule.forChild(consumerRoutes)
  ],
  exports:[RouterModule]
})
export class ConsumerDashboardRoutingModule { }