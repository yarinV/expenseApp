import { Component, OnInit, Injector } from '@angular/core';
import {Router} from "@angular/router";

import { VehiclesService } from '../services/vehicles.service';
import { UserService } from '../services/user.service';
import { ExpenseService } from '../services/expenses.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'],
})
export class VehiclesComponent implements OnInit {
  vehiclesService: VehiclesService
  userService: UserService
  expenseService: ExpenseService
  router: Router

  vehicleName;
  showList;
  vehicles: Vehicle[] = [];
  total;

  constructor(injector:Injector) {
    this.vehiclesService = injector.get(VehiclesService);
    this.userService = injector.get(UserService);
    this.expenseService = injector.get(ExpenseService);
    this.router = injector.get(Router);
  }

  ngOnInit() {
    this.vehiclesService.get({ uid : this.userService.userData.uid }).then((data)=>{
      if(data.length === 0){
        // TODO: redirect to intro page
        this.router.navigate(['vehicle-edit']);
        return;
      }
      this.vehicles = data;
      // after user vehicles returned calculate the expenses per vehicle
      this.expenseService.calculateTotal(this.vehicles).then((data)=>{
        this.total = data;
      })
      
    });
  }

  handleSelect(event){
    let id = event.split(',')[0];
    let name = event.split(',')[1];
    this.vehicleName = name;
    // TODO: add loading animation
    // Update user selectedVechile then get list of vehicles or show error if failed to update db
    this.userService.updateVehicleSelected(id, name).then(()=>{
      this.vehiclesService.vehicleSelectedChanged.emit();
    }).catch(()=>{
      console.log('update user selected vehicle failed');
    })

  }

  match(vehicle){
    return vehicle.id === this.userService.userData.vehicleSelected;
  }
}
