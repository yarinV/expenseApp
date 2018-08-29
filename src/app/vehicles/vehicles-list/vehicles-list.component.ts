import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { VehiclesService } from '../../services/vehicles.service';
import { VehiclesComponent } from '../vehicles.component';
import { ExpenseService } from '../../services/expenses.service';

@Component({
  selector: 'vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.css']
})
export class VehiclesListComponent extends VehiclesComponent{

  constructor(public userService: UserService, public vehiclesService: VehiclesService, public expenseService: ExpenseService) {
    super(vehiclesService, userService, expenseService);
   }

}
