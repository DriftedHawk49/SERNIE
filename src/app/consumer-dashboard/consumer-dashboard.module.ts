import { MatRippleModule } from '@angular/material/core';
import { ConsumerDashboardRoutingModule } from './dashboard-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './services/services.component';
import { HistoryComponent } from './history/history.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { GroceryComponent } from './grocery/grocery.component';
import { CreateListComponent } from './grocery/create-list/create-list.component';
import { PlaceOrderComponent } from './grocery/place-order/place-order.component';
import { HistoryOrdersComponent } from './grocery/history-orders/history-orders.component';
import { MatCheckboxModule } from '@angular/material/checkbox';







@NgModule({
  declarations: [ServicesComponent, HistoryComponent, GroceryComponent, CreateListComponent, PlaceOrderComponent, HistoryOrdersComponent],
  imports: [
    CommonModule,
    ConsumerDashboardRoutingModule,
    MatRippleModule,
    MatExpansionModule,
    MatRadioModule,
    MatCheckboxModule
  ]
})
export class ConsumerDashboardModule { }
