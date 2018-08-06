import { Injectable, EventEmitter } from '@angular/core';
import { VehiclesService } from './vehicles.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  newError = new EventEmitter<string>();
  
  constructor(private vehiclesService: VehiclesService) {
    this.vehiclesService.vehicleChanged.subscribe(
      ()=>{
        this.newError.emit("");
      }
  )     
   }

  msg(val){
    this.newError.emit(val);
  }
}
