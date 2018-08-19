import { Component, OnInit, NgZone } from '@angular/core';
import { VehiclesService } from '../services/vehicles.service';
import { Vehicle } from './vehicles';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  vehicleName;
  showList;
  vehicles: Vehicle[];
  constructor(private vehiclesService: VehiclesService, private route:ActivatedRoute, private zone:NgZone) { }

  ngOnInit() {
    var that = this;
    const path = this.route.snapshot.paramMap.get('path');

    // Subscribe for updates
    this.zone.run(()=>{
      that.vehiclesService.vehiclesChanged.subscribe(
        (data)=>{
          // zone.run will fix changes happening outside the zone
          this.zone.run(that.vehicles = data);
        }
      )
    });
    this.getVehicles();
  }

  getVehicles(){
    this.vehiclesService.getAll();
  }
  
  handleSelect(event){
    let vehicle_id = event.split(',')[0];
    let vehicle_name = event.split(',')[1];
    this.vehicleName = vehicle_name;
    this.vehiclesService.vehicleSelected = vehicle_id;
    this.vehiclesService.vehicleSelectedChanged.emit();
  }

}
