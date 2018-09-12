import { Component, OnInit, Injector } from '@angular/core';
import {Router} from "@angular/router";

import { VehiclesService } from '../services/vehicles.service';
import { UserService } from '../services/user.service';
import { ExpenseService } from '../services/expenses.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'],
})
export class VehiclesComponent implements OnInit {
  vehiclesService: VehiclesService;
  userService: UserService;
  expenseService: ExpenseService;
  router: Router;
  loaderService: LoaderService;

  vehicleName;
  showList;
  vehicles: Vehicle[] = [];
  total;

  constructor(injector:Injector) {
    this.vehiclesService = injector.get(VehiclesService);
    this.userService = injector.get(UserService);
    this.expenseService = injector.get(ExpenseService);
    this.router = injector.get(Router);
    this.loaderService = injector.get(LoaderService);
  }

  ngOnInit() {
    this.loaderService.startLoading();
    
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
        this.loaderService.finishLoading();
      });
      
    });
  }

  handleSelect(event){
    let obj = {
      id: event.split(',')[0],
      name: event.split(',')[1],
    }
    
    this.vehicleName = name;
    // Update user selectedVechile then get list of vehicles or show error if failed to update db
    this.userService.updateVehicleSelected(obj).then(()=>{
      this.vehiclesService.vehicleSelectedChanged.emit();
    }).catch(()=>{
      
    })

  }

  match(vehicle){
    return vehicle.id === this.userService.userData.vehicleSelected;
  }
}
