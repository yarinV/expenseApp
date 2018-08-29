import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(injector:Injector) {
    super(injector);
   }

}
