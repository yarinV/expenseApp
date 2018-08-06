import { Component, OnInit } from '@angular/core';
import { VehiclesService } from '../services/vehicles.service';
import { Vehicle } from './vehicles';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[];
  constructor(private vehiclesService: VehiclesService) { }

  ngOnInit() {
    this.vehicles = this.vehiclesService.get();
  }

  handleSelect(vehicle_id){
    this.vehiclesService.vehicleSelected = Number(vehicle_id);
    this.vehiclesService.vehicleChanged.emit();
  }

}
