import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { VehiclesComponent } from "./vehicles/vehicles.component";
import { ExpensesComponent } from "./expenses/expenses.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ExpenseComponent } from "./expenses/expense/expense.component";
import { addExpenseComponent } from "./expenses/add-expense/add-expense.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'vehicle', component: VehiclesComponent},
    { path: 'expenses', component: ExpensesComponent},
    { path: 'expense/:id', component: ExpenseComponent},
    { path: 'expense-edit/:id', component: addExpenseComponent},
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