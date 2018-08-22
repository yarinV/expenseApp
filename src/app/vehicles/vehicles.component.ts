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
    //TODO: add loadeing animation
    // update user selectedVechile then get list of vehicles or show error if failed to update db
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
