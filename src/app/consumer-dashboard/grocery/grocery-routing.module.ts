import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroceryComponent } from './grocery.component';
import { AuthGuard } from '../../auth.guard';


const routes: Routes = [{
  path: "grocery",
  component: GroceryComponent,
  canActivate: [AuthGuard],
  children: []
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroceryRoutingModule { }
