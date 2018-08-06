import { Injectable, EventEmitter } from "@angular/core";
import { Vehicle } from "../vehicles/vehicles";
import { mockVehicles } from "../vehicles/vehicles-mock";

@Injectable({
    providedIn: 'root'
})
export class VehiclesService {
    vehicles: Vehicle[];
    vehicleSelected: number;
    vehicleChanged = new EventEmitter();
    constructor(){}

    get(){
        this.vehicles = mockVehicles;
        return this.vehicles;
    }

    add(name:string){
        let vehicle = {
            id: "100",
            name: name,
        }
        mockVehicles.push(vehicle);
    }

    edit(id:string, name:string){
        mockVehicles.filter((item)=>{
            if(item.id === id){
                item.name = name;
            }
        });
    }
}