import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { VehiclesComponent } from "./vehicles/vehicles.component";
import { ExpensesComponent } from "./expenses/expenses.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ExpenseComponent } from "./expenses/expense/expense.component";
import { addExpenseComponent } from "./expenses/add-expense/add-expense.component";
import { AuthGuard } from "./helpers/auth.guard";

const appRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'vehicles', component: VehiclesComponent,  canActivate: [AuthGuard] },
    { path: 'expenses', component: ExpensesComponent,  canActivate: [AuthGuard] },
    { path: 'expense/:id', component: ExpenseComponent,  canActivate: [AuthGuard] },
    { path: 'expense-edit/:id', component: addExpenseComponent,  canActivate: [AuthGuard] },
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