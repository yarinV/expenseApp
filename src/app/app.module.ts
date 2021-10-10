import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { UpdateExpenseComponent } from './expenses/update-expense/update-expense.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { ExpenseComponent } from './expenses/expense/expense.component';
import { environment } from '../environments/environment';
import { LogComponent } from './helpers/log/log.component';
import { AuthGuard } from './helpers/auth.guard';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { DeleteButtonComponent } from './components/delete-button/delete-button.component';
import { VehiclesListComponent } from './vehicles/vehicles-list/vehicles-list.component';
import { VehicleComponent } from './vehicles/vehicle/vehicle.component';
import { UpdateVehicleComponent } from './vehicles/update-vehicle/update-vehicle.component';
import { SubmitButtonComponent } from './components/submit-button/submit-button.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    VehiclesComponent,
    ExpensesComponent,
    UpdateExpenseComponent,
    DashboardComponent,
    HeaderComponent,
    ExpenseComponent,
    LogComponent,
    DeleteButtonComponent,
    VehiclesListComponent,
    VehicleComponent,
    UpdateVehicleComponent,
    SubmitButtonComponent,
    AddButtonComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
