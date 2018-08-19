import { Component, OnInit } from '@angular/core';
import { VehiclesService } from '../services/vehicles.service';
import { Vehicle } from './vehicles';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private vehiclesService: VehiclesService, private route:ActivatedRoute, public userService: UserService) { }

  ngOnInit() {
    var that = this;
    const path = this.route.snapshot.paramMap.get('path');
    // Subscribe for updates
      that.vehiclesService.vehiclesChanged.subscribe(
        (data)=>{
          that.vehicles = data;
        }
      )
    this.getVehicles();
  }

  getVehicles(){
    this.vehiclesService.getAll();
  }
  
  handleSelect(event){
    let vehicle_id = event.split(',')[0];
    let vehicle_name = event.split(',')[1];
    this.vehicleName = vehicle_name;
    this.userService.updateVehicleSelected(vehicle_id);
    this.vehiclesService.vehicleSelectedChanged.emit();
  }

}
