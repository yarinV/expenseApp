import { Component, OnInit } from '@angular/core';
import { VehiclesService } from '../services/vehicles.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'],
})
export class VehiclesComponent implements OnInit {
  vehicleName;
  showList;
  vehicles: Vehicle[];
  constructor(public vehiclesService: VehiclesService, public userService: UserService) { }

  ngOnInit() {
    var that = this;
    // Subscribe for updates
      that.vehiclesService.vehiclesChanged.subscribe(
        (data)=>{
          that.vehicles = data;
        }
      )
    this.getAll();
  }

  getAll(){
    this.vehiclesService.getAll(this.userService.userData.uid);
  }

  get(){

  }

  update(){

  }

  delete(){
    
  }
  
  handleSelect(event){
    let id = event.split(',')[0];
    let name = event.split(',')[1];
    this.vehicleName = name;
    this.userService.updateVehicleSelected(id, name);
    this.vehiclesService.vehicleSelectedChanged.emit();
  }

  match(vehicle){
    return vehicle.id === this.userService.userData.vehicleSelected;
  }
}
