import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroceryRoutingModule } from './grocery-routing.module';
import { CreateListComponent } from './create-list/create-list.component';
import { HistoryOrdersComponent } from './history-orders/history-orders.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { AllListsComponent } from './all-lists/all-lists.component';
import { PlaceOrderWindowComponent } from './place-order-window/place-order-window.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import {MatCheckboxModule, MatCheckbox} from '@angular/material/checkbox';


@NgModule({imports: [
  CommonModule,
  GroceryRoutingModule,
  MatRippleModule,
  MatExpansionModule,
  MatCheckbox,
  MatCheckboxModule
],
  declarations: [
    CreateListComponent,
    HistoryOrdersComponent,
    PlaceOrderComponent,
    AllListsComponent,
    PlaceOrderWindowComponent,
    
  ]
})
export class GroceryModule { }
