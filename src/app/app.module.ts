import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { addExpenseComponent } from './expenses/add-expense/add-expense.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { ExpenseComponent } from './expenses/expense/expense.component';

@NgModule({
  declarations: [
    AppComponent,
    VehiclesComponent,
    ExpensesComponent,
    addExpenseComponent,
    DashboardComponent,
    HeaderComponent,
    ExpenseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
