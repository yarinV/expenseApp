import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(injector: Injector) {
    this.vehiclesService = injector.get(VehiclesService);
    this.userService = injector.get(UserService);
    this.expenseService = injector.get(ExpenseService);
    this.router = injector.get(Router);
    this.loaderService = injector.get(LoaderService);
  }

  ngOnInit() {
    this.loaderService.startLoading();

    this.vehiclesService.get({ uid: this.userService.userData.uid }).then((res) => {
      const data = res;
      if (data.length === 0) {
        // TODO: redirect to intro page
        this.router.navigate(['vehicle-edit']);
        this.loaderService.finishLoading();
        return;
      }
      this.vehicles = data;

      if (this.router.url.toLowerCase() !== 'dashboard') {
        // after user vehicles returned calculate the expenses per vehicle
        this.expenseService.calculateTotal(this.vehicles).then((res2) => {
          this.total = res2;
          this.loaderService.finishLoading();
        });
      }

    });
  }

  handleSelect(event) {

    const obj = {
      id: event.split(',')[0],
      name: event.split(',')[1],
    };

    this.vehicleName = obj.name;
    // Update user selectedVechile then get list of vehicles or show error if failed to update db
    this.userService.updateVehicleSelected(obj).then(() => {
      this.vehiclesService.vehicleSelectedChanged.emit();
      this.expenseService.expensesChanged.emit();
    }).catch((e) => {
      console.log(e);
    });

  }

  match(vehicle) {
    // console.log(this.userService.userData.vehicleSelected);

    return vehicle.id === this.userService.userData.vehicleSelected;
  }
}
