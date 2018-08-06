import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { addExpenseComponent } from './expenses/add-expense/add-expense.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { ExpenseComponent } from './expenses/expense/expense.component';
import { environment } from '../environments/environment';
import { ErrorsComponent } from './helpers/errors/errors.component';

@NgModule({
  declarations: [
    AppComponent,
    VehiclesComponent,
    ExpensesComponent,
    addExpenseComponent,
    DashboardComponent,
    HeaderComponent,
    ExpenseComponent,
    ErrorsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
