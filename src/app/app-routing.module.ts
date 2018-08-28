import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { VehiclesComponent } from "./vehicles/vehicles.component";
import { ExpensesComponent } from "./expenses/expenses.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ExpenseComponent } from "./expenses/expense/expense.component";
import { updateExpenseComponent } from "./expenses/update-expense/update-expense.component";
import { AuthGuard } from "./helpers/auth.guard";
import { UpdateVehicleComponent } from "./vehicles/update-vehicle/update-vehicle.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'vehicles', component: VehiclesComponent,  canActivate: [AuthGuard] },
    { path: 'vehicle-edit', component: UpdateVehicleComponent,  canActivate: [AuthGuard] },
    { path: 'vehicle-edit/:id', component: UpdateVehicleComponent,  canActivate: [AuthGuard] },
    { path: 'expenses', component: ExpensesComponent,  canActivate: [AuthGuard] },
    { path: 'expense-edit', component: updateExpenseComponent,  canActivate: [AuthGuard] },
    { path: 'expense-edit/:id', component: updateExpenseComponent,  canActivate: [AuthGuard] },
    // { path: 'not-found', component: PageNotFoundComponent},
    // { path: '**', redirectTo: '/not-found', pathMatch: 'full'}
  ];

@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}